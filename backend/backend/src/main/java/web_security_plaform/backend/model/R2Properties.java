package web_security_plaform.backend.model;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "cloudflare.r2")
public record R2Properties(
        String endpoint,
        String accessKey,
        String secretKey,
        String bucket,
        String publicUrl
) {}