import React, { useEffect, useState } from "react";
import { actualizarProyecto, obtenerProyectoPorId } from "./projectService";
import { useAuth } from "../auth/AuthContext";

const EditProjectModal = ({ onClose, onProjectUpdated, projectId }) => {
    const { authData } = useAuth();
    const [proyecto, setProyecto] = useState({
        nombre: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'Activo'
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const projectData = await obtenerProyectoPorId(projectId, authData.token);
                setProyecto(projectData);
            } catch (error) {
                setError('Error al cargar el proyecto');
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId, authData.token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProyecto({ ...proyecto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actualizarProyecto(projectId, proyecto, authData.token);
            onProjectUpdated(proyecto); // Llama a onProjectUpdated con el proyecto actualizado
            onClose();
        } catch (error) {
            setError('Error al editar el proyecto');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Editar Proyecto</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nombre del proyecto</label>
                        <input type="text" name="nombre" value={proyecto.nombre} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Descripcion</label>
                        <textarea name="descripcion" value={proyecto.descripcion} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Fecha de Inicio</label>
                        <input type="date" name="fecha_inicio" value={proyecto.fecha_inicio} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label>Fecha de Fin</label>
                        <input type="date" name="fecha_fin" value={proyecto.fecha_fin} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Estado:</label>
                        <select name="estado" value={proyecto.estado} onChange={handleInputChange}>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                    <button type="submit">Actualizar Proyecto</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default EditProjectModal;
