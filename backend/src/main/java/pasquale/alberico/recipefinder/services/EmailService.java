// src/main/java/pasquale/alberico/recipefinder/services/EmailService.java
package pasquale.alberico.recipefinder.services;

import kong.unirest.HttpResponse;
import kong.unirest.JsonNode;
import kong.unirest.Unirest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // 🔑 API key di Resend (mettila in env.properties come resend.api.key=...)
    @Value("${resend.api.key}")
    private String resendApiKey;

    // 📧 Email di benvenuto semplice
    public void sendWelcomeEmail(String to, String username) {
        String body = """
                {
                  "from": "RecipeFinder <onboarding@resend.dev>",
                  "to": "%s",
                  "subject": "Benvenuto su Recipe Finder!",
                  "html": "<h2>Ciao %s!</h2><p>Il tuo account è stato creato con successo 🎉</p>"
                }
                """.formatted(to, username != null ? username : to);

        HttpResponse<JsonNode> response = Unirest.post("https://api.resend.com/emails")
                .header("Authorization", "Bearer " + resendApiKey)
                .header("Content-Type", "application/json")
                .body(body)
                .asJson();

        System.out.println("📨 Resend welcome response: " + response.getBody());
    }

    // 📧 Email con CODICE OTP
    public void sendVerificationCode(String email, String code) {

        System.out.println("📨 Sto inviando email di verifica a: " + email);
        System.out.println("🔢 Codice: " + code);

        // HTML SENZA CONCATENAZIONI NEL JSON
        String html =
                "<h2>Verifica il tuo account</h2>" +
                        "<p>Il tuo codice di verifica per RecipeFinder è:</p>" +
                        "<h1>" + code + "</h1>" +
                        "<p>Inseriscilo nell'app per attivare il tuo account.</p>";

        String body = """
    {
      "from": "RecipeFinder <onboarding@resend.dev>",
      "to": "%s",
      "subject": "Il tuo codice di verifica",
      "html": "%s"
    }
    """.formatted(email, html.replace("\"", "\\\"")); // <-- escape delle virgolette

        System.out.println("📤 BODY EMAIL VERIFICA:\n" + body);

        HttpResponse<JsonNode> response = Unirest.post("https://api.resend.com/emails")
                .header("Authorization", "Bearer " + resendApiKey)
                .header("Content-Type", "application/json")
                .body(body)
                .asJson();

        System.out.println("📨 Resend verification-code response: " + response.getBody());
        System.out.println("📨 Status: " + response.getStatus());
    }

}

//Dopo la registrazione generi un codice tipo: 487392
// lo salvi nel DB
//Lo mandi via email (testo semplice)
//L’utente va su una pagina /verify e inserisce il codice
//Backend controlla:
//email → trova utente
//codice → matcha se ok → verified = true