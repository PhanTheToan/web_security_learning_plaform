package web_security_plaform.backend.payload.dto.email;

import lombok.Data;

@Data
public class BulkMembersRes {
    private int added;
    private int skipped;
    private int removed;
}
