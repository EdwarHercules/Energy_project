package eh.projects.energy.Repositories;

import eh.projects.energy.Entitys.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Rolrepository extends JpaRepository<Rol, Long> {
    Rol findByNombre(String role_user);
}
