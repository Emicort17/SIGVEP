package utez.edu.mx.SIGVEP.security.entity;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import utez.edu.mx.SIGVEP.model.Bitacora.BitacoraBean;
import utez.edu.mx.SIGVEP.model.Bitacora.BitacoraRepository;


import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class BitacoraFilter extends OncePerRequestFilter {

    private final BitacoraRepository bitacoraRepository;
    private static final Logger logger = LoggerFactory.getLogger(BitacoraFilter.class);

    public BitacoraFilter(BitacoraRepository bitacoraRepository) {
        this.bitacoraRepository = bitacoraRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String usuario = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : "ANÓNIMO";
        String metodo = request.getMethod();
        String endpoint = request.getRequestURI();

        logger.info("Solicitud recibida: {} {} por usuario {}", metodo, endpoint, usuario);

        try {
            BitacoraBean bitacora = new BitacoraBean(usuario, metodo, endpoint, LocalDateTime.now());
            bitacoraRepository.save(bitacora);
            logger.info("Acción registrada en la bitácora con éxito.");
        } catch (Exception e) {
            logger.error("Error al guardar la bitácora para la solicitud {} {}", metodo, endpoint, e);
        }

        filterChain.doFilter(request, response);
    }
}
