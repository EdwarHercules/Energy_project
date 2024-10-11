package eh.projects.energy.Repositories;

import eh.projects.energy.Entitys.Estructura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EstructurasRepository extends JpaRepository<Estructura, Long> {
    // 1. Obtener todas las categorías únicas
    @Query("SELECT DISTINCT e.categoria FROM Estructura e")
    List<String> findAllDistinctCategorias();

    // 2. Obtener todas las estructuras por una categoría específica
    @Query("SELECT e FROM Estructura e WHERE e.categoria = :categoria")
    List<Estructura> findByCategoria(@Param("categoria") String categoria);
}
