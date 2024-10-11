package eh.projects.energy.Controllers.materiales;

import eh.projects.energy.Objects.EstructurasDTO;
import eh.projects.energy.Services.EstructurasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/estructura")
public class EstructuraController {
    @Autowired
    private EstructurasService estructurasService;

    // Endpoint para obtener todas las personas
    @GetMapping
    public ResponseEntity<List<EstructurasDTO>> getAll() {
        List<EstructurasDTO> dto = estructurasService.getAll();
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // Endpoint para obtener por Id
    @GetMapping("/{id}")
    public ResponseEntity<EstructurasDTO> getPerId(@PathVariable("id") Long id) {
        Optional<EstructurasDTO> dto = estructurasService.getPerID(id);
        return dto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<String>> getAllCategorias() {
        List<String> categorias = estructurasService.getAllCategorias();
        return new ResponseEntity<>(categorias, HttpStatus.OK);
    }

    @GetMapping("/estructuras")
    public ResponseEntity<List<EstructurasDTO>> getAllEstructurasPerCategoria(@RequestParam String categoria){
        List<EstructurasDTO> dtos = estructurasService.getAllEstructurasPerCategoria(categoria);
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    // Endpoint para actualizar por id
    @PutMapping("/{id}")
    public ResponseEntity<EstructurasDTO> updateId(@PathVariable("id") Long id, @RequestBody EstructurasDTO dto) {
        EstructurasDTO dtoresult = estructurasService.estructuraUpdate(id, dto);
        return dtoresult != null ?
                ResponseEntity.ok(dtoresult) :
                ResponseEntity.notFound().build();
    }

    // Endpoint para eliminar un ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteID(@PathVariable("id") Long id) {
        estructurasService.estructuraDelete(id);
        return ResponseEntity.noContent().build();
    }

}
