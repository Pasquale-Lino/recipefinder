// src/main/java/pasquale/alberico/recipefinder/controllers/TestEmailController.java
package pasquale.alberico.recipefinder.controllers;

import org.springframework.web.bind.annotation.*;
import pasquale.alberico.recipefinder.services.EmailService;

@RestController
@RequestMapping("/api/test-email")
@CrossOrigin(origins = "http://localhost:5173")
public class TestEmailController {

    private final EmailService emailService;

    public TestEmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping
    public String sendTestEmail(@RequestParam String to) {
        emailService.sendVerificationEmail(to, "TEST-TOKEN-123");
        return "✅ Email di test inviata a: " + to;
    }
}
