package utez.edu.mx.SIGVEP.model.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import utez.edu.mx.SIGVEP.model.sale.SaleBean;
import utez.edu.mx.SIGVEP.model.user.token.PasswordResetToken;

import java.time.LocalDateTime;
import java.util.Set;


@Entity
@Builder(builderClassName = "Builder", toBuilder = true)
@ToString
@Table(name = "usuario")
public class UserBean {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", nullable = false, columnDefinition = "VARCHAR(30)")
    private String name;

    @Column(name = "apellido", nullable = false, columnDefinition = "VARCHAR(50)")
    private String surname;

    @Column(name = "telefono", nullable = false, columnDefinition = "VARCHAR(10)")
    private String telephone;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "contrasena", nullable = false)
    private String password;

    @Column(columnDefinition = "BOOL DEFAULT true")
    private Boolean status;

    @Column(columnDefinition = "BOOL DEFAULT false")
    private Boolean blocked;

    @Column(name = "blocked_at")
    private LocalDateTime blockedAt;

    @Column(name = "failed_attempts")
    private Integer failedAttempts = 0;
    @ManyToOne
    @JoinColumn(name = "id_role")
    private RoleBean role;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private Set<SaleBean> sale;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "passToken_id", referencedColumnName = "id")
    private PasswordResetToken token;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Boolean getBlocked() {
        return blocked;
    }

    public void setBlocked(Boolean blocked) {
        this.blocked = blocked;
    }

    public RoleBean getRole() {
        return role;
    }

    public void setRole(RoleBean role) {
        this.role = role;
    }

    public Set<SaleBean> getSale() {
        return sale;
    }

    public void setSale(Set<SaleBean> sale) {
        this.sale = sale;
    }

    public PasswordResetToken getToken() {
        return token;
    }

    public void setToken(PasswordResetToken token) {
        this.token = token;
    }

    public LocalDateTime getBlockedAt() {
        return blockedAt;
    }

    public void setBlockedAt(LocalDateTime blockedAt) {
        this.blockedAt = blockedAt;
    }

    public Integer getFailedAttempts() {
        return failedAttempts;
    }

    public void setFailedAttempts(Integer failedAttempts) {
        this.failedAttempts = failedAttempts;
    }

    public UserBean() {
    }

    public UserBean(String name, String surname, String telephone, String email, String password, Boolean status, Boolean blocked, LocalDateTime blockedAt, Integer failedAttempts, RoleBean role, Set<SaleBean> sale, PasswordResetToken token) {
        this.name = name;
        this.surname = surname;
        this.telephone = telephone;
        this.email = email;
        this.password = password;
        this.status = status;
        this.blocked = blocked;
        this.blockedAt = blockedAt;
        this.failedAttempts = failedAttempts;
        this.role = role;
        this.sale = sale;
        this.token = token;
    }

    public UserBean(Integer id, String name, String surname, String telephone, String email, String password, Boolean status, Boolean blocked, LocalDateTime blockedAt, Integer failedAttempts, RoleBean role, Set<SaleBean> sale, PasswordResetToken token) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.telephone = telephone;
        this.email = email;
        this.password = password;
        this.status = status;
        this.blocked = blocked;
        this.blockedAt = blockedAt;
        this.failedAttempts = failedAttempts;
        this.role = role;
        this.sale = sale;
        this.token = token;
    }
}
