package web_security_plaform.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import web_security_plaform.backend.model.ENum.ESessionStatus;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "lab_sessions")
public class LabSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_id", nullable = false)
    private Lab lab;

    @Column(name = "container_id", length = 255)
    private String containerId;

    private String url;

    private Integer port;

    @Column(name = "flag_submitted", length = 255)
    private String flagSubmitted;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ESessionStatus status;

    @Column(name = "counter_error_flag", columnDefinition = "INT DEFAULT 0")
    private Integer counterErrorFlag;

    @CreationTimestamp
    @Column(name = "started_at", updatable = false)
    private Instant startedAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "completed_at")
    private Instant completedAt;
}