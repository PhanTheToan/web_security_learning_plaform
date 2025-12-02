package web_security_plaform.backend.service;
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

    /**
     * Lấy toàn bộ bảng xếp hạng.
     */
    public List<UserRankingDto> getFullLeaderboard() {
        return userStarRepository.getFullLeaderboard();
    }

    private final UserStatsRepository userStatsRepository;


    @Transactional
    public void updateStatsOnFirstSolve(User user, int timeSolvedMinutes, int errorCount) {
        UserStats stats = userStatsRepository.findById(user.getId())
                .orElseGet(() -> UserStats.builder()
                        .userId(user.getId())
                        .user(user)
                        .labsSolved(0)
                        .totalTimeMinutes(0L)
                        .totalErrors(0)
                        .build()
                );

        stats.setLabsSolved(stats.getLabsSolved() + 1);
        stats.setTotalTimeMinutes(stats.getTotalTimeMinutes() + timeSolvedMinutes);
        stats.setTotalErrors(stats.getTotalErrors() + errorCount);

        userStatsRepository.save(stats);
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
