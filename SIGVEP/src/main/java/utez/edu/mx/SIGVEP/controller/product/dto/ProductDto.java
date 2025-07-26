package utez.edu.mx.SIGVEP.controller.product.dto;

import lombok.*;
import utez.edu.mx.SIGVEP.model.category.CategoryBean;
import utez.edu.mx.SIGVEP.model.product.ProductBean;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDto {
    private Integer id_product;
    private String name;
    private Double unit_price;
    private Boolean status;
    private Long stock;
    private CategoryBean category;

    public ProductDto(ProductBean productEntity) {
        this.id_product = productEntity.getId_product();
        this.name = productEntity.getName();
        this.unit_price = productEntity.getUnit_price();
        this.stock = productEntity.getStock();
        this.status = productEntity.getStatus();
        this.category = productEntity.getCategory();
    }

    public ProductBean toEntity(){
        ProductBean productBean = new ProductBean();
        productBean.setId_product(this.id_product);
        productBean.setName(this.name);
        productBean.setUnit_price(this.unit_price);
        productBean.setStock(this.stock);
        productBean.setStatus(this.status);
        productBean.setCategory(this.category);
        return productBean;
    }
}
