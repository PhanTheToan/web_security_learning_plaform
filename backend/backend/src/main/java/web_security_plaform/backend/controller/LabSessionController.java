package web_security_plaform.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.model.ENum.ESessionStatus;
import web_security_plaform.backend.model.EmailEvent;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.LabSession;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.response.LabSessionDTO;
import web_security_plaform.backend.repository.LabSessionRepository;
import web_security_plaform.backend.service.LabRunnerService;
import web_security_plaform.backend.service.LabService;
import web_security_plaform.backend.service.LabSessionService;
import web_security_plaform.backend.service.UserService;

import java.security.Principal;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lab-session")
public class LabSessionController {
    @Autowired
    private LabService labService;

    @Autowired
    private LabRunnerService  labRunnerService;

    @Autowired
    private UserService userService;

    @Autowired
    private LabSessionService labSessionService;

    @Autowired
    private LabSessionRepository labSessionRepository;


    private final ApplicationEventPublisher publisher;



    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/user-sessions")
    public ResponseEntity<?> getLabSessionsForUser(Principal principal, @RequestParam Integer labId) {
        User user = userService.findByUsername(principal.getName());
        List<LabSession> labSessions = labSessionService.findLabSessionsByUserIdAndLabId(user.getId(), labId);

        if (labSessions == null || labSessions.isEmpty()) {
            return ResponseEntity.ok(ESessionStatus.EXPIRED);
        }

        boolean hasRunning = labSessions.stream()
                .anyMatch(s -> s.getStatus() == ESessionStatus.RUNNING);

        if (hasRunning) {
            return labSessions.stream()
                    .filter(s -> s.getStatus() == ESessionStatus.RUNNING)
                    .findFirst()
                    .map(s -> ResponseEntity.ok(
                            ESessionStatus.RUNNING +
                                    " - ID: " + s.getId() +
                                    " - URL: " + s.getUrl()
                    ))
                    .orElse(ResponseEntity.ok("Không có session đang RUNNING"));
        }

        boolean hasSolved = labSessions.stream()
                .anyMatch(s -> s.getStatus() == ESessionStatus.SOLVED);

        if (hasSolved) {
            return ResponseEntity.ok(ESessionStatus.SOLVED);
        }

        return ResponseEntity.ok(ESessionStatus.EXPIRED);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @PostMapping("/active")
    public ResponseEntity<?> activateLabSessionForUser(@RequestParam  Integer labId, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        Lab lab = labService.getLabById(labId);
        List<LabSession> labSessionServiceListForUser = labSessionService.findLabSessionsByUserIdAndLabId(user.getId(), labId);
        if(labSessionServiceListForUser != null && !labSessionServiceListForUser.isEmpty()){
            for(LabSession labSession : labSessionServiceListForUser){
                if(labSession.getStatus().equals(ESessionStatus.RUNNING)){
                    return ResponseEntity.ok(new LabSessionDTO(labSession.getId(),"Lab is already active",labSession.getContainerId(), labSession.getUrl(), labSession.getPort(), labSession.getExpiresAt()));
                }
            }
        }
        return activateLabForUser(user, lab);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @PostMapping("/submit")
    public ResponseEntity<?> submitFlag(Principal principal, @RequestBody String flag, @RequestParam Integer labId, @RequestParam Integer labSessionId){
        User user = userService.findByUsername(principal.getName());
        Lab lab = labService.getLabById(labId);
        LabSession labSession = labSessionRepository.findById(labSessionId).orElse(null);
        if(labSession != null && labSession.getUser().getId().equals(user.getId()) && labSession.getLab().getId().equals(labId)
                && labSession.getStatus().equals(ESessionStatus.RUNNING)){
            if(Objects.equals(lab.getFlag(), flag)){
                labSession.setStatus(ESessionStatus.SOLVED);
                labSession.setCompletedAt(Instant.now());
                labSession.setFlagSubmitted(flag);
                labSessionRepository.save(labSession);
                labRunnerService.stopAfter(labSession, Duration.ofSeconds(180),true);
                Instant completedAt = Instant.now();

                ZoneId tz = ZoneId.of("Asia/Bangkok");
                DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss").withZone(tz);
                String startedAtStr = fmt.format(labSession.getStartedAt());
                String completedAtStr = fmt.format(completedAt);
                Map<String, Object> model = Map.of(
                        "subject", "Bạn đã hoàn thành lab " + lab.getName(),
                        "user", Map.of(
                                "fullName", user.getFullName(),
                                "username", user.getUsername(),
                                "email", user.getEmail()
                        ),
                        "lab", Map.of(
                                "id", lab.getId(),
                                "name", lab.getName()

                        ),
                        "session", Map.of(
                                "id", labSession.getId(),
                                "startedAt", startedAtStr,
                                "completedAt", completedAtStr,
                                "url", labSession.getUrl()
                        )
                );

                publisher.publishEvent(EmailEvent.builder()
                        .to(user.getEmail())
                        .subject("🎉 Hoàn thành lab: " + lab.getName())
                        .templateName("lab-solved")
                        .model(model)
                        .partials(List.of(
                        ))
                        .attachmentUrls(List.of(
                        ))
                        .generateReport(false)
                        .build());
                return ResponseEntity.ok("Flag is correct! Lab completed.");
            }else{
                int counterErrorFlag = labSession.getCounterErrorFlag() != null ? labSession.getCounterErrorFlag() : 0;
                labSession.setCounterErrorFlag(counterErrorFlag + 1);
                labSessionRepository.save(labSession);
                return ResponseEntity.badRequest().body("Incorrect flag. Please try again.");
            }
        }
        return ResponseEntity.badRequest().body("No active lab session found for submission.");
    }



    public ResponseEntity<?> activateLabForUser(User user, Lab lab) {

        LabRunnerService.StartLabResult res = labRunnerService.startLab(
                lab.getDockerImage(),
                lab.getName(),
                user.getId().toString(),
                lab.getTimeoutMinutes()
        );

        LabSession labSession = new LabSession();
        labSession.setUser(user);
        labSession.setLab(lab);
        labSession.setContainerId(res.containerId());
        labSession.setUrl(res.url());
        labSession.setPort(res.port());
        labSession.setExpiresAt(res.expiresAt());
        labSession.setStatus(ESessionStatus.RUNNING);
        labSession.setStartedAt(Instant.now());

        labSessionRepository.save(labSession);

        return ResponseEntity.ok(new LabSessionDTO(labSession.getId(),"Lab started successfully",res.containerId(), res.url(),res.port(),res.expiresAt()));
    }
}
