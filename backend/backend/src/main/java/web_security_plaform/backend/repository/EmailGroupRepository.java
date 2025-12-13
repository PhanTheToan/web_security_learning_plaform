package web_security_plaform.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import web_security_plaform.backend.model.EmailGroup;

import java.util.Optional;

public interface EmailGroupRepository extends JpaRepository<EmailGroup, Long> {
    Optional<EmailGroup> findByName(String name);
    Page<EmailGroup> findByNameContainingIgnoreCase(String q, Pageable pageable);
}
