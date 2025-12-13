package web_security_plaform.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import web_security_plaform.backend.model.EmailLog;
import web_security_plaform.backend.model.ENum.EmailStatus;
import web_security_plaform.backend.repository.EmailLogAdminRepository;

@Service
@RequiredArgsConstructor
public class EmailLogQueryService {

    private final EmailLogAdminRepository repo;

    public Page<EmailLog> list(Integer page, Integer size, EmailStatus status, String q, String toEmail) {
        Pageable pageable = PageRequest.of(page == null ? 0 : page, size == null ? 50 : size,
                Sort.by(Sort.Direction.DESC, "id"));

        if (status != null) return repo.findByStatus(status, pageable);
        if (toEmail != null && !toEmail.isBlank()) return repo.findByToEmailContainingIgnoreCase(toEmail, pageable);
        if (q != null && !q.isBlank()) return repo.findBySubjectContainingIgnoreCase(q, pageable);
        return repo.findAll(pageable);
    }

    public EmailLog get(Long id) {
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("EmailLog not found: " + id));
    }
}
