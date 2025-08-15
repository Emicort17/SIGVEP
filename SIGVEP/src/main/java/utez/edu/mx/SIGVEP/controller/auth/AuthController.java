package utez.edu.mx.SIGVEP.controller.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.SIGVEP.config.ApiResponse;
import utez.edu.mx.SIGVEP.controller.auth.dto.SignDto;
import utez.edu.mx.SIGVEP.service.auth.AuthService;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"*"})
public class AuthController {
    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse> signIn(@RequestBody SignDto dto) {
        return service.signIn(dto.getEmail(), dto.getPassword());
    }
}