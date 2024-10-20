import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: null,
    nombre: '',
    roles: []
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    const storedNombre = localStorage.getItem('userName');
    console.log("Este es el email del usuario", storedNombre)

    if (storedToken && storedNombre) {
      try {
        // Decodificar el token JWT
        const decodedToken = jwtDecode(storedToken);

        // Extraer los roles del token correctamente
        const roles = decodedToken.roles || []; // Asegurarse de que sea un array

        // Verificar si los roles se están extrayendo correctamente
        console.log('Roles extraídos:', roles); 

        setAuthData({ token: storedToken, nombre: storedNombre, roles });
      } catch (error) {
        console.error('Error al decodificar el token JWT', error);
      }
    }
  }, []);

  const login = (token, nombre, roles) => {
    setAuthData({ token, nombre, roles });
    localStorage.setItem('userToken', token);
    localStorage.setItem('userName', nombre);
    localStorage.setItem('userRoles', JSON.stringify(roles)); // Almacenar roles como string
    console.log('Usuario autenticado:');
    console.log('Token:', token);
    console.log('Nombre:', nombre);
    console.log('Roles:', roles);
  };

  const logout = () => {
    setAuthData({ token: null, nombre: '', roles: [] });
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRoles');
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
