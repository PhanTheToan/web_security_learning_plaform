package web_security_plaform.backend.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User findByUsername(String name) {
        return userRepository.findByUsername(name).orElse(null);
    }
}
