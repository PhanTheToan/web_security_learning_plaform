package web_security_plaform.backend.payload.dto;

import lombok.Data;
import web_security_plaform.backend.model.ENum.EDifficulty;
import web_security_plaform.backend.model.ENum.EStatus;
import web_security_plaform.backend.model.User;

import java.util.List;
import java.util.Set;

@Data
public class LabDetailDto {
    private int id;
    private String name;
    private EDifficulty difficulty;
    private String dockerImage;
    private EStatus status;
    private String authorName;
    private Set<TagDTO> tags;
}
