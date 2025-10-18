package web_security_plaform.backend.payload.dto;

import lombok.Data;
import web_security_plaform.backend.model.ENum.EStatus;

import java.util.Set;

@Data
public class TopicsResponse {
    private int id;
    private String title;
    private EStatus status;
    private String authorName;
    private Set<TagDTO> tags;
}
