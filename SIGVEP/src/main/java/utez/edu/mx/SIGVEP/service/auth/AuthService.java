package utez.edu.mx.SIGVEP.service.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.SIGVEP.config.ApiResponse;
import utez.edu.mx.SIGVEP.controller.auth.dto.SignedDto;
import utez.edu.mx.SIGVEP.controller.auth.dto.SimpleUserDto;
import utez.edu.mx.SIGVEP.controller.user.dto.UserDto;
import utez.edu.mx.SIGVEP.model.user.UserBean;
import utez.edu.mx.SIGVEP.security.jwt.JwtProvider;
import utez.edu.mx.SIGVEP.service.user.UserService;


import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserService service;
    private final AuthenticationManager manager;
    private final JwtProvider provider;

    public AuthService(UserService service, AuthenticationManager manager, JwtProvider provider) {
        this.service = service;
        this.manager = manager;
        this.provider = provider;
    }

    @Transactional
    public ResponseEntity<ApiResponse> signIn(String usuario, String contrasenia) {
        try {
            logger.info("Iniciando proceso de autenticación para el usuario: {}", usuario);

            Optional<UserBean> foundUsuario = service.findByMail(usuario);
            if (foundUsuario.isEmpty()) {
                logger.warn("Usuario no encontrado: {}", usuario);
                return new ResponseEntity<>(
                        new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario no encontrado"),
                        HttpStatus.NOT_FOUND
                );
            }

            UserBean user = foundUsuario.get();
            logger.info("Usuario encontrado: {}", user.getEmail());

            if (!user.getStatus()) {
                logger.warn("El usuario está inactivo: {}", user.getEmail());
                return new ResponseEntity<>(
                        new ApiResponse(HttpStatus.UNAUTHORIZED, true, "EL usuario está desactivado. Contacte al administrador"),
                        HttpStatus.UNAUTHORIZED
                );
            }

            if (Boolean.TRUE.equals(user.getBlocked())) {
                if (user.getBlockedAt() != null &&
                        user.getBlockedAt().isBefore(LocalDateTime.now().minusMinutes(30))) {
                    user.setBlocked(false);
                    user.setBlockedAt(null);
                    user.setFailedAttempts(0);
                    service.save(user);
                    logger.info("Usuario {} desbloqueado automáticamente", user.getEmail());
                } else {
                    logger.warn("El usuario {} está bloqueado y no ha pasado el tiempo", user.getEmail());
                    return new ResponseEntity<>(
                            new ApiResponse(HttpStatus.UNAUTHORIZED, true, "Cuenta bloqueada, espere 30 minutos"),
                            HttpStatus.UNAUTHORIZED
                    );
                }
            }

            Authentication auth = manager.authenticate(
                    new UsernamePasswordAuthenticationToken(usuario, contrasenia)
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            user.setFailedAttempts(0);
            service.save(user);

            String token = provider.generateToken(auth);
            SimpleUserDto simpleUser = new SimpleUserDto(user.getId(), user.getRole().getName());
            SignedDto signedDto = new SignedDto(token, "Bearer", simpleUser);

            logger.info("Autenticación exitosa para el usuario: {}", usuario);

            return new ResponseEntity<>(new ApiResponse(signedDto, HttpStatus.OK), HttpStatus.OK);

        } catch (BadCredentialsException e) {
            logger.error("Credenciales incorrectas para el usuario: {}", usuario);

            Optional<UserBean> foundUsuario = service.findByMail(usuario);
            if (foundUsuario.isPresent()) {
                UserBean user = foundUsuario.get();
                user.setFailedAttempts(user.getFailedAttempts() + 1);

                if (user.getFailedAttempts() >= 3) {
                    user.setBlocked(true);
                    user.setBlockedAt(LocalDateTime.now());
                    logger.warn("Usuario {} bloqueado por 30 minutos", user.getEmail());
                }

                service.save(user);
            }

            return new ResponseEntity<>(
                    new ApiResponse(HttpStatus.BAD_REQUEST, true, "Las credenciales no coinciden"),
                    HttpStatus.BAD_REQUEST
            );

        } catch (DisabledException e) {
            logger.error("El usuario está deshabilitado: {}", usuario);
            return new ResponseEntity<>(
                    new ApiResponse(HttpStatus.UNAUTHORIZED, true, "EL usuario está desactivado. Contacte al administrador"),
                    HttpStatus.UNAUTHORIZED
            );

        } catch (Exception e) {
            logger.error("Error inesperado durante el inicio de sesión para el usuario: {}", usuario, e);
            return new ResponseEntity<>(
                    new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, "Error interno en el servidor"),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

}