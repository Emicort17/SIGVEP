package utez.edu.mx.SIGVEP.controller.sale.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import utez.edu.mx.SIGVEP.controller.product.dto.ProductQuantityDto;
import utez.edu.mx.SIGVEP.model.sale.SaleBean;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleDto {
    private Integer id_venta;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime date;
    private double total_sale;
    private Boolean status;
    private Integer userId;
    private List<ProductQuantityDto> products;
    private Integer quantity_products;
    private String payment_type;
    private String paymentMethodId;
    private String paymentIntentId;

    public SaleBean toEntity() {
        SaleBean saleEntity = new SaleBean();
        saleEntity.setId_venta(id_venta);
        saleEntity.setDate(date);
        saleEntity.setTotal_sale(total_sale);
        saleEntity.setStatus(status);
        return saleEntity;
    }

}
