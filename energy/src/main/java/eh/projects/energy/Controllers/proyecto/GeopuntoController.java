package eh.projects.energy.Controllers.proyecto;

import eh.projects.energy.Objects.GeoPuntoDTO;
import eh.projects.energy.Services.GeoPuntoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/geopuntos")
public class GeopuntoController {

    @Autowired
    private GeoPuntoService geoPuntoService;

    // Endpoint para obtener todas las personas
    @GetMapping
    public ResponseEntity<List<GeoPuntoDTO>> getAll() {
        List<GeoPuntoDTO> dto = geoPuntoService.getAll();
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // Endpoint para obtener por Id
    @GetMapping("/{id}")
    public ResponseEntity<GeoPuntoDTO> getPerId(@PathVariable("id") Long id) {
        Optional<GeoPuntoDTO> dto = geoPuntoService.getPerID(id);
        return dto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/proyecto/{id}")
    public ResponseEntity<List<GeoPuntoDTO>> getAllPerProyecto(@PathVariable("id") Long id){
        List<GeoPuntoDTO> dto = geoPuntoService.getAllPerProyecto(id);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // Endpoint para crear un nuevo objeto
    @PostMapping
    public ResponseEntity<GeoPuntoDTO> createNewObject(@RequestParam Long id, @RequestBody GeoPuntoDTO dto) {
        try {
            GeoPuntoDTO newdto = geoPuntoService.crearProyectoNuevoPorUsuario(id, dto);
            return new ResponseEntity<>(newdto, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoint para actualizar por id
    @PutMapping("/{id}")
    public ResponseEntity<GeoPuntoDTO> updateId(@PathVariable("id") Long id, @RequestBody GeoPuntoDTO dto) {
        GeoPuntoDTO dtoresult = geoPuntoService.updateDTO(id, dto);
        return dtoresult != null ?
                ResponseEntity.ok(dtoresult) :
                ResponseEntity.notFound().build();
    }

    // Endpoint para eliminar un ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteID(@PathVariable("id") Long id) {
        geoPuntoService.deleteId(id);
        return ResponseEntity.noContent().build();
    }

}
