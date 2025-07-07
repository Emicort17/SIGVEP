package utez.edu.mx.SIGVEP.controller.user;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.SIGVEP.config.ApiResponse;
import utez.edu.mx.SIGVEP.controller.user.dto.UserDto;
import utez.edu.mx.SIGVEP.service.user.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UserController {


    @Autowired
    private UserService usuarioService;

    // Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsuarios() {
        List<UserDto> usuarios = usuarioService.getAllUsuarios();
        ApiResponse response = new ApiResponse(usuarios, HttpStatus.OK);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUsuarioById(@PathVariable Integer id) {
        Optional<UserDto> usuario = usuarioService.getUsuarioById(id);
        ApiResponse response;

        if (usuario.isPresent()) {
            response = new ApiResponse(usuario.get(), HttpStatus.OK);
        } else {
            response = new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario no encontrado");
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    // Crear un nuevo usuario
    @PostMapping("/crear/{roleName}")
    public ResponseEntity<ApiResponse> createUsuarioByRole(
            @Valid @RequestBody UserDto usuarioDto,
            @PathVariable String roleName
    ) {
        ApiResponse response;
        try {
            UserDto createdUsuario = usuarioService.createUsuarioByRole(usuarioDto, roleName);
            response = new ApiResponse(createdUsuario, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            response = new ApiResponse(HttpStatus.BAD_REQUEST, true, e.getMessage());
        } catch (Exception e) {
            response = new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, "Error al crear el usuario");
        }
        return new ResponseEntity<>(response, response.getStatus());
    }


    // Actualizar un usuario existente
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateUsuario(@PathVariable Integer id, @Valid @RequestBody UserDto usuarioDto) {
        Optional<UserDto> updatedUsuario = usuarioService.updateUsuario(id, usuarioDto);
        ApiResponse response;

        if (updatedUsuario.isPresent()) {
            response = new ApiResponse(updatedUsuario.get(), HttpStatus.OK);
        } else {
            response = new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario no encontrado para actualizar");
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    // Eliminar un usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUsuario(@PathVariable Integer id) {
        boolean isDeleted = usuarioService.deleteUsuario(id);
        ApiResponse response;

        if (isDeleted) {
            response = new ApiResponse(HttpStatus.NO_CONTENT, false, "Usuario eliminado con éxito");
        } else {
            response = new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario no encontrado para eliminar");
        }

        return new ResponseEntity<>(response, response.getStatus());

    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> cambiarEstadoUsuario(@PathVariable Integer id) {
        Optional<UserDto> usuarioActualizado = usuarioService.patch(id);
        ApiResponse response;

        if (usuarioActualizado.isPresent()) {
            response = new ApiResponse(usuarioActualizado.get(), HttpStatus.OK);
        } else {
            response = new ApiResponse(HttpStatus.NOT_FOUND, true, "Usuario no encontrado para cambiar estado");
        }
        return new ResponseEntity<>(response, response.getStatus());
    }
}
