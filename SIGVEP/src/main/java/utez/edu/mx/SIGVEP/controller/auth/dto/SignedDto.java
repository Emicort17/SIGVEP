package utez.edu.mx.SIGVEP.controller.auth.dto;

import lombok.Value;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

@Value
public class SignedDto {
    String token;
    String tokenType;
    Object user;
    List<? extends GrantedAuthority> authorities;
}
