package web_security_plaform.backend.controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.model.ENum.ERole;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.Role;
import web_security_plaform.backend.model.Tag;
import web_security_plaform.backend.model.Topic;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.dto.*;
import web_security_plaform.backend.payload.request.LabRequest;
import web_security_plaform.backend.payload.request.SignupRequest;
import web_security_plaform.backend.payload.request.TopicRequest;
import web_security_plaform.backend.payload.request.UserUpdateRequest;
import web_security_plaform.backend.payload.response.MessageResponse;
import web_security_plaform.backend.repository.LabRepository;
import web_security_plaform.backend.service.*;

import java.net.URI;
import java.security.Principal;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
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

    @Autowired
    private LabRunnerService labRunnerService;

    @Autowired
    private TagService tagService;

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/labs")
    public ResponseEntity<Page<LabDetailDto>> getAllLabs(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(labService.getAllLabDetails(page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<?> findObject(
            @RequestParam String type,
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "false") boolean like) {
        String kind = type.trim().toLowerCase(Locale.ROOT);
        if (!kind.equals("lab") && !kind.equals("tag")) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "type chỉ được phép là 'lab' hoặc 'tag'"));
        }

        if (id == null && !StringUtils.hasText(name)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Cần truyền 'id' hoặc 'name'"));
        }

        if (kind.equals("lab")) {
            if (id != null) {
                return ResponseEntity.ok(Map.of(
                        "type", "lab",
                        "items", labService.findLabInfoById(id).map(List::of).orElseGet(List::of)));
            } else {
                return ResponseEntity.ok(Map.of(
                        "type", "lab",
                        "items", labService.findLabInfosByName(name, like)));
            }
        } else { // tag
            if (id != null) {
                return ResponseEntity.ok(Map.of(
                        "type", "tag",
                        "items", tagService.findTagDTOById(id).map(List::of).orElseGet(List::of)));
            } else {
                return ResponseEntity.ok(Map.of(
                        "type", "tag",
                        "items", tagService.findTagDTOsByName(name, like)));
            }
        }
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
    public ResponseEntity<?> updateLab(@Valid @RequestBody LabRequest labRequest, Principal principal,
            @PathVariable int id) {
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
        dto.setFlag(lab.getFlag());

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
    public ResponseEntity<?> createTopics(@RequestBody TopicRequest topicRequest, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Author not found.");
        }
        Topic response = topicService.createTopic(topicRequest, user);
        return ResponseEntity.ok("Create topics success fully !");
    }

    @PutMapping("/topics/{id}")
    public ResponseEntity<?> updateTopics(@RequestBody TopicRequest topicRequest, @PathVariable long id,
            Principal principal) {
        User user = userService.findByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Author not found.");
        }
        Topic response = topicService.updateTopics(topicRequest, id, user);
        return ResponseEntity.ok("Update topics success fully !");
    }

    @GetMapping("/topics")
    public ResponseEntity<Page<TopicsResponse>> getAllTopics(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(topicService.getAllTopDetails(page, size));
    }

    @GetMapping("/topics/{id}")
    public ResponseEntity<?> getInformation(@PathVariable long id) {
        return ResponseEntity.ok(topicService.getTopicDetailById(id));
    }

    @PostMapping("/tags")
    public ResponseEntity<?> createTag(@RequestBody Tag tag) {
        Tag saved = tagService.createTag(tag);

        return ResponseEntity
                .created(URI.create("/tags/" + saved.getId()))
                .body(saved);
    }

    @DeleteMapping("/tags/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable int id,
            @RequestParam(defaultValue = "false") boolean force) {
        tagService.deleteTag(id, force);
        return ResponseEntity.noContent().build(); // 204
    }

    @Transactional
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody SignupRequest signUpRequest, @RequestParam int roleId) {
        return ResponseEntity.ok( userService.createUserByAdmin(signUpRequest, roleId) );
    }
    @Transactional
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUserByAdmin(@Valid @RequestBody UserUpdateRequest userUpdateRequest, @PathVariable int id) {
        return ResponseEntity.ok( userService.updateUserByAdmin(userUpdateRequest,id) );
    }
    @Transactional
    @PutMapping("/users-status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable int id) {
        return ResponseEntity.ok( userService.updateStatusUserByAdmin(id) );
    }
    @GetMapping("/users")
    public ResponseEntity<Page<UserInfoAdminResponse>> getAllUsers(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userService.getAllUserInfos(page, size));
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserInfo(@PathVariable int id) {
        return ResponseEntity.ok(userService.getUserInfoById(id));
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getAdminStatistics() {
        return ResponseEntity.ok(labRunnerService.getAdminStatistics());
    }


    @GetMapping("/ranking")
    public ResponseEntity<List<?>> getFullLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getFullLeaderboard());
    }


}
