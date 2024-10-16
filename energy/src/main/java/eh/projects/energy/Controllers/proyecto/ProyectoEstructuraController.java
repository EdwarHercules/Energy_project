package eh.projects.energy.Controllers.proyecto;

import eh.projects.energy.Objects.ProyectoEstructuraDTO;
import eh.projects.energy.Services.ProyectoEstructuraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/proyectoEstructura")
public class ProyectoEstructuraController {

    @Autowired
    private ProyectoEstructuraService service;

    // Endpoint para obtener todas las personas
    @GetMapping
    public ResponseEntity<List<ProyectoEstructuraDTO>> getAll() {
        List<ProyectoEstructuraDTO> dto = service.getAll();
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // Endpoint para obtener por Id
    @GetMapping("/{id}")
    public ResponseEntity<ProyectoEstructuraDTO> getPerId(@PathVariable("id") Long id) {
        Optional<ProyectoEstructuraDTO> dto = service.getPerID(id);
        return dto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para crear un nuevo objeto
    @PostMapping("/{proyectoId}/estructuras/{estructuraId}")
    public ResponseEntity<ProyectoEstructuraDTO> agregarEstructuraAProyecto(
            @PathVariable Long proyectoId,
            @PathVariable Long estructuraId) {

        try {
            ProyectoEstructuraDTO nuevoProyectoEstructura = service.insertarEstructurasPorProyecto(proyectoId, estructuraId);
            return new ResponseEntity<>(nuevoProyectoEstructura, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Manejo de errores si no se encuentra el proyecto o la estructura
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/estructuras/{ProyectoId}")
    public ResponseEntity<List<ProyectoEstructuraDTO>> getAllPerProyecto(@PathVariable("ProyectoId") Long id){
        List<ProyectoEstructuraDTO> proyectoEstructuraDTOS = service.getAllPerProyecto(id);
        return new ResponseEntity<>(proyectoEstructuraDTOS,HttpStatus.OK);
    }

    // Endpoint para actualizar por id
    @PutMapping("/{id}")
    public ResponseEntity<ProyectoEstructuraDTO> updateId(@PathVariable("id") Long id, @RequestBody ProyectoEstructuraDTO dto) {
        ProyectoEstructuraDTO dtoresult = service.updateProyectoEstructuraDTO(id, dto);
        return dtoresult != null ?
                ResponseEntity.ok(dtoresult) :
                ResponseEntity.notFound().build();
    }

    // Endpoint para eliminar un ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteID(@PathVariable("id") Long id) {
        service.deleteId(id);
        return ResponseEntity.noContent().build();
    }


}
