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
        const response = await axios.get(`${API_URL}/geopuntos/proyecto/${id}`, {
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
    } catch (error) {
        throw error.response.data || 'Error al crear un nuevo geoPunto';
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

export const descargarKmz = async (id, token) => {
    try {
        const response = await axios.get(`${API_URL}/geopuntos/proyectos/${id}/kmz`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            responseType: 'blob' // Especificamos que la respuesta es un archivo binario (blob)
        });

        // Crear un enlace para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.google-earth.kmz' }));
        const link = document.createElement('a');
        link.href = url;

        // Establecer el nombre del archivo
        const filename = `proyecto_${id}.kmz`;
        link.setAttribute('download', filename);

        // Simular clic para descargar el archivo
        document.body.appendChild(link);
        link.click();

        // Eliminar el enlace del DOM
        link.remove();
    } catch (error) {
        console.error('Error al descargar el archivo KMZ', error);
        throw error;
    }
};

export const descargarGDB = async (id, token) => {
    try {
        // Llamada a la API de Python
        const response = await axios.get(`http://127.0.0.1:8000/descargar-gdb/${id}`, getHeaders(token));
        
        // Manejar la respuesta de la API de Python que debería ser el archivo GDB
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `geopuntos_${id}.gdb`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        console.log(`Archivo GDB del proyecto ${id} descargado correctamente.`);
    } catch (error) {
        console.error("Error al descargar el archivo GDB:", error);
        throw error;
    }
};

export const descargarExcel = async (proyectoId, token) => {
    try {
        const response = await axios.get(`${API_URL}/excel/descargar/${proyectoId}`, {
            ...getHeaders(token),
            responseType: 'blob' // Indica que la respuesta es un blob
        });
        
        // Manejar la respuesta de la API para descargar el archivo Excel
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `proyecto_${proyectoId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        console.log(`Archivo Excel del proyecto ${proyectoId} descargado correctamente.`);
    } catch (error) {
        console.error("Error al descargar el archivo Excel:", error);
        throw error;
    }
};


export const crearGeoPuntoManual = async (id, geoPuntoDTO, token) => {
    try {
        const response = await axios.post(`${API_URL}/geopuntos/manual?id=${id}`, geoPuntoDTO, getHeaders(token));
        return response.data;
    } catch (error) {
        throw error.response.data || 'Error al crear un nuevo GeoPunto manual';
    }
};
export const obtenerCircuitosKMZ = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/circuitos/kmz`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            responseType: 'blob', // Necesario para recibir el archivo como blob
        });
        return response.data; // Aquí regresamos el blob
    } catch (error) {
        console.error('Error al obtener circuitos KMZ:', error);
        throw error;
    }
};