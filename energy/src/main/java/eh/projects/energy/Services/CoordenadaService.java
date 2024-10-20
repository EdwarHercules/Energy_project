package eh.projects.energy.Services;

import org.locationtech.proj4j.CRSFactory;
import org.locationtech.proj4j.CoordinateReferenceSystem;
import org.locationtech.proj4j.CoordinateTransform;
import org.locationtech.proj4j.CoordinateTransformFactory;
import org.locationtech.proj4j.ProjCoordinate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class CoordenadaService {

    private CoordinateTransform transform;
    private CoordinateTransform geoToUTMTransform;


    public CoordenadaService() {
        // Crear el sistema de referencia geográfica y el de UTM
        CRSFactory crsFactory = new CRSFactory();
        CoordinateReferenceSystem geoCRS = crsFactory.createFromName("EPSG:4326"); // WGS84
        CoordinateReferenceSystem utmCRS = crsFactory.createFromName("EPSG:32616"); // UTM Zona 33N, ajusta el código para tu zona específica

        CoordinateTransformFactory ctFactory = new CoordinateTransformFactory();
        transform = ctFactory.createTransform(geoCRS, utmCRS);
        geoToUTMTransform = ctFactory.createTransform(utmCRS, geoCRS); // Inicializa correctamente este transformador

    }

    public ProjCoordinate convertirGeograficaAUTM(BigDecimal latitud, BigDecimal longitud) {
        // Convertir BigDecimal a double
        double latitudDouble = latitud.doubleValue();
        double longitudDouble = longitud.doubleValue();

        // Crear coordenadas geográficas con los valores double
        ProjCoordinate coordGeografica = new ProjCoordinate(longitudDouble, latitudDouble); // longitud, latitud (orden importante)
        ProjCoordinate coordUTM = new ProjCoordinate();

        // Realizar la conversión de geográfica a UTM
        transform.transform(coordGeografica, coordUTM);

        return coordUTM; // Retorna el valor convertido (x, y en UTM)
    }


    /**
     * Convierte coordenadas UTM a geográficas (latitud y longitud).
     */
    public ProjCoordinate convertirUTMAGeografica(BigDecimal utmX, BigDecimal utmY) {
        // Convertir BigDecimal a double
        double utmXDouble = utmX.doubleValue();
        double utmYDouble = utmY.doubleValue();

        // Crear coordenadas UTM (orden: x, y)
        ProjCoordinate coordUTM = new ProjCoordinate(utmXDouble, utmYDouble);
        ProjCoordinate coordGeografica = new ProjCoordinate();

        // Realizar la conversión de UTM a geográfica
        geoToUTMTransform.transform(coordUTM, coordGeografica);

        return coordGeografica; // Retorna el valor convertido (longitud, latitud)
    }
}
