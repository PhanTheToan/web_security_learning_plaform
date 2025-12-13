package web_security_plaform.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.model.EmailJob;
import web_security_plaform.backend.model.ENum.EmailJobStatus;
import web_security_plaform.backend.service.EmailJobService;

@RestController
@RequestMapping("/api/admin/email/jobs")
@RequiredArgsConstructor
public class EmailJobAdminController {

    private final EmailJobService jobService;

    @GetMapping
    public ResponseEntity<Page<EmailJob>> list(
            @RequestParam(required = false) EmailJobStatus status,
            @RequestParam(required = false) Long groupId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size
    ) {
        return ResponseEntity.ok(jobService.list(page, size, status, groupId));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<EmailJob> get(@PathVariable String jobId) {
        return ResponseEntity.ok(jobService.get(jobId));
    }

    @PostMapping("/{jobId}/pause")
    public ResponseEntity<Void> pause(@PathVariable String jobId) {
        jobService.pause(jobId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{jobId}/resume")
    public ResponseEntity<Void> resume(@PathVariable String jobId) {
        jobService.resume(jobId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{jobId}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable String jobId) {
        jobService.cancel(jobId);
        return ResponseEntity.ok().build();
    }
}
