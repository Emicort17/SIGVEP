package utez.edu.mx.SIGVEP.controller.user.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPublicDto {
    private Integer id_usuario;
    private String nombre;
    private String apellido;
}
