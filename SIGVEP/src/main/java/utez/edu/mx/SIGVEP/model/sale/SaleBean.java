package utez.edu.mx.SIGVEP.model.sale;

import com.fasterxml.jackson.annotation.JsonBackReference;
import utez.edu.mx.SIGVEP.model.saleproduct.SaleProductBean;
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
    private double total_sale;

    @Column(name = "status", columnDefinition = "BOOL DEFAULT true")
    private Boolean status;

    @Column(name = "tipo_pago", nullable = false)
    private String payment_type;

    @Column(name = "cantidad_productos", nullable = false)
    private Integer quantity_products;

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "id_usuario", nullable = false)
   @JsonBackReference
   private UserBean user;

   @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
   private List<SaleProductBean> saleProducts = new ArrayList<>();

}
