package web_security_plaform.backend.payload.dto;

import lombok.Data;
import web_security_plaform.backend.model.ENum.EStatus;

import java.util.Set;

@Data
public class LabInfoDetail {
    private Integer id;

    private String name;

    private EStatus eStatus;

    private Set<TagDTO> tags;
}
