package eh.projects.energy.Repositories;

import eh.projects.energy.Entitys.Geopunto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GeoPuntoRepository extends JpaRepository<Geopunto, Long> {
    List<Geopunto> findByProyectoId(Long id);


}
