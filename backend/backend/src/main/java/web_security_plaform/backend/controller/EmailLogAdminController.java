package web_security_plaform.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.model.EmailLog;
import web_security_plaform.backend.model.ENum.EmailStatus;
import web_security_plaform.backend.service.EmailLogQueryService;

@RestController
@RequestMapping("/api/admin/email/logs-admin")
@RequiredArgsConstructor
public class EmailLogAdminController {

    private final EmailLogQueryService service;

    @GetMapping
    public ResponseEntity<Page<EmailLog>> list(
            @RequestParam(required = false) EmailStatus status,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String toEmail,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "50") Integer size
    ) {
        return ResponseEntity.ok(service.list(page, size, status, q, toEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmailLog> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }
}
