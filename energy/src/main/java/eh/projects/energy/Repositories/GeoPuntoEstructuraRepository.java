package eh.projects.energy.Repositories;

import eh.projects.energy.Entitys.GeopuntoEstructura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GeoPuntoEstructuraRepository extends JpaRepository<GeopuntoEstructura, Long> {

    List<GeopuntoEstructura> findByProyectoId(Long id);

    List<GeopuntoEstructura> findByGeopuntoId(Long geopuntoId);

}
