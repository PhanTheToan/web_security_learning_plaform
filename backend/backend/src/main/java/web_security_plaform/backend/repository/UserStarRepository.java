package web_security_plaform.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import web_security_plaform.backend.model.UserStar;
import web_security_plaform.backend.payload.dto.UserRankingDto;

import java.util.List;

@Repository
public interface UserStarRepository extends JpaRepository<UserStar, Long> {
    @Query("""
        SELECT new web_security_plaform.backend.payload.dto.UserRankingDto(
            u.id,
            COALESCE(u.fullName, u.username),
            COUNT(us.lab.id) AS labsSolved,
            COALESCE(SUM(us.timeSolved), 0),
            COALESCE(SUM(us.errorCount), 0)
        )
        FROM UserStar us
        JOIN us.user u
        GROUP BY u.id, u.fullName, u.username
        ORDER BY labsSolved DESC, SUM(us.timeSolved) ASC, SUM(us.errorCount) ASC
        """)
    List<UserRankingDto> getFullLeaderboard();

    @Query("""
        SELECT new web_security_plaform.backend.payload.dto.UserRankingDto(
            u.id,
            COALESCE(u.fullName, u.username),
            COUNT(us.lab.id) AS labsSolved,
            COALESCE(SUM(us.timeSolved), 0),
            COALESCE(SUM(us.errorCount), 0)
        )
        FROM UserStar us
        JOIN us.user u
        GROUP BY u.id, u.fullName, u.username
        ORDER BY labsSolved DESC, SUM(us.timeSolved) ASC, SUM(us.errorCount) ASC
        """)
    Page<UserRankingDto> getLeaderboardPage(Pageable pageable);
}
