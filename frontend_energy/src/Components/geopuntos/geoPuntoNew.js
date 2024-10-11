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
                },
                (error) => {
                    setError('No se pudo obtener la ubicación: ' + error.message);
                }
            );
        } else {
            setError('Geolocalización no es soportada por este navegador.');
        }
    }, []); // Solo se ejecuta una vez al montar el componente

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGeoPunto({ ...geoPunto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Crear Nuevo GeoPunto</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="descripcion" 
                        placeholder="Descripción" 
                        onChange={handleInputChange} 
                        required 
                    />
                    <button type="submit">Crear GeoPunto</button>
                </form>
            </div>
        </div>
    );
};

export default CreateGeoPuntoModal;
