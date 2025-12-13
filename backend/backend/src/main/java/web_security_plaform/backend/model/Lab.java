package web_security_plaform.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import web_security_plaform.backend.model.ENum.EDifficulty;
import web_security_plaform.backend.model.ENum.EStatus;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "labs")
public class Lab {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @NotBlank
    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Column(nullable = false, unique = true, length = 255)
    private String flag;

    @Column(columnDefinition = "TEXT")
    private String solution;

    @Column(columnDefinition = "TEXT")
    private String hint;

    @Column(name = "fix_vulnerabilities", columnDefinition = "TEXT")
    private String fixVulnerabilities;

    @NotBlank
    @Column(name = "docker_image", nullable = false, length = 255)
    private String dockerImage;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EDifficulty difficulty;

    @Column(name = "linkSource")
    private String linkSource;

    @NotNull
    @Column(name = "timeout_minutes", nullable = false)
    private Integer timeoutMinutes;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "lab_tags", joinColumns = @JoinColumn(name = "lab_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();
}