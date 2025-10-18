package web_security_plaform.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.relational.core.sql.In;
import web_security_plaform.backend.model.ENum.EStatus;

import java.util.Set;

@Data
public class TopicRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotNull
    private EStatus status;

    private Set<Integer> tagId;

    private Set<Integer> labsId;
}
