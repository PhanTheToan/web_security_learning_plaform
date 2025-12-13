package web_security_plaform.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import web_security_plaform.backend.model.EmailJob;
import web_security_plaform.backend.model.ENum.EmailJobStatus;

public interface EmailJobRepository extends JpaRepository<EmailJob, String> {
    Page<EmailJob> findByStatus(EmailJobStatus status, Pageable pageable);
    Page<EmailJob> findByGroupId(Long groupId, Pageable pageable);
}