package eh.projects.energy.Controllers.proyecto;

import eh.projects.energy.Objects.GeoPuntoDTO;
import eh.projects.energy.Objects.GeoPuntoEstructuraDTO;
import eh.projects.energy.Services.GeoPuntoEstructuraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/geopuntoEstructura")
public class GeoPuntoEstructuraController {

    @Autowired
    private GeoPuntoEstructuraService geoPuntoEstructuraService;

    // Obtener todos los geopuntos y estructuras
    @GetMapping
    public ResponseEntity<List<GeoPuntoEstructuraDTO>> getAll() {
        List<GeoPuntoEstructuraDTO> geopuntosEstructuras = geoPuntoEstructuraService.getAll();
        return ResponseEntity.ok(geopuntosEstructuras);
    }

    // Obtener geopunto y estructura por ID
    @GetMapping("/{id}")
    public ResponseEntity<GeoPuntoEstructuraDTO> getPerID(@PathVariable Long id) {
        Optional<GeoPuntoEstructuraDTO> geopuntoEstructura = geoPuntoEstructuraService.getPerID(id);
        return geopuntoEstructura.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null)); // Devuelve 404 si no se encuentra
    }


    @GetMapping("/proyecto/{id}")
    public ResponseEntity<List<GeoPuntoEstructuraDTO>> getAllPerProyecto(@PathVariable("id") Long id){
        List<GeoPuntoEstructuraDTO> dto = geoPuntoEstructuraService.getAllPerProyecto(id);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping("/geopunto/{geopuntoId}")
    public ResponseEntity<List<GeoPuntoEstructuraDTO>> getEstructurasPorGeopunto(@PathVariable Long geopuntoId) {
        List<GeoPuntoEstructuraDTO> estructuras = geoPuntoEstructuraService.getEstructurasPorGeopunto(geopuntoId);
        return ResponseEntity.ok(estructuras);
    }

    // Insertar estructura en geopunto
    @PostMapping("/{geoPuntoId}/estructura/{estructuraId}")
    public ResponseEntity<GeoPuntoEstructuraDTO> insertarEstructuraEnGeoPunto(
            @PathVariable Long geoPuntoId,
            @PathVariable Long estructuraId,
            @RequestParam String circuito) {

        GeoPuntoEstructuraDTO nuevaEstructura = geoPuntoEstructuraService.insertarEstructuraEnGeoPunto(geoPuntoId, estructuraId, circuito);
        return new ResponseEntity<>(nuevaEstructura, HttpStatus.CREATED);
    }

    // Actualizar geopunto estructura
    @PutMapping("/{id}")
    public ResponseEntity<GeoPuntoEstructuraDTO> updateGeoPuntoEstructuraDTO(
            @PathVariable Long id,
            @RequestBody GeoPuntoEstructuraDTO objectGeoPuntoEstructuraDTOupdate) {

        GeoPuntoEstructuraDTO updatedEstructura = geoPuntoEstructuraService.updateGeoPuntoEstructuraDTO(id, objectGeoPuntoEstructuraDTOupdate);
        return ResponseEntity.ok(updatedEstructura);
    }

    // Eliminar geopunto estructura por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteId(@PathVariable Long id) {
        geoPuntoEstructuraService.deleteId(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 No Content
    }
}
