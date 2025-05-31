package utez.edu.mx.SIGVEP.controller.category.dto;


import lombok.*;
import utez.edu.mx.SIGVEP.model.category.CategoryBean;
import utez.edu.mx.SIGVEP.model.product.ProductBean;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDto {
    private Integer id_categoria;
    private String nombre, descripcion;
    private Boolean estatus;
    private Set<ProductBean> products;

    public CategoryDto(CategoryBean categoryEntity){
        this.id_categoria = categoryEntity.getId_categoria();
        this.nombre = categoryEntity.getNombre();
        this.descripcion = categoryEntity.getDescripcion();
        this.estatus = categoryEntity.getEstatus();
        this.products = categoryEntity.getProducts();
    }

    public CategoryBean toEntity() {
        CategoryBean categoryEntity = new CategoryBean();
        categoryEntity.setId_categoria(this.id_categoria);
        categoryEntity.setNombre(this.nombre);
        categoryEntity.setDescripcion(this.descripcion);
        categoryEntity.setEstatus(true);
        categoryEntity.setProducts(this.products);
        return categoryEntity;
    }

}
