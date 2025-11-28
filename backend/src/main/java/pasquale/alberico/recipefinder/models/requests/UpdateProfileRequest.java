package pasquale.alberico.recipefinder.models.requests;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String nome;
    private String cognome;
    private String telefono;
    private String avatar;
}
