package web_security_plaform.backend.service;
import org.apache.tomcat.util.buf.UDecoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import web_security_plaform.backend.model.ENum.ERole;
import web_security_plaform.backend.model.ENum.EStatus;
import web_security_plaform.backend.model.Role;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.dto.UserInfoAdminResponse;
import web_security_plaform.backend.payload.dto.UserInfoUserResponse;
import web_security_plaform.backend.payload.request.SignupRequest;
import web_security_plaform.backend.payload.request.UserUpdateRequest;
import web_security_plaform.backend.payload.response.MessageResponse;
import web_security_plaform.backend.payload.response.UserInfoResponse;
import web_security_plaform.backend.repository.RoleRepository;
import web_security_plaform.backend.repository.UserRepository;
import web_security_plaform.backend.security.jwt.JwtUtils;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;


    public User findByUsername(String name) {
        return userRepository.findByUsername(name).orElse(null);
    }

    public ResponseEntity<?> createUserByAdmin(SignupRequest signUpRequest, long roleId) {
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

        Role userRole = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    public ResponseEntity<?> updateUserByAdmin(UserUpdateRequest userUpdateRequest, long id) {
        User existedUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));


        existedUser.setUsername(existedUser.getUsername());
        existedUser.setPassword(existedUser.getPassword());
        existedUser.setFullName(userUpdateRequest.getFullName() != null ? userUpdateRequest.getFullName() : existedUser.getFullName());
        existedUser.setStatus(userUpdateRequest.getEStatus() != null ? userUpdateRequest.getEStatus() : existedUser.getStatus());
        existedUser.setDateOfBirth(userUpdateRequest.getDateOfBirth() != null ? userUpdateRequest.getDateOfBirth() : existedUser.getDateOfBirth());
        existedUser.setEmail(userUpdateRequest.getEmail() != null ? userUpdateRequest.getEmail() : existedUser.getEmail());
        existedUser.setGender(userUpdateRequest.getGender() != null ? userUpdateRequest.getGender() : existedUser.getGender());

        Role userRole = roleRepository.findById((long) userUpdateRequest.getRoleIds().stream().findFirst().orElseThrow(() -> new RuntimeException("Error: Role is not found.")))
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        existedUser.setRoles(roles);
        userRepository.save(existedUser);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @Transactional
    public ResponseEntity<?> updateUserByUser(UserUpdateRequest userUpdateRequest, long id) {

        User existedUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));

        if (userUpdateRequest.getCurrentPassword() != null && !userUpdateRequest.getCurrentPassword().isEmpty() &&
                userUpdateRequest.getNewPassword() != null && !userUpdateRequest.getNewPassword().isEmpty()) {

            String existingPassword = existedUser.getPassword();
            String currentPassword = userUpdateRequest.getCurrentPassword();
            String newPassword = userUpdateRequest.getNewPassword();

            if (!encoder.matches(currentPassword, existingPassword)) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Mật khẩu hiện tại không chính xác!"));
            }

            if (currentPassword.equals(newPassword)) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Mật khẩu mới phải khác với mật khẩu cũ!"));
            }

            String encodedNewPassword = encoder.encode(newPassword);
            existedUser.setPassword(encodedNewPassword);
        }

        existedUser.setFullName(userUpdateRequest.getFullName() != null ? userUpdateRequest.getFullName() : existedUser.getFullName());
        existedUser.setDateOfBirth(userUpdateRequest.getDateOfBirth() != null ? userUpdateRequest.getDateOfBirth() : existedUser.getDateOfBirth());
        existedUser.setEmail(userUpdateRequest.getEmail() != null ? userUpdateRequest.getEmail() : existedUser.getEmail());
        existedUser.setGender(userUpdateRequest.getGender() != null ? userUpdateRequest.getGender() : existedUser.getGender());

        userRepository.save(existedUser);

        return ResponseEntity.ok(new MessageResponse("Cập nhật thông tin thành công!"));
    }

//    public ResponseEntity<?> deleteUserByAdmin(long id) {
//        User existedUser = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
//        userRepository.delete(existedUser);
//        return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
//    }


    public ResponseEntity<?> updateStatusUserByAdmin(long id) {
        User existedUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        if (existedUser.getStatus() == EStatus.Active) {
            existedUser.setStatus(EStatus.Inactive);
        } else {
            existedUser.setStatus(EStatus.Active);
        }
        userRepository.save(existedUser);
        return ResponseEntity.ok(new MessageResponse("User status updated successfully!"));
    }

    @Transactional(readOnly = true)
    public Page<UserInfoAdminResponse> getAllUserInfos(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findAll(pageable);
        return userPage.map(this::toUserInfoAdminResponse);
    }

    private UserInfoAdminResponse toUserInfoAdminResponse(User u) {
        UserInfoAdminResponse dto = new UserInfoAdminResponse();
        dto.setId(u.getId());
        dto.setUsername(u.getUsername());
        dto.setFullName(u.getFullName());
        dto.setEmail(u.getEmail());
        dto.setStatus(u.getStatus());

        Set<String> roleNames = u.getRoles() == null ? Set.of() :
                u.getRoles().stream()
                        .map(role -> {
                            Object name = role.getName();
                            return name == null ? "" : name.toString();
                        })
                        .filter(s -> s != null && !s.isBlank())
                        .collect(Collectors.toSet());

        dto.setRoles(roleNames);
        return dto;
    }
    private UserInfoUserResponse toUserInfoUserResponse(User u) {
        UserInfoUserResponse dto = new UserInfoUserResponse();
        dto.setId(u.getId());
        dto.setUsername(u.getUsername());
        dto.setFullName(u.getFullName());
        dto.setEmail(u.getEmail());
        dto.setStatus(u.getStatus());
        dto.setDateOfBirth(u.getDateOfBirth());

        Set<String> roleNames = u.getRoles() == null ? Set.of() :
                u.getRoles().stream()
                        .map(role -> {
                            Object name = role.getName();
                            return name == null ? "" : name.toString();
                        })
                        .filter(s -> s != null && !s.isBlank())
                        .collect(Collectors.toSet());

        dto.setRoles(roleNames);
        return dto;
    }

    private boolean notBlank(String s) {
        return s != null && !s.trim().isBlank();
    }
    @Transactional(readOnly = true)
    public UserInfoAdminResponse getUserInfoById(long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id " + id));
        return toUserInfoAdminResponse(u);
    }

    @Transactional(readOnly = true)
    public UserInfoUserResponse getUserv2InfoById(long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id " + id));
        return toUserInfoUserResponse(u);
    }


}

