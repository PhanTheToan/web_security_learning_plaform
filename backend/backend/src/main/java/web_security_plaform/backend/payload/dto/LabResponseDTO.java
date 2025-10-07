package web_security_plaform.backend.payload.dto;

import lombok.Data;
import web_security_plaform.backend.model.ENum.EDifficulty;
import web_security_plaform.backend.model.ENum.EStatus;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class LabResponseDTO {
    private Integer id;
    private String name;
    private String description;
    private String hint;
    private String dockerImage;
    private EDifficulty difficulty;
    private Integer timeoutMinutes;
    private EStatus status;
    private LocalDateTime createdAt;

    private AuthorDTO author;

    private Set<TagDTO> tags;
}