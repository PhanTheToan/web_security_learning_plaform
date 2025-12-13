package web_security_plaform.backend.payload.dto;

import lombok.Data;
import web_security_plaform.backend.model.ENum.EDifficulty;
import web_security_plaform.backend.model.ENum.EStatus;
import web_security_plaform.backend.service.LabService;

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
    private String description;
    private String hint;
    private String solution;
    private String fixVulnerabilities;
    private Integer timeoutMinutes;
    private String linkSource;
    private List<CommunitySolutionsDTO> communitySolutionDTOS;
    private List<LabService.RecentSolvedLab> recentSolvedLabs;
    private String flag;
}
