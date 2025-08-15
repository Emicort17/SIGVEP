package utez.edu.mx.SIGVEP.model.sale;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Repository
public interface SaleRepository extends JpaRepository<SaleBean, Integer>{
    Optional<SaleBean> findById(Integer id);
    List<SaleBean> findByDateBetween(LocalDateTime start, LocalDateTime end);

}
