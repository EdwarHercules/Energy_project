import axios from 'axios';

// const API_URL = 'https://ep.edwarhercules.site/api';
const API_URL = 'http://localhost:8081/api';

export const getHeaders = (token) => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  export const obtenerProyectosPorUsuario = async (email, token) => {
    try {
        const response = await axios.get(`${API_URL}/proyectos/responsable/${encodeURIComponent(email)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los proyectos', error);
        throw error;
    }
};


export const obtenerProyectoPorId = async (id, token) => {
    try{
        const response = await axios.get(`${API_URL}/proyectos/${id}`, {
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

export const crearProyecto = async (email, proyectoDTO, token) => {
    try {
        const response = await axios.post(`${API_URL}/proyectos?email=${encodeURIComponent(email)}`, proyectoDTO, getHeaders(token));
        return response.data;
    } catch (error){
        throw error.response.data || 'Error al crear un nuevo proyecto'
    }
};

export const actualizarProyecto = async (id, proyectoDTO, token) => {
    try {
        const response = await axios.put(`${API_URL}/proyectos/${id}`, proyectoDTO, getHeaders(token));
        return response.data;
    } catch (error) {
        throw error.response.data || 'Error al actualizar el proyecto'
    }
}

export const eliminarProyecto = async (id, token) => {
    try {
        await axios.delete(`${API_URL}/proyectos/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        throw error.response.data || 'Error al eliminar un proyecto'
    }
}