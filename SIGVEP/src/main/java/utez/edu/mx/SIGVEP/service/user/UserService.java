package utez.edu.mx.SIGVEP.service.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.SIGVEP.controller.user.dto.ChangePasswordDto;
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
        return usuarioDao.findAllByOrderByIdAsc().stream()
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
    public Optional<UserDto> updateUsuario(Integer id, UserDto userDto) {
        return usuarioDao.findById(id).map(usuario -> {
            setUsuarioDataForUpdate(usuario, userDto);
            usuarioDao.save(usuario);
            return toDTO(usuario);
        });
    }

    @Transactional
    public boolean deleteUsuario(Integer id) {
        if (usuarioDao.existsById(id)) {
            usuarioDao.deleteById(id);
            return true;
        }
        return false;
    }

    private void setUsuarioData(UserBean usuario, UserDto userDto, boolean isNew) {
        logger.info("Iniciando la configuración del usuario...");

        if (userDto.getNombre() == null || userDto.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre no puede estar vacío.");
        }
        if (userDto.getNombre().length() > 30) {
            throw new IllegalArgumentException("El nombre excede los 30 caracteres permitidos.");
        }
        usuario.setName(userDto.getNombre());

        if (userDto.getApellido() == null || userDto.getApellido().trim().isEmpty()) {
            throw new IllegalArgumentException("El apellido no puede estar vacío.");
        }
        if (userDto.getApellido().length() > 50) {
            throw new IllegalArgumentException("El apellido excede los 50 caracteres permitidos.");
        }
        usuario.setSurname(userDto.getApellido());

        if (userDto.getTelefono() == null || userDto.getTelefono().trim().isEmpty()) {
            throw new IllegalArgumentException("El teléfono no puede estar vacío.");
        }
        if (!userDto.getTelefono().matches("\\d{10}")) {
            throw new IllegalArgumentException("El teléfono debe contener exactamente 10 dígitos.");
        }
        if (usuarioDao.existsByTelephone(userDto.getTelefono())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese número de teléfono.");
        }
        usuario.setTelephone(userDto.getTelefono());

        if (userDto.getEmail() == null || userDto.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email no puede estar vacío.");
        }
        if (!userDto.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("El formato del email no es válido.");
        }
        if (usuarioDao.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email.");
        }
        usuario.setEmail(userDto.getEmail());

        if (isNew) {
            if (userDto.getContrasena() == null || userDto.getContrasena().isEmpty()) {
                throw new IllegalArgumentException("La contraseña es obligatoria para un nuevo usuario.");
            }
            usuario.setPassword(passwordEncoder.encode(userDto.getContrasena()));
        }

        if (userDto.getRole() != null && userDto.getRole().getName() != null) {
            roleDao.findByName(userDto.getRole().getName()).ifPresent(usuario::setRole);
        }

        usuario.setStatus(true);
        usuario.setBlocked(false);
        logger.info("Configuración del usuario completada: {}", usuario);
    }


    private void setUsuarioDataForUpdate(UserBean usuario, UserDto userDto) {
        if (userDto.getNombre() != null) {
            if (userDto.getNombre().trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre no puede estar vacío.");
            }
            if (userDto.getNombre().length() > 30) {
                throw new IllegalArgumentException("El nombre excede los 30 caracteres permitidos.");
            }
            usuario.setName(userDto.getNombre());
        }

        if (userDto.getApellido() != null) {
            if (userDto.getApellido().trim().isEmpty()) {
                throw new IllegalArgumentException("El apellido no puede estar vacío.");
            }
            if (userDto.getApellido().length() > 50) {
                throw new IllegalArgumentException("El apellido excede los 50 caracteres permitidos.");
            }
            usuario.setSurname(userDto.getApellido());
        }

        if (userDto.getTelefono() != null) {
            if (!userDto.getTelefono().matches("\\d{10}")) {
                throw new IllegalArgumentException("El teléfono debe contener exactamente 10 dígitos.");
            }

            Optional<UserBean> usuarioExistente = usuarioDao.findByTelephone(userDto.getTelefono());
            if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(usuario.getId())) {
                throw new IllegalArgumentException("Ya existe otro usuario con ese número de teléfono.");
            }
            usuario.setTelephone(userDto.getTelefono());
        }

        if (userDto.getEmail() != null) {
            if (!userDto.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
                throw new IllegalArgumentException("El formato del email no es válido.");
            }

            Optional<UserBean> usuarioExistente = usuarioDao.findByEmail(userDto.getEmail());
            if (usuarioExistente.isPresent() && !usuarioExistente.get().getId().equals(usuario.getId())) {
                throw new IllegalArgumentException("Ya existe otro usuario con ese email.");
            }
            usuario.setEmail(userDto.getEmail());
        }

        if (userDto.getRole() != null && userDto.getRole().getName() != null) {
            roleDao.findByName(userDto.getRole().getName()).ifPresent(usuario::setRole);
        }
    }


    @Transactional
    public UserDto createUsuarioByRole(UserDto userDto, String roleName) {
        Optional<RoleBean> role = roleDao.findByName(roleName);
        if (!role.isPresent()) {
            throw new IllegalArgumentException("El rol especificado no existe: " + roleName);
        }

        if ("ADMIN_ROLE".equalsIgnoreCase(roleName)) {
            boolean existsAdmin = usuarioDao.existsByRoleName("ADMIN_ROLE");
            if (existsAdmin) {
                throw new IllegalArgumentException("Ya existe un usuario con el rol ADMIN_ROLE. Solo se permite uno.");
            }
        }

        UserBean usuario = new UserBean();
        setUsuarioData(usuario, userDto, true);
        usuario.setRole(role.get());

        UserBean savedUsuario = usuarioDao.save(usuario);

        return toDTO(savedUsuario);
    }



    @Transactional
    public Optional<UserDto> changeStatus(Integer userId) {
        return usuarioDao.findById(userId).map(usuario -> {
            usuario.setStatus(!usuario.getStatus());
            usuarioDao.save(usuario);
            return toDTO(usuario);
        });
    }

    @Transactional
    public Optional<UserDto> changeBlocked(Integer userId) {
        return usuarioDao.findById(userId).map(usuario -> {
            usuario.setBlocked(!usuario.getBlocked());
            usuarioDao.save(usuario);
            return toDTO(usuario);
        });
    }



    @Transactional
    public Optional<UserDto> patch(Integer id){
        if(usuarioDao.existsById(id)){
            UserBean user = usuarioDao.findById(id).get();
            Boolean estatus = user.getStatus();
            user.setStatus(!estatus);
            return Optional.of(toDTO(user));
        }
        return Optional.empty();
    }

    @Transactional
    public boolean changePassword(ChangePasswordDto dto) {
        Optional<UserBean> optionalUser = usuarioDao.findById(dto.getUserId());
        if (optionalUser.isPresent()) {
            UserBean usuario = optionalUser.get();

            if (!passwordEncoder.matches(dto.getContrasenaActual(), usuario.getPassword())) {
                throw new IllegalArgumentException("La contraseña actual es incorrecta.");
            }

            usuario.setPassword(passwordEncoder.encode(dto.getNuevaContrasena()));
            usuarioDao.save(usuario);
            return true;
        }
        return false;
    }




    private UserDto toDTO(UserBean usuario) {
        return UserDto.builder()
                .id_usuario(usuario.getId())
                .nombre(usuario.getName())
                .apellido(usuario.getSurname())
                .telefono(usuario.getTelephone())
                .email(usuario.getEmail())
                .contrasena(usuario.getPassword())
                .status(usuario.getStatus())
                .blocked(usuario.getBlocked())
                .role(usuario.getRole())
                .build();
    }
}
