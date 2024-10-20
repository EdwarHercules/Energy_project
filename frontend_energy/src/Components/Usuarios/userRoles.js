import React, { useEffect, useState } from 'react';
import { obtenerUsuarios, obtenerRoles, asignarRolAUsuario, eliminarRolDeUsuario } from '../auth/UsuariosService'; // Ajusta la ruta de tus servicios
import { useAuth } from '../auth/AuthContext'; // Tu contexto de autenticación

import "../../Styles/AllProjectsPerUser.css";

const UsuariosConRoles = () => {
  const { authData } = useAuth(); // Obtener la información de autenticación (token, roles, etc.)
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]); // Nuevo estado para los roles
  const [nuevoRol, setNuevoRol] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Cambia a la cantidad de elementos que desees por página

  // Verificar si el usuario tiene el rol ROL_USER_ADMIN
  const esAdmin = authData?.roles?.includes('ROLE_USER_PRUEBA');

  // Cargar la lista de usuarios y roles
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const usuariosData = await obtenerUsuarios(authData.token);
        const rolesData = await obtenerRoles(authData.token); // Cargar roles
        setUsuarios(usuariosData);
        setRoles(rolesData); // Establecer roles
      } catch (error) {
        setError('Error al cargar los usuarios o roles');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [authData.token]);

  // Función para asignar un rol a un usuario
  const manejarAsignarRol = async () => {
    if (!usuarioSeleccionado || !nuevoRol) {
      setError('Debes seleccionar un usuario y un rol');
      return;
    }

    try {
      await asignarRolAUsuario(usuarioSeleccionado, nuevoRol, authData.token);
      alert('Rol asignado con éxito');
      setUsuarioSeleccionado('');
      setNuevoRol('');
      // Recargar los usuarios y roles con los datos actualizados
      const usuariosData = await obtenerUsuarios(authData.token);
      setUsuarios(usuariosData);
    } catch (error) {
      setError('Error al asignar el rol');
    }
  };

  // Función para eliminar un rol de un usuario
  const manejarEliminarRol = async (usuarioId, rolId) => {
    try {
      await eliminarRolDeUsuario(usuarioId, rolId, authData.token);
      alert('Rol eliminado con éxito');
      // Recargar los usuarios con los roles actualizados
      const usuariosData = await obtenerUsuarios(authData.token);
      setUsuarios(usuariosData);
    } catch (error) {
      setError('Error al eliminar el rol');
    }
  };

  if (!esAdmin) {
    return <p>No tienes permiso para ver esta página.</p>;
  }

  // Paginación
  const indexOfLastUsuario = currentPage * itemsPerPage;
  const indexOfFirstUsuario = indexOfLastUsuario - itemsPerPage;
  const currentUsuarios = usuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);
  const totalPages = Math.ceil(usuarios.length / itemsPerPage);

  const handleNextFive = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 5, totalPages));
  };

  const handlePrevFive = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 5, 1));
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  return (
    <div className="container-projects-user">
      <div className="main-content-user">
        <h2>Gestión de Usuarios y Roles</h2>
        {/* Formulario para asignar un nuevo rol */}
        <div style={{ marginTop: '20px' }}>
          <h3>Asignar nuevo rol a un usuario</h3>
          <div>
            <label>Seleccionar Usuario: </label>
            <select value={usuarioSeleccionado} onChange={(e) => setUsuarioSeleccionado(e.target.value)}>
              <option value="">-- Seleccionar Usuario --</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Seleccionar Rol: </label>
            <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)}>
              <option value="">-- Seleccionar Rol --</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>

          <button onClick={manejarAsignarRol} style={{ marginTop: '10px' }}>
            Asignar Rol
          </button>
        </div>
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Tabla de usuarios con sus roles */}
            <div className="table-container-accounts-user">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Roles</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                {currentUsuarios.map((usuario) => 
                  usuario.roles.map((rol, index) => (
                    <tr key={`${usuario.id}-${index}`}>
                      <td>{usuario.nombre}</td>
                      <td>{rol}</td>
                      <td>
                        <button onClick={() => manejarEliminarRol(usuario.id, rol)}>
                          Eliminar Rol
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              </table>
            </div>

            {/* Paginación */}
            <div className="pagination">
              <button onClick={handleFirstPage}>Primero</button>
              <button onClick={handlePrevFive}>-5</button>
              {[...Array(totalPages).keys()].slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages)).map(page => (
                <button
                  key={page + 1}
                  onClick={() => setCurrentPage(page + 1)}
                  className={currentPage === page + 1 ? "active" : ""}
                >
                  {page + 1}
                </button>
              ))}
              <button onClick={handleNextFive}>+5</button>
              <button onClick={handleLastPage}>Último</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UsuariosConRoles;
