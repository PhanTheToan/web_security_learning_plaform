package web_security_plaform.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import web_security_plaform.backend.model.ENum.ESessionStatus;
import web_security_plaform.backend.model.LabSession;

import java.util.List;

@Repository
public interface LabSessionRepository extends JpaRepository<LabSession, Integer> {
    @Query("SELECT ls FROM LabSession ls WHERE ls.user.id = ?1 AND ls.lab.id = ?2")
    List<LabSession> findLabSessionsByUserIdAndLabId(Integer id, Integer labId);
    @Query("SELECT ls FROM LabSession ls WHERE ls.containerId = ?1 AND ls.status = 'RUNNING'")
    LabSession findByContainerIdWithStatusRunning(String containerId);

    @Query("SELECT ls FROM LabSession ls WHERE ls.status = 'SOLVED'")
    List<LabSession> findAllLabSessionSolved();

    @Query("SELECT ls FROM LabSession ls WHERE ls.status = 'EXPIRED'")
    List<LabSession> findAllLabSessionExpired();

    @Query("SELECT ls FROM LabSession ls WHERE ls.status = 'SOLVED' AND ls.lab.id = ?1")
    List<LabSession> findAllLabSessionSolved(Long labId);

    @Query("SELECT ls FROM LabSession ls WHERE ls.status = 'EXPIRED' AND ls.lab.id = ?1")
    List<LabSession> findAllLabSessionExpired(Long labId);

    @Query("SELECT COUNT(ls) FROM LabSession ls WHERE ls.status = ?1")
    Integer countByStatus(ESessionStatus eSessionStatus);

    @Query("SELECT COUNT(ls) FROM LabSession ls WHERE ls.lab.id = ?1 AND ls.status = ?2")
    Integer countByStatus(int labId,ESessionStatus eSessionStatus);



    @Query("SELECT ls.user.id, ls.lab.id, ls.completedAt FROM LabSession ls WHERE ls.status = 'SOLVED' ORDER BY ls.completedAt DESC LIMIT 5")
    List<Object[]> findFiveUserRecentSolvedLabs();

    @Query("SELECT ls.lab.difficulty, COUNT(ls) FROM LabSession ls WHERE ls.status = 'SOLVED' GROUP BY ls.lab.difficulty")
    List<Object[]> countSolvedLabsByDifficultyLevel();


    List<LabSession> findAllByLabId(Long labId);
}
