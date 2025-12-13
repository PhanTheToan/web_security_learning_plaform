package web_security_plaform.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import web_security_plaform.backend.model.ENum.EGender;
import web_security_plaform.backend.model.ENum.ERole;
import web_security_plaform.backend.model.ENum.EStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    private Set<String> role;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    @Size(max = 50)
    private String fullName;

    private EStatus eStatus;

    @NotNull(message = "Not null pls!!!")
    private EGender gender;

    @NotNull(message = "Date of birth cannot be null")
    private LocalDate dateOfBirth;

    @NotBlank
    @Size(max = 255)
    private String email;

    private Set<Integer> roleIds;
}