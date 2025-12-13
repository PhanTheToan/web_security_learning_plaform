package web_security_plaform.backend.payload.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import web_security_plaform.backend.model.ENum.EStatus;

import java.time.LocalDate;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
public class UserInfoUserResponse extends UserInfoAdminResponse{
    private String password;
    private LocalDate dateOfBirth;
}
