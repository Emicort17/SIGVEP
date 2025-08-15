package utez.edu.mx.SIGVEP.controller.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String contrasena;
    private Boolean status;
    private Boolean blocked;
    private RoleBean role;

    public UserDto(UserBean usuarioEntity) {
        this.id_usuario = usuarioEntity.getId();
        this.nombre = usuarioEntity.getName();
        this.apellido = usuarioEntity.getSurname();
        this.telefono = usuarioEntity.getTelephone();
        this.email = usuarioEntity.getEmail();
        this.contrasena = usuarioEntity.getPassword();
        this.status = usuarioEntity.getStatus();
        this.blocked = usuarioEntity.getBlocked();
        this.role = usuarioEntity.getRole();
    }
    public UserDto(Integer id_usuario) {
        this.id_usuario = id_usuario;
    }

    public UserBean toEntity() {
        UserBean usuario = new UserBean();
        usuario.setId(this.id_usuario);
        usuario.setName(this.nombre);
        usuario.setSurname(this.apellido);
        usuario.setTelephone(this.telefono);
        usuario.setEmail(this.email);
        usuario.setPassword(this.contrasena);
        usuario.setRole(this.role);
        usuario.setStatus(true);
        usuario.setBlocked(false);
        return usuario;
    }
}
