package utez.edu.mx.SIGVEP.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.SIGVEP.model.user.RoleBean;
import utez.edu.mx.SIGVEP.model.user.RoleRepository;
import utez.edu.mx.SIGVEP.model.user.UserBean;
import utez.edu.mx.SIGVEP.model.user.UserRepository;


@Configuration
@RequiredArgsConstructor
@Order(1)
public class InitialConfig implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository usuarioRepository;
    private final PasswordEncoder encoder;

    @Override
    @Transactional
    public void run(String... args) {

        RoleBean adminRole = getOrSaveRol(
                RoleBean.builder().id_role(null).name("ADMIN_ROLE").user(null).build()
        );

        RoleBean userRole = getOrSaveRol(
                RoleBean.builder().id_role(null).name("USER_ROLE").user(null).build()

        );

        getOrSaveUser(
                UserBean.builder()
                        .name("admin")
                        .surname("admin")
                        .telephone("7774915742")
                        .email("admin@example.com")
                        .password(encoder.encode("admin1234"))
                        .failedAttempts(0)
                        .status(true)
                        .blocked(false)
                        .role(adminRole)
                        .build()
        );

        getOrSaveUser(
                UserBean.builder()
                        .name("user")
                        .surname("user")
                        .telephone("7774897655")
                        .email("user@example.com")
                        .password(encoder.encode("user1234"))
                        .failedAttempts(0)
                        .status(true)
                        .blocked(false)
                        .role(userRole)
                        .build()
        );

    }



    // Método genérico para obtener o guardar un rol
    @Transactional
    public RoleBean getOrSaveRol(RoleBean role) {
        return roleRepository.findByName(role.getName())
                .orElseGet(() -> roleRepository.saveAndFlush(role));
    }

    // Método genérico para obtener o guardar un usuario
    @Transactional
    public UserBean getOrSaveUser(UserBean usuario) {
        return usuarioRepository.findByEmail(usuario.getEmail())
                .orElseGet(() -> usuarioRepository.saveAndFlush(usuario));
    }
}
