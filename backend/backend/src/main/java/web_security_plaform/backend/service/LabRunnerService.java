package web_security_plaform.backend.service;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.github.dockerjava.api.command.ListContainersCmd;
import com.github.dockerjava.api.exception.NotFoundException;
import com.github.dockerjava.api.model.*;
import jakarta.annotation.Nullable;
import jakarta.annotation.PreDestroy;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import web_security_plaform.backend.model.*;
import web_security_plaform.backend.model.ENum.EDifficulty;
import web_security_plaform.backend.model.ENum.ESessionStatus;
import web_security_plaform.backend.model.ENum.ESolutionStatus;
import web_security_plaform.backend.payload.dto.CommunitySolutionsDTO;
import web_security_plaform.backend.repository.CommunitySolutionRepository;
import web_security_plaform.backend.repository.LabRepository;
import web_security_plaform.backend.repository.LabSessionRepository;
import web_security_plaform.backend.repository.UserRepository;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;


@Service
public class LabRunnerService {
    private final DockerClient dockerClient;

    @Autowired
    private LabSessionRepository labSessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommunitySolutionRepository communitySolutionRepository;

    @Autowired
    private LabRepository labRepository;

    private final ApplicationEventPublisher publisher;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private final Map<String, ScheduledFuture<?>> timers = new ConcurrentHashMap<>();
    private final Map<String, String> containerToImage = new ConcurrentHashMap<>();
    private final Map<String, Instant> containerExpires = new ConcurrentHashMap<>();

    // host để build URL trả về (VPS thì đặt domain/IP của bạn)
    @Value("${labs.host}")
    private String labsHost;

    private final boolean removeImageOnStop = false;

    public LabRunnerService(DockerClient dockerClient, ApplicationEventPublisher publisher) {
        this.dockerClient = dockerClient;
        this.publisher = publisher;
    }

    public StartLabResult startLab(String dockerImageName, String labSlug, String userId, int timeoutMinutes) {
        pullIfMissing(dockerImageName);

        ExposedPort p80 = ExposedPort.tcp(80);
        HostConfig host = HostConfig.newHostConfig()
                .withPortBindings(new PortBinding(Ports.Binding.empty(), p80))
                .withAutoRemove(true)
                .withMemory(512L * 1024 * 1024)
                .withNanoCPUs(500_000_000L);

        CreateContainerResponse c = dockerClient.createContainerCmd(dockerImageName)
                .withExposedPorts(p80)
                .withHostConfig(host)
                .withLabels(Map.of("app","websec-lab","lab",labSlug,"owner",userId))
                .exec();

        String containerId = c.getId();
        dockerClient.startContainerCmd(containerId).exec();

        try { Thread.sleep(1200); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }

        InspectContainerResponse insp = dockerClient.inspectContainerCmd(containerId).exec();
        Ports.Binding[] b = insp.getNetworkSettings().getPorts().getBindings().get(p80);
        if (b == null || b.length == 0 || b[0] == null) {
            stopAndCleanupFirst(containerId);
            throw new RuntimeException("No host port bound for container " + containerId);
        }
        int hostPort = Integer.parseInt(b[0].getHostPortSpec());
        String url = "http://" + labsHost + ":" + hostPort;

        containerToImage.put(containerId, dockerImageName);

        int safeMinutes = Math.max(1, Math.min(timeoutMinutes, 240));
        Instant expiresAt = Instant.now().plus(Duration.ofMinutes(safeMinutes));
        ScheduledFuture<?> f = scheduler.schedule(() -> {
            try { stopAndCleanupFirstByContainerIdHaveLabSessionId(containerId,false); } catch (Exception ignored) {}
        }, safeMinutes, TimeUnit.MINUTES);
        timers.put(containerId, f);
        containerExpires.put(containerId, expiresAt);

        return new StartLabResult(containerId, hostPort, url, expiresAt);
    }
    public void stopAfter(LabSession labSession, Duration delay, boolean flag) {
        if (labSession.getContainerId() == null || labSession.getContainerId().isBlank()) return;

        Optional.ofNullable(timers.remove(labSession.getContainerId())).ifPresent(t -> t.cancel(false));

        Instant expiresAt = Instant.now().plus(delay);
        containerExpires.put(labSession.getContainerId(), expiresAt);

        ScheduledFuture<?> f = scheduler.schedule(() -> {
            try { stopAndCleanup(labSession,flag); } catch (Exception ignored) {}
        }, delay.toSeconds(), TimeUnit.SECONDS);

        timers.put(labSession.getContainerId(), f);
    }


