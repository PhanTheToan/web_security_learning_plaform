package web_security_plaform.backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.model.ENum.ERole;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.Topic;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.dto.*;
import web_security_plaform.backend.payload.request.LabRequest;
import web_security_plaform.backend.payload.request.TopicRequest;
import web_security_plaform.backend.service.LabService;
import web_security_plaform.backend.service.TopicService;
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

    @Autowired
    private TopicService topicService;


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
    @PutMapping("/labs/{id}")
    public ResponseEntity<?> updateLab(@Valid @RequestBody LabRequest labRequest, Principal principal, @PathVariable int id) {
        User author = userService.findByUsername(principal.getName());
        if (author == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Author not found.");
        }

        Lab newLabEntity = labService.updateLabs(labRequest, author, id);
        LabResponseDTO responseDTO = mapToLabResponseDTO(newLabEntity);

        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);

    }

    @GetMapping("/labs/{id}")
    public ResponseEntity<LabDetailDto> getLabById(@PathVariable int id) {
        LabDetailDto labDetail = labService.getLabDetailById(id);
        if (labDetail == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(labDetail);
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

    @PostMapping("/topics")
    public ResponseEntity<?> createTopics(@RequestBody TopicRequest topicRequest, Principal principal){
        User user = userService.findByUsername(principal.getName());
        if(user==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Author not found.");
        }
        Topic response = topicService.createTopic(topicRequest,user);
        return ResponseEntity.ok("Create topics success fully !");
    }

    @PutMapping("/topics/{id}")
    public ResponseEntity<?> updateTopics(@RequestBody TopicRequest topicRequest, @PathVariable long id,Principal principal){
        User user = userService.findByUsername(principal.getName());
        if(user==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Author not found.");
        }
        Topic response = topicService.updateTopics(topicRequest,id,user);
        return ResponseEntity.ok("Update topics success fully !");
    }

    @GetMapping("/topics")
    public ResponseEntity<Page<TopicsResponse>> getAllTopics(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(topicService.getAllTopDetails(page, size));
    }

    @GetMapping("/topics/{id}")
    public ResponseEntity<?> getInformation(@PathVariable long id){
        return ResponseEntity.ok(topicService.getTopicDetailById(id));
    }

}
