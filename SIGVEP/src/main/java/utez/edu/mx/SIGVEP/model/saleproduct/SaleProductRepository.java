package utez.edu.mx.SIGVEP.model.saleproduct;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleProductRepository extends JpaRepository<SaleProductBean, Long> {

}
