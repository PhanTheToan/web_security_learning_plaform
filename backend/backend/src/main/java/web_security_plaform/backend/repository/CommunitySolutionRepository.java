package web_security_plaform.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import web_security_plaform.backend.model.CommunitySolution;

import java.util.Collection;

public interface CommunitySolutionRepository extends JpaRepository<CommunitySolution, Integer> {
    Collection<CommunitySolution> findByLabId(Integer id);
}
