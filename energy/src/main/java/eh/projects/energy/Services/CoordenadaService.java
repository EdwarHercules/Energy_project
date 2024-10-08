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

    public CoordenadaService() {
        // Crear el sistema de referencia geográfica y el de UTM
        CRSFactory crsFactory = new CRSFactory();
        CoordinateReferenceSystem geoCRS = crsFactory.createFromName("EPSG:4326"); // WGS84
        CoordinateReferenceSystem utmCRS = crsFactory.createFromName("EPSG:32633"); // UTM Zona 33N, ajusta el código para tu zona específica

        CoordinateTransformFactory ctFactory = new CoordinateTransformFactory();
        transform = ctFactory.createTransform(geoCRS, utmCRS);
    }

    public ProjCoordinate convertirGeograficaAUTM(BigDecimal latitud, BigDecimal longitud) {
        ProjCoordinate coordGeografica = new ProjCoordinate(longitud, latitud); // longitud, latitud (orden importante)
        ProjCoordinate coordUTM = new ProjCoordinate();

        // Realizar la conversión de geográfica a UTM
        transform.transform(coordGeografica, coordUTM);

        return coordUTM; // Retorna el valor convertido (x, y en UTM)
    }
}
