import React, { useState, useEffect } from "react";
import { crearGeoPunto } from "./geoPuntoService";
import { useAuth } from "../auth/AuthContext";
import "../../Styles/projectNew.css";

const CreateGeoPuntoModal = ({ onClose, onGeoPuntoCreated, proyectoId }) => {
    const { authData } = useAuth();
    const [geoPunto, setGeoPunto] = useState({
        descripcion: '',
        latitud: '',
        longitud: ''
    });
    const [error, setError] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true); // Estado de carga de la ubicación
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado de envío del formulario

    useEffect(() => {
        // Solicitar la ubicación del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setGeoPunto((prev) => ({
                        ...prev,
                        latitud: position.coords.latitude,
                        longitud: position.coords.longitude
                    }));
                    setIsLoadingLocation(false); // Se termina la carga de la ubicación
                },
                (error) => {
                    setError('No se pudo obtener la ubicación: ' + error.message);
                    setIsLoadingLocation(false); // Mostrar el error pero dejar de cargar
                }
            );
        } else {
            setError('Geolocalización no es soportada por este navegador.');
            setIsLoadingLocation(false); // Termina la carga en caso de error
        }
    }, []); // Solo se ejecuta una vez al montar el componente

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGeoPunto({ ...geoPunto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Inicia el estado de envío
        try {
            const geoPuntoDTO = {
                idProyecto: proyectoId,
                descripcion: geoPunto.descripcion,
                latitud: geoPunto.latitud,
                longitud: geoPunto.longitud
            };

            await crearGeoPunto(proyectoId, geoPuntoDTO, authData.token); // Envía el id del proyecto
            onGeoPuntoCreated(); // Llama a la función para actualizar la lista
            onClose(); // Cierra el modal
        } catch (error) {
            setError('Error al crear el geoPunto: ' + (error.response?.data || error.message));
        } finally {
            setIsSubmitting(false); // Termina el estado de envío
        }
    };

    return (
        <div className="modal-punto">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Crear Nuevo GeoPunto</h2>
                {error && <p className="error">{error}</p>}
                {isLoadingLocation ? (
                    <p>Cargando ubicación...</p> // Indicador de carga mientras se obtiene la ubicación
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Descripción</label>
                            <input 
                                type="text" 
                                name="descripcion" 
                                placeholder="Descripción" 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div className="acciones">
                            <button type="submit" disabled={isSubmitting || isLoadingLocation}>
                                {isSubmitting ? "Creando..." : "Crear GeoPunto"}
                            </button>
                            <button type="button" onClick={onClose}>Cancelar</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );    
};

export default CreateGeoPuntoModal;
