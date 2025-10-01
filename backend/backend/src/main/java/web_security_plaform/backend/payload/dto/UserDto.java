package gxyt.backend.payload.dto;

import web_security_plaform.backend.model.ENum.EGender;
import lombok.Builder;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
@Builder
public class UserDto {
    private Integer id;

    private String email;

    private String password;

    private String fullName;

    private String phoneNumber;

    private String address;

    private Date dateOfBirth;

    private EGender gender;

    private String username;

    private Date createdAt;

    private String notes;

    private String imageUrl;

    private Date updatedAt;

    private Set<String> role;
}