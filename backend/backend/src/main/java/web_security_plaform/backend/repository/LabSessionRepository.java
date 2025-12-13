package web_security_plaform.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    @Query("""
    SELECT ls
    FROM LabSession ls
    WHERE ls.lab.id = :labId
      AND ls.status = 'SOLVED'
      AND ls.completedAt = (
          SELECT MIN(ls2.completedAt)
          FROM LabSession ls2
          WHERE ls2.lab.id = :labId
            AND ls2.user.id = ls.user.id
            AND ls2.status = 'SOLVED'
      )
    ORDER BY ls.completedAt DESC
    """)
    List<LabSession> findAllFirstSolvedSessionsByLabId(@Param("labId") Integer labId);

    @Query("""
SELECT ls.lab.difficulty, COUNT(DISTINCT ls.lab.id)
FROM LabSession ls
WHERE ls.user.id = ?1 AND ls.status = 'SOLVED'
GROUP BY ls.lab.difficulty
""")
    List<Object[]> countLabsSolvedByUserByLevel(Integer id);
    @Query("""
SELECT ls FROM LabSession ls
JOIN FETCH ls.lab l
WHERE ls.user.id = :userId
  AND ls.status = 'SOLVED'
  AND ls.completedAt = (
      SELECT MIN(ls2.completedAt) FROM LabSession ls2
      WHERE ls2.user.id = ls.user.id AND ls2.lab.id = ls.lab.id
        AND ls2.status = 'SOLVED'
  )
""")
    List<LabSession> findFirstSolvedSessionsWithLab(@Param("userId") Integer userId);

    LabSession findFirstByUserIdAndLabIdAndStatus(Integer id, Integer labId, ESessionStatus eSessionStatus);
}
