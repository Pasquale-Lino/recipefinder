package pasquale.alberico.recipefinder.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import pasquale.alberico.recipefinder.services.EmailService;

@RestController
public class TestEmailController {

    private final EmailService emailService;

    public TestEmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/api/test-email")
    public String testEmail() {
        emailService.sendWelcomeEmail("la_tua_email_personale@gmail.com", "TestUser");
        return "Email inviata!";
    }
}
