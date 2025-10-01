package web_security_plaform.backend.controller;



import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.model.ENum.ERole;
import web_security_plaform.backend.model.Role;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.request.LoginRequest;
import web_security_plaform.backend.payload.request.SignupRequest;
import web_security_plaform.backend.payload.response.MessageResponse;
import web_security_plaform.backend.payload.response.UserInfoResponse;
import web_security_plaform.backend.repository.RoleRepository;
import web_security_plaform.backend.repository.UserRepository;
import web_security_plaform.backend.security.jwt.JwtUtils;
import web_security_plaform.backend.security.services.UserDetailsImpl;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "https://websecurity.com/", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final String PASSWORD_UPDATED_SUCCESSFULLY = "Password updated successfully!";

    private static final String ERROR_INVALID_OR_EXPIRED_RESET_PASSWORD_LINK = "Error: Invalid or expired reset password link!";

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }


    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(new UserInfoResponse(userDetails.getId(),
                        userDetails.getUsername(),
                        userDetails.getEmail(),
                        roles));
    }


    @PostMapping("/signup")
    @Transactional
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        User user = User.builder()
                .username(signUpRequest.getUsername())
                .password(encoder.encode(signUpRequest.getPassword()))
                .address(signUpRequest.getAddress())
                .fullName(signUpRequest.getFullName())
                .build();

        // Assign USER role by default
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new MessageResponse("You've been signed out!"));
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuthentication(HttpServletRequest request) {
        String token = jwtUtils.getJwtFromCookies(request);
        if (token != null && jwtUtils.validateJwtToken(token)) {
            String username = jwtUtils.getUserNameFromJwtToken(token);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Error: User is not found."));
            List<String> roles = user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new UserInfoResponse(user.getId(), username, user.getEmail(), roles, user.getFullName(), user.getAddress()));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed!");
        }
    }

    @GetMapping("/exists/{username}")
    public boolean checkUsernameExists(@PathVariable String username) {
        return userRepository.existsByUsername(username);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Generate unique token
            String token = UUID.randomUUID().toString();

            // Save the token and the expiry time (5 minutes from now) in the database
            user.setResetPasswordToken(token);
            user.setResetPasswordExpires(LocalDateTime.now().plusMinutes(5));
            userRepository.save(user);

            // Generate reset link
            String resetLink = "https://meyojapanorder.com/new-password.html?token=" + token;

            // Return reset link as part of the response
            return ResponseEntity.ok(resetLink);
        } else {
            return ResponseEntity.badRequest().body("Error: User not found!");
        }
    }

    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        Optional<User> optionalUser = Optional.ofNullable(userRepository.findByResetPasswordToken(token));

        if (optionalUser.isPresent() && isTokenValid(optionalUser.get())) {
            updateUserPassword(optionalUser.get(), newPassword);
            return ResponseEntity.ok(PASSWORD_UPDATED_SUCCESSFULLY);
        } else {
            return ResponseEntity.badRequest().body(ERROR_INVALID_OR_EXPIRED_RESET_PASSWORD_LINK);
        }
    }

    private boolean isTokenValid(User user) {
        return LocalDateTime.now().isBefore(user.getResetPasswordExpires());
    }

    private void updateUserPassword(User user, String newPassword) {
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
    }

    @PostMapping("/reset-default-password")
    public ResponseEntity<?> resetDefaultPassword(@RequestBody Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Reset password to default
            user.setPassword(encoder.encode("123456"));
            userRepository.save(user);

            return ResponseEntity.ok("Mật khẩu đã thay đổi về mặc định");
        } else {
            return ResponseEntity.badRequest().body("Error: User not found!");
        }
    }
}