    public void stopAndCleanup(LabSession labSession, boolean flag) {
        if (labSession.getContainerId() == null || labSession.getContainerId().isBlank()) return;
        if (flag) {
            if (labSession.getStatus() != ESessionStatus.SOLVED) {
                labSession.setStatus(ESessionStatus.SOLVED);
                labSession.setCompletedAt(Instant.now());
                labSession.setFlagSubmitted(labSession.getFlagSubmitted());
            }
        } else {
            labSession.setStatus(ESessionStatus.EXPIRED);
        }
        labSessionRepository.save(labSession);
        try {
            dockerClient.stopContainerCmd(labSession.getContainerId()).withTimeout(5).exec();
        } catch (Exception ignored) {}

        if (removeImageOnStop) {
            String image = containerToImage.remove(labSession.getContainerId());
            if (image != null && !image.isBlank()) {
                try { dockerClient.removeImageCmd(image).withForce(true).exec(); } catch (Exception ignored) {}
            }
        } else {
            containerToImage.remove(labSession.getContainerId());
        }
    }

    public void stopAndCleanupStrict(String containerId) {
        if (containerId == null || containerId.isBlank()) {
            throw new IllegalArgumentException("containerId is required");
        }

        Optional.ofNullable(timers.remove(containerId)).ifPresent(t -> t.cancel(false));
        containerExpires.remove(containerId);

        boolean exists = true;
        try {
            dockerClient.inspectContainerCmd(containerId).exec();
        } catch (NotFoundException nf) {
            exists = false;
        } catch (Exception e) {
            throw new IllegalStateException("Inspect failed for container " + containerId + ": " + e.getMessage(), e);
        }
        if (!exists) {
            containerToImage.remove(containerId);
            throw new NoSuchElementException("Container " + containerId + " not found");
        }

        try {
            dockerClient.stopContainerCmd(containerId).withTimeout(5).exec();
        } catch (NotFoundException nf) {
            containerToImage.remove(containerId);
            throw new NoSuchElementException("Container " + containerId + " not found while stopping");
        } catch (Exception e) {
            throw new IllegalStateException("Failed to stop container " + containerId + ": " + e.getMessage(), e);
        }

        try {
            dockerClient.removeContainerCmd(containerId).withForce(true).withRemoveVolumes(true).exec();
        } catch (NotFoundException nf) {
        } catch (Exception e) {
            throw new IllegalStateException("Failed to remove container " + containerId + ": " + e.getMessage(), e);
        }

        String image = containerToImage.remove(containerId);
        if (removeImageOnStop && image != null && !image.isBlank()) {
            try {
                dockerClient.removeImageCmd(image).withForce(true).exec();
            } catch (NotFoundException nf) {
            } catch (Exception e) {
                throw new IllegalStateException("Failed to remove image " + image + " for container " + containerId + ": " + e.getMessage(), e);
            }
        }
    }

