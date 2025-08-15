package utez.edu.mx.SIGVEP.controller.Email;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.SIGVEP.config.ApiResponse;
import utez.edu.mx.SIGVEP.controller.Email.Dto.MailDto;
import utez.edu.mx.SIGVEP.controller.Email.Dto.TokenCorreoDto;
import utez.edu.mx.SIGVEP.controller.user.dto.UserDto;
import utez.edu.mx.SIGVEP.model.user.UserBean;
import utez.edu.mx.SIGVEP.service.user.UserService;
import utez.edu.mx.SIGVEP.util.Email.EmailSenderService;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth/recover")
@CrossOrigin(origins = {"*"})
public class EmailSenderController {
    private final EmailSenderService service;
    private final UserService userService;

    public EmailSenderController(EmailSenderService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping("/send-mail")
    public ResponseEntity<ApiResponse> sendEmail(@RequestBody MailDto dto) {
        Optional<UserBean> user = userService.findByMail(dto.getToEmail());
        if(user.isEmpty()){
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND, true, "El correo no está registrado"), HttpStatus.NOT_FOUND);
        }
        String token = service.sendEmail_password(dto.getToEmail());
        if(token != null) {
            TokenCorreoDto data = new TokenCorreoDto(token, dto.getToEmail());
            return new ResponseEntity<>(new ApiResponse(data, HttpStatus.OK), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST, true, "Error al mandar el correo"), HttpStatus.BAD_REQUEST);
    }
}
