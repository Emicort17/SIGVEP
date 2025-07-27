package utez.edu.mx.SIGVEP.controller.product.dto;


import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductQuantityDto {
    private Integer productId;
    private Long quantity;
}
