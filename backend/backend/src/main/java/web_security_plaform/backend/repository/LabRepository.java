package web_security_plaform.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.LabSession;
import web_security_plaform.backend.model.Tag;

import java.util.List;
import java.util.Set;

@Repository
public interface LabRepository extends JpaRepository<Lab, Integer> {

    @Query(value = "SELECT DISTINCT l FROM Lab l LEFT JOIN FETCH l.author a",
            countQuery = "SELECT COUNT(l) FROM Lab l")
    Page<Lab> findLabsWithAuthor(Pageable pageable);

    @Query("SELECT DISTINCT l FROM Lab l LEFT JOIN FETCH l.author a LEFT JOIN FETCH l.tags t WHERE l IN :labs")
    List<Lab> findWithTags(@Param("labs") List<Lab> labs);

    List<Lab> findByNameIgnoreCase(String name);
    List<Lab> findByNameContainingIgnoreCase(String name);

    @Query("SELECT DISTINCT l FROM Lab l LEFT JOIN FETCH l.tags t")
    List<Lab> findAllWithTags();

    @Query("SELECT DISTINCT l FROM Lab l JOIN l.tags t " +
            "WHERE l.name LIKE :name AND t IN :tags " +
            "GROUP BY l " +
            "HAVING COUNT(DISTINCT t) = :tagCount")
    List<Lab> findByNameContainingAndAllTags(@Param("name") String name,
                                             @Param("tags") Set<Tag> tags,
                                             @Param("tagCount") Long tagCount);
    @Query("SELECT DISTINCT l FROM Lab l LEFT JOIN FETCH l.tags t " +
            "WHERE l.name LIKE :name")
    List<Lab> findByNameContainingWithTags(@Param("name") String name);

    @Query("SELECT l.difficulty, COUNT(l) FROM Lab l GROUP BY l.difficulty")
    List<Object[]> countLabsByLevel();



}
