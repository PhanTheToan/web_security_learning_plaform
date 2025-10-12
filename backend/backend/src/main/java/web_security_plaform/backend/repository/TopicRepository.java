package web_security_plaform.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.Topic;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    @Query(value = "SELECT DISTINCT l FROM Topic l LEFT JOIN FETCH l.author a",
            countQuery = "SELECT COUNT(l) FROM Lab l")
    Page<Topic> findTopicsWithAuthor(Pageable pageable);

    @Query("SELECT DISTINCT l FROM Lab l LEFT JOIN FETCH l.author a LEFT JOIN FETCH l.tags t WHERE l IN :labs")
    List<Topic> findWithTags(@Param("labs") List<Lab> labs);
}
