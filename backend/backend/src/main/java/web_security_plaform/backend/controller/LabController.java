package web_security_plaform.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.dto.LabInfoDetail;
import web_security_plaform.backend.repository.UserRepository;
import web_security_plaform.backend.service.LabRunnerService;
import web_security_plaform.backend.service.LabService;
import web_security_plaform.backend.service.UserService;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/lab")
public class LabController {
    @Autowired
    private LabService labService;

    @Autowired
    private LabRunnerService labRunnerService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;



    @GetMapping()
    public ResponseEntity<?> getAllLabs(){
        return ResponseEntity.ok(labService.getAllLabs());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<LabInfoDetail>> filterLabs(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Set<Integer> tagIds) {

        List<LabInfoDetail> filteredLabs = labService.filterByNameAndTags(name, tagIds);

        return ResponseEntity.ok(filteredLabs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLabDetailByIdForUser(@PathVariable Integer id){
        return ResponseEntity.ok(labService.getLabDetailByUser(id));
    }

    @PostMapping("/active")
    public ResponseEntity<?> activateLabForUser(Principal principal, @RequestParam Integer labId) {
        User user = userService.findByUsername(principal.getName());
        Lab lab = labService.getLabById(labId);

        LabRunnerService.StartLabResult res = labRunnerService.startLab(
                lab.getDockerImage(),
                lab.getName(),
                user.getId().toString(),
                lab.getTimeoutMinutes()
        );

        return ResponseEntity.ok(Map.of(
                "message", "Lab activated successfully",
                "containerId", res.containerId(),
                "url", res.url(),
                "port", res.port(),
                "expiresAt", res.expiresAt().toString()
        ));
    }

    @PostMapping("/stop")
    public ResponseEntity<?> inActivateLabForUser(@RequestParam String contrainerId){
        labRunnerService.stopAndCleanup(contrainerId);
        return ResponseEntity.ok("Lab stop successfully");
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/status")
    public ResponseEntity<?> listStatus(Principal principal, @RequestParam(name = "mine", required = false) Boolean mine) {
        String ownerFilter = null;
        if (Boolean.TRUE.equals(mine)) {
            User user = userService.findByUsername(principal.getName());
            ownerFilter = user.getId().toString();
        }
        List<LabRunnerService.LabInstanceDTO> list = labRunnerService.listRunningLabs(ownerFilter);
        return ResponseEntity.ok(list);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/images")
    public ResponseEntity<?> listImages(
            @RequestParam(name = "dangling", required = false) Boolean dangling,
            @RequestParam(name = "inUse", required = false) Boolean inUse
    ) {
        var list = labRunnerService.listImages(dangling, inUse);
        return ResponseEntity.ok(list);
    }

}
