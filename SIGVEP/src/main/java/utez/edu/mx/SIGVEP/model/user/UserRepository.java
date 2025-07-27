package utez.edu.mx.SIGVEP.model.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<UserBean, Integer> {
    Optional<UserBean> findByEmail(String email);
    Optional<UserBean> findByTelephone(String telephone);
    boolean existsByRoleName(String roleName);
    List<UserBean> findAllByOrderByIdAsc();
    boolean existsByEmail(String email);
    boolean existsByTelephone(String telephone);

}
