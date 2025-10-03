package web_security_plaform.backend.payload.response;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
public class UserInfoResponse {
    @Setter
    private Integer id;

    @Setter
    private String username;

    @Setter
    private String email;

    private final List<String> roles;

    @Setter
    private String fullName;



    public UserInfoResponse(Integer id, String username, String email, List<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }

    public UserInfoResponse(Integer id, String username, String email, List<String> roles, String fullName) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.fullName = fullName;
    }

}