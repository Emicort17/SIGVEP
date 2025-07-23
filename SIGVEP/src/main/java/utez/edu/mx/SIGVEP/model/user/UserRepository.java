package utez.edu.mx.SIGVEP.model.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<UserBean, Integer> {
    Optional<UserBean> findByEmail(String email);
    boolean existsByRoleName(String roleName);


}
