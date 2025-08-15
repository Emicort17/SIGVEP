package utez.edu.mx.SIGVEP.controller.category;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.SIGVEP.config.ApiResponse;
import utez.edu.mx.SIGVEP.controller.category.dto.CategoryDto;
import utez.edu.mx.SIGVEP.service.category.CategoryService;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/categorias")
@Validated
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAllCategorias() {
        List<CategoryDto> categorias = categoryService.findAll();
        ApiResponse apiResponse = new ApiResponse(categorias, HttpStatus.OK);
        return new ResponseEntity<>(apiResponse, apiResponse.getStatus());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCategoryById(@PathVariable Integer id) {
        Optional<CategoryDto> category = categoryService.findById(id);
        ApiResponse apiResponse;
        if (category.isPresent()) {
            apiResponse = new ApiResponse(category.get(), HttpStatus.OK);
        }else{
            apiResponse = new ApiResponse(HttpStatus.NOT_FOUND,
                    true,
                    "Categoria no encontrado"
            );
        }
        return new ResponseEntity<>(apiResponse, apiResponse.getStatus());
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse> addCategory(@RequestBody CategoryDto categoryDto) {
        ApiResponse response;
        try{
            CategoryDto addCategory = categoryService.register(categoryDto);
            response = new ApiResponse(addCategory, HttpStatus.OK);
        }catch (IllegalArgumentException e){
            response = new ApiResponse(HttpStatus.BAD_REQUEST, true, e.getMessage());
        }catch (Exception e) {
            response = new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, e.getMessage());
        }
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateCategory(@PathVariable Integer id, @RequestBody CategoryDto categoryDto) {
        ApiResponse response;
        try {
            Optional<CategoryDto> updateCategory = categoryService.update(categoryDto, id);
            if (updateCategory.isPresent()) {
                response = new ApiResponse(updateCategory.get(), HttpStatus.OK);
            } else {
                response = new ApiResponse(HttpStatus.NOT_FOUND, true, "Categoria no encontrado");
            }
        } catch (IllegalArgumentException e) {
            response = new ApiResponse(HttpStatus.BAD_REQUEST, true, e.getMessage());
        } catch (Exception e) {
            response = new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, true, e.getMessage());
        }
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse> patchCategory(@PathVariable Integer id) {
        Optional<CategoryDto> category = categoryService.patch(id);
        ApiResponse apiResponse;
        if (category.isPresent()) {
            apiResponse = new ApiResponse(category.get(), HttpStatus.OK);
        }else{
            apiResponse = new ApiResponse(HttpStatus.NOT_FOUND, true,  "Categoria no encontrado");
        }
        return new ResponseEntity<>(apiResponse, apiResponse.getStatus());
    }
}
