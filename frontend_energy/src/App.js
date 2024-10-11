import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate , useLocation} from 'react-router-dom';
import { AuthProvider, useAuth } from './Components/auth/AuthContext'; 
import Login from './Components/auth/Login';
import Register from './Components/auth/Register'; 
import NotFound from './Pages/NotFound';
import Sidebar from './Components/sidebar'; 
import Proyectos from './Components/project/projectUser'
import ProjectLayout from './Components/Views/viewOneProject';
import GeoPuntoUser from './Components/geopuntos/geoPuntoList';
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
            <Route path="/proyectos/:id" element={<PrivateRoute><ProjectLayout /></PrivateRoute>}>
              <Route path="geoPuntos" element={<GeoPuntoUser />} />
              {/* Otras rutas dentro de un proyecto */}
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

const Layout = ({ children }) => {
  const { authData } = useAuth();
  const location = useLocation();

  // Mostrar Sidebar general excepto en login o register
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
