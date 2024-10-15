package eh.projects.energy.Controllers.proyecto;

import eh.projects.energy.Objects.ProyectoMaterialDTO;

import eh.projects.energy.Services.ProyectoMaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/proyectoMaterial")
public class ProyectoMaterialController {

    @Autowired
    private ProyectoMaterialService proyectoMaterialService;

    // Endpoint para obtener todas las personas
    @GetMapping
    public ResponseEntity<List<ProyectoMaterialDTO>> getAll() {
        List<ProyectoMaterialDTO> dto = proyectoMaterialService.getAll();
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // Endpoint para obtener por Id
    @GetMapping("/{id}")
    public ResponseEntity<ProyectoMaterialDTO> getPerId(@PathVariable("id") Long id) {
        Optional<ProyectoMaterialDTO> dto = proyectoMaterialService.getPerID(id);
        return dto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/materiales/{proyectoId}")
    public ResponseEntity<List<ProyectoMaterialDTO>> obtenerTodosLosMaterialesPorProyecto(@PathVariable("proyectoId") Long id){
        List<ProyectoMaterialDTO> proyectoMaterialDTOS = proyectoMaterialService
                .getAllPerProyect(id);
        return new ResponseEntity<>(proyectoMaterialDTOS, HttpStatus.OK);
    }

    //Endpoint para obtener todos los materiales distintos
    @GetMapping("/{proyectoId}/materiales/distinctos")
    public ResponseEntity<List<ProyectoMaterialDTO>> obtenerMaterialesDistinctosPorProyecto(
            @PathVariable Long proyectoId) {
        // Llamada al servicio para obtener los materiales distintos por proyecto
        List<ProyectoMaterialDTO> materialesDistinctos = proyectoMaterialService.getAllDistinctPerProyecto(proyectoId);

        // Retornar el resultado
        if (materialesDistinctos.isEmpty()) {
            return ResponseEntity.noContent().build(); // Retornar 204 si no hay materiales
        }

        return ResponseEntity.ok(materialesDistinctos); // Retornar 200 con la lista de materiales
    }

    // Endpoint para crear un nuevo objeto
    @PostMapping("/{proyectoId}/estructuras/{estructuraId}/materiales")
    public ResponseEntity<?> insertarMaterialesPorEstructuraEnProyecto(
            @PathVariable Long proyectoId,
            @PathVariable Long estructuraId,
            @RequestParam String voltaje) {

        // Llamada al servicio para insertar materiales
        ProyectoMaterialDTO resultado = proyectoMaterialService.insertarMaterialesPorEstructuraEnProyecto(proyectoId, estructuraId, voltaje);

        // Retornar el resultado con un código de estado 201 (CREATED)
        return new ResponseEntity<>(resultado, HttpStatus.CREATED);
    }

    // Endpoint para actualizar por id
    @PutMapping("/{id}")
    public ResponseEntity<ProyectoMaterialDTO> updateId(@PathVariable("id") Long id, @RequestBody ProyectoMaterialDTO dto) {
        ProyectoMaterialDTO dtoresult = proyectoMaterialService.updateProyectoMaterialDTO(id, dto);
        return dtoresult != null ?
                ResponseEntity.ok(dtoresult) :
                ResponseEntity.notFound().build();
    }

    // Endpoint para eliminar un ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteID(@PathVariable("id") Long id) {
        proyectoMaterialService.deleteId(id);
        return ResponseEntity.noContent().build();
    }

}
