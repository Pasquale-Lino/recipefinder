package pasquale.alberico.recipefinder.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User updateProfile(Long userId, User data) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        if (data.getUsername() != null) user.setUsername(data.getUsername());
        if (data.getEmail() != null) user.setEmail(data.getEmail());
        if (data.getPassword() != null) user.setPassword(data.getPassword());
        if (data.getProfileImage() != null) user.setProfileImage(data.getProfileImage());
        if (data.getPhoneNumber() != null) user.setPhoneNumber(data.getPhoneNumber());
        if (data.getLastName() != null) user.setLastName(data.getLastName());

        return userRepository.save(user);
    }
}
