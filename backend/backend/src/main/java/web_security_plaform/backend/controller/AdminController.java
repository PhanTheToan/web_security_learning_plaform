package web_security_plaform.backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.request.LabRequest;
import web_security_plaform.backend.service.LabService;
import web_security_plaform.backend.service.UserService;

import java.security.Principal;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {
    @Autowired
    private LabService labService;
    @Autowired
    private UserService userService;


    @GetMapping("/labs")
    public ResponseEntity<?> getAllLabs(@RequestParam int page, @RequestParam int size) {
        // Logic to fetch labs with pagination
        return ResponseEntity.ok("List of labs for page " + page + " with size " + size);
    }

    @PostMapping("/labs")
    public ResponseEntity<?> createLab(@Valid @RequestBody LabRequest labRequest, Principal principal) {
        User author = userService.findByUsername(principal.getName());
        if (author == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Author not found.");
        }

        Lab newLab = labService.createLab(labRequest, author);

        return new ResponseEntity<>(newLab, HttpStatus.CREATED);
    }
}
