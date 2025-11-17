package pasquale.alberico.recipefinder.config;
import java.io.File;
import com.mashape.unirest.http.HttpResponse; // unirest v1.4.9
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
public class MGSamples {
    public static JsonNode sendSimpleMessage() throws UnirestException {
        String apiKey = System.getenv("${MAILGUN_API_KEY}");
        if (apiKey == null) {
            apiKey = "${MAILGUN_API_KEY}";
        }

        HttpResponse<JsonNode> request = Unirest.post("https://api.mailgun.net/v3/sandbox4c1601845bcf4757a774ebae080d0b14.mailgun.org/messages")
                .basicAuth("api", apiKey)
                .queryString("from", "Mailgun Sandbox <postmaster@sandbox4c1601845bcf4757a774ebae080d0b14.mailgun.org>")
                .queryString("to", "pasquale alberico <pasquale.alberico94@gmail.com>")
                .queryString("subject", "Hello pasquale alberico")
                .queryString("text", "Congratulations pasquale alberico, you just sent an email with Mailgun! You are truly awesome!")
                .asJson();
        return request.getBody();
    }}
