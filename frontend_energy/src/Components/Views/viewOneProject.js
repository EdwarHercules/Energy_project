import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import SidebarProject from './SidebarProject'; 
import "../../Styles/viewProject.css"; 

const ProjectLayout = () => {
    const { id } = useParams(); 

    return (
        <div className="view-project-container">
            <SidebarProject projectId={id} />  {/* Sidebar solo en las vistas de proyecto */}
            <div className="project-content">
                <Outlet />  {/* Renderiza el contenido del proyecto */}
            </div>
        </div>
    );
};

export default ProjectLayout;
