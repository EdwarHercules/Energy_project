import React, { useState, useEffect } from "react";
import { obtenerCategorias, obtenerEstructuraPorCategoria } from "./estructuraService"; 
import { useAuth } from "../auth/AuthContext";
import "../../Styles/projectNew.css";

const AgregarEstructuraModal = ({ onClose, onAgregarEstructura, geoPuntoId }) => {
    const { authData } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [estructuras, setEstructuras] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [estructuraSeleccionada, setEstructuraSeleccionada] = useState(null);
    const [imagenes, setImagenes] = useState([]); // Solo si tienes un campo 'imagen'

    useEffect(() => {
        // Cargar todas las categorías al montar el componente
        if (authData.token) {
            obtenerCategorias(authData.token)
                .then(data => setCategorias(data))
                .catch(error => console.error("Error al obtener las categorías", error));
        }
    }, [authData.token]);

    const handleCategoriaChange = (e) => {
        const categoria = e.target.value;
        setCategoriaSeleccionada(categoria);
        console.log("Categoría seleccionada:", categoria); // Log para verificar el valor

        // Verificar que la categoría no esté vacía antes de hacer la llamada
        if (categoria) {
            obtenerEstructuraPorCategoria(categoria, authData.token)
                .then(data => {
                    setEstructuras(data);
                    // Asegúrate de que 'data' contenga las estructuras filtradas
                    console.log("Estructuras obtenidas:", data); // Log para verificar las estructuras
                    // Si 'imagen' está presente en la estructura, usa esto
                    // setImagenes(data.map(estructura => estructura.imagen)); // Solo si 'imagen' existe
                })
                .catch(error => console.error("Error al obtener las estructuras", error));
        } else {
            // Limpiar estructuras si no hay categoría seleccionada
            setEstructuras([]);
            // setImagenes([]); // Limpiar imágenes si es necesario
        }
    };

    const handleEstructuraChange = (e) => {
        const estructuraId = e.target.value;
        const estructura = estructuras.find(e => e.id === parseInt(estructuraId));
        setEstructuraSeleccionada(estructura);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (estructuraSeleccionada) {
            onAgregarEstructura(estructuraSeleccionada); // Llamamos al callback para agregar la estructura
            onClose(); // Cerramos el modal
        }
    };

    return (
        <div className="modal" style={{ width: "90%", height: "90%" }}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ flex: 1 }}>
                        <h2>Agregar Estructura</h2>
                        <form onSubmit={handleSubmit}>
                            <label>Categoría de Estructura:</label>
                            <select value={categoriaSeleccionada} onChange={handleCategoriaChange} required>
                                <option value="">Selecciona una categoría</option>
                                {categorias.map(categoria => (
                                    <option key={categoria} value={categoria}>
                                        {categoria}
                                    </option>
                                ))}
                            </select>

                            {estructuras.length > 0 && (
                                <>
                                    <label>Estructura:</label>
                                    <select value={estructuraSeleccionada?.id || ""} onChange={handleEstructuraChange} required>
                                        <option value="">Selecciona una estructura</option>
                                        {estructuras.map(estructura => (
                                            <option key={estructura.id} value={estructura.id}>
                                                {estructura.codigo} - {estructura.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                            
                            <button type="submit">Agregar Estructura</button>
                        </form>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h3>Imágenes de la Estructura</h3>
                        {imagenes.length > 0 ? (
                            <div className="imagenes-estruc">
                                {imagenes.map((imagen, index) => (
                                    <img key={index} src={imagen} alt="Estructura" style={{ width: "100%", marginBottom: "10px" }} />
                                ))}
                            </div>
                        ) : (
                            <p>No hay imágenes disponibles</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgregarEstructuraModal;
