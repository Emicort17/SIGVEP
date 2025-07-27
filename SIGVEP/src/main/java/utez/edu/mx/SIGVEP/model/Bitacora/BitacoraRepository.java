package utez.edu.mx.SIGVEP.model.Bitacora;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BitacoraRepository extends JpaRepository<BitacoraBean, Long> {
    List<BitacoraBean> findByOrderByIdDesc();
}
