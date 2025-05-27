package utez.edu.mx.SIGVEP.model.user;

import jakarta.persistence.*;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder(builderClassName = "Builder", toBuilder = true)
@ToString
@Table(name = "usuario")
public class UserBean {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_usuario;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "contrasena", nullable = false)
    private String password;

    @Column(columnDefinition = "BOOL DEFAULT true")
    private Boolean status;

    @Column(columnDefinition = "BOOL DEFAULT false")
    private Boolean blocked;

    @ManyToOne
    @JoinColumn(name = "id_role")
    private RoleBean role;

    public Integer getId_usuario() {
        return id_usuario;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Boolean getStatus() {
        return status;
    }

    public Boolean getBlocked() {
        return blocked;
    }

    public RoleBean getRole() {
        return role;
    }

    public void setId_usuario(Integer id_usuario) {
        this.id_usuario = id_usuario;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public void setBlocked(Boolean blocked) {
        this.blocked = blocked;
    }

    public void setRole(RoleBean role) {
        this.role = role;
    }
}
