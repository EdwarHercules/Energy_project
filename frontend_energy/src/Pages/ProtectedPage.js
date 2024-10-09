// src/pages/ProtectedPage.js
import React, { useEffect, useState } from 'react';
import { fetchProtectedResource } from '../api';
import { useAuth } from '../Components/auth/AuthContext';

const ProtectedPage = () => {
    const [data, setData] = useState(null);
    const { authData } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchProtectedResource();
                setData(result);
            } catch (error) {
                console.error('Error fetching protected resource:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Página Protegida</h2>
            {authData.token && <p>Bienvenido {authData.nombre}</p>}
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
        </div>
    );
};

export default ProtectedPage;
