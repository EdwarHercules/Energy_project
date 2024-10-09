import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api';
import "../Styles/Register.css";

// Lista de géneros
const generos = [
  "Masculino",
  "Femenino",
  "Otro",
  "Prefiero no decir"
];

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [genero, setGenero] = useState('');
    const [edad, setEdad] = useState('');
    const [identificacion, setIdentificacion] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [estado, setEstado] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const usuarioRegistro = {
                nombre,
                password,
                email,
                genero,
                edad,
                identificacion,
                direccion,
                telefono,
                estado
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
                            placeholder="Nombre" 
                            required 
                        />
                    </div>
                    <div className="personal-data">
                        <h3>Datos Personales</h3>
                        <div>
                            <label className='label-contrast'>Género:</label>
                            <select
                                value={genero}
                                onChange={(e) => setGenero(e.target.value)}
                                required
                                id='options-genre'
                            >
                                <option value="">Selecciona tu género</option>
                                {generos.map((gen, index) => (
                                    <option key={index} value={gen}>{gen}</option>
                                ))}
                            </select>
                        </div>
                        <input 
                            type="number" 
                            value={edad} 
                            onChange={(e) => setEdad(e.target.value)} 
                            placeholder="Edad" 
                            required 
                        />
                        <input 
                            type="text" 
                            value={identificacion} 
                            onChange={(e) => setIdentificacion(e.target.value)} 
                            placeholder="Identificación" 
                            required 
                        />
                        <input 
                            type="text" 
                            value={direccion} 
                            onChange={(e) => setDireccion(e.target.value)} 
                            placeholder="Dirección" 
                            required 
                        />
                        <input 
                            type="text" 
                            value={telefono} 
                            onChange={(e) => setTelefono(e.target.value)} 
                            placeholder="Teléfono" 
                            required 
                        />
                        <label className='label-contrast'>
                            <input 
                                type="checkbox" 
                                checked={estado} 
                                onChange={(e) => setEstado(e.target.checked)} 
                            />
                            Estado
                        </label>
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
