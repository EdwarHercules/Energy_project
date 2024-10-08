package eh.projects.energy.Repositories;

import eh.projects.energy.Entitys.Material;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository extends JpaRepository<Material, Long> {
}
