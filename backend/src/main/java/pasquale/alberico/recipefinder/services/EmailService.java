package pasquale.alberico.recipefinder.services;

import kong.unirest.HttpResponse;
import kong.unirest.JsonNode;
import kong.unirest.Unirest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String resendApiKey;

    public void sendWelcomeEmail(String to, String username) {

        String body = """
                {
                  "from": "RecipeFinder <onboarding@resend.dev>",
                  "to": "%s",
                  "subject": "Benvenuto su Recipe Finder!",
                  "html": "<h2>Ciao %s!</h2><p>Il tuo account è stato creato con successo 🎉</p>"
                }
                """.formatted(to, username);

        HttpResponse<JsonNode> response = Unirest.post("https://api.resend.com/emails")
                .header("Authorization", "Bearer " + resendApiKey)
                .header("Content-Type", "application/json")
                .body(body)
                .asJson();

        System.out.println("Resend response: " + response.getBody());
    }
}
