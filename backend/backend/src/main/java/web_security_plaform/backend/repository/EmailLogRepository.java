package web_security_plaform.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import web_security_plaform.backend.model.ENum.EmailStatus;
import web_security_plaform.backend.model.EmailLog;

public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {
    @Query("""
           SELECT e FROM EmailLog e
           WHERE (:keyword IS NULL OR 
                 LOWER(e.toEmail) LIKE LOWER(CONCAT('%', :keyword, '%')) OR 
                 LOWER(e.subject) LIKE LOWER(CONCAT('%', :keyword, '%')) OR 
                 LOWER(e.templateName) LIKE LOWER(CONCAT('%', :keyword, '%')))
           AND (:status IS NULL OR e.status = :status)
           """)
    Page<EmailLog> searchLogs(
            @Param("keyword") String keyword,
            @Param("status") EmailStatus status,
            Pageable pageable
    );
    Page<EmailLog> findByStatus(EmailStatus status, Pageable pageable);
    Page<EmailLog> findBySubjectContainingIgnoreCase(String q, Pageable pageable);
    Page<EmailLog> findByToEmailContainingIgnoreCase(String q, Pageable pageable);
}
