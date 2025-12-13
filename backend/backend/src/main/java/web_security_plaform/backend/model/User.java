package web_security_plaform.backend.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import web_security_plaform.backend.model.ENum.EGender;
import web_security_plaform.backend.model.ENum.EStatus;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Size(max = 255)
    @Email
    private String email;

    @NotBlank
    @Size(max = 255)
    private String username;

    @NotBlank
    @Size(max = 255)
    private String fullName;

    @NotNull
    private EStatus status;

    @NotNull(message = "Not null pls!!!")
    private EGender gender;

    @NotNull(message = "Date of birth cannot be null")
    private LocalDate dateOfBirth;

    @NotBlank
    @Size(max = 255)
    private String password;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

//    @Column(name = "reset_password_token")
//    private String resetPasswordToken;
//
//    @Column(name = "reset_password_expires")
//    private LocalDateTime resetPasswordExpires;
}
