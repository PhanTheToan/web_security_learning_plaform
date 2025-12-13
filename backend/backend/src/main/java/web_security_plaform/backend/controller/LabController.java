package web_security_plaform.backend.controller;

import jakarta.ws.rs.GET;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.dto.LabInfoDetail;
import web_security_plaform.backend.repository.UserRepository;
import web_security_plaform.backend.service.LabRunnerService;
import web_security_plaform.backend.service.LabService;
import web_security_plaform.backend.service.UserService;

import java.security.Principal;
import java.util.*;

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

//    @PostMapping("/active")
//    public ResponseEntity<?> activateLabForUser(Principal principal, @RequestParam Integer labId) {
//        User user = userService.findByUsername(principal.getName());
//        Lab lab = labService.getLabById(labId);
//
//        LabRunnerService.StartLabResult res = labRunnerService.startLab(
//                lab.getDockerImage(),
//                lab.getName(),
//                user.getId().toString(),
//                lab.getTimeoutMinutes()
//        );
//
//        return ResponseEntity.ok(Map.of(
//                "message", "Lab activated successfully",
//                "containerId", res.containerId(),
//                "url", res.url(),
//                "port", res.port(),
//                "expiresAt", res.expiresAt().toString()
//        ));
//    }
//
//    @PostMapping("/stop")
//    public ResponseEntity<?> inActivateLabForUser(@RequestParam String contrainerId){
//        labRunnerService.stopAndCleanup(contrainerId);
//        return ResponseEntity.ok("Lab stop successfully");
//    }
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
        List<LabRunnerService.ImageInfoDTO> images = labRunnerService.listImages(dangling, inUse);
        return ResponseEntity.ok(images);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/containers/cleanup")
    public ResponseEntity<?> cleanupContainers(@RequestParam String containerIds) {
        if (containerIds == null || containerIds.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "containerIds is required");
        }

        List<String> ids = Arrays.stream(containerIds.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .toList();

        if (ids.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No valid container ids provided");
        }

        List<CleanupResult> results = new ArrayList<>();
        for (String id : ids) {
            try {
                labRunnerService.stopAndCleanupStrict(id);
                results.add(CleanupResult.ok(id, "Stopped and cleaned up successfully"));
            } catch (NoSuchElementException e) {
                results.add(CleanupResult.fail(id, "Container not found"));
            } catch (IllegalStateException e) {
                results.add(CleanupResult.fail(id, e.getMessage()));
            } catch (Exception e) {
                results.add(CleanupResult.fail(id, "Cleanup failed: " + e.getClass().getSimpleName() + ": " + e.getMessage()));
            }
        }

        boolean anyFailure = results.stream().anyMatch(r -> !r.success());
        HttpStatus status = anyFailure ? HttpStatus.MULTI_STATUS : HttpStatus.OK;
        return ResponseEntity.status(status).body(results);
    }

    public record CleanupResult(String containerId, boolean success, String message) {
        public static CleanupResult ok(String id, String msg) { return new CleanupResult(id, true, msg); }
        public static CleanupResult fail(String id, String msg) { return new CleanupResult(id, false, msg); }
    }


    @DeleteMapping("/images")
    public ResponseEntity<?> deleteImage(
            @RequestParam String image
    ) {
        try {
            if (!labRunnerService.findContainersUsingImage(image).isEmpty())
                throw new RuntimeException("Image is in use by running containers. Use force=true to delete.");

            labRunnerService.deleteImage(image);
            return ResponseEntity.ok(Map.of(
                    "message", "Image deleted successfully",
                    "image", image
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage(),
                    "image", image
            ));
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/solved-statistics")
    public ResponseEntity<?> getLabStatusStatistics() {

        return ResponseEntity.ok(labRunnerService.getLabStatusStatistics());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user-recent")
    public ResponseEntity<?> getUserRecentLabs() {
       return ResponseEntity.ok(labRunnerService.getUserRecentLabs());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/lab-solved-level")
    public ResponseEntity<?> getLabSolvedLevelStatistics() {

        return ResponseEntity.ok(labRunnerService.getLabSolvedLevelStatistics());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/solved-status/{labId}")
    public ResponseEntity<?> getSolvedStatusForLab(@PathVariable Integer labId) {

        return ResponseEntity.ok(labRunnerService.getSolvedStatusForLab(labId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/error-submit/{labId}")
    public ResponseEntity<?> getErrorSubmitStatisticsForLab(@PathVariable Long labId) {

        return ResponseEntity.ok(labRunnerService.getErrorSubmitStatisticsForLab(labId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/avg-time-solved/{labId}")
    public ResponseEntity<?> getAvgTimeToSolveForLab(@PathVariable Long labId) {

        return ResponseEntity.ok(labRunnerService.getAvgTimeToSolveForLab(labId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user-lab-count")
    public ResponseEntity<?> getUserLabCountStatistics(@RequestParam Long labId) {

        return ResponseEntity.ok(labRunnerService.getUserLabCountStatistics(labId));
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/solved-statistics/{labId}")
    public ResponseEntity<?> getLabStatusStatistics(@PathVariable Long labId) {

        return ResponseEntity.ok(labRunnerService.getLabStatusStatistics(labId));
    }

    @PreAuthorize("hasRole('ADMIN') || hasRole('USER')")
    @GetMapping("/community-solutions/user")
    public ResponseEntity<?> getCommunitySolutionsForUser(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        return ResponseEntity.ok(labRunnerService.getCommunitySolutionsForUser(user));
    }

    @PreAuthorize("hasRole('ADMIN') || hasRole('USER')")
    @PostMapping("/community-solutions")
    public ResponseEntity<?> submitCommunitySolution(Principal principal,
                                                     @RequestParam Integer labId,
                                                     @RequestParam String youtubeLink,
                                                     @RequestParam String writeUpLink) {
        User user = userService.findByUsername(principal.getName());
        return ResponseEntity.ok(labRunnerService.submitCommunitySolution(user, labId, youtubeLink,writeUpLink));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/community-solutions/{solutionId}")
    public ResponseEntity<?> updateStatus(@PathVariable int solutionId,
                                                     @RequestParam Boolean approve,
                                          @RequestParam(required = false) String adminFeedback
                                                     ) {
        return ResponseEntity.ok(labRunnerService.updateStatusCommunitySolution(solutionId, approve, adminFeedback));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/community-solutions/{labId}")
    public ResponseEntity<?> getAllCommunitySolutions( @PathVariable int labId) {
        return ResponseEntity.ok(labRunnerService.getAllCommunitySolutions(labId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/logs/{labId}")
    public ResponseEntity<?> getLabLogs(@PathVariable long labId) {
        return ResponseEntity.ok(labRunnerService.getLabLogs(labId));
    }

//    @PreAuthorize("hasRole('ADMIN')")
//    @PostMapping("/images/cleanup")
//    public ResponseEntity<?> cleanupImages(
//            @RequestParam(name = "dangling", required = false) Boolean dangling,
//            @RequestParam(name = "inUse", required = false) Boolean inUse
//    ) {
//        var cleaned = labRunnerService.cleanupImages(dangling, inUse);
//        return ResponseEntity.ok(Map.of(
//                "removedImageIds", cleaned
//        ));
//    }
}
