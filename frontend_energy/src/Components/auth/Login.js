import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { login } from "../../api";
import "../Styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const { token } = await login(username, password);
      loginContext(token, username);
      alert('¡Inicio de sesión exitoso!'); // Mostrar alerta de éxito
      navigate('/home');
    } catch (error) {
      alert(`Email o Contraseña incorrectos.`); // Mostrar alerta de error
      setError(error.message); // Opcional: conservar el mensaje de error para depuración
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="background">
      <div className="shape"></div>
      <div className="shape"></div>
      <form onSubmit={handleLogin}>
        <div className="form-title">Control de Gastos</div>
        <div className="form-subtitle">Administra tus finanzas con facilidad</div>
        <h3>Login Here</h3>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Email"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Log In</button>

        <div className="social">
          <div className="go"><i className="fab fa-google"></i> Google</div>
          <div className="fb"><i className="fab fa-facebook"></i> Facebook</div>
          <div className="cred"><i className="fas fa-wallet"></i> Créditos</div>
        </div>
      </form>
      <button className='register-button' onClick={handleRegisterClick}>Registrarse</button>
      <p className="register-info">Si aún no te has registrado, hazlo aquí.</p>
    </div>
  );
};

export default Login;
