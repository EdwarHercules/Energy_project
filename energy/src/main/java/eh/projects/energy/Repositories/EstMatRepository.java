package eh.projects.energy.Repositories;

import eh.projects.energy.Entitys.EstMat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EstMatRepository extends JpaRepository<EstMat, Long> {

    List<EstMat> findByEstructuraId(Long id);
}
