package utez.edu.mx.SIGVEP.controller.Email.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenCorreoDto {
    private String token;
    private String correo;

    public TokenCorreoDto(String token, String toEmail) {
        this.token = token;
        this.correo = toEmail;
    }
}
