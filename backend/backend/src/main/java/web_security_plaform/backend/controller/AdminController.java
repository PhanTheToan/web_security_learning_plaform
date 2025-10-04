package web_security_plaform.backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.dto.AuthorDTO;
import web_security_plaform.backend.payload.dto.LabDetailDto;
import web_security_plaform.backend.payload.dto.LabResponseDTO;
import web_security_plaform.backend.payload.dto.TagDTO;
import web_security_plaform.backend.payload.request.LabRequest;
import web_security_plaform.backend.service.LabService;
import web_security_plaform.backend.service.UserService;

import java.security.Principal;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {
    @Autowired
    private LabService labService;
    @Autowired
    private UserService userService;


    @GetMapping("/labs")
    public ResponseEntity<Page<LabDetailDto>> getAllLabs(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(labService.getAllLabDetails(page, size));
    }

    @PostMapping("/labs")
    public ResponseEntity<?> createLab(@Valid @RequestBody LabRequest labRequest, Principal principal) {
        User author = userService.findByUsername(principal.getName());
        if (author == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Author not found.");
        }

        Lab newLabEntity = labService.createLab(labRequest, author);
        LabResponseDTO responseDTO = mapToLabResponseDTO(newLabEntity);

        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);

    }
    private LabResponseDTO mapToLabResponseDTO(Lab lab) {
        LabResponseDTO dto = new LabResponseDTO();
        dto.setId(lab.getId());
        dto.setName(lab.getName());
        dto.setDescription(lab.getDescription());
        dto.setHint(lab.getHint());
        dto.setDockerImage(lab.getDockerImage());
        dto.setDifficulty(lab.getDifficulty());
        dto.setTimeoutMinutes(lab.getTimeoutMinutes());
        dto.setStatus(lab.getStatus());
        dto.setCreatedAt(lab.getCreatedAt());

        AuthorDTO authorDTO = new AuthorDTO();
        authorDTO.setId(lab.getAuthor().getId());
        authorDTO.setFullName(lab.getAuthor().getFullName());
        dto.setAuthor(authorDTO);

        Set<TagDTO> tagDTOs = lab.getTags().stream().map(tag -> {
            TagDTO tagDTO = new TagDTO();
            tagDTO.setId(tag.getId());
            tagDTO.setName(tag.getName());
            return tagDTO;
        }).collect(Collectors.toSet());
        dto.setTags(tagDTOs);

        return dto;
    }
}
