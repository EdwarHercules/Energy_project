package eh.projects.energy.Controllers.mapa;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/circuitos")
public class CircuitosController {

    private final ResourceLoader resourceLoader;

    public CircuitosController(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @GetMapping("/kmz")
    public ResponseEntity<Resource> getCircuitos() {
        try {
            // Cargar el archivo KMZ desde el directorio resources
            Resource resource = resourceLoader.getResource("classpath:mapa/CIRCUITOS A NIVEL NACIONAL 02_2024.kmz");

            // Configurar los encabezados de la respuesta
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=CIRCUITOS_A_NIVEL_NACIONAL_02_2024.kmz");
            headers.add(HttpHeaders.CONTENT_TYPE, "application/vnd.google-earth.kmz");

            return new ResponseEntity<>(resource, headers, HttpStatus.OK);
        } catch (Exception e) {
            // Manejo de excepciones
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}