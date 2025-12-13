package web_security_plaform.backend.model;

import jakarta.persistence.*;
import lombok.*;
import web_security_plaform.backend.model.ENum.EmailJobStatus;

import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "email_job",
        indexes = {
                @Index(name="idx_job_status", columnList="status"),
                @Index(name="idx_job_group", columnList="group_id")
        })
public class EmailJob {
    @Id
    @Column(length = 64)
    private String id; // e.g. JOB-20251214-000001

    @Column(name="group_id", nullable=false)
    private Long groupId;

    @Column(nullable=false, length=255)
    private String templateName;

    @Column(nullable=false, length=255)
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, length=32)
    private EmailJobStatus status;

    @Column(nullable=false)
    private Integer total = 0;

    @Column(nullable=false)
    private Integer sent = 0;

    @Column(nullable=false)
    private Integer failed = 0;

    @Column(nullable=false)
    private LocalDateTime createdAt;

    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;

    @Column(length=2000)
    private String lastError;
}
