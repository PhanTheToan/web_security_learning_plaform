package web_security_plaform.backend.payload.dto;

import lombok.Data;
import web_security_plaform.backend.model.ENum.EStatus;
import web_security_plaform.backend.model.Lab;

import java.util.Set;

@Data
public class TopicDetailDTO {
    private Integer id;

    private String title;

    private String content;
    private EStatus status;
    private Set<LabInfoDetail> labs;
    private Set<TagDTO> tags;
}
