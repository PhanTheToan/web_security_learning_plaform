package web_security_plaform.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;
import web_security_plaform.backend.service.R2Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final R2Service r2;

    public FileUploadController(R2Service r2) {
        this.r2 = r2;
    }

    private static final Set<String> ALLOWED_MIME = Set.of(
            "image/jpeg", "image/jpg", "image/png",
            "application/pdf",
            "application/zip", "application/x-zip-compressed"
    );

    // Whitelist extension
    private static final Set<String> ALLOWED_EXT = Set.of("jpg", "jpeg", "png", "pdf", "zip");

    private static final long MAX_SIZE = 100L * 1024L * 1024L;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "prefix", required = false, defaultValue = "uploads") String prefix
    ) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu file hoặc file rỗng");
        }

        if (file.getSize() > MAX_SIZE) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "File vượt quá giới hạn 20MB");
        }

        String contentType = Optional.ofNullable(file.getContentType()).orElse("");
        String original = Optional.ofNullable(file.getOriginalFilename()).orElse("file");
        String safeName = original.replaceAll("[^A-Za-z0-9._-]", "_");

        String ext = "";
        int dot = safeName.lastIndexOf('.');
        if (dot > 0 && dot < safeName.length() - 1) {
            ext = safeName.substring(dot + 1).toLowerCase(Locale.ROOT);
        }
        if (!ALLOWED_EXT.contains(ext)) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "Định dạng không được phép!");
        }

        if (!ALLOWED_MIME.contains(contentType)) {
            contentType = switch (ext) {
                case "jpg", "jpeg" -> "image/jpeg";
                case "png" -> "image/png";
                case "pdf" -> "application/pdf";
                case "zip" -> "application/zip";
                default -> "application/octet-stream";
            };
        }
        if (!ALLOWED_MIME.contains(contentType)) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "MIME không hợp lệ: " + contentType);
        }

        LocalDate now = LocalDate.now();
        String key = String.format("%s/%d/%02d/%s-%s",
                (prefix == null || prefix.isBlank()) ? "uploads" : prefix,
                now.getYear(),
                now.getMonthValue(),
                UUID.randomUUID(),
                safeName
        );

        String etag = r2.uploadStreaming(key, file.getInputStream(), file.getSize(), contentType);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("key", key);
        body.put("contentType", contentType);
        body.put("size", file.getSize());
        body.put("etag", etag);
        body.put("publicUrl", r2.publicUrl(key)); // link r2.dev nếu cấu hình
        return ResponseEntity.ok(body);
    }
}
