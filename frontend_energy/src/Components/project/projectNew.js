import React, { useState } from "react";
import { crearProyecto } from "./projectService";
import { useAuth } from "../auth/AuthContext";
import "../../Styles/projectNew.css"

const CreateProjectModal = ({ onClose, onProjectCreated}) => {
    const { authData } = useAuth();
    const [proyecto, setProyecto] = useState({
        nombre: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'Activo'
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProyecto({ ...proyecto, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = authData.nombre;
            await crearProyecto(email, proyecto, authData.token);
            onProjectCreated();
            onClose();
        } catch (error) {
            setError('Error al crear el proyecto');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Crear Nuevo Proyecto</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nombre del proyecto</label>
                        <input type="text" name="nombre" value={proyecto.nombre} onChange={handleInputChange} required/>
                    </div>
                    <div>
                        <label>Descripcion</label>
                        <textarea name="descripcion" value={proyecto.descripcion} onChange={handleInputChange} required/>
                    </div>
                    <div>
                        <label>Fecha de Inicio</label>
                        <input type="date" name="fecha_inicio" value={proyecto.fecha_inicio} onChange={handleInputChange} required/>
                    </div>
                    <div>
                        <label>Fecha de Fin</label>
                        <input type="date" name="fecha_fin" value={proyecto.fecha_fin} onChange={handleInputChange}/>
                    </div>
                    <div>
                    <label>Estado:</label>
                        <select name="estado" value={proyecto.estado} onChange={handleInputChange}>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>                    
                    </div>
                    <div className="acciones">
                    <button type="submit">Crear Proyecto</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default CreateProjectModal;