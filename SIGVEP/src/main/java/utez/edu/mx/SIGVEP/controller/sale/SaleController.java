package utez.edu.mx.SIGVEP.controller.sale;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.SIGVEP.config.ApiResponse;
import utez.edu.mx.SIGVEP.controller.sale.dto.SaleDto;
import utez.edu.mx.SIGVEP.controller.sale.dto.SaleNewDto;
import utez.edu.mx.SIGVEP.controller.user.dto.UserDto;
import utez.edu.mx.SIGVEP.service.sale.SaleService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ventas")
@Validated
public class SaleController {

    @Autowired
    private SaleService saleService;

    // Obtener todas las ventas
    @GetMapping
    public ResponseEntity<ApiResponse> getAllSales() {
        List<SaleNewDto> sales = saleService.getAllSales();
        ApiResponse response = new ApiResponse(sales, HttpStatus.OK);
        return new ResponseEntity<>(response, response.getStatus());
    }

    // Obtener una venta por ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getSaleById(@PathVariable Integer id) {
        Optional<SaleNewDto> sale = saleService.getSaleById(id);
        ApiResponse response;

        if (sale.isPresent()) {
            response = new ApiResponse(sale.get(), HttpStatus.OK);
        } else {
            response = new ApiResponse(HttpStatus.NOT_FOUND, true, "Venta no encontrada");
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    // Ventas del día
    @GetMapping("/dia")
    public ResponseEntity<ApiResponse> getSalesOfDay() {
        List<SaleNewDto> sales = saleService.getSalesDay();
        ApiResponse response = new ApiResponse(sales, HttpStatus.OK);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("/semana")
    public ResponseEntity<ApiResponse> getSalesOfWeek() {
        List<SaleNewDto> sales = saleService.getSalesOfWeek();
        ApiResponse response = new ApiResponse(sales, HttpStatus.OK);
        return new ResponseEntity<>(response, response.getStatus());
    }

    // Ventas del mes
    @GetMapping("/mes")
    public ResponseEntity<ApiResponse> getSalesOfMonth() {
        List<SaleNewDto> sales = saleService.getSalesOfMonth();
        ApiResponse response = new ApiResponse(sales, HttpStatus.OK);
        return new ResponseEntity<>(response, response.getStatus());
    }

    // Ventas del año
    @GetMapping("/anio")
    public ResponseEntity<ApiResponse> getSalesOfYear() {
        List<SaleNewDto> sales = saleService.getSalesOfYear();
        ApiResponse response = new ApiResponse(sales, HttpStatus.OK);
        return new ResponseEntity<>(response, response.getStatus());
    }

    // Crear nueva venta
    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createSale(@Valid @RequestBody SaleDto saleDto) {
        ApiResponse response;
        try {
            Map<String, Object> result = saleService.saveSaleWithPayment(saleDto);
            response = new ApiResponse(result, HttpStatus.CREATED);
        } catch (StripeException e) {
            response = new ApiResponse(HttpStatus.BAD_REQUEST, true, "Error de Stripe: " + e.getMessage());
        } catch (RuntimeException e) {
            response = new ApiResponse(HttpStatus.BAD_REQUEST, true, "Error interno: " + e.getMessage());
        }
        return new ResponseEntity<>(response, response.getStatus());
    }


    // Actualizar venta
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateSale(@PathVariable Integer id, @Valid @RequestBody SaleDto saleDto) {
        Optional<SaleDto> updatedSale = saleService.updateSale(id, saleDto);
        ApiResponse response;

        if (updatedSale.isPresent()) {
            response = new ApiResponse(updatedSale.get(), HttpStatus.OK);
        } else {
            response = new ApiResponse(HttpStatus.NOT_FOUND, true, "Venta no encontrada para actualizar");
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    // Eliminar venta
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteSale(@PathVariable Integer id) {
        boolean isDeleted = saleService.deleteSale(id);
        ApiResponse response;

        if (isDeleted) {
            response = new ApiResponse(HttpStatus.NO_CONTENT, false, "Venta eliminada con éxito");
        } else {
            response = new ApiResponse(HttpStatus.NOT_FOUND, true, "Venta no encontrada para eliminar");
        }

        return new ResponseEntity<>(response, response.getStatus());
    }


    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse> cambiarEstadoVenta(@PathVariable Integer id) {
        Optional<SaleDto> usuarioActualizado = saleService.changeStatus(id);
        ApiResponse response;

        if (usuarioActualizado.isPresent()) {
            response = new ApiResponse(usuarioActualizado.get(), HttpStatus.OK);
        } else {
            response = new ApiResponse(HttpStatus.NOT_FOUND, true, "Venta no encontrada para cambiar estado");
        }
        return new ResponseEntity<>(response, response.getStatus());
    }


}