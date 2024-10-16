import React, { useState, useEffect, useCallback } from "react";
import { obtenerCategorias, obtenerEstructuraPorCategoria } from "./estructuraService"; 
import { insertarEstructuraEnGeoPunto } from "../geopuntos/geoPuntoEstructuraService";
import { insertarEstructurasPorProyecto } from "./estructuraProjectService";
import { insertarMaterialPorProyecto } from "../material/materialProjectService";
import { useAuth } from "../auth/AuthContext";
import "../../Styles/agregarEstructura.css";

const AgregarEstructuraModal = ({ onClose, onAgregarEstructura, geoPuntoId, proyectoId }) => {
    const { authData } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [estructuras, setEstructuras] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [estructuraSeleccionada, setEstructuraSeleccionada] = useState(null);
    const [voltajeSeleccionado, setVoltajeSeleccionado] = useState("");
    const [circuito, setCircuito] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Función para obtener categorías
    const fetchCategorias = useCallback(async () => {
        if (authData.token) {
            try {
                const data = await obtenerCategorias(authData.token);
                setCategorias(data);
                localStorage.setItem('categorias', JSON.stringify(data)); // Guardar en caché
            } catch (error) {
                console.error("Error al obtener las categorías", error);
            }
        }
    }, [authData.token]);

    // Función para refrescar estructuras según la categoría seleccionada
    const fetchEstructurasPorCategoria = useCallback(async (categoria) => {
        if (categoria && authData.token) {
            try {
                const data = await obtenerEstructuraPorCategoria(categoria, authData.token);
                setEstructuras(data);
            } catch (error) {
                console.error("Error al obtener las estructuras", error);
            }
        } else {
            setEstructuras([]);
        }
    }, [authData.token]);

    useEffect(() => {
        // Intenta cargar categorías desde el localStorage primero
        const cachedCategorias = localStorage.getItem('categorias');
        if (cachedCategorias) {
            setCategorias(JSON.parse(cachedCategorias));
        } else {
            fetchCategorias(); // Si no hay caché, obtiene desde el servidor
        }
    }, [fetchCategorias]);

    useEffect(() => {
        fetchEstructurasPorCategoria(categoriaSeleccionada);
    }, [categoriaSeleccionada, fetchEstructurasPorCategoria]);

    const handleCategoriaChange = (e) => {
        const categoria = e.target.value;
        setCategoriaSeleccionada(categoria);
    };

    const handleEstructuraChange = (e) => {
        const estructuraId = e.target.value;
        const estructura = estructuras.find(e => e.id === parseInt(estructuraId));
        setEstructuraSeleccionada(estructura);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (estructuraSeleccionada && voltajeSeleccionado && circuito) {
            setIsSubmitting(true);
            try {
                // Inserta la estructura por proyecto
                await insertarEstructurasPorProyecto(proyectoId, estructuraSeleccionada.id, authData.token);
    
                // Inserta la estructura en el geopunto
                await insertarEstructuraEnGeoPunto(geoPuntoId, estructuraSeleccionada.id, circuito, authData.token);
    
                // Inserta el material por proyecto
                await insertarMaterialPorProyecto(proyectoId, estructuraSeleccionada.id, voltajeSeleccionado, authData.token);
                
                // Refresca las estructuras de la categoría actual
                await fetchEstructurasPorCategoria(categoriaSeleccionada);

                // Llama al callback para agregar la estructura
                onAgregarEstructura(estructuraSeleccionada);
                onClose(); // Cierra el modal
            } catch (error) {
                console.error("Error al agregar la estructura:", error);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            console.error("Todos los campos son obligatorios.");
        }
    };
    
    return (
        <div className="modal-estructura-new">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <div className="modal-body">
                    <div className="modal-form">
                        <h2>Agregar Estructura</h2>
                        <form className="form-estructura-new" onSubmit={handleSubmit}>
                            {/* Categoría de Estructura */}
                            <div className="form-group">
                                <label>Categoría de Estructura:</label>
                                <select value={categoriaSeleccionada} onChange={handleCategoriaChange} required>
                                    <option value="">Selecciona una categoría</option>
                                    {categorias.map(categoria => (
                                        <option key={categoria} value={categoria}>
                                            {categoria}
                                        </option>
                                    ))}
                                </select>
                            </div>
    
                            {/* Estructura */}
                            {estructuras.length > 0 && (
                                <div className="form-group">
                                    <label>Estructura:</label>
                                    <select value={estructuraSeleccionada?.id || ""} onChange={handleEstructuraChange} required>
                                        <option value="">Selecciona una estructura</option>
                                        {estructuras.map(estructura => (
                                            <option key={estructura.id} value={estructura.id}>
                                                {estructura.codigo} - {estructura.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
    
                            {/* Voltaje */}
                            <div className="form-group">
                                <label>Seleccione el voltaje:</label>
                                <select value={voltajeSeleccionado} onChange={(e) => setVoltajeSeleccionado(e.target.value)} required>
                                    <option value="">Selecciona un voltaje</option>
                                    <option value="34kva">34kva</option>
                                    <option value="13kva">13kva</option>
                                    <option value="No aplica">No aplica</option>
                                </select>
                            </div>
    
                            {/* Circuito */}
                            <div className="form-group">
                                <label>Ingrese el circuito donde se trabaja:</label>
                                <input 
                                    type="text" 
                                    name="circuito" 
                                    value={circuito} 
                                    onChange={(e) => setCircuito(e.target.value)} 
                                    required 
                                />
                            </div>
    
                            {/* Botón de agregar */}
                            <div className="acciones">
                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Agregando..." : "Agregar Estructura"}
                                </button>
                                <button type="button" onClick={onClose}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgregarEstructuraModal;
