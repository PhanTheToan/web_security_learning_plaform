package web_security_plaform.backend.payload.response;

import lombok.Data;

import java.time.Instant;

@Data
public class LabSessionDTO {
//"message", "Lab activated successfully",
//        "containerId", res.containerId(),
//        "url", res.url(),
//        "port", res.port(),
//        "expiresAt", res.expiresAt().toString()

        private String message;
        private Integer id;
        private String containerId;
        private String url;
        private Integer port;
        private String expiresAt;


    public LabSessionDTO(Integer id,String message, String containerId, String url, Integer port, Instant expiresAt) {
        this.id = id;
        this.message = message;
        this.containerId = containerId;
        this.url = url;
        this.port = port;
        this.expiresAt = expiresAt.toString();
    }
}
