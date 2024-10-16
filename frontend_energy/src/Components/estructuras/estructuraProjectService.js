import axios from "axios";

// const API_URL = 'https://ep.edwarhercules.site/api';
const API_URL = 'http://localhost:8081/api';

export const getHeaders = (token) => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
});

// Función para obtener estructuras por proyecto
export const obtenerEstructurasPorProyecto = async (id, token) => {
    try {
        const response = await axios.get(`${API_URL}/proyectoEstructura/estructuras/${id}`, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al obtener las estructuras', error);
        throw error.response?.data || 'Error al obtener las estructuras';
    }
};

// Función para insertar estructuras por proyecto
export const insertarEstructurasPorProyecto = async (proyectoId, estructuraId, token) => {
    try {
        const response = await axios.post(`${API_URL}/proyectoEstructura/${proyectoId}/estructuras/${estructuraId}`, {}, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al insertar estructuras por proyecto', error);
        throw error.response?.data || 'Error al insertar estructuras por proyecto';
    }
};
