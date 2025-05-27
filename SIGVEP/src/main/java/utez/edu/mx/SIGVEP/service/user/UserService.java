package utez.edu.mx.SIGVEP.service.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.SIGVEP.controller.user.dto.UserDto;
import utez.edu.mx.SIGVEP.model.user.RoleBean;
import utez.edu.mx.SIGVEP.model.user.RoleRepository;
import utez.edu.mx.SIGVEP.model.user.UserBean;
import utez.edu.mx.SIGVEP.model.user.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository usuarioDao;

    @Autowired
    private RoleRepository roleDao;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepository usuarioDao, RoleRepository roleDao, PasswordEncoder passwordEncoder) {
        this.usuarioDao = usuarioDao;
        this.roleDao = roleDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsuarios() {
        return usuarioDao.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<UserDto> getUsuarioById(Integer id) {
        return usuarioDao.findById(id).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public Optional<UserDto> getUsuarioByEmail(String email) {
        return usuarioDao.findByEmail(email).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public Optional<UserBean> findByMail(String mail) {
        return usuarioDao.findByEmail(mail);
    }

    @Transactional
    public UserDto saveUsuario(UserDto UserDto) {
        UserBean usuario = new UserBean();
        setUsuarioData(usuario, UserDto, true);
        UserBean savedUsuario = usuarioDao.save(usuario);
        return toDTO(savedUsuario);
    }

    @Transactional
    public Optional<UserDto> updateUsuario(Integer id, UserDto UserDto) {
        Optional<UserBean> existingUsuario = usuarioDao.findById(id);
        if (existingUsuario.isPresent()) {
            UserBean usuario = existingUsuario.get();
            setUsuarioData(usuario, UserDto, false);
            usuarioDao.save(usuario);
            return Optional.of(toDTO(usuario));
        }
        return Optional.empty();
    }

    @Transactional
    public boolean deleteUsuario(Integer id) {
        if (usuarioDao.existsById(id)) {
            usuarioDao.deleteById(id);
            return true;
        }
        return false;
    }

    private void setUsuarioData(UserBean usuario, UserDto UserDto, boolean isNew) {
        logger.info("Iniciando la configuración del usuario...");
        usuario.setEmail(UserDto.getEmail());

        if (UserDto.getContrasena() != null && !UserDto.getContrasena().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(UserDto.getContrasena());
            logger.info("Contraseña original: {}", UserDto.getContrasena());
            logger.info("Contraseña encriptada: {}", encodedPassword);
            usuario.setPassword(encodedPassword);
        } else if (isNew) {
            throw new IllegalArgumentException("La contraseña es obligatoria para un nuevo usuario.");
        }

        if (UserDto.getRole() != null && UserDto.getRole().getName() != null) {
            Optional<RoleBean> role = roleDao.findByName(UserDto.getRole().getName());
            role.ifPresent(usuario::setRole);
        }

        if (isNew) {
            usuario.setStatus(true);
            usuario.setBlocked(false);
        }
        logger.info("Configuración del usuario completada: {}", usuario);
    }

    @Transactional
    public UserDto createUsuarioByRole(UserDto UserDto, String roleName) {
        logger.info("Buscando rol con nombre: {}", roleName);

        // Buscar el rol en la base de datos
        Optional<RoleBean> role = roleDao.findByName(roleName);
        if (!role.isPresent()) {
            logger.error("Rol no encontrado: {}", roleName);
            throw new IllegalArgumentException("El rol especificado no existe: " + roleName);
        }

        // Crear y asignar el usuario con el rol encontrado
        UserBean usuario = new UserBean();
        logger.info("Asignando datos al usuario con email: {}", UserDto.getEmail());
        setUsuarioData(usuario, UserDto, true);

        // Asignar el rol encontrado
        usuario.setRole(role.get());
        logger.info("Rol asignado: {}", role.get().getName());

        // Guardar el usuario en la base de datos
        UserBean savedUsuario = usuarioDao.save(usuario);
        logger.info("Usuario creado con éxito: ID {}", savedUsuario.getId_usuario());

        return toDTO(savedUsuario);
    }


    private UserDto toDTO(UserBean usuario) {
        return UserDto.builder()
                .id_usuario(usuario.getId_usuario())
                .email(usuario.getEmail())
                .contrasena(usuario.getPassword())
                .role(usuario.getRole())
                .build();
    }
}
