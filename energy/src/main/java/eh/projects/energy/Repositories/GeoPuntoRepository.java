package eh.projects.energy.Repositories;

import eh.projects.energy.Entitys.Geopunto;
import eh.projects.energy.Entitys.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GeoPuntoRepository extends JpaRepository<Geopunto, Long> {
    List<Geopunto> findByProyectoId(Long id);


    long countByProyecto(Proyecto proyecto);

    List<Geopunto> findByProyectoAndNombreIsNull(Proyecto proyecto);

    // Método para obtener todos los puntos geográficos de un proyecto
    List<Geopunto> findByProyecto(Proyecto proyecto);
}
