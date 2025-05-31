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
    private Integer id_producto;
    private String clave;
    private Double precio_unitario;
    private Boolean estatus;
    private CategoryBean category;

    public ProductDto(ProductBean productEntity) {
        this.id_producto = productEntity.getId_producto();
        this.clave = productEntity.getClave();
        this.precio_unitario = productEntity.getPrecio_unitario();
        this.estatus = productEntity.getEstatus();
        this.category = productEntity.getCategory();
    }

    public ProductBean toEntity(){
        ProductBean productBean = new ProductBean();
        productBean.setId_producto(this.id_producto);
        productBean.setClave(this.clave);
        productBean.setPrecio_unitario(this.precio_unitario);
        productBean.setEstatus(true);
        productBean.setCategory(this.category);
        return productBean;
    }
}
