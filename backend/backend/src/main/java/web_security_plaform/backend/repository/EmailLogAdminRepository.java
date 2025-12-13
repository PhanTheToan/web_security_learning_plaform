package web_security_plaform.backend.repository;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import web_security_plaform.backend.model.EmailLog;
import web_security_plaform.backend.model.ENum.EmailStatus;

public interface EmailLogAdminRepository extends JpaRepository<EmailLog, Long> {
    Page<EmailLog> findByStatus(EmailStatus status, Pageable pageable);
    Page<EmailLog> findBySubjectContainingIgnoreCase(String q, Pageable pageable);
    Page<EmailLog> findByToEmailContainingIgnoreCase(String q, Pageable pageable);
}
