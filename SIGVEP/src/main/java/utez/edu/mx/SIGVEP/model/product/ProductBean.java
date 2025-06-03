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
    @Column(name = "id_producto", nullable = false)
    private Integer id_product;

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

    public CategoryBean getCategory() {
        return category;
    }

    public void setCategory(CategoryBean category) {
        this.category = category;
    }

    public Double getUnit_price() {
        return unit_price;
    }

    public void setUnit_price(Double unit_price) {
        this.unit_price = unit_price;
    }

    public Long getStock() {
        return stock;
    }

    public void setStock(Long stock) {
        this.stock = stock;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getId_product() {
        return id_product;
    }

    public void setId_product(Integer id_producto) {
        this.id_product = id_producto;
    }
}
