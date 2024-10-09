import React, {useState, useEffect} from "react";
import { useAuth } from "../auth/AuthContext";
import { obtenerProyectosPorUsuario, eliminarProyecto, actualizarProyecto } from "./projectService";


const ProjectUser = () => {
    const { authData } = useAuth();
    const [proyectos, setProyecto] = useState([]);
    const [editingProyecto, setEditingProyecto] = useState(null);

    useEffect(() => {
        if (authData.token) {
            obtenerProyectosPorUsuario(authData.token)
                .then(data => {
                    setProyecto(data);
                })
                .catch(error => {
                    console.error('Error al obtener los proyectos', error);
                });
        }
    }, [authData.token]);

    const handleEliminar = async (id) => {
        try {
            await eliminarProyecto(id, authData.token);
            setProyecto(proyectos.filter(proyectos => proyectos.id !== id));
        } catch (error) {
            console.error('Error al eliminar el proyecto: ', error);
        }
    };

    const handleActualizarProyecto = async (proyectoActualizado) => {
        try {
            await actualizarProyecto(proyectoActualizado.id, proyectoActualizado, authData.token);
            setProyecto(proyectos.map(proyectos =>
                proyectos.id === proyectoActualizado.id ? proyectoActualizado : proyectos
            ));
            setEditingProyecto(null);
        } catch (error) {
            console.error('Error al actualizar el proyecto: ', error);
        }
    } ;

    return (
        <div className="container-projects">
            {authData.token ? (
                <div className="main-content">
                    <h2>Proyectos</h2>
                    <div className="botones">
                        <button>Crear un Proyecto Nuevo</button>
                    </div>
                    {proyectos.length > 0 ? (
                        <div className="table-container-accounts">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Descripcion</th>
                                        <th>Fecha de Inicio</th>
                                        <th>Fecha de fin</th>
                                        <th>Estado</th>
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
                                                <button onClick={() => handleActualizarProyecto(proyecto)}>Actualizar</button>
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
                </div>
            ) : (
                <p> Redirigiendo al login...</p>
            )}
        </div>
    )

}