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

    // Endpoint para conseguir los proyectos de un usuario
    @GetMapping("/responsable/{email}")
    public ResponseEntity<List<ProyectoDTO>> getProyectosByResponsable(@PathVariable String email) {
        List<ProyectoDTO> proyectos = proyectoService.getAllByResponsable(email);
        if (proyectos.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content si no hay proyectos
        }
        return ResponseEntity.ok(proyectos); // 200 OK con la lista de proyectos
    }

    // Endpoint para crear un proyecto nuevo
    @PostMapping
    public ResponseEntity<ProyectoDTO> createNewObject(@RequestParam String email, @RequestBody ProyectoDTO proyectoDTO){
        try{
            ProyectoDTO newProject = proyectoService.crearProyectoNuevoPorUsuario(email, proyectoDTO);
            return new ResponseEntity<>(newProject, HttpStatus.CREATED);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
