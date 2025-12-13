package web_security_plaform.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import web_security_plaform.backend.model.ENum.EDifficulty;
import web_security_plaform.backend.model.ENum.EStatus;

import java.util.Set;

@Data
public class LabRequest {

    @NotBlank
    private String name;

    private String description;
    private String solution;
    private String hint;
    private String fixVulnerabilities;
    private String linkSource;

    @NotBlank
    private String dockerImage;

    @NotBlank
    private String flag;

    @NotNull
    private EDifficulty difficulty;

    @NotNull
    private Integer timeoutMinutes;

    @NotNull
    private EStatus status;

    private Set<Integer> tagIds;
}