package web_security_plaform.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import web_security_plaform.backend.model.ENum.ERole;
import web_security_plaform.backend.model.Role;
import web_security_plaform.backend.model.Tag;
import web_security_plaform.backend.repository.RoleRepository;
import web_security_plaform.backend.repository.TagRepository;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final TagRepository tagRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            Role userRole = Role.builder().name(ERole.ROLE_USER).build();
            Role adminRole = Role.builder().name(ERole.ROLE_ADMIN).build();
            roleRepository.saveAll(Arrays.asList(userRole, adminRole));
            System.out.println("Initialized ROLES data.");
        }

        // --- Khởi tạo Tags ---
        // Chỉ thêm dữ liệu nếu bảng tags đang trống
        if (tagRepository.count() == 0) {
            List<Tag> tags = Arrays.asList(
                    Tag.builder().name("SQL Injection").build(),
                    Tag.builder().name("XSS").build(),
                    Tag.builder().name("IDOR").build(),
                    Tag.builder().name("CSRF").build(),
                    Tag.builder().name("Java").build(),
                    Tag.builder().name("NodeJS").build(),
                    Tag.builder().name("PHP").build()
            );
            tagRepository.saveAll(tags);
            System.out.println("Initialized TAGS data.");
        }
    }
}