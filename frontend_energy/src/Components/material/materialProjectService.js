import axios from "axios";

// const API_URL = 'https://ep.edwarhercules.site/api';
const API_URL = 'http://localhost:8081/api';

export const getHeaders = (token) => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
});

// Función para obtener materiales por proyecto
export const obtenerMaterialPorProyecto = async (id, token) => {
    try {
        const response = await axios.get(`${API_URL}/proyectoMaterial/materiales/${id}`, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al obtener los materiales', error);
        throw error.response?.data || 'Error al obtener los materiales';
    }
};

// Función para obtener distintos materiales por proyecto
export const obtenerDistintosMaterialPorProyecto = async (proyectoId, token) => {
    try {
        const response = await axios.get(`${API_URL}/proyectoMaterial/${proyectoId}/materiales/distinctos`, getHeaders(token));
        return response.data;
    } catch (error) {
        console.error('Error al obtener los materiales distintos', error);
        throw error.response?.data || 'Error al obtener los materiales distintos';
    }
};

// Función para insertar materiales por estructura en un proyecto
export const insertarMaterialPorProyecto = async (proyectoId, estructuraId, voltaje, token) => {
    // Validación de parámetros
    if (!proyectoId || !estructuraId || !voltaje || !token) {
        throw new Error('Todos los parámetros son obligatorios: proyectoId, estructuraId, voltaje y token.');
    }

    try {
        // Realiza la solicitud POST, enviando el voltaje como parámetro de consulta
        const response = await axios.post(
            `${API_URL}/proyectoMaterial/${proyectoId}/estructuras/${estructuraId}/materiales?voltaje=${encodeURIComponent(voltaje)}`,
            null, // No envías un cuerpo, ya que el voltaje es un parámetro de consulta
            getHeaders(token)
        );

        // Retorna los materiales insertados
        return response.data;
    } catch (error) {
        // Manejo de errores de respuesta del servidor
        if (error.response) {
            console.error('Error de servidor:', error.response.data);
            throw new Error(`Error: ${error.response.status} - ${error.response.data.message || error.response.data}`);
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor:', error.request);
            throw new Error('No se recibió respuesta del servidor. Verifica la conexión.');
        } else {
            console.error('Error en la configuración de la solicitud:', error.message);
            throw new Error(`Error en la configuración de la solicitud: ${error.message}`);
        }
    }
};
