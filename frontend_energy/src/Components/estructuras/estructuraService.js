import axios from 'axios';

// const API_URL = 'https://ep.edwarhercules.site/api';
const API_URL = 'http://localhost:8081/api';

export const getHeaders = (token) => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
});



export const obtenerEstructuras = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/estructura`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los estructura', error);
        throw error;
    }
};


export const obtenerCategorias = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/estructura/categorias`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los estructura', error);
        throw error;
    }
};


export const obtenerEstructuraPorId = async (id, token) => {
    try{
        const response = await axios.get(`${API_URL}/estructura/${id}`, {
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


// estructuraService.js

export const obtenerEstructuraPorCategoria = async (categoria, token) => {
    const response = await fetch(`${API_URL}/estructura/estructuras?categoria=${categoria}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Error al obtener las estructuras");
    }
    return await response.json();
};

