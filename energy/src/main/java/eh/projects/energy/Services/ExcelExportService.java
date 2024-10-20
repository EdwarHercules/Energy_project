package eh.projects.energy.Services;

import eh.projects.energy.Entitys.GeopuntoEstructura;
import eh.projects.energy.Objects.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class ExcelExportService {
    private static final Logger logger = LoggerFactory.getLogger(ExcelExportService.class);


    @Autowired
    private GeoPuntoService geoPuntoService;

    @Autowired
    private ProyectoEstructuraService proyectoEstructuraService;

    @Autowired
    private ProyectoMaterialService proyectoMaterialService;

    @Autowired
    private GeoPuntoEstructuraService geoPuntoEstructuraService ;

    public ByteArrayOutputStream generateExcel(Long proyectoId) {


        Workbook workbook = new XSSFWorkbook(); // Crear un nuevo libro de trabajo

        // Hoja 1 - Lista de Puntos
        Sheet puntosSheet = workbook.createSheet("Puntos Geograficos");
        createHeaderRow(puntosSheet, new String[]{"ID", "Nombre", "Descripción", "Latitud", "Longitud", "UTM X", "UTM Y"});
        List<GeoPuntoDTO> puntos = geoPuntoService.getAllPerProyecto(proyectoId);
        int rowNum = 1;
        for (GeoPuntoDTO punto : puntos) {
            Row row = puntosSheet.createRow(rowNum++);
            row.createCell(0).setCellValue(punto.getId());
            row.createCell(1).setCellValue(punto.getNombre());
            row.createCell(2).setCellValue(punto.getDescripcion());
            row.createCell(3).setCellValue(String.valueOf(punto.getLatitud()));
            row.createCell(4).setCellValue(String.valueOf(punto.getLongitud()));
            row.createCell(4).setCellValue(String.valueOf(punto.getUtm_x()));
            row.createCell(4).setCellValue(String.valueOf(punto.getUtm_y()));
        }

        // Hoja 2 - Lista de Estructuras por Proyecto
        Sheet estructurasSheet = workbook.createSheet("Estructuras");
        createHeaderRow(estructurasSheet, new String[]{"ID", "Cantidad", "Proyecto", "Estructura", "Nombre de Estructura"});
        List<ProyectoEstructuraDTO> estructuras = proyectoEstructuraService.getAllPerProyecto(proyectoId);
        rowNum = 1;
        for (ProyectoEstructuraDTO estructura : estructuras) {
            Row row = estructurasSheet.createRow(rowNum++);
            row.createCell(0).setCellValue(estructura.getId());
            row.createCell(1).setCellValue(estructura.getCantidad());
            row.createCell(2).setCellValue(estructura.getProyecto().getNombre()); // Asumiendo que tienes un método para obtener el nombre del proyecto
            row.createCell(3).setCellValue(estructura.getEstructura().getCodigo());
            row.createCell(4).setCellValue(estructura.getEstructura().getNombre());
        }

        // Hoja 3 - Lista de Materiales por Proyecto
        Sheet materialesSheet = workbook.createSheet("Materiales");
        createHeaderRow(materialesSheet, new String[]{"ID", "Codigo de Material","Material", "Cantidad", "Unidad"});
        List<ProyectoMaterialDTO> materiales = proyectoMaterialService.getAllPerProyect(proyectoId);
        rowNum = 1;
        for (ProyectoMaterialDTO material : materiales) {
            Row row = materialesSheet.createRow(rowNum++);
            row.createCell(0).setCellValue(material.getId());
            row.createCell(1).setCellValue(material.getMaterial().getCodigo()); // Asumiendo que tienes un método para obtener el nombre del material
            row.createCell(2).setCellValue(material.getMaterial().getNombre()); // Asumiendo que tienes un método para obtener el nombre del material
            row.createCell(3).setCellValue(material.getUnidad());
            row.createCell(4).setCellValue(material.getCantidad());
        }

        // Hoja 4 - Lista del Total de Materiales por Proyecto
        Sheet totalMaterialesSheet = workbook.createSheet("Total de Materiales");
        createHeaderRow(totalMaterialesSheet, new String[]{"Material", "Cantidad Total"});
        List<ProyectoMaterialDTO> totalMateriales = proyectoMaterialService.getAllDistinctPerProyecto(proyectoId);
        rowNum = 1;
        for (ProyectoMaterialDTO totalMaterial : totalMateriales) {
            Row row = totalMaterialesSheet.createRow(rowNum++);
            row.createCell(0).setCellValue(totalMaterial.getMaterial().getNombre());
            row.createCell(1).setCellValue(totalMaterial.getCantidad());
        }

        // Hoja 5 - Lista de Estructuras Por Punto Por Proyecto
        Sheet estructurasPuntosSheet = workbook.createSheet("Estructuras en Puntos");
        createHeaderRow(estructurasPuntosSheet, new String[]{"ID", "Proyecto", "Punto", "UTM X", "UTM Y", "Estructura", "Nombre de Estructura", "Circuito"});

        // Obtener datos
        List<GeoPuntoEstructuraDTO> estructuraDTOS = geoPuntoEstructuraService.getAllPerProyecto(proyectoId);

        // Log para verificar si se obtienen datos
        logger.info("Número de Estructuras en Puntos obtenidas: {}", estructuraDTOS.size());
        rowNum = 1;

        for (GeoPuntoEstructuraDTO geoPuntoEstructuraDTO : estructuraDTOS) {
            Row row = estructurasPuntosSheet.createRow(rowNum++);
            row.createCell(0).setCellValue(geoPuntoEstructuraDTO.getId());
            row.createCell(1).setCellValue(geoPuntoEstructuraDTO.getProyecto().getNombre());
            row.createCell(2).setCellValue(geoPuntoEstructuraDTO.getGeopunto().getNombre());
            row.createCell(3).setCellValue(String.valueOf(geoPuntoEstructuraDTO.getGeopunto().getUtm_x()));
            row.createCell(4).setCellValue(String.valueOf(geoPuntoEstructuraDTO.getGeopunto().getUtm_y()));
            row.createCell(5).setCellValue(geoPuntoEstructuraDTO.getEstructura().getCodigo());
            row.createCell(6).setCellValue(geoPuntoEstructuraDTO.getEstructura().getNombre());
            row.createCell(7).setCellValue(geoPuntoEstructuraDTO.getCircuito());
        }

        // Comprobar si se añadieron filas
        logger.info("Número de filas añadidas en la hoja 'Estructuras en Puntos': {}", rowNum - 1);

        // Escribir el archivo a un ByteArrayOutputStream
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            workbook.write(outputStream);
            return outputStream; // Retornar el flujo de salida
        } catch (Exception e) {
            e.printStackTrace(); // Manejo de errores
            throw new RuntimeException("Error al generar el archivo Excel", e);
        } finally {
            try {
                workbook.close(); // Cerrar el libro de trabajo
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void createHeaderRow(Sheet sheet, String[] headers) {
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            headerRow.createCell(i).setCellValue(headers[i]);
        }
    }
}
