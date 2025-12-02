package web_security_plaform.backend.payload.dto;

public record UserRankingDto(
        Integer userId,
        String fullName,
        long labsSolved,
        long totalTimeMinutes,
        long totalErrors
) {}