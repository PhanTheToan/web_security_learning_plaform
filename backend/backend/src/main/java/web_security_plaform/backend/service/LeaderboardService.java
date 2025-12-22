package web_security_plaform.backend.service;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.model.UserStats;
import web_security_plaform.backend.payload.dto.UserRankingDto;
import web_security_plaform.backend.repository.UserStarRepository;
import web_security_plaform.backend.repository.UserStatsRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {
    private final UserStarRepository userStarRepository;
    @PersistenceContext
    private EntityManager em;

    /**
     * Lấy toàn bộ bảng xếp hạng.
     */
    public List<UserRankingDto> getFullLeaderboard() {
        return userStarRepository.getFullLeaderboard();
    }

    private final UserStatsRepository userStatsRepository;


    @Transactional
    public void updateStatsOnFirstSolve(User user, int timeSolvedMinutes, int errorCount) {

        Integer userId = user.getId();

        UserStats stats = userStatsRepository.findById(userId).orElse(null);

        if (stats == null) {
            User userRef = em.getReference(User.class, userId);

            stats = new UserStats();
            stats.setUser(userRef);
            stats.setLabsSolved(0);
            stats.setTotalTimeMinutes(0L);
            stats.setTotalErrors(0);

            em.persist(stats);
            em.flush();
        }

        stats.setLabsSolved(stats.getLabsSolved() + 1);
        stats.setTotalTimeMinutes(stats.getTotalTimeMinutes() + timeSolvedMinutes);
        stats.setTotalErrors(stats.getTotalErrors() + errorCount);

    }

    public List<UserRankingDto> getTop10Leaderboard() {
        List<UserStats> stats = userStatsRepository.findTop10ByOrder()
                .stream()
                .limit(10)
                .toList();

        return stats.stream()
                .map(us -> new UserRankingDto(
                        us.getUserId(),
                        us.getUser().getFullName() != null ? us.getUser().getFullName() : us.getUser().getUsername(),
                        us.getLabsSolved(),
                        us.getTotalTimeMinutes(),
                        us.getTotalErrors()
                ))
                .collect(Collectors.toList());
    }

    public String getUserRankString(Integer userId) {
        Long rank = userStatsRepository.findRankOfUser(userId);
        if (rank == null) {

            return "#-";
        }
        return "#" + rank;
    }

}
