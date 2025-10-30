package web_security_plaform.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import web_security_plaform.backend.model.LabSession;

import java.util.List;

@Repository
public interface LabSessionRepository extends JpaRepository<LabSession, Integer> {
    @Query("SELECT ls FROM LabSession ls WHERE ls.user.id = ?1 AND ls.lab.id = ?2")
    List<LabSession> findLabSessionsByUserIdAndLabId(Integer id, Integer labId);
    @Query("SELECT ls FROM LabSession ls WHERE ls.containerId = ?1 AND ls.status = 'RUNNING'")
    LabSession findByContainerIdWithStatusRunning(String containerId);
}
