package utez.edu.mx.SIGVEP.model.saleproduct;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import utez.edu.mx.SIGVEP.model.product.ProductBean;
import utez.edu.mx.SIGVEP.model.sale.SaleBean;

@Entity
@Table(name = "sale_product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleProductBean {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sale_id")
    @JsonIgnore
    private SaleBean sale;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private ProductBean product;

    @Column(nullable = false)
    private Long quantity;
}
