import axios from "axios";

// const API_URL = 'https://ep.edwarhercules.site/api';
const API_URL = 'http://localhost:8081/api';

export const getHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
});

// Obtener todos los geopuntos y estructuras
export const obtenerGeopuntosEstructuras = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/geopuntoEstructura`, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al obtener los geopuntos y estructuras', error);
        throw error;
    }
};

// Obtener geopunto y estructura por ID
export const obtenerGeoPuntoEstructuraPorID = async (id, token) => {
    try {
        const response = await axios.get(`${API_URL}/geopuntoEstructura/${id}`, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al obtener el geopunto y estructura', error);
        throw error;
    }
};

// Insertar estructura en geopunto
export const insertarEstructuraEnGeoPunto = async (geoPuntoId, estructuraId, circuito, token) => {
    try {
        const response = await axios.post(`${API_URL}/geopuntoEstructura/${geoPuntoId}/estructura/${estructuraId}?circuito=${circuito}`, {}, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al insertar estructura en geopunto', error);
        throw error.response.data || 'Error al insertar la estructura en el geopunto';
    }
};

// Actualizar geopunto estructura
export const actualizarGeoPuntoEstructura = async (id, objectGeoPuntoEstructuraDTOupdate, token) => {
    try {
        const response = await axios.put(`${API_URL}/geopuntoEstructura/${id}`, objectGeoPuntoEstructuraDTOupdate, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el geopunto estructura', error);
        throw error.response.data || 'Error al actualizar el geopunto estructura';
    }
};

// Eliminar geopunto estructura por ID
export const eliminarGeoPuntoEstructuraPorID = async (id, token) => {
    try {
        await axios.delete(`${API_URL}/geopuntoEstructura/${id}`, getHeaders(token));
    } catch (error) {
        console.error('Error al eliminar el geopunto estructura', error);
        throw error.response.data || 'Error al eliminar el geopunto estructura';
    }
};

// Obtener estructuras por ID de geopunto
export const obtenerEstructurasPorGeoPunto = async (geopuntoId, token) => {
    try {
        const response = await axios.get(`${API_URL}/geopuntoEstructura/geopunto/${geopuntoId}`, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al obtener las estructuras del geopunto', error);
        throw error;
    }
};
