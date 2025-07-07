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
    public Boolean sendEmail_password(String toEmail) {

        Optional<UserBean> foundUser = userService.findByMail(toEmail);
        if (foundUser.isPresent()) {

            passwordResetTokenRepository.deleteByUser(foundUser.get());


            String token = UUID.randomUUID().toString();
            LocalDateTime expiration = LocalDateTime.now().plusMinutes(15);

            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUser(foundUser.get());
            resetToken.setExpirationDate(expiration);
            passwordResetTokenRepository.save(resetToken);


            String resetLink = "por definir" + token;


            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("SAEMcor@gmail.com");
            message.setTo(toEmail);
            message.setSubject("Recuperación de contraseña");
            message.setText("Hola " + foundUser.get().getEmail()
                    + ",\n\nHemos recibido una solicitud para restablecer tu contraseña."
                    + "\n\nHaz clic en el siguiente enlace para continuar:"
                    + "\n" + resetLink
                    + "\n\nEste enlace expirará en 15 minutos."
                    + "\n\nSi no solicitaste este cambio, puedes ignorar este mensaje.");
            mailSender.send(message);

            return true;
        }

        return false;
    }
}
