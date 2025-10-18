package web_security_plaform.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import web_security_plaform.backend.model.Tag;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Integer> {
    Optional<Tag> findByNameIgnoreCase(String name);
    List<Tag> findByNameContainingIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    @Query(value = "SELECT COUNT(*) FROM lab_tags WHERE tag_id = :tagId", nativeQuery = true)
    int countLabLinksByTagId(Integer tagId);

    @Query(value = "SELECT COUNT(*) FROM topic_tags WHERE tag_id = :tagId", nativeQuery = true)
    int countTopicLinksByTagId(Integer tagId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM lab_tags WHERE tag_id = :tagId", nativeQuery = true)
    void deleteLabLinksByTagId(Integer tagId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM topic_tags WHERE tag_id = :tagId", nativeQuery = true)
    void deleteTopicLinksByTagId(Integer tagId);
}
