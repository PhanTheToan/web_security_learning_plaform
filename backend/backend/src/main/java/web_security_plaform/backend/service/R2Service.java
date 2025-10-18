package web_security_plaform.backend.service;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;

import java.io.InputStream;
import java.net.URI;
import java.time.Duration;
import java.util.List;

import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import web_security_plaform.backend.model.R2Properties;

@Service
public class R2Service {

    private final S3Client s3;
    private final S3Presigner presigner;
    private final R2Properties props;

    public R2Service(S3Client s3, S3Presigner presigner, R2Properties props) {
        this.s3 = s3;
        this.presigner = presigner;
        this.props = props;
    }

    // === PRESIGN PUT (UPLOAD) — ký kèm Content-Type để client gửi đúng y hệt ===
    public String presignPut(String key, int seconds, String contentType) {
        PutObjectRequest putReq = PutObjectRequest.builder()
                .bucket(props.bucket())
                .key(key)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignReq = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(seconds))
                .putObjectRequest(putReq)
                .build();

        PresignedPutObjectRequest presigned = presigner.presignPutObject(presignReq);
        return presigned.url().toString();
    }

    // === PRESIGN GET (DOWNLOAD) ===
    public String presignGet(String key, int seconds) {
        GetObjectRequest getReq = GetObjectRequest.builder()
                .bucket(props.bucket())
                .key(key)
                .build();

        GetObjectPresignRequest presignReq = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(seconds))
                .getObjectRequest(getReq)
                .build();

        PresignedGetObjectRequest presigned = presigner.presignGetObject(presignReq);
        return presigned.url().toString();
    }

    // === Public URL (qua r2.dev) nếu bạn phục vụ công khai ===
    public String publicUrl(String key) {
        String base = props.publicUrl();
        if (base == null || base.isBlank()) return null;
        // tránh double slash
        if (base.endsWith("/")) base = base.substring(0, base.length() - 1);
        if (key.startsWith("/")) key = key.substring(1);
        return base + "/" + key;
    }

    public void upload(String key, byte[] data, String contentType) {
        s3.putObject(PutObjectRequest.builder()
                        .bucket(props.bucket())
                        .key(key)
                        .contentType(contentType)
                        .build(),
                RequestBody.fromBytes(data));
    }
    public String uploadStreaming(String key, InputStream in, long size, String contentType) {
        PutObjectResponse res = s3.putObject(
                PutObjectRequest.builder()
                        .bucket(props.bucket())
                        .key(key)
                        .contentType(contentType)
                        .build(),
                RequestBody.fromInputStream(in, size)
        );
        return res.eTag();
    }

    public byte[] download(String key) {
        ResponseBytes<GetObjectResponse> bytes = s3.getObjectAsBytes(GetObjectRequest.builder()
                .bucket(props.bucket())
                .key(key)
                .build());
        return bytes.asByteArray();
    }

    public boolean exists(String key) {
        try {
            s3.headObject(HeadObjectRequest.builder()
                    .bucket(props.bucket())
                    .key(key)
                    .build());
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        } catch (S3Exception e) {
            if (e.statusCode() == 404) return false;
            throw e;
        }
    }

    public void delete(String key) {
        s3.deleteObject(DeleteObjectRequest.builder()
                .bucket(props.bucket())
                .key(key)
                .build());
    }

    public List<S3Object> list(String prefix, Integer maxKeys) {
        ListObjectsV2Response res = s3.listObjectsV2(ListObjectsV2Request.builder()
                .bucket(props.bucket())
                .prefix(prefix == null ? "" : prefix)
                .maxKeys(maxKeys == null ? 1000 : maxKeys)
                .build());
        return res.contents();
    }
}
