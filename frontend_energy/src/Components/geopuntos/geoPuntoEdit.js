import React, { useEffect, useState } from "react";
import { actualizarGeoPunto, obtenerGeoPuntoPorId } from "./geoPuntoService";
import { useAuth } from "../auth/AuthContext";

const EditProjectModal = ({ onClose, onGeoPuntoUpdated, geoPuntoId }) => {
    const { authData } = useAuth();
    const [geoPunto, setGeoPunto] = useState({
        descripcion: '',
        latitud: '',
        longitud: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGeoPunto = async () => {
            try {
                const projectData = await obtenerGeoPuntoPorId(geoPuntoId, authData.token);
                setGeoPunto(projectData);
            } catch (error) {
                setError('Error al cargar el geoPunto');
            }
        };

        if (geoPuntoId) {
            fetchGeoPunto();
        }
    }, [geoPuntoId, authData.token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGeoPunto({ ...geoPunto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actualizarGeoPunto(geoPuntoId, geoPunto, authData.token);
            onGeoPuntoUpdated(geoPunto); // Llama a onGeoPuntoUpdated con el geoPunto actualizado
            onClose();
        } catch (error) {
            setError('Error al editar el geoPunto');
        }
    };

    return (
        <div className="moda-edit-punto">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Editar Proyecto</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Descripcion</label>
                        <textarea name="descripcion" value={geoPunto.descripcion} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Latitud</label>
                        <input type="text" name="latitud" value={geoPunto.latitud} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Longitud</label>
                        <input type="text" name="longitud" value={geoPunto.longitud} onChange={handleInputChange} />
                    </div>
                    <div className="buttons-edit">
                    <button type="submit">Actualizar Proyecto</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProjectModal;
