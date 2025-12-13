package web_security_plaform.backend.payload.dto.email;

import lombok.Data;

@Data
public class UpdateGroupReq {
    private String name;
    private String description;
}
