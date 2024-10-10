package eh.projects.energy.Repositories;

import eh.projects.energy.Entitys.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {

    List<Proyecto> findByResponsableId(Long id);

}
