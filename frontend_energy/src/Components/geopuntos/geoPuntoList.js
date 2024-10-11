import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useParams } from "react-router-dom";
import { obtenerGeoPuntosPorProyecto, eliminarGeoPunto } from "./geoPuntoService"; 
import CreateGeoPuntoModal from "./geoPuntoNew";
import AgregarEstructuraModal from "../estructuras/geoPuntoEstructurasNew";
import EditGeoPuntoModal from "./geoPuntoEdit";

import "../../Styles/projectUser.css";

const GeoPuntoUser = () => {
    
    const { authData } = useAuth();
    const { id } = useParams(); // Usar useParams para obtener el id del proyecto desde la URL

    const [geoPuntos, setGeoPuntos] = useState([]);
    const [editingGeoPunto, setEditingGeoPunto] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAgregarEstructuraModal, setShowAgregarEstructuraModal] = useState(false);
    const [selectedGeoPuntoId, setSelectedGeoPuntoId] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [geoPuntosPerPage] = useState(10); 
    
    console.log("Received project ID in GeoPuntosList:", id); // Verifica aquí
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
            console.error('Error al eliminar el geoPuntos: ', error);
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

    // Llamar al modal cuando se haga clic en "Agregar Estructura"
    const handleAgregarEstructuraClick = (geoPuntoId) => {
        setSelectedGeoPuntoId(geoPuntoId);
        setShowAgregarEstructuraModal(true);
    };

    // Cerrar el modal y agregar la estructura
    const handleAgregarEstructura = (estructura) => {
        // Aquí puedes llamar a tu backend para agregar la estructura a la tabla geopunto_estructura
        console.log(`Estructura ${estructura.nombre} agregada al GeoPunto ${selectedGeoPuntoId}`);
    };

    // Paginación: Calcular índices de proyectos por página
    const indexOfLastGeoPunto = currentPage * geoPuntosPerPage;
    const indexOfFirstGeoPunto = indexOfLastGeoPunto - geoPuntosPerPage;
    const currentGeoPuntos = geoPuntos.slice(indexOfFirstGeoPunto, indexOfLastGeoPunto);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calcular número total de páginas
    const totalPages = Math.ceil(geoPuntos.length / geoPuntosPerPage);

    return (
        <div className="container-projects">
            {authData.token ? (
                <div className="main-content">
                    <h2>GeoPuntos del Proyecto</h2>
                    <div className="botones">
                        <button className="create" onClick={() => setShowCreateModal(true)}>Crear un GeoPunto Nuevo</button>
                    </div>
                    {geoPuntos.length > 0 ? (
                        <>
                            <div className="table-container-accounts">
                                <table>
                                    <thead>
                                        <tr>
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
                                                <td>{geoPunto.descripcion}</td>
                                                <td>{geoPunto.latitud}</td>
                                                <td>{geoPunto.longitud}</td>
                                                <td>{geoPunto.utm_x}</td>
                                                <td>{geoPunto.utm_y}</td>
                                                <td>
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
                                {[...Array(totalPages).keys()].map(page => (
                                    <button
                                        key={page + 1}
                                        onClick={() => paginate(page + 1)}
                                        className={currentPage === page + 1 ? "active" : ""}
                                    >
                                        {page + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>No hay GeoPuntos para este proyecto</p>
                    )}
                    {showCreateModal && (
                        <CreateGeoPuntoModal
                            onClose={() => setShowCreateModal(false)}
                            onGeoPuntoCreated={handleGeoPuntoCreated}
                            proyectoId={id} // Asegúrate de que idDelProyecto sea el ID correcto

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
