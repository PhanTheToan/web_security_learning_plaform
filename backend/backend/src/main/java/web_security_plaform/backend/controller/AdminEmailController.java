package web_security_plaform.backend.controller;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.config.R2HandlebarsRenderer;
import web_security_plaform.backend.model.EmailEvent;
import web_security_plaform.backend.model.EmailLog;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.repository.UserRepository;
import web_security_plaform.backend.service.MailService;
import org.springframework.context.ApplicationEventPublisher;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/admin/email")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminEmailController {

    private final R2HandlebarsRenderer renderer;
    private final MailService mailService;
    private final ApplicationEventPublisher publisher;

    private final UserRepository userRepository;

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

    private List<String> resolveEmails(List<Long> userIds, List<String> explicitEmails) {
        List<String> result = new ArrayList<>();

        if (explicitEmails != null && !explicitEmails.isEmpty()) {
            result.addAll(explicitEmails);
        }

        if (userIds != null && !userIds.isEmpty()) {
            List<User> users = userRepository.findAllById(userIds);
            result.addAll(
                    users.stream()
                            .map(User::getEmail)
                            .filter(Objects::nonNull)
                            .distinct()
                            .toList()
            );
        }

        return result;
    }


    @PostMapping("/send-async-multi-user")
    public ResponseEntity<String> sendAsyncMultiUser(@RequestBody SendReqMulti req) {
        List<String> to  = resolveEmails(req.getToUserIds(), req.getTo());
        List<String> cc  = resolveEmails(req.getCcUserIds(), req.getCc());
        List<String> bcc = resolveEmails(req.getBccUserIds(), req.getBcc());

        String ccStr  = cc.isEmpty()  ? null : String.join(",", cc);
        String bccStr = bcc.isEmpty() ? null : String.join(",", bcc);

        for (String email : to) {
            publisher.publishEvent(EmailEvent.builder()
                    .to(email)
                    .cc(ccStr)
                    .bcc(bccStr)
                    .subject(req.getSubject())
                    .templateName(req.getTemplateName())
                    .model(req.getModel() != null ? req.getModel() : Map.of())
                    .partials(req.getPartials())
                    .attachmentUrls(req.getAttachmentUrls())
                    .generateReport(Boolean.TRUE.equals(req.getGenerateReport()))
                    .reportKeyPrefix(req.getReportKeyPrefix())
                    .build());
        }



        return ResponseEntity.ok("QUEUED");
    }



    @Data
    public static class PreviewReq {
        public String templateName;
        public Map<String, Object> model;
        public List<String> partials;
    }

    @Data
    @NoArgsConstructor
    public static class SendReqMulti {
        private List<Long> toUserIds;
        private List<String> to;
        private List<Long> ccUserIds;
        private List<String> cc;
        private List<Long> bccUserIds;
        private List<String> bcc;
        private String subject;
        private String templateName;
        private Map<String, Object> model;
        private List<String> partials;
        private List<String> attachmentUrls;
        private Boolean generateReport;
        private String reportKeyPrefix;
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
