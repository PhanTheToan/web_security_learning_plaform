package web_security_plaform.backend.service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.jsoup.Jsoup;
import org.jsoup.helper.W3CDom;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public byte[] htmlToPdfBytes(String html) {
        if (html == null || html.isBlank()) {
            throw new RuntimeException("Empty HTML for PDF");
        }

        html = html.replace("\uFEFF", "").trim();

        try (var out = new ByteArrayOutputStream()) {
            // Parse HTML bằng Jsoup
            Document jdoc = Jsoup.parse(html);
            jdoc.outputSettings()
                    .syntax(Document.OutputSettings.Syntax.xml)     // xuất kiểu XML/XHTML
                    .escapeMode(Entities.EscapeMode.xhtml)
                    .charset(java.nio.charset.StandardCharsets.UTF_8);

            // Convert Jsoup Document -> W3C Document
            W3CDom w3cDom = new W3CDom();
            org.w3c.dom.Document w3cDoc = w3cDom.fromJsoup(jdoc);

            // Render PDF
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withW3cDocument(w3cDoc, null);
            builder.toStream(out);
            builder.run();

            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to render PDF", e);
        }
    }
}