    public void stopAndCleanupFirst(String containerId) {
        if (containerId == null || containerId.isBlank()) return;
        Optional.ofNullable(timers.remove(containerId)).ifPresent(t -> t.cancel(false));
        containerExpires.remove(containerId);
        try {
            dockerClient.stopContainerCmd(containerId).withTimeout(5).exec();
        } catch (Exception ignored) {}

        if (removeImageOnStop) {
            String image = containerToImage.remove(containerId);
            if (image != null && !image.isBlank()) {
                try { dockerClient.removeImageCmd(image).withForce(true).exec(); } catch (Exception ignored) {}
            }
        } else {
            containerToImage.remove(containerId);
        }
    }
    public void stopAndCleanupFirstByContainerIdHaveLabSessionId(String containerId, boolean flag) {
        if (containerId == null || containerId.isBlank()) return;
        Optional.ofNullable(timers.remove(containerId)).ifPresent(t -> t.cancel(false));
        containerExpires.remove(containerId);
        LabSession labSession = labSessionRepository.findByContainerIdWithStatusRunning(containerId);
//        System.out.println("labSession found for containerId " + containerId + ": " + (labSession != null));
        if (labSession != null) {
            if (flag){
                labSession.setCompletedAt(Instant.now());
                labSession.setStatus(ESessionStatus.SOLVED);
                labSessionRepository.save(labSession);
            }else{
                labSession.setStatus(ESessionStatus.EXPIRED);
                labSession.setExpiresAt(Instant.now());
                labSessionRepository.save(labSession);
            }
        }
        try {
            dockerClient.stopContainerCmd(containerId).withTimeout(5).exec();
        } catch (Exception ignored) {}

        if (removeImageOnStop) {
            String image = containerToImage.remove(containerId);
            if (image != null && !image.isBlank()) {
                try { dockerClient.removeImageCmd(image).withForce(true).exec(); } catch (Exception ignored) {}
            }
        } else {
            containerToImage.remove(containerId);
        }
    }

    @PreDestroy
    public void onShutdown() {
        scheduler.shutdownNow();
    }
    private void pullIfMissing(String image) {
        try { dockerClient.inspectImageCmd(image).exec(); }
        catch (Exception notFound) {
            try { dockerClient.pullImageCmd(image).start().awaitCompletion(); }
            catch (InterruptedException ie) { Thread.currentThread().interrupt(); throw new RuntimeException(ie); }
        }
    }

    public List<LabInstanceDTO> listRunningLabs(@Nullable String ownerFilter) {
        ListContainersCmd cmd = dockerClient.listContainersCmd()
                .withShowAll(false) // chỉ container đang chạy
                .withLabelFilter(Map.of("app", "websec-lab"));

        List<Container> containers = cmd.exec();
        List<LabInstanceDTO> out = new ArrayList<>();

        for (Container c : containers) {
            Map<String, String> labels = c.getLabels() != null ? c.getLabels() : Map.of();
            String owner = labels.getOrDefault("owner", "");
            if (ownerFilter != null && !ownerFilter.isBlank() && !ownerFilter.equals(owner)) {
                continue;
            }
            String lab = labels.getOrDefault("lab", "");
            String image = c.getImage();
            String id = c.getId();
            Instant createdAt = Instant.ofEpochSecond(c.getCreated());
            String state = c.getState();   // e.g., "running"
            String status = c.getStatus(); // e.g., "Up 2 minutes"

            int hostPort = -1;
            if (c.getPorts() != null) {
                for (ContainerPort p : c.getPorts()) {
                    if ("tcp".equalsIgnoreCase(p.getType()) && p.getPrivatePort() == 80 && p.getPublicPort() != null) {
                        hostPort = p.getPublicPort();
                        break;
                    }
                }
                if (hostPort < 0 && c.getPorts().length > 0 && c.getPorts()[0].getPublicPort() != null) {
                    hostPort = c.getPorts()[0].getPublicPort();
                }
            }
            String url = hostPort > 0 ? ("http://" + labsHost + ":" + hostPort) : null;
            Instant expiresAt = containerExpires.get(id);

            out.add(new LabInstanceDTO(id, image, lab, owner, hostPort, url, state, status, createdAt, expiresAt));
        }
        // sắp xếp mới nhất trước
        out.sort(Comparator.comparing((LabInstanceDTO d) -> d.createdAt()).reversed());
        return out;
    }
    public List<String> findContainersUsingImage(String imageIdOrName) {
        return dockerClient.listContainersCmd()
                .withShowAll(true)
                .exec()
                .stream()
                .filter(c -> c.getImage().equals(imageIdOrName) || c.getImageId().equals(imageIdOrName))
                .map(Container::getId)
                .collect(Collectors.toList());
    }

