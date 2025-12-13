package web_security_plaform.backend.payload.dto.email;

import lombok.Data;

@Data
public class SyncGroupReq {
    public enum Mode { REPLACE, MERGE }
    private Mode mode = Mode.MERGE;

    // Filter đơn giản: theo status (dạng int trong DB của bạn)
    private Integer statusEquals;
}
