// const API_URL = 'https://ep.edwarhercules.site/api';
const API_URL = 'http://localhost:8081/api';

export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData || 'Usuario o contraseña incorrectos');
        }

        const data = await response.json();
        return { token: data.token };
    } catch (error) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
};

export const obtenerNombrePersona = async (email, token) => {
    try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await fetch(`${API_URL}/usuario/nombrePersona?email=${email}`, { headers });

        if (!response.ok) {
            throw new Error('Error al obtener el nombre de la persona');
        }

        return await response.text();
    } catch (error) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
};

export const obtenerCuentas = async (email, token) => {
    try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await fetch(`${API_URL}/usuario/cuentas?email=${email}`, { headers });

        if (!response.ok) {
            throw new Error('Error al obtener las cuentas del usuario');
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
};

export const register = async (usuarioRegistro) => {
    try {
        await fetch(`${API_URL}/auth/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioRegistro),
        });

        // No se espera ninguna respuesta específica del servidor
        // Si la solicitud no lanza un error, se considera que el registro fue exitoso
        return; 
    } catch (error) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
};

export const fetchProtectedResource = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/protected-endpoint`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch protected resource');
    }
    return await response.json();
};
