import React, { useState } from "react";
import { crearGeoPuntoManual } from "./geoPuntoService"; // Asegúrate de importar tu función de servicio adecuada
import { useAuth } from "../auth/AuthContext";
import "../../Styles/projectNew.css";

const CreateGeoPuntoManualModal = ({ onClose, onGeoPuntoCreated, proyectoId }) => {
    const { authData } = useAuth();
    const [geoPunto, setGeoPunto] = useState({
        descripcion: '',
        latitud: '',
        longitud: '',
        utm_x: '',
        utm_y: '',
        coordenadasTipo: 'geograficas' // Nuevo estado para tipo de coordenadas
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGeoPunto({ ...geoPunto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Enviando datos:", geoPunto);
        try {
            const geoPuntoDTO = {
                idProyecto: proyectoId,
                descripcion: geoPunto.descripcion,
                latitud: geoPunto.coordenadasTipo === 'geograficas' ? geoPunto.latitud : null,
                longitud: geoPunto.coordenadasTipo === 'geograficas' ? geoPunto.longitud : null,
                utm_x: geoPunto.coordenadasTipo === 'utm' ? geoPunto.utm_x : null,
                utm_y: geoPunto.coordenadasTipo === 'utm' ? geoPunto.utm_y : null,
            };
    
            await crearGeoPuntoManual(proyectoId, geoPuntoDTO, authData.token); // Envía el id del proyecto
            onGeoPuntoCreated(); // Llama a la función para actualizar la lista
            onClose(); // Cierra el modal
        } catch (error) {
            console.error('Error al crear el geoPunto:', error);
            setError('Error al crear el geoPunto: ' + (error.response?.data || error.message));
        }
    };
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Crear GeoPunto Manualmente</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Descripción</label>
                        <input 
                            type="text" 
                            name="descripcion" 
                            value={geoPunto.descripcion}
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>

                    <div>
                        <label>Tipo de Coordenadas</label>
                        <select
                            name="coordenadasTipo"
                            value={geoPunto.coordenadasTipo}
                            onChange={handleInputChange}
                        >
                            <option value="geograficas">Geográficas</option>
                            <option value="utm">Universales (UTM)</option>
                        </select>
                    </div>

                    {geoPunto.coordenadasTipo === 'geograficas' && (
                        <>
                            <div>
                                <label>Latitud</label>
                                <input className="numer-pts"
                                    type="number" 
                                    name="latitud" 
                                    placeholder="Latitud" 
                                    value={geoPunto.latitud} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div>
                                <label>Longitud</label>
                                <input className="numer-pts"
                                    type="number" 
                                    name="longitud" 
                                    placeholder="Longitud" 
                                    value={geoPunto.longitud} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                        </>
                    )}

                    {geoPunto.coordenadasTipo === 'utm' && (
                        <>
                            <div>
                                <label>UTM en X</label>
                                <input className="numer-pts"
                                    type="number" 
                                    name="utm_x" 
                                    placeholder="UTM X" 
                                    value={geoPunto.utm_x} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div>
                                <label>UTM en Y</label>
                                <input className="numer-pts"
                                    type="number" 
                                    name="utm_y" 
                                    placeholder="UTM Y" 
                                    value={geoPunto.utm_y} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                        </>
                    )}

                    <div className="acciones">
                        <button type="submit">Crear GeoPunto</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGeoPuntoManualModal;
