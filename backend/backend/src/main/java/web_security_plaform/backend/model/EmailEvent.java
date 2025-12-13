package web_security_plaform.backend.model;

import lombok.Builder;

import java.util.List;
import java.util.Map;

@Builder
public record EmailEvent(
        String to,
        String cc,
        String bcc,
        String subject,
        String templateName,
        Map<String, Object> model,
        List<String> partials,
        List<String> attachmentUrls,
        boolean generateReport,
        String reportKeyPrefix
) {}