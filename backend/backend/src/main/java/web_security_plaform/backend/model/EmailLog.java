package web_security_plaform.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import jakarta.persistence.*;
import lombok.*;
import lombok.NoArgsConstructor;
import web_security_plaform.backend.model.ENum.EStatus;
import web_security_plaform.backend.model.ENum.EmailStatus;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "email_logs")
public class EmailLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String toEmail;
    private String cc;
    private String bcc;
    private String subject;
    private String templateName;

    @Enumerated(EnumType.STRING)
    private EmailStatus status;

    @Column(length = 2000)
    private String errorMessage;

    private LocalDateTime sentAt;

    @Column(length = 1000)
    private String metadataJson;
}
