package utez.edu.mx.SIGVEP.model.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;


@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder(builderClassName = "Builder", toBuilder = true)
@Table(name = "role")
public class RoleBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_role;

    @Column(name = "nombre", nullable = false)
    private String name;

    @OneToMany(mappedBy = "role")
    @JsonIgnore
    private Set<UserBean> user;

    public Integer getId_role() {
        return id_role;
    }

    public String getName() {
        return name;
    }

    public Set<UserBean> getUser() {
        return user;
    }

    public void setId_role(Integer id_role) {
        this.id_role = id_role;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUser(Set<UserBean> user) {
        this.user = user;
    }
}