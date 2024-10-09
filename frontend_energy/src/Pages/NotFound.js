import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Components/auth/AuthContext'; // Ajusta la ruta según tu estructura

const NotFound = () => {
  const { authData } = useAuth(); // Obtén el estado de autenticación
  const location = useLocation(); // Obtén la ruta actual

  useEffect(() => {
  }, [location, authData]);

  // Verifica si el usuario está autenticado
  if (authData.token) {
    // Redirige a la página de inicio si el usuario está autenticado
    return <Navigate to="/home" />;
  } else {
    // Redirige a la página de inicio de sesión si el usuario no está autenticado
    return <Navigate to="/login" />;
  }
};

export default NotFound;
