package pasquale.alberico.recipefinder.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import pasquale.alberico.recipefinder.entities.User;
import pasquale.alberico.recipefinder.services.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")  // solo per test
public class UserController {

    @Autowired
    private UserService userService;

    @PutMapping("/update-profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestBody User data) {

        User updated = userService.updateProfile(currentUser.getId(), data);
        return ResponseEntity.ok(updated);
    }
}
