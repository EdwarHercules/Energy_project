import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Sidebar.css';
import { HomeIcon } from '@heroicons/react/24/solid';
import { useAuth } from './auth/AuthContext'; // Asegúrate de que este es tu contexto de autenticación

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { authData } = useAuth(); // Obtener la información de autenticación

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const handleTouchOutside = (event) => {
            if (isOpen && !event.target.closest('.sidebar')) {
                closeSidebar();
            }
        };

        document.addEventListener('touchstart', handleTouchOutside);

        return () => {
            document.removeEventListener('touchstart', handleTouchOutside);
        };
    }, [isOpen]);

    // Verificar si el usuario tiene el rol de admin
    const esAdmin = authData?.roles?.includes('ROL_USER_ADMIN');
    

    return (
        <div>
            <nav className={`sidebar ${isOpen ? 'show' : ''}`}>
                <div className="sidebar-nav">
                    <ul>
                        <li>
                            <Link to="/home" onClick={closeSidebar}><i className="ion-ios-home-outline"></i> Home</Link>
                        </li>
                        {/* Mostrar "Usuarios" solo si el usuario es admin */}
                        {esAdmin && (
                            <li>
                                <Link to="/usuarios" onClick={closeSidebar}><i className="ion-ios-person-outline"></i> Usuarios</Link>
                            </li>
                        )}
                        <li>
                            <Link to="/proyectos" onClick={closeSidebar}><i className="ion-ios-person-outline"></i> Proyectos</Link>
                        </li>
                        <li>
                            <Link to="/" onClick={closeSidebar}><i className="ion-ios-card-outline"></i> Log in</Link>
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

export default Sidebar;
