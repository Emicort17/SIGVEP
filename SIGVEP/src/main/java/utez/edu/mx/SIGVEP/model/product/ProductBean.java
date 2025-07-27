package utez.edu.mx.SIGVEP.model.product;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import utez.edu.mx.SIGVEP.model.category.CategoryBean;
import utez.edu.mx.SIGVEP.model.saleproduct.SaleProductBean;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "producto")
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderClassName = "Builder", toBuilder = true)
@ToString
@Getter
@Setter
public class ProductBean {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto", nullable = false)
    private Integer id;

    @Column(name = "nombre", nullable = false)
    private String name;

    @Column(name = "precio_unitario", nullable = false)
    private Double unit_price;

    @Column(name = "stock", nullable = false)
    private Long stock;

    @Column(name = "estado", nullable = false)
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "id_category")
    private CategoryBean category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<SaleProductBean> saleProducts = new ArrayList<>();
}
