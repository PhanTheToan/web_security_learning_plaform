package web_security_plaform.backend.payload.dto;

import lombok.Data;

@Data
public class CreateGroupReq {
    private String name;
    private String description;
}
