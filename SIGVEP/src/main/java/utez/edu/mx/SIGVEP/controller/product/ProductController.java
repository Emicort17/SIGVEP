package utez.edu.mx.SIGVEP.controller.product;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.SIGVEP.config.ApiResponse;
import utez.edu.mx.SIGVEP.controller.category.dto.CategoryDto;
import utez.edu.mx.SIGVEP.controller.product.dto.ProductDto;
import utez.edu.mx.SIGVEP.service.product.ProductService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
@Validated
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAllProducts() {
        List<ProductDto> productos = productService.findAll();
        ApiResponse response = new ApiResponse(productos, HttpStatus.OK);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Integer id) {
        Optional<ProductDto> producto = productService.findById(id);
        ApiResponse response;
        if (producto.isPresent()) {
            response = new ApiResponse(producto.get(), HttpStatus.OK);
        }else{
            response = new ApiResponse(HttpStatus.NOT_FOUND,
                    true,
                    "Producto no encontrado");
        }

        return new ResponseEntity<>(response, response.getStatus());
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> addProduct(@RequestBody ProductDto product) {
        ApiResponse response;
        try{
            ProductDto addProduct = productService.register(product);
            response = new ApiResponse(addProduct, HttpStatus.OK);
        }catch (IllegalArgumentException e){
            response = new ApiResponse(HttpStatus.BAD_REQUEST, true, e.getMessage());
        }catch (Exception e){
            response = new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, e.getMessage());
        }
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProduct(@PathVariable Integer id, @RequestBody ProductDto product) {
        Optional<ProductDto> updateProduct = productService.update(product, id);
        ApiResponse response;
        if (updateProduct.isPresent()) {
            response = new ApiResponse(updateProduct.get(), HttpStatus.OK);
        }else{
            response = new ApiResponse(HttpStatus.NOT_FOUND, true, "Producto no encontrado para actualizar");
        }
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> patchProduct(@PathVariable Integer id) {
        Optional<ProductDto> product = productService.patch(id);
        ApiResponse response;
        if (product.isPresent()) {
            response = new ApiResponse(product.get(), HttpStatus.OK);
        } else {
            response = new ApiResponse(HttpStatus.NOT_FOUND, true, "Producto no encontrado");
        }
        return new ResponseEntity<>(response, response.getStatus());
    }
}
