package web_security_plaform.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import web_security_plaform.backend.model.CommunitySolution;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface CommunitySolutionRepository extends JpaRepository<CommunitySolution, Integer> {
    Collection<CommunitySolution> findByLabId(Integer id);

    @Query("SELECT cs FROM CommunitySolution cs WHERE cs.lab.id = ?1 AND cs.user.id = ?2")
    CommunitySolution findByLabIdAndUserId(Integer labId, Integer id);

    @Query("SELECT cs FROM CommunitySolution cs WHERE cs.user.id = ?1")
    List<CommunitySolution> findAllCommunitySolutionByUserId(Integer id);

    CommunitySolution findByUserIdAndLabId(Integer id, Integer labId);

    List<CommunitySolution> findAllByLabId(int labId);
}
