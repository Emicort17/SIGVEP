package utez.edu.mx.SIGVEP.controller.product.dto;

import lombok.*;
import utez.edu.mx.SIGVEP.model.product.ProductBean;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductQuantityNewDto {
    private ProductBean product;
    private Long quantity;
}
