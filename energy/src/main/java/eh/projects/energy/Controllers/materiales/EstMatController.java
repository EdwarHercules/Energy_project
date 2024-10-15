package eh.projects.energy.Controllers.materiales;

import eh.projects.energy.Objects.EstMatDTO;
import eh.projects.energy.Services.EstMatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/estmat")
public class EstMatController {
    @Autowired
    private EstMatService estMatService;

    // Endpoint para obtener todas las personas
    @GetMapping
    public ResponseEntity<List<EstMatDTO>> getAll() {
        List<EstMatDTO> dto = estMatService.getAll();
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // Endpoint para obtener por Id
    @GetMapping("/{id}")
    public ResponseEntity<EstMatDTO> getPerId(@PathVariable("id") Long id) {
        Optional<EstMatDTO> dto = estMatService.getPerID(id);
        return dto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para obtener materiales por estructura id
    @GetMapping("/estructuras")
    public ResponseEntity<List<EstMatDTO>> getAllPerEstructuraID(@RequestParam Long id) {
        List<EstMatDTO> dto = estMatService.getAllPerEstructuras(id);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // Endpoint para actualizar por id
    @PutMapping("/{id}")
    public ResponseEntity<EstMatDTO> updateId(@PathVariable("id") Long id, @RequestBody EstMatDTO dto) {
        EstMatDTO dtoresult = estMatService.updateDTO(id, dto);
        return dtoresult != null ?
                ResponseEntity.ok(dtoresult) :
                ResponseEntity.notFound().build();
    }

    // Endpoint para eliminar un ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteID(@PathVariable("id") Long id) {
        estMatService.deleteId(id);
        return ResponseEntity.noContent().build();
    }

}
