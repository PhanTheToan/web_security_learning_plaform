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
import web_security_plaform.backend.model.ENum.EStatus;
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
import web_security_plaform.backend.service.LeaderboardService;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "https://lockbyte.com/", maxAge = 3600, allowCredentials = "true")
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

    @Autowired
    private LeaderboardService leaderboardService;

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
        if(userDetails.getStatus() != EStatus.Active){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User account is not active.");
        }
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
                .fullName(signUpRequest.getFullName())
                .dateOfBirth(signUpRequest.getDateOfBirth())
                .gender(signUpRequest.getGender())
                .email(signUpRequest.getEmail())
                .status(EStatus.Active)
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
            String rank = leaderboardService.getUserRankString(user.getId());
            return ResponseEntity.ok(new UserInfoResponse(user.getId(), username, user.getEmail(), roles, user.getFullName(), rank));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed!");
        }
    }

    @GetMapping("/exists/{username}")
    public boolean checkUsernameExists(@PathVariable String username) {
        return userRepository.existsByUsername(username);
    }

}
