package eh.projects.energy.Controllers.proyecto;
import eh.projects.energy.Services.ExcelExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;


@RestController
@RequestMapping("/api/excel")
public class ExcelExportController {

    @Autowired
    private ExcelExportService excelExportService;

    @GetMapping("/descargar/{proyectoId}")
    public ResponseEntity<byte[]> downloadExcel(@PathVariable Long proyectoId) {
        ByteArrayOutputStream byteArrayOutputStream = excelExportService.generateExcel(proyectoId);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=proyecto_" + proyectoId + ".xlsx");

        return new ResponseEntity<>(byteArrayOutputStream.toByteArray(), headers, HttpStatus.OK);
    }
}
