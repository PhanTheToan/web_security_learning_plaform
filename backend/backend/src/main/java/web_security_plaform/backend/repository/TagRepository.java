package web_security_plaform.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import web_security_plaform.backend.model.Tag;

public interface TagRepository extends JpaRepository<Tag, Integer> {
}
