package utez.edu.mx.SIGVEP.model.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductBean, Integer> {
    List<ProductBean> findAllByOrderByIdAsc();
}
