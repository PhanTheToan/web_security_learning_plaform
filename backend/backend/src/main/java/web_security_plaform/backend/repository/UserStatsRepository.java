package web_security_plaform.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import web_security_plaform.backend.model.UserStats;

import java.util.List;

public interface UserStatsRepository extends JpaRepository<UserStats, Integer> {

    @Query("""
        SELECT us
        FROM UserStats us
        ORDER BY us.labsSolved DESC, us.totalTimeMinutes ASC, us.totalErrors ASC
        """)
    List<UserStats> findTop10ByOrder();

    @Query(value = """
    SELECT 1 + COUNT(*)
    FROM user_stats s
    JOIN user_stats me ON me.user_id = :userId
    WHERE
           s.labs_solved > me.labs_solved
        OR (s.labs_solved = me.labs_solved AND s.total_time_minutes < me.total_time_minutes)
        OR (s.labs_solved = me.labs_solved AND s.total_time_minutes = me.total_time_minutes
            AND s.total_errors < me.total_errors)
    """, nativeQuery = true)
    Long findRankOfUser(@Param("userId") Integer userId);

}
