package web_security_plaform.backend.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.model.S3Object;
import web_security_plaform.backend.service.R2Service;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/files")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class FileUploadController {

    private final R2Service r2;

    public FileUploadController(R2Service r2) { this.r2 = r2; }

    @PostMapping(value="/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "prefix", required = false, defaultValue = "uploads") String prefix
    ) throws IOException {

        // Tạo key: uploads/2025/10/18/<uuid>-<tên gốc>
        String original = Optional.ofNullable(file.getOriginalFilename()).orElse("file");
        String safeName = original.replaceAll("[^A-Za-z0-9._-]", "_");
        String key = String.format("%s/%s/%s/%s-%s",
                prefix,
                java.time.LocalDate.now().getYear(),
                String.format("%02d", java.time.LocalDate.now().getMonthValue()),
                java.util.UUID.randomUUID(),
                safeName
        );

        String contentType = Optional.ofNullable(file.getContentType())
                .orElse("application/octet-stream");

        r2.upload(key, file.getBytes(), contentType);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("key", key);
        body.put("contentType", contentType);
        body.put("size", file.getSize());
        body.put("publicUrl", r2.publicUrl(key));
        return ResponseEntity.ok(body);
    }
}