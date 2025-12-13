package web_security_plaform.backend.payload.dto.email;

import lombok.Data;

import java.util.List;

@Data
public class BulkMembersReq {
    private List<Long> userIds;
}
