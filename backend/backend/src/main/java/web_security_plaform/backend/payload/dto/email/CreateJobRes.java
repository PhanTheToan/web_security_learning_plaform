package web_security_plaform.backend.payload.dto.email;

import lombok.Data;

@Data
public class CreateJobRes {
    private String jobId;
    private String status; // QUEUED/RUNNING...
}
