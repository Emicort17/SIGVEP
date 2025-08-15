package utez.edu.mx.SIGVEP.util.Email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import utez.edu.mx.SIGVEP.model.user.UserBean;
import utez.edu.mx.SIGVEP.model.user.token.PasswordResetToken;
import utez.edu.mx.SIGVEP.model.user.token.PasswordResetTokenRepository;
import utez.edu.mx.SIGVEP.service.user.UserService;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class EmailSenderServiceImpl implements EmailSenderService {

    private final JavaMailSender mailSender;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    public EmailSenderServiceImpl(JavaMailSender mailSender,
                                  UserService userService,
                                  PasswordEncoder passwordEncoder,
                                  PasswordResetTokenRepository passwordResetTokenRepository) {
        this.mailSender = mailSender;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Override
    public String sendEmail_password(String toEmail) {
        Optional<UserBean> foundUser = userService.findByMail(toEmail);
        if (foundUser.isPresent()) {
            passwordResetTokenRepository.deleteByUser(foundUser.get());
            int tokenInt = 100000 + new Random().nextInt(900000);
            String token = String.valueOf(tokenInt);
            LocalDateTime expiration = LocalDateTime.now().plusMinutes(15);

            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUser(foundUser.get());
            resetToken.setExpirationDate(expiration);
            passwordResetTokenRepository.save(resetToken);

            String messageText = String.format(
                    "¡Hola %s!\n\n" +
                            "Hemos recibido una solicitud para restablecer tu contraseña.\n\n" +
                            "Tu código de verificación es:\n\n" +
                            "%s\n\n" +
                            "Este código expirará en 15 minutos.\n\n" +
                            "Si no solicitaste este cambio, puedes ignorar este mensaje.\n\n" +
                            "Saludos,\nEquipo de soporte",
                    foundUser.get().getEmail(), token
            );

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("SAEMcor@gmail.com");
            message.setTo(toEmail);
            message.setSubject("Recuperación de contraseña");
            message.setText(messageText);
            mailSender.send(message);

            return token;
        }
        return null;
    }
}
