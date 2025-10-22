package web_security_plaform.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import web_security_plaform.backend.model.ENum.EGender;
import web_security_plaform.backend.model.ENum.EStatus;

import java.time.LocalDate;
import java.util.Set;

@Data
public class UserUpdateRequest {

    @Size(min = 3, max = 20)
    private String username;

    private Set<String> role;

    @Size(min = 6, max = 40)
    private String newPassword;

    @Size(min = 6, max = 40)
    private String currentPassword;

    @Size(max = 50)
    private String fullName;

    private EStatus eStatus;

    private EGender gender;

    private LocalDate dateOfBirth;

    @Size(max = 255)
    private String email;

    private Set<Integer> roleIds;
}