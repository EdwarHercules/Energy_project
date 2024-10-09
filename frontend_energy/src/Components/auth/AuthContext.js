import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({ token: null, nombre: '' });

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    const storedNombre = localStorage.getItem('userName');
    if (storedToken && storedNombre) {
      setAuthData({ token: storedToken, nombre: storedNombre });
    }
  }, []);

  const login = (token, nombre) => {
    setAuthData({ token, nombre });
    localStorage.setItem('userToken', token);
    localStorage.setItem('userName', nombre);
  };

  const logout = () => {
    setAuthData({ token: null, nombre: '' });
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
