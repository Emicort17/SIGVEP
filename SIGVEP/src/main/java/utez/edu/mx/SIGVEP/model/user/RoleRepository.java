package utez.edu.mx.SIGVEP.model.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<RoleBean, Integer> {
    Optional<RoleBean> findByName(String name);

}
