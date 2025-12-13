package web_security_plaform.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.dto.UserInfoUserResponse;
import web_security_plaform.backend.payload.request.UserUpdateRequest;
import web_security_plaform.backend.service.LeaderboardService;
import web_security_plaform.backend.service.UserService;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public UserInfoUserResponse getUserProfile(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        return userService.getUserv2InfoById(user.getId());
    }
    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(Principal principal, @RequestBody UserUpdateRequest userUpdateRequest) {
        User user = userService.findByUsername(principal.getName());
        return userService.updateUserByUser(userUpdateRequest, user.getId());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getUserDashboard(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        return userService.getUserDashboard(user);
    }
    @GetMapping("/labs")
    public ResponseEntity<?> getUserLabs(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        return userService.getUserLabs(user);
    }

}
