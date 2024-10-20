
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { obtenerGeoPuntosPorProyecto } from './geoPuntoService'; // Importa correctamente tu servicio
import { obtenerEstructurasPorGeoPunto } from './geoPuntoEstructuraService';
import { useAuth } from '../auth/AuthContext';
import { useParams } from 'react-router-dom';
import "../../Styles/Mapa.css";
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import PlanesModal from "../../Pages/Planes"; // Importa el componente de planes

const MapaGeoPuntos = () => {
    const [geoPuntos, setGeoPuntos] = useState([]);
    const [position, setPosition] = useState([0, 0]);
    const { authData } = useAuth();
    const { id } = useParams();
    const [estructuras, setEstructuras] = useState({});
    const [modalOpen, setModalOpen] = useState(false); // Estado para el modal de planes
    const rolesConEstructuras = ['ROLE_USER_PRUEBA', 'ROL_USER_ADMIN', 'ROL_USER_ADVANCED'];
    const rolesPermitidosParaMapa = [...rolesConEstructuras, 'ROL_USER_PREMIUM']; // Añade ROL_USER_PREMIUM

    // Crear un icono de marcador personalizado usando las imágenes de Leaflet
    const customMarkerIcon = new L.Icon({
        iconUrl: iconMarker,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    useEffect(() => {
        const fetchGeoPuntos = async () => {
            try {
                const puntos = await obtenerGeoPuntosPorProyecto(id, authData.token);
                setGeoPuntos(puntos);

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

    const handleMouseOver = async (geopuntoId) => {
        // Verifica si el usuario tiene un rol que le permita ver estructuras
        if (rolesConEstructuras.some(role => authData.roles.includes(role))) {
            try {
                const estructurasPorGeoPunto = await obtenerEstructurasPorGeoPunto(geopuntoId, authData.token);
                setEstructuras(prevState => ({ ...prevState, [geopuntoId]: estructurasPorGeoPunto }));
            } catch (error) {
                console.error('Error al obtener estructuras:', error);
            }
        }
    };

    // Verifica si el usuario tiene un rol que le permita ver el mapa
    const canViewMap = rolesPermitidosParaMapa.some(role => authData.roles.includes(role));

    useEffect(() => {
        if (!canViewMap) {
            setModalOpen(true); // Abre el modal si no tiene acceso
        }
    }, [canViewMap]);

    return (
        <>
            {canViewMap ? (
                <MapContainer 
                    center={position} 
                    zoom={5} 
                    style={{ height: '72vh', width: '41%', top: '16%', left: '35%', position: 'fixed' }}
                    maxZoom={24}
                    minZoom={0}
                >
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer checked name="Carreteras (OSM)">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Satélite (Mapbox)">
                            <TileLayer
                                url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2FyaGVybzY3OTkiLCJhIjoiY20yYjM0cjdjMDVxOTJrcHZ2M21iOGdhaCJ9.TTHGeMmv_IGdYpg_q-gaGA"
                                attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                                tileSize={512}
                                zoomOffset={-1}
                                maxZoom={24}
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Relieve (Mapbox)">
                            <TileLayer
                                url="https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2FyaGVybzY3OTkiLCJhIjoiY20yYjM0cjdjMDVxOTJrcHZ2M21iOGdhaCJ9.TTHGeMmv_IGdYpg_q-gaGA"
                                attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                                tileSize={512}
                                zoomOffset={-1}
                                maxZoom={24}
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>

                    {geoPuntos.map(geoPunto => (
                        <Marker 
                            key={geoPunto.id} 
                            position={[geoPunto.latitud, geoPunto.longitud]} 
                            icon={customMarkerIcon}
                            eventHandlers={{
                                mouseover: () => handleMouseOver(geoPunto.id)
                            }}
                        >
                            <Popup>
                                <div>
                                    <h3>{geoPunto.nombre}</h3>
                                    <h4>Estructuras:</h4>
                                    {rolesConEstructuras.some(role => authData.roles.includes(role)) ? ( // Cambia aquí para permitir acceso
                                        estructuras[geoPunto.id] ? (
                                            estructuras[geoPunto.id].map((estructura) => (
                                                <div key={estructura.id}>
                                                    <p><strong>{estructura.estructura.nombre}</strong> (Código: {estructura.estructura.codigo})</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>Adquiera un plan de pago para ver las estructuras en el punto.</p>
                                        )
                                    ) : (
                                        <div>
                                            <p>Si quieres ver las estructuras que hay en este punto adquiere el plan advanced.</p>
                                            <button onClick={() => setModalOpen(true)}>Ver Planes</button>
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            ) : null}

            <PlanesModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                onOpenTerms={() => console.log('Open terms')} // Puedes implementar esta función según tus necesidades
            />
        </>
    );
};

export default MapaGeoPuntos;
