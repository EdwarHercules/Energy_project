package eh.projects.energy.Repositories;

import eh.projects.energy.Entitys.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Rolrepository extends JpaRepository<Rol, Long> {
    Rol findByNombre(String role_user);

    List<Rol> findAllByNombreIn(List<String> nombres);

}
