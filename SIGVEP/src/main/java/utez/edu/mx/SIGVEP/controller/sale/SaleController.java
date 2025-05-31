package utez.edu.mx.SIGVEP.controller.sale;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.SIGVEP.config.ApiResponse;
import utez.edu.mx.SIGVEP.controller.sale.dto.SaleDto;
import utez.edu.mx.SIGVEP.service.sale.SaleService;

import java.util.List;
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
        List<SaleDto> sales = saleService.getAllSales();
        ApiResponse response = new ApiResponse(sales, HttpStatus.OK);
        return new ResponseEntity<>(response, response.getStatus());
    }

    // Obtener una venta por ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getSaleById(@PathVariable Integer id) {
        Optional<SaleDto> sale = saleService.getSaleById(id);
        ApiResponse response;

        if (sale.isPresent()) {
            response = new ApiResponse(sale.get(), HttpStatus.OK);
        } else {
            response = new ApiResponse(HttpStatus.NOT_FOUND, true, "Venta no encontrada");
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    // Crear nueva venta
    @PostMapping
    public ResponseEntity<ApiResponse> createSale(@Valid @RequestBody SaleDto saleDto) {
        ApiResponse response;
        try {
            SaleDto createdSale = saleService.saveSale(saleDto);
            response = new ApiResponse(createdSale, HttpStatus.CREATED);
        } catch (Exception e) {
            response = new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, "Error al crear la venta");
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
}