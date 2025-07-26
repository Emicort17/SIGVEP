package utez.edu.mx.SIGVEP.controller.sale.dto;

import lombok.*;
import utez.edu.mx.SIGVEP.controller.user.dto.UserPublicDto;
import utez.edu.mx.SIGVEP.model.product.ProductBean;
import utez.edu.mx.SIGVEP.model.sale.SaleBean;
import utez.edu.mx.SIGVEP.model.user.UserBean;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleNewDto {
    private Integer id_venta;
    private Date date;
    private int total_sale;
    private Boolean status;
    private UserPublicDto user;
    private List<ProductBean> products;
    private Integer quantity_products;
    private String payment_type;

    public SaleBean toEntity() {
        SaleBean saleEntity = new SaleBean();
        saleEntity.setId_venta(id_venta);
        saleEntity.setDate(date);
        saleEntity.setTotal_sale(total_sale);
        saleEntity.setStatus(status);
        saleEntity.setProducts(products);
        return saleEntity;
    }
}
