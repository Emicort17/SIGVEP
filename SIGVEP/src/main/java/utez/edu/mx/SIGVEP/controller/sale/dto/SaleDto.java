package utez.edu.mx.SIGVEP.controller.sale.dto;


import jakarta.persistence.Column;
import lombok.*;
import utez.edu.mx.SIGVEP.model.sale.SaleBean;

import java.sql.Date;

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

    public SaleDto(SaleBean saleEntity) {
        this.id_venta =  saleEntity.getId_venta();
        this.date = saleEntity.getDate();
        this.total_sale = saleEntity.getTotal_sale();
        this.status = saleEntity.getStatus();
    }

    public SaleBean toEntity() {
        SaleBean saleEntity = new SaleBean();
        saleEntity.setId_venta(id_venta);
        saleEntity.setDate(date);
        saleEntity.setTotal_sale(total_sale);
        saleEntity.setStatus(status);
        return saleEntity;
    }

}
