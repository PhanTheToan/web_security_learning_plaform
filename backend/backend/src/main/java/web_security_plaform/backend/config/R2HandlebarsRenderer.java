package web_security_plaform.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Template;
import com.github.jknack.handlebars.helper.StringHelpers;
import com.github.jknack.handlebars.io.TemplateLoader;
import com.github.jknack.handlebars.io.URLTemplateLoader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class R2HandlebarsRenderer {

    @Value("${email.templates.baseUrl}")
    private String templatesBaseUrl;

    @Value("${email.theme.jsonUrl}")
    private String themeJsonUrl;

    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper om = new ObjectMapper();

    private final Handlebars handlebars;
    private final Map<String, Template> cache = new ConcurrentHashMap<>();
    private static final String SUFFIX = ".hbs";

    public R2HandlebarsRenderer(@Value("${email.templates.baseUrl}") String tBase) {
        TemplateLoader rootLoader = new HttpTemplateLoader(tBase, SUFFIX);
        this.handlebars = new Handlebars(rootLoader);     // << chỉ 1 loader
        StringHelpers.register(this.handlebars);
    }

    public String renderFromR2(String templateName, Map<String, Object> model, String[] unused) throws IOException {
        // theme.json
        try {
            ResponseEntity<String> resp = rest.getForEntity(themeJsonUrl, String.class);
            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                Map<String, Object> theme = om.readValue(resp.getBody(), Map.class);
                model.put("theme", theme);
            }
        } catch (Exception ignored) {}

        String name = stripSuffix(templateName, SUFFIX);
        Template tpl = cache.computeIfAbsent(name, n -> {
            try {
                return handlebars.compile(n);
            } catch (IOException e) {
                throw new RuntimeException("Cannot compile template: " + n, e);
            }
        });
        return tpl.apply(model);
    }

    private static String stripSuffix(String name, String suffix) {
        return (name != null && name.endsWith(suffix)) ? name.substring(0, name.length() - suffix.length()) : name;
    }

    static class HttpTemplateLoader extends URLTemplateLoader {
        private final String baseUrl;
        private final String suffix;
        HttpTemplateLoader(String baseUrl, String suffix) {
            this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
            this.suffix  = suffix != null ? suffix : "";
        }
        @Override public String getPrefix() { return ""; }
        @Override public String getSuffix() { return suffix; }
        @Override protected URL getResource(String location) throws MalformedURLException {
            String normalized = location.startsWith("/") ? location.substring(1) : location;
            String path = normalized.endsWith(suffix) ? normalized : normalized + suffix;
            return new URL(baseUrl + "/" + path);
        }
    }
}

