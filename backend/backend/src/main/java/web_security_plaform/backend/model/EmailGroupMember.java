package web_security_plaform.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "email_group_member",
        uniqueConstraints = @UniqueConstraint(columnNames = {"group_id", "user_id"}),
        indexes = {
                @Index(name = "idx_egm_group", columnList = "group_id"),
                @Index(name = "idx_egm_user", columnList = "user_id")
        }
)
public class EmailGroupMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="group_id", nullable = false)
    private Long groupId;

    @Column(name="user_id", nullable = false)
    private Integer userId;
}
