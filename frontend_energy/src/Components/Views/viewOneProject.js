import React from "react";
import { useParams } from "react-router-dom"; // Para obtener el ID del proyecto
import SidebarProject from "./SidebarProject"; // Importa el sidebar
import "../../Styles/viewProject.css"; // Añade los estilos correspondientes

const ViewProject = () => {
    const { id } = useParams(); // Obtiene el ID de la URL

    return (
        <div className="view-project-container">
            <SidebarProject /> {/* Sidebar a la izquierda */}
            <div className="project-details">
                <h2>Detalles del Proyecto {id}</h2>
                {/* Aquí puedes agregar más detalles del proyecto */}
                <p>Aquí se mostrarán los detalles del proyecto con ID: {id}</p>
            </div>
        </div>
    );
};

export default ViewProject;
