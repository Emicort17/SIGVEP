package utez.edu.mx.SIGVEP.model.sale;
import com.fasterxml.jackson.annotation.JsonBackReference;
import utez.edu.mx.SIGVEP.model.product.ProductBean;
import utez.edu.mx.SIGVEP.model.user.UserBean;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder(builderClassName = "Builder", toBuilder = true)
@ToString
@Getter
@Setter
@Table(name = "venta")
public class SaleBean {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_venta;

    @Column(name = "fecha", nullable = false)
    private Date date;

    @Column(name = "total_venta", nullable = false)
    private int total_sale;

    @Column(name = "status", columnDefinition = "BOOL DEFAULT true")
    private Boolean status;


   @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonBackReference
   private UserBean user;

    @ManyToMany
    @JoinTable(
            name = "sale_product",
            joinColumns = @JoinColumn(name = "sale_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<ProductBean> products = new ArrayList<>();

}
