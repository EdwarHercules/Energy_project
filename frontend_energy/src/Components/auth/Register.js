import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api';
import "../../Styles/Register.css";

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const usuarioRegistro = {
                nombre,
                password,
                email
            };

            await register(usuarioRegistro);
            alert('¡Registro exitoso!'); // Mostrar alerta de éxito
            setError(null);
            setSuccessMessage(null);
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('Error registrando usuario:', error);
            alert(`Error al registrarse: ${error.message}`); // Mostrar alerta de error
            setError(`Error en el registro: ${error.message}`);
            setSuccessMessage(null);
        }
    };

    const handleGoToLogin = () => {
        navigate('/');
    };

    return (
        <div className='register-container'>
            <h2>Registro de Usuario</h2>
            {/* Se han eliminado los mensajes de error y éxito en el DOM */}
            <form className='form-div' onSubmit={handleSubmit}>
                <div className="form-section">
                    <div className="user-data">
                        <h3>Datos de Usuario</h3>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" 
                            required 
                        />
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Contraseña" 
                            required 
                        />
                        <input 
                            type="text" 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} 
                            placeholder="Nombre Completo" 
                            required 
                        />
                    </div>
                   
                </div>
                <div className="form-buttons">
                    <button type="submit">Registrarse</button>
                    <button type="button" className='back-button' onClick={handleGoToLogin}>Volver al Login</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
