import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Styles/Sidebar.css';
import { HomeIcon } from '@heroicons/react/24/solid';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

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

    return (
        <div>
            <nav className={`sidebar ${isOpen ? 'show' : ''}`}>
                <header>Menu</header>
                <div className="sidebar-nav">
                    <ul>
                        <li>
                            <Link to="/home" onClick={closeSidebar}><i className="ion-ios-home-outline"></i> Home</Link>
                        </li>
                        <li>
                            <Link to="/perfil" onClick={closeSidebar}><i className="ion-ios-person-outline"></i> Perfil</Link>
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
