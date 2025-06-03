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
    private Integer id_category;
    private String name, description;
    private Boolean status;
    private Set<ProductBean> products;

    public CategoryDto(CategoryBean categoryEntity){
        this.id_category = categoryEntity.getId_category();
        this.name = categoryEntity.getName();
        this.description = categoryEntity.getDescription();
        this.status = categoryEntity.getStatus();
        this.products = categoryEntity.getProducts();
    }

    public CategoryBean toEntity() {
        CategoryBean categoryEntity = new CategoryBean();
        categoryEntity.setId_category(this.id_category);
        categoryEntity.setName(this.name);
        categoryEntity.setDescription(this.description);
        categoryEntity.setStatus(true);
        categoryEntity.setProducts(this.products);
        return categoryEntity;
    }

}