    public void deleteImage(String imageNameOrId) {
        try {
            dockerClient.removeImageCmd(imageNameOrId)
                    .exec();
        } catch (Exception e) {
            throw new RuntimeException("Cannot delete image " + imageNameOrId + ": " + e.getMessage(), e);
        }
    }

    public ResponseEntity<LabListForStatus> getLabStatusStatistics() {
        ZoneId ZONE = ZoneOffset.UTC;

        List<LabStatusStatistics> solved = labSessionRepository.findAllLabSessionSolved().stream()
                .map(s -> convert(s.getCompletedAt(), s.getLab(), ZONE))
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(LabStatusStatistics::completedAt))
                .toList();

        List<LabStatusStatistics> expired = labSessionRepository.findAllLabSessionExpired().stream()
                .map(s -> convert(s.getExpiresAt(), s.getLab(), ZONE))       // <== dùng expiredAt đúng nghĩa
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(LabStatusStatistics::completedAt))
                .toList();

        return ResponseEntity.ok(new LabListForStatus(solved, expired));
    }

    public ResponseEntity<LabListForStatus> getLabStatusStatistics(Long labId) {
        ZoneId ZONE = ZoneOffset.UTC;

        List<LabStatusStatistics> solved = labSessionRepository.findAllLabSessionSolved(labId).stream()
                .map(s -> convert(s.getCompletedAt(), s.getLab(), ZONE))
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(LabStatusStatistics::completedAt))
                .toList();

        List<LabStatusStatistics> expired = labSessionRepository.findAllLabSessionExpired(labId).stream()
                .map(s -> convert(s.getExpiresAt(), s.getLab(), ZONE))       // <== dùng expiredAt đúng nghĩa
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(LabStatusStatistics::completedAt))
                .toList();

        return ResponseEntity.ok(new LabListForStatus(solved, expired));
    }
    private LabStatusStatistics convert(Instant timestamp, Lab lab, ZoneId zone) {
        if (timestamp == null || lab == null || lab.getId() == null) return null;
        return new LabStatusStatistics(LocalDateTime.ofInstant(timestamp, zone), lab.getId());
    }

    public ResponseEntity<?> getAdminStatistics() {
        Integer labSolvedCount = labSessionRepository.countByStatus(ESessionStatus.SOLVED);
        Integer labExpiredCount = labSessionRepository.countByStatus(ESessionStatus.EXPIRED);
        Integer totalLabs = labRepository.findAll().size();
        Integer totalsUsers = userRepository.findAll().size();
        AdminStatistics stats = new AdminStatistics(
                labSolvedCount,
                labExpiredCount,
                totalLabs,
                totalsUsers
        );
        return ResponseEntity.ok(stats);
    }

    public ResponseEntity<?> getUserRecentLabs() {
        List<UserRecentLabs> out = new ArrayList<>();
        ZoneId ZONE = ZoneOffset.UTC;

        List<Object[]> results = labSessionRepository.findFiveUserRecentSolvedLabs();
        for (Object[] row : results) {
            Integer userId = (Integer) row[0];
            Integer labId = (Integer) row[1];
            Instant completedAt = (Instant) row[2];
            String fullName = userRepository.findById((long)userId)
                    .map(u -> u.getFullName() != null ? u.getFullName() : u.getUsername())
                    .orElse("Unknown User");

            String labName = labRepository.findById(labId)
                    .map(Lab::getName)
                    .orElse("Unknown Lab");

            out.add(new UserRecentLabs(fullName, labName, LocalDateTime.ofInstant(completedAt, ZONE)));
        }

        return ResponseEntity.ok(out);
    }

    public ResponseEntity<?> getLabSolvedLevelStatistics() {
        List<Object[]> results = labSessionRepository.countSolvedLabsByDifficultyLevel();
        Map<String, Integer> out = new HashMap<>();
        for (Object[] row : results) {
            EDifficulty level = (EDifficulty) row[0];
            Long countLong = (Long) row[1];
            Integer count = countLong != null ? countLong.intValue() : 0;
            out.put(String.valueOf(level), count);
        }
        return ResponseEntity.ok(out);
    }

    public ResponseEntity<?> getSolvedStatusForLab(Integer labId) {
        Integer solved = labSessionRepository.countByStatus(labId, ESessionStatus.SOLVED);
        Integer expired = labSessionRepository.countByStatus(labId, ESessionStatus.EXPIRED);
        Integer running = labSessionRepository.countByStatus(labId, ESessionStatus.RUNNING);

        Map<String, Integer> out = new HashMap<>();
        out.put("Solved", solved);
        out.put("Expired", expired);
        out.put("Running", running);

        return ResponseEntity.ok(out);
    }

    public ResponseEntity<?> getErrorSubmitStatisticsForLab(Long labId) {
        List<LabSession> sessions = labSessionRepository.findAllByLabId(labId);
        Map<String, Integer> out = new HashMap<>();
        int errorTotal = 0;
        int correctTotal = 0;

        for (LabSession s : sessions) {
            int count = s.getCounterErrorFlag() != null ? s.getCounterErrorFlag() : 0;
            errorTotal += count;
            if (s.getStatus() == ESessionStatus.SOLVED) {
                correctTotal += 1;
            }
        }
        out.put("total_error_submissions", errorTotal);
        out.put("total_correct_submissions", correctTotal);
        return ResponseEntity.ok(out);
    }

    public ResponseEntity<?> getAvgTimeToSolveForLab(Long labId) {
        List<LabSession> sessions = labSessionRepository.findAllByLabId(labId);
        long totalSeconds = 0;
        int solvedCount = 0;

        for (LabSession s : sessions) {
            if (s.getStatus() == ESessionStatus.SOLVED && s.getStartedAt() != null && s.getCompletedAt() != null) {
                Duration duration = Duration.between(s.getStartedAt(), s.getCompletedAt());
                totalSeconds += duration.getSeconds();
                solvedCount += 1;
            }
        }

        double avgSeconds = solvedCount > 0 ? (double) totalSeconds / solvedCount : 0.0;
        Map<String, Object> out = new HashMap<>();
        out.put("average_time_seconds", avgSeconds);
        out.put("solved_count", solvedCount);
        return ResponseEntity.ok(out);
    }

    public ResponseEntity<?> getUserLabCountStatistics(Long labId) {
        List<LabSession> sessions = labSessionRepository.findAllByLabId(labId);

        Map<Long, List<LabSession>> sessionsByUser = sessions.stream()
                .collect(Collectors.groupingBy(sess -> Long.valueOf(sess.getUser().getId())));

        List<UserLabCountStatistics> stats = sessionsByUser.entrySet().stream()
                .map(entry -> {
                    Long userId = entry.getKey();
                    List<LabSession> userSessions = entry.getValue();

                    User user = userSessions.get(0).getUser();
                    String fullName = user.getFullName() != null ? user.getFullName() : user.getUsername();

                    int labAccessCount = userSessions.size();

                    int errorCount = userSessions.stream()
                            .mapToInt(sess -> sess.getCounterErrorFlag() != null ? sess.getCounterErrorFlag() : 0)
                            .sum();

                    List<LabSession> solvedSessions = userSessions.stream()
                            .filter(sess -> sess.getStatus() == ESessionStatus.SOLVED
                                    && sess.getStartedAt() != null
                                    && sess.getCompletedAt() != null)
                            .sorted(Comparator.comparing(LabSession::getCompletedAt))
                            .toList();

                    int totalSolved = solvedSessions.size();

                    Double firstSolvedTimeSeconds = null;
                    Double fastestSolveTimeSeconds = null;
                    Double averageSolveTimeSeconds = null;

                    if (!solvedSessions.isEmpty()) {
                        List<Long> durations = solvedSessions.stream()
                                .map(sess -> Duration.between(sess.getStartedAt(), sess.getCompletedAt()).getSeconds())
                                .toList();

                        long firstSolveDuration = durations.get(0); // do đã sort theo completedAt
                        long fastestDuration = durations.stream().mapToLong(Long::longValue).min().orElse(0L);
                        double averageDuration = durations.stream().mapToLong(Long::longValue).average().orElse(0.0);

                        firstSolvedTimeSeconds = (double) firstSolveDuration;
                        fastestSolveTimeSeconds = (double) fastestDuration;
                        averageSolveTimeSeconds = averageDuration;
                    }

                    return new UserLabCountStatistics(
                            userId.intValue(),
                            fullName,
                            errorCount,
                            labAccessCount,
                            totalSolved,
                            firstSolvedTimeSeconds,
                            fastestSolveTimeSeconds,
                            averageSolveTimeSeconds
                    );
                })
                .toList();

        // 4. Trả về list thống kê
        return ResponseEntity.ok(stats);
    }

    public ResponseEntity<?> getCommunitySolutionsForUser(User user) {
        List<CommunitySolution> communitySolution = communitySolutionRepository.findAllCommunitySolutionByUserId(user.getId());

        List<CommunitySolutionDTOUser> out = new ArrayList<>();
        communitySolution.forEach(communitySolution1 -> {
            CommunitySolutionDTOUser dto = new CommunitySolutionDTOUser(
                    communitySolution1.getId(),
                    communitySolution1.getStatus(),
                    communitySolution1.getWriteUpUrl(),
                    communitySolution1.getYoutubeUrl(),
                    communitySolution1.getLab().getId(),
                    communitySolution1.getUser().getId(),
                    communitySolution1.getUser().getFullName() != null ? communitySolution1.getUser().getFullName() : communitySolution1.getUser().getUsername(),
                    communitySolution1.getFeedback() != null ? communitySolution1.getFeedback() : "No feedback provided"
            );
           out.add(dto);
        });
        return ResponseEntity.ok(out);
    }

    public ResponseEntity<?> submitCommunitySolution(User user, Integer labId, String youtubeLink, String writeUpLink) {
        Lab lab = labRepository.findById(labId).orElse(null);
        if (lab == null) {
            return ResponseEntity.badRequest().body("Lab not found");
        }

        CommunitySolution existingSolution = communitySolutionRepository.findByUserIdAndLabId(user.getId(), labId);
        if (existingSolution != null) {
            return ResponseEntity.badRequest().body("You have already submitted a solution for this lab");
        }
        LabSession labSession = labSessionRepository.findFirstByUserIdAndLabIdAndStatus(user.getId(), labId, ESessionStatus.SOLVED);

        if (labSession == null) {
            return ResponseEntity.badRequest().body("You must solve the lab before submitting a community solution");
        }

        CommunitySolution communitySolution = new CommunitySolution();
        communitySolution.setUser(user);
        communitySolution.setLab(lab);
        communitySolution.setYoutubeUrl(youtubeLink);
        communitySolution.setWriteUpUrl(writeUpLink);
        communitySolution.setStatus(ESolutionStatus.Pending);


        communitySolutionRepository.save(communitySolution);



        Map<String, Object> model = Map.of(
                "subject", "Pending Status" + lab.getName(),
                "user", Map.of(
                        "fullName", user.getFullName(),
                        "username", user.getUsername(),
                        "email", user.getEmail()
                ),
                "lab", Map.of(
                        "id", lab.getId(),
                        "name", lab.getName()

                )
        );

        publisher.publishEvent(EmailEvent.builder()
                .to(user.getEmail())
                .subject("🎉 Pending Community Solution: " + lab.getName())
                .templateName("community-solution-pending")
                .model(model)
                .partials(List.of(
                ))
                .attachmentUrls(List.of(
                ))
                .generateReport(false)
                .build());

        CommunitySolutionDTO dto = new CommunitySolutionDTO(
                communitySolution.getId(),
                communitySolution.getStatus(),
                communitySolution.getWriteUpUrl(),
                communitySolution.getYoutubeUrl(),
                communitySolution.getLab().getId(),
                communitySolution.getUser().getId(),
                communitySolution.getUser().getFullName() != null ? communitySolution.getUser().getFullName() : communitySolution.getUser().getUsername()
        );

        return ResponseEntity.ok(dto);
    }



    public ResponseEntity<?> updateStatusCommunitySolution(int solutionId, Boolean approved, String feedback) {
        CommunitySolution communitySolution = communitySolutionRepository.findById(solutionId).orElse(null);
        if (communitySolution == null) {
            return ResponseEntity.badRequest().body("Community solution not found");
        }
        User user = communitySolution.getUser();
        Lab lab = communitySolution.getLab();

        String subjectStatus = approved != null && approved ? "Approved" : "Rejected";
        if (approved != null && approved) {
            communitySolution.setStatus(ESolutionStatus.Approved);
            communitySolution.setFeedback(feedback != null ? feedback : "No feedback provided");
            Map<String, Object> model = Map.of(
                    "subject", subjectStatus + " Status" + lab.getName(),
                    "user", Map.of(
                            "fullName", user.getFullName(),
                            "username", user.getUsername(),
                            "email", user.getEmail()
                    ),
                    "lab", Map.of(
                            "id", lab.getId(),
                            "name", lab.getName()

                    )
            );

            publisher.publishEvent(EmailEvent.builder()
                    .to(user.getEmail())
                    .subject("🎉 " + subjectStatus + " Community Solution: " + lab.getName())
                    .templateName("comunity-solution-accept")
                    .model(model)
                    .partials(List.of(
                    ))
                    .attachmentUrls(List.of(
                    ))
                    .generateReport(false)
                    .build());
        } else {
            Map<String, Object> model = Map.of(
                    "subject", subjectStatus + " Status" + lab.getName(),
                    "user", Map.of(
                            "fullName", user.getFullName(),
                            "username", user.getUsername(),
                            "email", user.getEmail()
                    ),
                    "lab", Map.of(
                            "id", lab.getId(),
                            "name", lab.getName(),
                            "feedback", feedback != null ? feedback : "No feedback provided"

                    )
            );
            communitySolution.setFeedback(feedback != null ? feedback : "No feedback provided");

            publisher.publishEvent(EmailEvent.builder()
                    .to(user.getEmail())
                    .subject("🎉 " + subjectStatus + " Community Solution: " + lab.getName())
                    .templateName("email_templates_community-solution-rejected")
                    .model(model)
                    .partials(List.of(
                    ))
                    .attachmentUrls(List.of(
                    ))
                    .generateReport(false)
                    .build());
            communitySolution.setStatus(ESolutionStatus.Rejected);
        }

        communitySolutionRepository.save(communitySolution);





        return ResponseEntity.ok("Community solution status updated successfully");
    }

    public ResponseEntity<?> getAllCommunitySolutions(int labId) {
        List<CommunitySolution> communitySolutions = communitySolutionRepository.findAllByLabId(labId);

        List<CommunitySolutionDTOUser> out = new ArrayList<>();
        communitySolutions.forEach(communitySolution1 -> {
            CommunitySolutionDTOUser dto = new CommunitySolutionDTOUser(
                    communitySolution1.getId(),
                    communitySolution1.getStatus(),
                    communitySolution1.getWriteUpUrl(),
                    communitySolution1.getYoutubeUrl(),
                    communitySolution1.getLab().getId(),
                    communitySolution1.getUser().getId(),
                    communitySolution1.getUser().getFullName() != null ? communitySolution1.getUser().getFullName() : communitySolution1.getUser().getUsername(),
                    communitySolution1.getFeedback() != null ? communitySolution1.getFeedback() : "No feedback provided"
            );
            out.add(dto);
        });
        return ResponseEntity.ok(out);

    }

    public ResponseEntity<?> getLabLogs(Long labId) {
        List<LabSession> sessions = labSessionRepository.findAllByLabId(labId);
        List<Map<String, Object>> logs = new ArrayList<>();

        for (LabSession session : sessions) {
            Map<String, Object> logEntry = new HashMap<>();
            logEntry.put("sessionId", session.getId());
            logEntry.put("userId", session.getUser().getId());
            logEntry.put("username", session.getUser().getUsername());
            logEntry.put("status", session.getStatus());
            logEntry.put("startedAt", session.getStartedAt());
            logEntry.put("completedAt", session.getCompletedAt());
            logEntry.put("expiresAt", session.getExpiresAt());
            logEntry.put("containerId", session.getContainerId());
            logEntry.put("flagSubmitted", session.getFlagSubmitted() != null ? session.getFlagSubmitted() : "None");
            logEntry.put("counterErrorFlag", session.getCounterErrorFlag());
            logs.add(logEntry);
        }

        return ResponseEntity.ok(logs.stream().sorted(Comparator.comparing(log -> (Instant) log.get("startedAt"))).collect(Collectors.toList()));
    }

    record CommunitySolutionDTO(
            int id,
            ESolutionStatus status,
            String writeup,
            String youtubeUrl,
            Integer labId,
            int userId,
            String fullName
    ) {}

    record CommunitySolutionDTOUser(
            int id,
            ESolutionStatus status,
            String writeup,
            String youtubeUrl,
            Integer labId,
            int userId,
            String fullName,
            String feedback
    ) {}

    public record UserLabCountStatistics(
            Integer userId,
            String fullName,
            int errorCount,
            int labAccessCount,
            int totalSolved,
            Double firstSolvedTimeSeconds,
            Double fastestSolveTimeSeconds,
            Double averageSolveTimeSeconds
    ) {}

    public record UserRecentLabs(
            String fullName,
           String labName,
            LocalDateTime completedAt
    ) {}
    public record AdminStatistics(
            Integer labSolvedCount,
            Integer labExpiredCount,
            Integer totalLabs,
            Integer totalUsers
    ) {}
    public record LabStatusStatistics(
            LocalDateTime completedAt,
            Integer labId
    ) {}

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LabListForStatus {
        private List<LabStatusStatistics> solved;
        private List<LabStatusStatistics> expired;
    }

    // DTO cho status
    public record LabInstanceDTO(
            String containerId,
            String image,
            String lab,
            String owner,
            int port,
            String url,
            String state,
            String status,
            Instant createdAt,
            Instant expiresAt
    ) {}

    public record StartLabResult(String containerId, int port, String url, Instant expiresAt) {}
    public List<ImageInfoDTO> listImages(@Nullable Boolean danglingOnly, @Nullable Boolean inUseOnly) {
        List<Container> containers = dockerClient.listContainersCmd()
                .withShowAll(true)
                .exec();
        Set<String> inUseImageIds = containers.stream()
                .map(Container::getImageId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<Image> images = dockerClient.listImagesCmd()
                .withShowAll(true)
                .exec();

        List<ImageInfoDTO> out = new ArrayList<>();
        for (Image img : images) {
            String id = img.getId(); // sha256:...
            String idShort = (id != null && id.length() > 12) ? id.substring(7, 19) : id; // cắt ngắn

            List<String> tags = (img.getRepoTags() == null) ? List.of() : Arrays.asList(img.getRepoTags());
            boolean dangling = tags.isEmpty() || (tags.size() == 1 && "<none>:<none>".equals(tags.get(0)));
            boolean inUse = inUseImageIds.contains(id);

            if (danglingOnly != null && danglingOnly && !dangling) continue;
            if (inUseOnly != null && inUseOnly && !inUse) continue;

            Instant createdAt = Instant.ofEpochSecond(img.getCreated() == null ? 0L : img.getCreated());
            long sizeBytes = (img.getSize() == null) ? 0L : img.getSize();

            out.add(new ImageInfoDTO(
                    id,
                    idShort,
                    tags,
                    sizeBytes,
                    createdAt,
                    dangling,
                    inUse
            ));
        }

        out.sort(Comparator.comparing(ImageInfoDTO::createdAt).reversed());
        return out;
    }

    public record ImageInfoDTO(
            String id,
            String idShort,        // rút gọn
            List<String> repoTags, // ví dụ: ["user/image:latest"]
            long sizeBytes,
            Instant createdAt,
            boolean dangling,      // true nếu <none>:<none>
            boolean inUse          // true nếu đang có container sử dụng
    ) {}


}
