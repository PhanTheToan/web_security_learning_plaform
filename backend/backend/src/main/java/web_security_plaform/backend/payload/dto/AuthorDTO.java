package web_security_plaform.backend.payload.dto;

import lombok.Data;

@Data
public class AuthorDTO {
    private Integer id;
    private String username;
    private String fullName;
}
