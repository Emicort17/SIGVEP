package utez.edu.mx.SIGVEP.model.Bitacora;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BitacoraRepository extends JpaRepository<BitacoraBean, Long> {

}
