import JSZip from 'jszip';
import { kml } from '@tmcw/togeojson';

export const parseKMZ = async (kmzBlob) => {
    const kmz = new JSZip();
    const zipContent = await kmz.loadAsync(kmzBlob);
    const kmlFile = Object.keys(zipContent.files).find((filename) => filename.endsWith('.kml'));

    if (kmlFile) {
        const kmlContent = await zipContent.file(kmlFile).async('text');
        return parseKML(kmlContent); // Utiliza una función para parsear el KML a GeoJSON
    }

    throw new Error('No KML file found in KMZ');
};

export const parseKML = (kmlContent) => {
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlContent, 'application/xml');
    return kml(kmlDoc); // Convertir KML a GeoJSON
};
