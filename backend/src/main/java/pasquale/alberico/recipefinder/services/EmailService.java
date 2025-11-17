package pasquale.alberico.recipefinder.services;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${mailgun.api.key}")
    private String apiKey;

    @Value("${mailgun.domain}")
    private String domain;

    public void sendVerificationEmail(String toEmail, String token) {
        try {
            String subject = "Conferma la tua registrazione su RecipeFinder 🍳";
            String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;
            String body = "Ciao!\n\n" +
                    "Grazie per esserti registrato su RecipeFinder.\n" +
                    "Clicca qui per verificare il tuo account:\n" + verificationLink + "\n\n" +
                    "Buona giornata, il team RecipeFinder.";

            HttpResponse<String> response = Unirest.post("https://api.mailgun.net/v3/" + domain + "/messages")
                    .basicAuth("api", apiKey) // 👈 qui usi la key SENZA "key-"
                    .queryString("from", "RecipeFinder <postmaster@" + domain + ">")
                    .queryString("to", toEmail)
                    .queryString("subject", subject)
                    .queryString("text", body)
                    .asString();

            System.out.println("📧 Mailgun response: " + response.getStatus() + " - " + response.getBody());

            if (response.getStatus() != 200) {
                throw new RuntimeException("Errore Mailgun: " + response.getBody());
            }

        } catch (Exception e) {
            System.err.println("❌ Errore nell'invio dell'email di verifica: " + e.getMessage());
        }
    }
}
