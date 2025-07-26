package utez.edu.mx.SIGVEP.controller.sale.dto;


import jakarta.persistence.Column;
import lombok.*;
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
public class SaleDto {

    private Integer id_venta;
    private Date date;
    private int total_sale;
    private Boolean status;
    private Integer userId;
    private List<Integer> productIds;



    public SaleBean toEntity() {
        SaleBean saleEntity = new SaleBean();
        saleEntity.setId_venta(id_venta);
        saleEntity.setDate(date);
        saleEntity.setTotal_sale(total_sale);
        saleEntity.setStatus(status);
        return saleEntity;
    }

}
