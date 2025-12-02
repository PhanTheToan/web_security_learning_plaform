package web_security_plaform.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStats {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "labs_solved", nullable = false)
    private Integer labsSolved;

    @Column(name = "total_time_minutes", nullable = false)
    private Long totalTimeMinutes;

    @Column(name = "total_errors", nullable = false)
    private Integer totalErrors;
}
