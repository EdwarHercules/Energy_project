import axios from 'axios';

// Constante para la URL de la API
const API_URL = 'http://localhost:8081/api';

// Función para obtener los headers con el token de autorización
export const getHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
});

// Servicio para obtener todos los usuarios con sus roles
export const obtenerUsuarios = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/usuarios`, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al obtener los usuarios', error);
        throw error.response.data || 'Error al obtener los usuarios';
    }
};

// Servicio para obtener un usuario por ID
export const obtenerUsuarioPorId = async (id, token) => {
    try {
        const response = await axios.get(`${API_URL}/usuarios/${id}`, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al obtener el usuario por ID', error);
        throw error.response.data || 'Error al obtener el usuario por ID';
    }
};

// Servicio para asignar un nuevo rol a un usuario
export const asignarRolAUsuario = async (id, rolId, token) => {
    try {
        const response = await axios.post(`${API_URL}/usuarios/${id}/roles/${rolId}`, null, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al asignar rol al usuario', error);
        throw error.response.data || 'Error al asignar rol al usuario';
    }
};

// Servicio para eliminar un rol de un usuario
export const eliminarRolDeUsuario = async (id, rolId, token) => {
    try {
        const response = await axios.delete(`${API_URL}/usuarios/${id}/roles/${rolId}`, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al eliminar rol del usuario', error);
        throw error.response.data || 'Error al eliminar rol del usuario';
    }
};

// Servicio para actualizar un usuario
export const actualizarUsuario = async (id, usuarioDTO, token) => {
    try {
        const response = await axios.put(`${API_URL}/usuarios/${id}`, usuarioDTO, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el usuario', error);
        throw error.response.data || 'Error al actualizar el usuario';
    }
};

// Servicio para eliminar un usuario
export const eliminarUsuario = async (id, token) => {
    try {
        const response = await axios.delete(`${API_URL}/usuarios/${id}`, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el usuario', error);
        throw error.response.data || 'Error al eliminar el usuario';
    }
};

// Servicio para obtener todos los roles
export const obtenerRoles = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/usuarios/roles`, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al obtener los roles', error);
        throw error.response.data || 'Error al obtener los roles';
    }
};