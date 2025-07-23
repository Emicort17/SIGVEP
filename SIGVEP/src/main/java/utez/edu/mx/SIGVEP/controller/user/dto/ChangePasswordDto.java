package utez.edu.mx.SIGVEP.controller.user.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordDto {
    private Integer userId;
    private String contrasenaActual;
    private String nuevaContrasena;
}
