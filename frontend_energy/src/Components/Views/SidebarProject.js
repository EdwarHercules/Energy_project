import React, { useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/solid';
import "../../Styles/SidebarProject.css"


const SidebarProject = ( {projectId} ) => {
    console.log("Received project ID in SidebarProject:", projectId); // Verifica aquí

    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const handleTouchOutside = (event) => {
            if (isOpen && !event.target.closest('.sidebarProject')) {
                closeSidebar();
            }
        };

        document.addEventListener('touchstart', handleTouchOutside);

        return () => {
            document.removeEventListener('touchstart', handleTouchOutside);
        };
    }, [isOpen]);

    return (
        <div>
            <nav className={`sidebarProject ${isOpen ? 'show' : ''}`}>
                <div className="sidebar-nav-project">
                    <ul>
                        <li>
                            <Link to={`/proyectos/${projectId}/geoPuntos`} onClick={closeSidebar}><i className="ion-ios-home-outline"></i> GeoPuntos</Link>
                        </li>
                        <li>
                            <Link to={`/proyectos/${projectId}/mapa`} onClick={closeSidebar}><i className="ion-ios-person-outline"></i> Mapa</Link>
                        </li>
                        <li>
                            <Link to={`/proyectos/${projectId}/estMat`} onClick={closeSidebar}><i className="ion-ios-person-outline"></i> Estructuras y Materiales</Link>
                        </li>
                        <li>
                            <Link to={`/proyectos/${projectId}/files`} onClick={closeSidebar}><i className="ion-ios-card-outline"></i> Archivos de Descarga</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <button className="sidebar-button" onClick={toggleSidebar}>
                <HomeIcon className="heroicon" />
            </button>
        </div>
    );
};

export default SidebarProject;