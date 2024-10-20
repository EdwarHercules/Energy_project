import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useParams } from "react-router-dom";
import { obtenerGeoPuntosPorProyecto, eliminarGeoPunto } from "./geoPuntoService"; 
import CreateGeoPuntoModal from "./geoPuntoNew";
import AgregarEstructuraModal from "../estructuras/geoPuntoEstructurasNew";
import EditGeoPuntoModal from "./geoPuntoEdit";
import CreateGeoPuntoManualModal from "./CreateGeoPuntoManualModal ";

import "../../Styles/projectUser.css";

const GeoPuntoUser = () => {
    
    const { authData } = useAuth();
    const { id } = useParams(); // Usar useParams para obtener el id del proyecto desde la URL

    const [geoPuntos, setGeoPuntos] = useState([]);
    const [editingGeoPunto, setEditingGeoPunto] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showManualCreateModal, setShowManualCreateModal] = useState(false); // Estado para el modal manual
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAgregarEstructuraModal, setShowAgregarEstructuraModal] = useState(false);
    const [selectedGeoPuntoId, setSelectedGeoPuntoId] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [geoPuntosPerPage] = useState(10); 
    
    useEffect(() => {
        if (authData.token && id) {
            obtenerGeoPuntosPorProyecto(id, authData.token)
                .then(data => {
                    setGeoPuntos(data);
                })
                .catch(error => {
                    console.error('Error al obtener los geoPuntos', error);
                });
        }
    }, [authData.token, id]);

    const handleEliminar = async (id) => {
        try {
            await eliminarGeoPunto(id, authData.token);
            setGeoPuntos(geoPuntos.filter(geoPunto => geoPunto.id !== id));
        } catch (error) {
            console.error('Error al eliminar el geoPunto: ', error);
        }
    };

    const handleGeoPuntoCreated = () => {
        if (authData.token && id) {
            obtenerGeoPuntosPorProyecto(id, authData.token)
                .then(data => setGeoPuntos(data))
                .catch(error => console.error('Error al obtener los geoPuntos', error));
        }
    };

    const handleGeoPuntoUpdated = (geoPuntoActualizado) => {
        setGeoPuntos(geoPuntos.map(geoPunto =>
            geoPunto.id === geoPuntoActualizado.id ? geoPuntoActualizado : geoPunto
        ));
        setEditingGeoPunto(null);
        setShowEditModal(false); // Cierra el modal después de actualizar
    };

    const handleEditClick = (geoPunto) => {
        setEditingGeoPunto(geoPunto);
        setShowEditModal(true);
    };

    const handleAgregarEstructuraClick = (geoPuntoId) => {
        setSelectedGeoPuntoId(geoPuntoId);
        setShowAgregarEstructuraModal(true);
    };

    const handleAgregarEstructura = (estructura) => {
        console.log(`Estructura ${estructura.nombre} agregada al GeoPunto ${selectedGeoPuntoId}`);
    };

    const indexOfLastGeoPunto = currentPage * geoPuntosPerPage;
    const indexOfFirstGeoPunto = indexOfLastGeoPunto - geoPuntosPerPage;
    const currentGeoPuntos = geoPuntos.slice(indexOfFirstGeoPunto, indexOfLastGeoPunto);

    const totalPages = Math.ceil(geoPuntos.length / geoPuntosPerPage);

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

    // Limitar los botones de paginación (2 antes y 2 después de la página actual)
    const visiblePages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
    }

    return (
        <div className="container-projects">
            {authData.token ? (
                <div className="main-content">
                    <h2>GeoPuntos del Proyecto</h2>
                    <div className="botones">
                        <button className="create" onClick={() => setShowCreateModal(true)}>Crear un GeoPunto Nuevo</button>
                        <button className="create" onClick={() => setShowManualCreateModal(true)}>Crear un GeoPunto Manualmente</button> {/* Nuevo botón */}
                    </div>
                    {geoPuntos.length > 0 ? (
                        <>
                            <div className="table-container-accounts">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Punto</th>
                                            <th>Descripción</th>
                                            <th>Latitud</th>
                                            <th>Longitud</th>
                                            <th>Punto UTM en X</th>
                                            <th>Punto UTM en Y</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentGeoPuntos.map(geoPunto => (
                                            <tr key={geoPunto.id}>
                                                <td>{geoPunto.nombre}</td>
                                                <td>{geoPunto.descripcion}</td>
                                                <td>{geoPunto.latitud}</td>
                                                <td>{geoPunto.longitud}</td>
                                                <td>{geoPunto.utm_x}</td>
                                                <td>{geoPunto.utm_y}</td>
                                                <td className="butons-puntos">
                                                    <button onClick={() => handleAgregarEstructuraClick(geoPunto.id)}>Agregar Estructuras</button>
                                                    <button onClick={() => handleEditClick(geoPunto)}>Editar</button>
                                                    <button className="alert" onClick={() => handleEliminar(geoPunto.id)}>Eliminar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

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
                        <p>No hay GeoPuntos para este proyecto</p>
                    )}
                    {showCreateModal && (
                        <CreateGeoPuntoModal
                            onClose={() => setShowCreateModal(false)}
                            onGeoPuntoCreated={handleGeoPuntoCreated}
                            proyectoId={id}
                        />
                    )}
                    {showManualCreateModal && (
                        <CreateGeoPuntoManualModal
                            onClose={() => setShowManualCreateModal(false)}
                            onGeoPuntoCreated={handleGeoPuntoCreated} // Actualiza la lista después de crear
                            proyectoId={id}
                        />
                    )}
                    {showEditModal && (
                        <EditGeoPuntoModal
                            geoPuntoId={editingGeoPunto.id}
                            onClose={() => setShowEditModal(false)}
                            onGeoPuntoUpdated={handleGeoPuntoUpdated}
                        />
                    )}
                     
                    {showAgregarEstructuraModal && (
                        <AgregarEstructuraModal
                            onClose={() => setShowAgregarEstructuraModal(false)}
                            onAgregarEstructura={handleAgregarEstructura}
                            geoPuntoId={selectedGeoPuntoId}
                            proyectoId={id}
                        />
                    )}
                </div>
            ) : (
                <p>Redirigiendo al login...</p>
            )}
        </div>
    );
};

export default GeoPuntoUser;
