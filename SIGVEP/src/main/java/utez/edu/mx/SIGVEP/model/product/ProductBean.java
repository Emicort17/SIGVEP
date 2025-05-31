package utez.edu.mx.SIGVEP.model.product;


import jakarta.persistence.*;
import lombok.*;
import utez.edu.mx.SIGVEP.model.category.CategoryBean;


@Entity
@Table(name = "producto")
@AllArgsConstructor
@NoArgsConstructor
@Builder(builderClassName = "Builder", toBuilder = true)
@ToString
public class ProductBean {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_producto;

    @Column(name = "clave", nullable = false)
    private String clave;

    @Column(name = "precio_unitario", nullable = false)
    private Double precio_unitario;

    @Column(name = "estatus", nullable = false)
    private Boolean estatus;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    private CategoryBean category;

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public Boolean getEstatus() {
        return estatus;
    }

    public void setEstatus(Boolean estatus) {
        this.estatus = estatus;
    }

    public Integer getId_producto() {
        return id_producto;
    }

    public void setId_producto(Integer id_producto) {
        this.id_producto = id_producto;
    }

    public Double getPrecio_unitario() {
        return precio_unitario;
    }

    public void setPrecio_unitario(Double precio_unitario) {
        this.precio_unitario = precio_unitario;
    }

    public CategoryBean getCategory() {
        return category;
    }

    public void setCategory(CategoryBean category) {
        this.category = category;
    }
}
