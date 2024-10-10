import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { obtenerProyectosPorUsuario, eliminarProyecto } from "./projectService";
import CreateProjectModal from "./projectNew";
import EditProjectModal from "./projectEdit";

const ProjectUser = () => {
    const { authData } = useAuth();
    const [proyectos, setProyecto] = useState([]);
    const [editingProyecto, setEditingProyecto] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // Para el modal de edición

    useEffect(() => {
        if (authData.token && authData.nombre) {
            obtenerProyectosPorUsuario(authData.nombre, authData.token)
                .then(data => {
                    setProyecto(data);
                })
                .catch(error => {
                    console.error('Error al obtener los proyectos', error);
                });
        }
    }, [authData.token, authData.nombre]);

    const handleEliminar = async (id) => {
        try {
            await eliminarProyecto(id, authData.token);
            setProyecto(proyectos.filter(proyecto => proyecto.id !== id));
        } catch (error) {
            console.error('Error al eliminar el proyecto: ', error);
        }
    };

    const handleProjectCreated = () => {
        if (authData.token && authData.nombre) {
            obtenerProyectosPorUsuario(authData.nombre, authData.token)
                .then(data => setProyecto(data))
                .catch(error => console.error('Error al obtener los proyectos', error));
        }
    };

    const handleProjectUpdated = (proyectoActualizado) => {
        setProyecto(proyectos.map(proyecto =>
            proyecto.id === proyectoActualizado.id ? proyectoActualizado : proyecto
        ));
        setEditingProyecto(null);
        setShowEditModal(false); // Cierra el modal después de actualizar
    };

    const handleEditClick = (proyecto) => {
        setEditingProyecto(proyecto);
        setShowEditModal(true);
    };

    return (
        <div className="container-projects">
            {authData.token ? (
                <div className="main-content">
                    <h2>Proyectos</h2>
                    <div className="botones">
                        <button onClick={() => setShowCreateModal(true)}>Crear un Proyecto Nuevo</button>
                    </div>
                    {proyectos.length > 0 ? (
                        <div className="table-container-accounts">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Descripcion</th>
                                        <th>Fecha de Inicio</th>
                                        <th>Fecha de Fin</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proyectos.map(proyecto => (
                                        <tr key={proyecto.id}>
                                            <td>{proyecto.nombre}</td>
                                            <td>{proyecto.descripcion}</td>
                                            <td>{proyecto.fecha_inicio}</td>
                                            <td>{proyecto.fecha_fin}</td>
                                            <td>{proyecto.estado}</td>
                                            <td>
                                                <button onClick={() => handleEditClick(proyecto)}>Actualizar</button>
                                                <button onClick={() => handleEliminar(proyecto.id)}>Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No hay proyectos para este usuario</p>
                    )}
                    {showCreateModal && (
                        <CreateProjectModal
                            onClose={() => setShowCreateModal(false)}
                            onProjectCreated={handleProjectCreated}
                        />
                    )}
                    {showEditModal && (
                        <EditProjectModal
                            projectId={editingProyecto.id} // Pasa el ID del proyecto a editar
                            onClose={() => setShowEditModal(false)}
                            onProjectUpdated={handleProjectUpdated} // Callback para cuando se actualiza el proyecto
                        />
                    )}
                </div>
            ) : (
                <p>Redirigiendo al login...</p>
            )}
        </div>
    );
}

export default ProjectUser;
