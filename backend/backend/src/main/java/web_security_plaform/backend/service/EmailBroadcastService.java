package web_security_plaform.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import web_security_plaform.backend.controller.AdminEmailController;
import web_security_plaform.backend.model.EmailJob;
import web_security_plaform.backend.repository.EmailGroupMemberRepository;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailBroadcastService {

    private final EmailGroupMemberRepository emailGroupMemberRepository;
    private final MailService mailService;
    private final EmailJobService jobService;
    private final EmailGroupMemberService memberService;


    @Async("mailExecutor")
    public void broadcastGroup(Long groupId,
                               AdminEmailController.SendReqMulti req,
                               String ccStr,
                               String bccStr) {

        EmailJob job = jobService.createQueued(groupId, req.getTemplateName(), req.getSubject());
        final String jobId = job.getId();
        log.info("Starting email broadcast job: {}", jobId);

        try {
            jobService.markRunning(jobId, (int) memberService.count(groupId));

            Map<String, Object> model = (req.getModel() != null)
                    ? req.getModel()
                    : Map.<String, Object>of();

            PreparedMailAssets assets = mailService.prepareAssets(req.getAttachmentUrls());

            int page = 0;
            int size = 1000;

            while (true) {
                var p = emailGroupMemberRepository.findEmailsByGroupId(groupId, PageRequest.of(page++, size));

                for (String email : p.getContent()) {
                    try {
                        mailService.sendEmailFromR2Prepared(
                                email,
                                ccStr,
                                bccStr,
                                req.getSubject(),
                                req.getTemplateName(),
                                model,
                                req.getPartials(),
                                req.getAttachmentUrls(),
                                Boolean.TRUE.equals(req.getGenerateReport()),
                                req.getReportKeyPrefix(),
                                assets
                        );
                        jobService.incSent(jobId);
                    } catch (Exception e) {
                        log.error("Failed to send email to {} for job {}", email, jobId, e);
                        jobService.incFailed(jobId, e.getMessage());
                    }
                }

                if (p.isLast()) break;
            }

            jobService.markCompleted(jobId);
            log.info("Finished email broadcast job: {}", jobId);

        } catch (Exception e) {
            log.error("Fatal error in email broadcast job: {}", jobId, e);
            jobService.incFailed(jobId, e.getMessage());
        }
    }
}
