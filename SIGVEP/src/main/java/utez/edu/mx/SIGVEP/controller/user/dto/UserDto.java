package utez.edu.mx.SIGVEP.controller.user.dto;

import lombok.*;
import utez.edu.mx.SIGVEP.model.user.RoleBean;
import utez.edu.mx.SIGVEP.model.user.UserBean;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Integer id_usuario;
    private String nombre;
    private String apellido;
    private String telefono;
    private String email;
    private String contrasena;
    private RoleBean role;

    public UserDto(UserBean usuarioEntity) {
        this.id_usuario = usuarioEntity.getId_usuario();
        this.nombre = usuarioEntity.getName();
        this.apellido = usuarioEntity.getSurname();
        this.telefono = usuarioEntity.getTelephone();
        this.email = usuarioEntity.getEmail();
        this.contrasena = usuarioEntity.getPassword();
        this.role = usuarioEntity.getRole();
    }

    public UserBean toEntity() {
        UserBean usuario = new UserBean();
        usuario.setId_usuario(this.id_usuario);
        usuario.setName(this.nombre);
        usuario.setSurname(this.apellido);
        usuario.setTelephone(this.telefono);
        usuario.setEmail(this.email);
        usuario.setPassword(this.contrasena);
        usuario.setRole(this.role);
        usuario.setStatus(true); // Activo por defecto
        usuario.setBlocked(false); // No bloqueado por defecto
        return usuario;
    }
}
