import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { obtenerProyectosPorUsuario, eliminarProyecto } from "./projectService";
import CreateProjectModal from "./projectNew";
import EditProjectModal from "./projectEdit";

import "../../Styles/AllProjectsPerUser.css";

const ProjectUser = () => {
    const { authData } = useAuth();
    const [proyectos, setProyecto] = useState([]);
    const [editingProyecto, setEditingProyecto] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // Para el modal de edición
    const navigate = useNavigate(); // Crea el hook de navegación

    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [projectsPerPage] = useState(10); // Proyectos por página (10)

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

    const handleVerProyecto = (proyectoId) => {
        navigate(`/proyectos/${proyectoId}/geoPuntos`);
    };

    // Paginación: Calcular índices de proyectos por página
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = proyectos.slice(indexOfFirstProject, indexOfLastProject);

    // Calcular número total de páginas
    const totalPages = Math.ceil(proyectos.length / projectsPerPage);

    // Limitar los botones de paginación (2 antes y 2 después de la página actual)
    const visiblePages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
    }

    // Funciones de navegación
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleNextFive = () => {
        const nextPage = Math.min(currentPage + 5, totalPages);
        setCurrentPage(nextPage);
    };

    const handlePrevFive = () => {
        const prevPage = Math.max(currentPage - 5, 1);
        setCurrentPage(prevPage);
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
    };

    const goToLastPage = () => {
        setCurrentPage(totalPages);
    };

    return (
        <div className="container-projects-user">
            {authData.token ? (
                <div className="main-content-user">
                    <h2>Proyectos</h2>
                    <div className="botones-user">
                        <button className="create-user" onClick={() => setShowCreateModal(true)}>Crear un Proyecto Nuevo</button>
                    </div>
                    {proyectos.length > 0 ? (
                        <>
                            <div className="table-container-accounts-user">
                                <table className="table-projects">
                                    <thead className="table-head-project">
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Descripcion</th>
                                            <th>Fecha de Inicio</th>
                                            <th>Fecha de Fin</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body-project">
                                        {currentProjects.map(proyecto => (
                                            <tr key={proyecto.id}>
                                                <td>{proyecto.nombre}</td>
                                                <td>{proyecto.descripcion}</td>
                                                <td>{proyecto.fecha_inicio}</td>
                                                <td>{proyecto.fecha_fin}</td>
                                                <td>{proyecto.estado}</td>
                                                <td className="butons-puntos"> 
                                                <button className="view-user" onClick={() => handleVerProyecto(proyecto.id)}>
                                                    Ver Proyecto
                                                </button>                                                   
                                                <button onClick={() => handleEditClick(proyecto)}>Actualizar</button>
                                                    <button className="alert-user" onClick={() => handleEliminar(proyecto.id)}>Eliminar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            <div className="pagination">
                                <button onClick={goToFirstPage} disabled={currentPage === 1}>Primero</button>
                                <button onClick={handlePrevFive} disabled={currentPage === 1}>-5</button>
                                
                                {visiblePages.map(page => (
                                    <button
                                        key={page}
                                        onClick={() => paginate(page)}
                                        className={currentPage === page ? "active" : ""}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button onClick={handleNextFive} disabled={currentPage === totalPages}>+5</button>
                                <button onClick={goToLastPage} disabled={currentPage === totalPages}>Último</button>
                            </div>
                        </>
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
