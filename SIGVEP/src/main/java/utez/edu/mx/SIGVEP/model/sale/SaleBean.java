package utez.edu.mx.SIGVEP.model.sale;
import utez.edu.mx.SIGVEP.model.user.UserBean;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

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
    private UserBean user;

}
