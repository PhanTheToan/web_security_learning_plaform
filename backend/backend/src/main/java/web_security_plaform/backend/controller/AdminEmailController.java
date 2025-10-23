package web_security_plaform.backend.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.config.R2HandlebarsRenderer;
import web_security_plaform.backend.model.EmailEvent;
import web_security_plaform.backend.model.EmailLog;
import web_security_plaform.backend.service.MailService;
import org.springframework.context.ApplicationEventPublisher;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/email")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminEmailController {

    private final R2HandlebarsRenderer renderer;
    private final MailService mailService;
    private final ApplicationEventPublisher publisher;

    @PostMapping("/preview")
    public ResponseEntity<String> preview(@RequestBody PreviewReq req) throws IOException {
        String html = renderer.renderFromR2(
                req.templateName, req.model != null ? req.model : Map.of(),
                req.partials != null ? req.partials.toArray(String[]::new) : null
        );
        return ResponseEntity.ok(html);
    }

    @PostMapping("/send")
    public ResponseEntity<String> send(@RequestBody SendReq req) {
        mailService.sendEmailFromR2(
                req.to, req.cc, req.bcc,
                req.subject,
                req.templateName,
                req.model != null ? req.model : Map.of(),
                req.partials,
                req.attachmentUrls,
                Boolean.TRUE.equals(req.generateReport),
                req.reportKeyPrefix
        );
        return ResponseEntity.ok("SENT");
    }

    @PostMapping("/send-async")
    public ResponseEntity<String> sendAsync(@RequestBody SendReq req) {
        publisher.publishEvent(EmailEvent.builder()
                .to(req.to).cc(req.cc).bcc(req.bcc)
                .subject(req.subject)
                .templateName(req.templateName)
                .model(req.model != null ? req.model : Map.of())
                .partials(req.partials)
                .attachmentUrls(req.attachmentUrls)
                .generateReport(Boolean.TRUE.equals(req.generateReport))
                .reportKeyPrefix(req.reportKeyPrefix)
                .build());
        return ResponseEntity.ok("QUEUED");
    }

    @Data
    public static class PreviewReq {
        public String templateName;
        public Map<String, Object> model;
        public List<String> partials;
    }

    @Data
    public static class SendReq extends PreviewReq {
        public String to;
        public String cc;
        public String bcc;
        public String subject;
        public List<String> attachmentUrls;
        public Boolean generateReport;
        public String reportKeyPrefix;
    }

    @GetMapping("/logs")
    public ResponseEntity<Page<EmailLog>> getEmailLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status
    ) {
        Page<EmailLog> logs = mailService.getEmailLogs(page, size, keyword, status);
        return ResponseEntity.ok(logs);
    }
}
