package eh.projects.energy.Controllers.proyecto;

import eh.projects.energy.Objects.ProyectoDTO;
import eh.projects.energy.Services.ProyectoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/proyectos")
public class ProyectoController {

    @Autowired
    private ProyectoService proyectoService;

    // Endpoint para obtener todas las personas
    @GetMapping
    public ResponseEntity<List<ProyectoDTO>> getAll() {
        List<ProyectoDTO> proyectoDTOS = proyectoService.getAll();
        return new ResponseEntity<>(proyectoDTOS, HttpStatus.OK);
    }

    // Endpoint para obtener por Id
    @GetMapping("/{id}")
    public ResponseEntity<ProyectoDTO> getPerId(@PathVariable("id") Long id) {
        Optional<ProyectoDTO> proyectoDTOS = proyectoService.getPerID(id);
        return proyectoDTOS.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para actualizar por id
    @PutMapping("/{id}")
    public ResponseEntity<ProyectoDTO> updateId(@PathVariable("id") Long id, @RequestBody ProyectoDTO dto) {
        ProyectoDTO dtoresult = proyectoService.updateDTO(id, dto);
        return dtoresult != null ?
                ResponseEntity.ok(dtoresult) :
                ResponseEntity.notFound().build();
    }

    // Endpoint para eliminar un ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteID(@PathVariable("id") Long id) {
        proyectoService.deleteProyecto(id);
        return ResponseEntity.noContent().build();
    }

}
