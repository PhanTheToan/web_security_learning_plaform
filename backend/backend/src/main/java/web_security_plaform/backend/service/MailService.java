package web_security_plaform.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import web_security_plaform.backend.config.R2HandlebarsRenderer;
import web_security_plaform.backend.model.ENum.EmailStatus;
import web_security_plaform.backend.model.EmailLog;
import web_security_plaform.backend.repository.EmailLogRepository;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final R2HandlebarsRenderer renderer;
    private final R2Service r2;
    private final PdfService pdfService;
    private final EmailLogRepository emailLogRepo;



    @Value("${email.assets.logoUrl:}")
    private String logoUrl;

    /**
     * Gửi email HTML từ template .hbs (R2), đính kèm file từ R2 public URL,
     * (tuỳ chọn) sinh PDF từ template "report" hoặc từ model["reportHtml"] và upload PDF lên R2.
     */
    public void sendEmailFromR2(
            String to, @Nullable String cc, @Nullable String bcc,
            String subject,
            String templateName,
            Map<String, Object> model,
            @Nullable List<String> partialNames,
            @Nullable List<String> attachmentUrls,
            boolean generateReport,
            @Nullable String reportKeyPrefix
    ) {
        EmailLog.EmailLogBuilder logb = EmailLog.builder()
                .toEmail(to).cc(cc).bcc(bcc)
                .subject(subject).templateName(templateName)
                .sentAt(LocalDateTime.now());

        try {
            // 1) Render Email HTML
            String html = renderer.renderFromR2(
                    templateName, model,
                    partialNames != null ? partialNames.toArray(String[]::new) : null
            );

            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, StandardCharsets.UTF_8.name());
            helper.setTo(to);
            if (cc != null && !cc.isBlank()) helper.setCc(cc);
            if (bcc != null && !bcc.isBlank()) helper.setBcc(bcc);
            helper.setSubject(subject);
            helper.setText(html, true);

            // 2) Inline CID logo (nếu có)
            if (logoUrl != null && !logoUrl.isBlank()) {
                byte[] logo = r2.downloadPublic(logoUrl);
                helper.addInline("logo", new ByteArrayResource(logo), "image/png");
                // trong .hbs dùng: <img src="cid:logo" .../>
            }

            // 3) Đính kèm file từ R2 (public URLs)
            if (attachmentUrls != null) {
                for (String url : attachmentUrls) {
                    String filename = url.substring(url.lastIndexOf('/') + 1);
                    byte[] bytes = r2.downloadPublic(url);
                    helper.addAttachment(filename, new ByteArrayResource(bytes), R2Service.guessContentType(filename));
                }
            }

            // 4) (Optional) Sinh PDF → upload → attach
            if (generateReport) {
                String reportHtml = (String) model.get("reportHtml");
                if (reportHtml == null) {
                    reportHtml = renderer.renderFromR2("report", model, null); // cần có email_templates/report.hbs trên R2
                }
                byte[] pdf = pdfService.htmlToPdfBytes(reportHtml);
                String key = (reportKeyPrefix != null ? reportKeyPrefix : "reports/") + "report-" + System.currentTimeMillis() + ".pdf";
                String publicUrl = r2.uploadBytes(key, pdf, "application/pdf");

                helper.addAttachment("report.pdf", new ByteArrayResource(pdf), "application/pdf");
                model.put("reportUrl", publicUrl); // nếu muốn tái render lần sau để hiển thị link
            }

            mailSender.send(msg);
            emailLogRepo.save(logb.status(EmailStatus.SENT).build());

        } catch (MessagingException | RuntimeException e) {
            emailLogRepo.save(logb.status(EmailStatus.FAILED).errorMessage(e.getMessage()).build());
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Page<EmailLog> getEmailLogs(int page, int size, String keyword, String statusStr) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "sentAt"));
        EmailStatus status = parseStatus(statusStr);
        return emailLogRepo.searchLogs(
                (keyword != null && !keyword.isBlank()) ? keyword : null,
                status,
                pageable
        );
    }
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public Map<String, String> handleBadEnum(IllegalArgumentException ex) {
        return Map.of("error", "Invalid status. Allowed: SENT, FAILED");
    }
    private EmailStatus parseStatus(String s) {
        if (s == null || s.isBlank()) return null;
        return EmailStatus.valueOf(s.trim().toUpperCase()); // sẽ ném IllegalArgumentException nếu sai
    }

    public void sendEmailFromR2Prepared(
            String to, @Nullable String cc, @Nullable String bcc,
            String subject,
            String templateName,
            Map<String, Object> model,
            @Nullable List<String> partialNames,
            @Nullable List<String> attachmentUrls,
            boolean generateReport,
            @Nullable String reportKeyPrefix,
            @Nullable PreparedMailAssets assets
    ) {
        EmailLog.EmailLogBuilder logb = EmailLog.builder()
                .toEmail(to).cc(cc).bcc(bcc)
                .subject(subject).templateName(templateName)
                .sentAt(LocalDateTime.now());

        try {
            String html = renderer.renderFromR2(
                    templateName, model,
                    partialNames != null ? partialNames.toArray(String[]::new) : null
            );

            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, StandardCharsets.UTF_8.name());
            helper.setTo(to);
            if (cc != null && !cc.isBlank()) helper.setCc(cc);
            if (bcc != null && !bcc.isBlank()) helper.setBcc(bcc);
            helper.setSubject(subject);
            helper.setText(html, true);

            if (logoUrl != null && !logoUrl.isBlank()) {
                byte[] logo;
                if (assets != null && assets.logoBytes() != null && assets.logoBytes().length > 0) {
                    logo = assets.logoBytes();
                } else {
                    logo = r2.downloadPublic(logoUrl);
                }
                helper.addInline("logo", new ByteArrayResource(logo), "image/png");
            }

            if (attachmentUrls != null) {
                Map<String, byte[]> cached =
                        (assets != null && assets.attachmentBytesByFilename() != null)
                                ? assets.attachmentBytesByFilename()
                                : java.util.Collections.emptyMap();

                for (String url : attachmentUrls) {
                    String filename = url.substring(url.lastIndexOf('/') + 1);

                    byte[] bytes = cached.get(filename);
                    if (bytes == null) {
                        // fallback nếu cache không có
                        bytes = r2.downloadPublic(url);
                    }

                    helper.addAttachment(
                            filename,
                            new ByteArrayResource(bytes),
                            R2Service.guessContentType(filename)
                    );
                }
            }

            if (generateReport) {
                String reportHtml = (String) model.get("reportHtml");
                if (reportHtml == null) {
                    reportHtml = renderer.renderFromR2("report", model, null);
                }
                byte[] pdf = pdfService.htmlToPdfBytes(reportHtml);
                String key = (reportKeyPrefix != null ? reportKeyPrefix : "reports/")
                        + "report-" + System.currentTimeMillis() + ".pdf";
                String publicUrl = r2.uploadBytes(key, pdf, "application/pdf");

                helper.addAttachment("report.pdf", new ByteArrayResource(pdf), "application/pdf");
                model.put("reportUrl", publicUrl);
            }

            mailSender.send(msg);
            emailLogRepo.save(logb.status(EmailStatus.SENT).build());

        } catch (MessagingException | RuntimeException e) {
            emailLogRepo.save(logb.status(EmailStatus.FAILED).errorMessage(e.getMessage()).build());
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    public PreparedMailAssets prepareAssets(@Nullable List<String> attachmentUrls) {
        byte[] cachedLogo = null;
        if (logoUrl != null && !logoUrl.isBlank()) {
            cachedLogo = r2.downloadPublic(logoUrl);
        }

        Map<String, byte[]> cachedAttachments = new java.util.HashMap<>();
        if (attachmentUrls != null) {
            for (String url : attachmentUrls) {
                String filename = url.substring(url.lastIndexOf('/') + 1);
                cachedAttachments.put(filename, r2.downloadPublic(url));
            }
        }

        return new PreparedMailAssets(cachedLogo, cachedAttachments);
    }
}
