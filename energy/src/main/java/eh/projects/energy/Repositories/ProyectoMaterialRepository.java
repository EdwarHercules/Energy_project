package eh.projects.energy.Repositories;

import eh.projects.energy.Entitys.ProyectoMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProyectoMaterialRepository extends JpaRepository<ProyectoMaterial, Long> {

    List<ProyectoMaterial> findByProyectoId(Long id);
}
