package web_security_plaform.backend.service;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.api.async.ResultCallbackTemplate;
import com.github.dockerjava.api.command.CreateContainerResponse;
import com.github.dockerjava.api.command.InspectContainerResponse;
import com.github.dockerjava.api.command.ListContainersCmd;
import com.github.dockerjava.api.command.PullImageResultCallback;
import com.github.dockerjava.api.model.*;
import com.github.dockerjava.core.DockerClientConfig;
import jakarta.annotation.Nullable;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import web_security_plaform.backend.model.ENum.ESessionStatus;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.LabSession;
import web_security_plaform.backend.repository.LabSessionRepository;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Service
public class LabRunnerService {
    private final DockerClient dockerClient;

    @Autowired
    private LabSessionRepository labSessionRepository;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private final Map<String, ScheduledFuture<?>> timers = new ConcurrentHashMap<>();
    private final Map<String, String> containerToImage = new ConcurrentHashMap<>();
    private final Map<String, Instant> containerExpires = new ConcurrentHashMap<>();

    // host để build URL trả về (VPS thì đặt domain/IP của bạn)
    @Value("${labs.host}")
    private String labsHost;

    private final boolean removeImageOnStop = false;

    public LabRunnerService(DockerClient dockerClient) {
        this.dockerClient = dockerClient;
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
        Optional.ofNullable(timers.remove(labSession.getContainerId())).ifPresent(t -> t.cancel(false));
        containerExpires.remove(labSession.getContainerId());
        if (flag){
            labSession.setCompletedAt(Instant.now());
            labSession.setStatus(ESessionStatus.SOLVED);
            labSessionRepository.save(labSession);
        }else{
            labSession.setStatus(ESessionStatus.EXPIRED);
            labSessionRepository.save(labSession);
        }
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
        if (labSession != null) {
            if (flag){
                labSession.setCompletedAt(Instant.now());
                labSession.setStatus(ESessionStatus.SOLVED);
                labSessionRepository.save(labSession);
            }else{
                labSession.setStatus(ESessionStatus.EXPIRED);
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
