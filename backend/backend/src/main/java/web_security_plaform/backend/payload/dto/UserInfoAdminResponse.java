package web_security_plaform.backend.payload.dto;

import lombok.Data;
import web_security_plaform.backend.model.ENum.EStatus;

import java.util.Set;

@Data
public class UserInfoAdminResponse {
    private Integer id;
    private String username;
    private String fullName;
    private String email;
    private EStatus status;
    private Set<String> roles;
}