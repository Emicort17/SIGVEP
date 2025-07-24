package utez.edu.mx.SIGVEP.controller.bitacora;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utez.edu.mx.SIGVEP.model.Bitacora.BitacoraBean;
import utez.edu.mx.SIGVEP.model.Bitacora.BitacoraService;


import java.util.List;

@RestController
@RequestMapping("/api/bitacora")
@CrossOrigin("*")
public class BitacoraController {

    @Autowired
    private BitacoraService bitacoraService;

    @GetMapping
    public ResponseEntity<List<BitacoraBean>> getAllBitacoras() {
        List<BitacoraBean> bitacoras = bitacoraService.getAllBitacoras();
        return ResponseEntity.ok(bitacoras);
    }
}
