package web_security_plaform.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import web_security_plaform.backend.controller.AdminEmailController;
import web_security_plaform.backend.repository.EmailGroupMemberRepository;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailBroadcastService {

    private final EmailGroupMemberRepository emailGroupMemberRepository;
    private final MailService mailService;

    @Async("mailExecutor")
    public void broadcastGroup(Long groupId,
                               AdminEmailController.SendReqMulti req,
                               String ccStr,
                               String bccStr) {

        Map<String, Object> model = (req.getModel() != null)
                ? req.getModel()
                : Map.<String, Object>of();

        PreparedMailAssets assets = mailService.prepareAssets(req.getAttachmentUrls());

        int page = 0;
        int size = 1000;

        while (true) {
            var p = emailGroupMemberRepository.findEmailsByGroupId(groupId, PageRequest.of(page++, size));

            for (String email : p.getContent()) {
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
            }

            if (p.isLast()) break;
        }
    }
}
