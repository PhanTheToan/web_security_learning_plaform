package web_security_plaform.backend.controller;

import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.model.ENum.ESessionStatus;
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
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ScheduledFuture;

@RestController
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



    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @PostMapping("/active")
    public ResponseEntity<?> activateLabSessionForUser(@PathVariable  Integer labId, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        Lab lab = labService.getLabById(labId);
        List<LabSession> labSessionServiceListForUser = labSessionService.findLabSessionsByUserIdAndLabId(user.getId(), labId);
        if(labSessionServiceListForUser != null && !labSessionServiceListForUser.isEmpty()){
            for(LabSession labSession : labSessionServiceListForUser){
                if(labSession.getStatus().equals(ESessionStatus.RUNNING)){
                    return ResponseEntity.ok(new LabSessionDTO("Lab is already active",labSession.getContainerId(), labSession.getUrl(), labSession.getPort(), labSession.getExpiresAt()));
                }
            }
        }
        return activateLabForUser(user, lab);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @PostMapping("/submit")
    public ResponseEntity<?> submitFlag(Principal principal, @RequestParam String flag, @RequestParam Integer labId, @RequestParam Integer labSessionId){
        User user = userService.findByUsername(principal.getName());
        Lab lab = labService.getLabById(labId);
        LabSession labSession = labSessionRepository.findById(labSessionId).orElse(null);
        if(labSession != null && labSession.getUser().getId().equals(user.getId()) && labSession.getLab().getId().equals(labId)
                && labSession.getStatus().equals(ESessionStatus.RUNNING)){
            if(lab.getFlag().equals(flag)){
                labRunnerService.stopAfter(labSession, Duration.ofSeconds(300),true);
                return ResponseEntity.ok("Flag is correct! Lab completed.");
            }else{
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

        return ResponseEntity.ok(new LabSessionDTO("Lab started successfully",res.containerId(), res.url(),res.port(),res.expiresAt()));
    }


}
