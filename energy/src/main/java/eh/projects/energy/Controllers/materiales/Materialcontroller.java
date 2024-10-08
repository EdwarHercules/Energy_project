package eh.projects.energy.Controllers.materiales;

import eh.projects.energy.Objects.MaterialDTO;
import eh.projects.energy.Services.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/material")
public class Materialcontroller {
    @Autowired
    private MaterialService materialService;

    // Endpoint para obtener todas las personas
    @GetMapping
    public ResponseEntity<List<MaterialDTO>> getAll() {
        List<MaterialDTO> dto = materialService.getAll();
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // Endpoint para obtener por Id
    @GetMapping("/{id}")
    public ResponseEntity<MaterialDTO> getPerId(@PathVariable("id") Long id) {
        Optional<MaterialDTO> dto = materialService.getPerID(id);
        return dto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para actualizar por id
    @PutMapping("/{id}")
    public ResponseEntity<MaterialDTO> updateId(@PathVariable("id") Long id, @RequestBody MaterialDTO dto) {
        MaterialDTO dtoresult = materialService.materialupdateDTO(id, dto);
        return dtoresult != null ?
                ResponseEntity.ok(dtoresult) :
                ResponseEntity.notFound().build();
    }

    // Endpoint para eliminar un ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteID(@PathVariable("id") Long id) {
        materialService.materialDelete(id);
        return ResponseEntity.noContent().build();
    }

}
