import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { obtenerGeoPuntosPorProyecto } from './geoPuntoService'; // Asegúrate de importar correctamente tu servicio
import { useAuth } from '../auth/AuthContext'; // Importa tu hook de autenticación
import { useParams } from 'react-router-dom'; // Para obtener el id del proyecto
import "../../Styles/Mapa.css";

const MapaGeoPuntos = () => {
  const [geoPuntos, setGeoPuntos] = useState([]);
  const [position, setPosition] = useState([0, 0]); // Posición inicial
  const { authData } = useAuth(); // Obtener el token del usuario autenticado
  const { id } = useParams(); // Obtener el id del proyecto desde los parámetros de la URL

  // Obtener los puntos geográficos por proyecto
  useEffect(() => {
    const fetchGeoPuntos = async () => {
      try {
        const puntos = await obtenerGeoPuntosPorProyecto(id, authData.token); // Usa el id del proyecto y el token
        setGeoPuntos(puntos);
        
        // Establecer la posición del mapa en base a los puntos obtenidos
        if (puntos.length > 0) {
          const latitudes = puntos.map(p => p.latitud);
          const longitudes = puntos.map(p => p.longitud);
          const avgLat = latitudes.reduce((a, b) => a + b) / latitudes.length;
          const avgLng = longitudes.reduce((a, b) => a + b) / longitudes.length;
          setPosition([avgLat, avgLng]);
        }
      } catch (error) {
        console.error('Error al cargar los puntos geográficos:', error);
      }
    };

    fetchGeoPuntos();
  }, [id, authData.token]);

  return (
    <MapContainer 
  center={position} 
  zoom={5} // Zoom inicial
  style={{ height: '72vh', width: '41%', top: '16%', left:'35%', position:'fixed' }}
  maxZoom={24} // Aumenta el zoom máximo permitido
  minZoom={0}  // Establece un zoom mínimo si es necesario
>
  <LayersControl position="topright">
    {/* Mapa de carreteras (OpenStreetMap) */}
    <LayersControl.BaseLayer checked name="Carreteras (OSM)">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </LayersControl.BaseLayer>

    {/* Mapa satelital de Mapbox */}
    <LayersControl.BaseLayer name="Satélite (Mapbox)">
        <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2FyaGVybzY3OTkiLCJhIjoiY20yYjM0cjdjMDVxOTJrcHZ2M21iOGdhaCJ9.TTHGeMmv_IGdYpg_q-gaGA`}
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
        tileSize={512} // Mantén esto para alta resolución
        zoomOffset={-1}
        maxZoom={24} // Zoom más alto si los tiles lo permiten
        />

    </LayersControl.BaseLayer>

    {/* Mapa de relieve (outdoors de Mapbox) */}
    <LayersControl.BaseLayer name="Relieve (Mapbox)">
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2FyaGVybzY3OTkiLCJhIjoiY20yYjM0cjdjMDVxOTJrcHZ2M21iOGdhaCJ9.TTHGeMmv_IGdYpg_q-gaGA`}
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
        tileSize={512} // Tamaño del tile para renderizar a mayores niveles de zoom
        zoomOffset={-1} // Ajusta el offset para permitir zoom alto
        maxZoom={24} // Zoom máximo
      />
    </LayersControl.BaseLayer>
  </LayersControl>

  {/* Marcadores de puntos geográficos */}
  {geoPuntos.map((punto) => (
    <Marker
      key={punto.id}
      position={[punto.latitud, punto.longitud]}
      icon={new L.Icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })}
    >
      <Popup>
        <strong>{punto.nombre}</strong><br />
        {punto.descripcion}
      </Popup>
    </Marker>
  ))}
</MapContainer>

  );
};

export default MapaGeoPuntos;
