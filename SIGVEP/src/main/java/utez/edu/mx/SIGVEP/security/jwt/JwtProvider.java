    package utez.edu.mx.SIGVEP.security.jwt;

    import io.jsonwebtoken.Claims;
    import io.jsonwebtoken.JwtException;
    import io.jsonwebtoken.Jwts;
    import io.jsonwebtoken.security.MacAlgorithm;
    import io.jsonwebtoken.io.Decoders;
    import io.jsonwebtoken.security.Keys;
    import jakarta.servlet.http.HttpServletRequest;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.userdetails.UserDetails;
    import org.springframework.stereotype.Service;

    import javax.crypto.SecretKey;
    import java.security.Key;
    import java.util.Date;

    @Service
    public class JwtProvider {

        @Value("${jwt.secret}")
        private String secret;

        @Value("${jwt.expiration}")
        private long expiration;


        private static final String TOKEN_HEADER = "Authorization";
        private static final String TOKEN_TYPE = "Bearer ";

        // Generar un token JWT (versión 0.12.6 compatible)
        public String generateToken(Authentication auth) {
            UserDetails user = (UserDetails) auth.getPrincipal();

            Date tokenCreateTime = new Date();
            Date tokenValidity = new Date(tokenCreateTime.getTime() + expiration * 1000);

            return Jwts.builder()
                    .subject(user.getUsername())
                    .claim("roles", user.getAuthorities())
                    .issuedAt(tokenCreateTime)
                    .expiration(tokenValidity)
                    .signWith(getSignKey())
                    .compact();
        }

        // Obtener la clave para firmar los tokens
        private SecretKey getSignKey() {
            byte[] keyBytes = Decoders.BASE64.decode(secret);
            return Keys.hmacShaKeyFor(keyBytes);
        }


        // Resolver el token desde la solicitud HTTP
        public String resolveToken(HttpServletRequest req) {
            String bearerToken = req.getHeader(TOKEN_HEADER);
            if (bearerToken != null && bearerToken.startsWith(TOKEN_TYPE)) {
                return bearerToken.substring(TOKEN_TYPE.length());
            }
            return null;
        }

        // Validar un token JWT
        public boolean validateToken(String token) {
            try {
                getClaims(token);
                return true;
            } catch (io.jsonwebtoken.ExpiredJwtException e) {
                System.err.println("El token ha expirado: " + e.getMessage());
            } catch (io.jsonwebtoken.JwtException | IllegalArgumentException e) {
                System.err.println("Token inválido: " + e.getMessage());
            }
            return false;
        }

        // Extraer claims del token
        public Claims getClaims(String token) {
            try {
                return Jwts.parser()
                        .verifyWith(getSignKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();
            } catch (JwtException e) {
                throw new RuntimeException("Error al obtener los claims del token: " + e.getMessage());
            }
        }
    }
