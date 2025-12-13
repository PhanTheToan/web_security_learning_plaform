package web_security_plaform.backend.config;

import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Template;
import com.github.jknack.handlebars.helper.StringHelpers;
import com.github.jknack.handlebars.io.ClassPathTemplateLoader;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class HandlebarsRenderer {
    private final Handlebars handlebars;
    private final Map<String, Template> cache = new ConcurrentHashMap<>();

    public HandlebarsRenderer() {
        var loader = new ClassPathTemplateLoader("/templates/email", ".hbs");
        this.handlebars = new Handlebars(loader);

        StringHelpers.register(handlebars);
        this.handlebars.registerHelper("partial", (ctx, opts) -> ctx);
        this.handlebars.with(new ClassPathTemplateLoader("/templates/email/partials", ".hbs"));
    }

    public String render(String templateName, Map<String, Object> model) throws IOException {
        var tpl = cache.computeIfAbsent(templateName, name -> {
            try {
                return handlebars.compile(name);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
        return tpl.apply(model);
    }
}
