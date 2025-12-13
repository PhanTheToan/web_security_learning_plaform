package web_security_plaform.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import web_security_plaform.backend.model.EmailEvent;
import web_security_plaform.backend.service.MailService;

@Component
@RequiredArgsConstructor
public class EmailEventListener {

    private final MailService mailService;

    @Async
    @EventListener
    public void handle(EmailEvent e) {
        mailService.sendEmailFromR2(
                e.to(), e.cc(), e.bcc(),
                e.subject(),
                e.templateName(),
                e.model(),
                e.partials(),
                e.attachmentUrls(),
                e.generateReport(),
                e.reportKeyPrefix()
        );
    }
}