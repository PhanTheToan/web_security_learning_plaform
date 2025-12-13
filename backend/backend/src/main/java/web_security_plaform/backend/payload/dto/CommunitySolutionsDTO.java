package web_security_plaform.backend.payload.dto;

import lombok.Data;
import web_security_plaform.backend.model.ENum.ESolutionStatus;
import web_security_plaform.backend.model.ENum.EStatus;

@Data
public class CommunitySolutionsDTO {
    private int id;
    private String fullName;
    private ESolutionStatus status;
    private String writeup;
    private String youtubeUrl;
    private int labId;
    private int userId;
}
