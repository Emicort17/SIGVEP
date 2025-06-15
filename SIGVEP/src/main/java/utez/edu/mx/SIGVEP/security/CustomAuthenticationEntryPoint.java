package utez.edu.mx.SIGVEP.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import utez.edu.mx.SIGVEP.config.ApiResponse;

import java.io.IOException;

public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        // Crear una respuesta personalizada
        ApiResponse apiResponse = new ApiResponse(HttpStatus.FORBIDDEN, true, "Acceso denegado: Autenticación requerida");

        // Configurar la respuesta HTTP
        response.setContentType("application/json");
        response.setStatus(HttpStatus.FORBIDDEN.value());

        // Escribir la respuesta en el cuerpo de la respuesta
        ObjectMapper objectMapper = new ObjectMapper();
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}
