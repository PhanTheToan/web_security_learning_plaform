package web_security_plaform.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import web_security_plaform.backend.model.R2Properties;

import java.io.InputStream;
import java.net.URLConnection;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class R2Service {

    private final S3Client s3;
    private final R2Properties props;
    private final RestTemplate rest = new RestTemplate();

    public String uploadStreaming(String key, InputStream in, long size, String contentType) {
        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(props.bucket())
                .key(key)
                .contentType(contentType)
                .build();
        s3.putObject(req, RequestBody.fromInputStream(in, size));
        return publicUrl(key);
    }

    public String uploadBytes(String key, byte[] bytes, String contentType) {
        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(props.bucket())
                .key(key)
                .contentType(contentType)
                .build();
        s3.putObject(req, RequestBody.fromBytes(bytes));
        return publicUrl(key);
    }

    public String publicUrl(String key) {
        return props.publicUrl() + "/" + key;
    }

    public byte[] downloadPublic(String publicUrl) {
        ResponseEntity<byte[]> res = rest.exchange(publicUrl, HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), byte[].class);
        if (!res.getStatusCode().is2xxSuccessful() || res.getBody() == null) {
            throw new RuntimeException("Cannot download: " + publicUrl);
        }
        return res.getBody();
    }

    public static String guessContentType(String filename) {
        String type = URLConnection.guessContentTypeFromName(filename);
        return Objects.requireNonNullElse(type, "application/octet-stream");
    }
}
