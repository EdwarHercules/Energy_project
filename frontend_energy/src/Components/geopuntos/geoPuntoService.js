import axios from 'axios';

// const API_URL = 'https://ep.edwarhercules.site/api';
const API_URL = 'http://localhost:8081/api';

export const getHeaders = (token) => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  export const obtenerGeoPuntosPorProyecto = async (id, token) => {
    try {
        const response = await axios.get(`${API_URL}/geopuntos/proyecto/${id}}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los geopuntos', error);
        throw error;
    }
};


export const obtenerGeoPuntoPorId = async (id, token) => {
    try{
        const response = await axios.get(`${API_URL}/geopuntos/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        return response.data
    } catch (error) {
        console.error('Error al obtener el proyecto', error);
        throw error;
    }
};

export const crearGeoPunto = async (id, geoPuntoDTO, token) => {
    try {
        const response = await axios.post(`${API_URL}/geopuntos?id=${id}`, geoPuntoDTO, getHeaders(token));
        return response.data;
    } catch (error){
        throw error.response.data || 'Error al crear un nuevo proyecto'
    }
};

export const actualizarGeoPunto = async (id, geoPuntoDTO, token) => {
    try {
        const response = await axios.put(`${API_URL}/geopuntos/${id}`, geoPuntoDTO, getHeaders(token));
        return response.data;
    } catch (error) {
        throw error.response.data || 'Error al actualizar el proyecto'
    }
}

export const eliminarGeoPunto = async (id, token) => {
    try {
        await axios.delete(`${API_URL}/geopuntos/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        throw error.response.data || 'Error al eliminar un proyecto'
    }
}