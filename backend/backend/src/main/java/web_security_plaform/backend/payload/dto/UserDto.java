package gxyt.backend.payload.dto;

import web_security_plaform.backend.model.ENum.EGender;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Data
@Builder
public class UserDto {
    private Integer id;

    private String email;

    private String password;

    private String fullName;

    private LocalDate dateOfBirth;

    private EGender gender;

    private String username;

    private Date updatedAt;

    private Set<String> role;
}