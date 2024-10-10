import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate , useLocation} from 'react-router-dom';
import { AuthProvider, useAuth } from './Components/auth/AuthContext'; // Asegúrate de que las rutas sean correctas
import Login from './Components/auth/Login';
import Register from './Components/auth/Register'; // Importa el componente de registro
import NotFound from './Pages/NotFound';
import Sidebar from './Components/sidebar'; // Ajusta la ruta según tu estructura
import Proyectos from './Components/project/projectUser'
import ViewProject from './Components/Views/viewOneProject';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/proyectos' element={<PrivateRoute><Proyectos/></PrivateRoute>} />
            <Route path="/proyecto/:id" element={<ViewProject />} /> {/* Nueva ruta para ver el proyecto */}
            {/* Añade más rutas aquí según sea necesario */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

const Layout = ({ children }) => {
  const { authData } = useAuth();
  const location = useLocation(); // Obtén la ruta actual

  // Verifica si la ruta actual es '/login' o '/register'
  const shouldShowSidebar = authData.token && !['/', '/register'].includes(location.pathname);

  return (
    <div className="main-container">
            {shouldShowSidebar && <Sidebar />}
            <div className="content">
                {children}
            </div>
        </div>
  );
};

const PrivateRoute = ({ children }) => {
  const { authData } = useAuth();
  return authData.token ? children : <Navigate to="/login" />;
};

export default App;
