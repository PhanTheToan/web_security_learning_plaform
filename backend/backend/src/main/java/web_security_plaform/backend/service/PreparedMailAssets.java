package web_security_plaform.backend.service;

import lombok.Builder;

import java.util.Map;

@Builder
public record PreparedMailAssets(
        byte[] logoBytes,
        Map<String, byte[]> attachmentBytesByFilename
) {}
