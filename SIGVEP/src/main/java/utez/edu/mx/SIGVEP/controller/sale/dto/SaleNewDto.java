package utez.edu.mx.SIGVEP.controller.sale.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import utez.edu.mx.SIGVEP.controller.product.dto.ProductQuantityNewDto;
import utez.edu.mx.SIGVEP.controller.user.dto.UserPublicDto;
import utez.edu.mx.SIGVEP.model.sale.SaleBean;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleNewDto {
    private Integer id_venta;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime date;
    private double total_sale;
    private Boolean status;
    private UserPublicDto user;
    private List<ProductQuantityNewDto> products;
    private Integer quantity_products;
    private String payment_type;
    private String paymentIntentId;
    private String paymentMethodId;

    public SaleBean toEntity() {
        SaleBean saleEntity = new SaleBean();
        saleEntity.setId_venta(id_venta);
        saleEntity.setDate(date);
        saleEntity.setTotal_sale(total_sale);
        saleEntity.setStatus(status);
        return saleEntity;
    }
}
