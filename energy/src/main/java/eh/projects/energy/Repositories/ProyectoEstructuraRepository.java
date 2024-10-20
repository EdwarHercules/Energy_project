package eh.projects.energy.Repositories;

import eh.projects.energy.Entitys.ProyectoEstructura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProyectoEstructuraRepository extends JpaRepository<ProyectoEstructura, Long> {

    List<ProyectoEstructura> findByProyectoId(Long id);
}
