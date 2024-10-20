import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useParams } from "react-router-dom";
import {
    obtenerEstructurasPorProyecto,
} from "../estructuras/estructuraProjectService";
import { obtenerMaterialPorProyecto, obtenerDistintosMaterialPorProyecto } from "../material/materialProjectService";

const EstructurasMaterialesProject = () => {
    const { authData } = useAuth();
    const { id } = useParams();

    const [estructuras, setEstructuras] = useState([]);
    const [materiales, setMateriales] = useState([]);
    const [materialesDistintos, setMaterialesDistintos] = useState([]);

    const [tablaActual, setTablaActual] = useState("estructuras");

    const [currentPageEstructuras, setCurrentPageEstructuras] = useState(1);
    const [currentPageMateriales, setCurrentPageMateriales] = useState(1);
    const [currentPageMaterialesDistintos, setCurrentPageMaterialesDistintos] = useState(1);
    const [itemsPerPage] = useState(10);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const estructurasData = await obtenerEstructurasPorProyecto(id, authData.token);
                const materialesData = await obtenerMaterialPorProyecto(id, authData.token);
                const materialesDistintosData = await obtenerDistintosMaterialPorProyecto(id, authData.token);

                // Verificamos si los datos recibidos son diferentes a los guardados en caché
                const cachedEstructuras = localStorage.getItem(`estructuras_${id}`);
                const cachedMateriales = localStorage.getItem(`materiales_${id}`);
                const cachedMaterialesDistintos = localStorage.getItem(`materialesDistintos_${id}`);

                if (JSON.stringify(estructurasData) !== cachedEstructuras) {
                    setEstructuras(estructurasData);
                    localStorage.setItem(`estructuras_${id}`, JSON.stringify(estructurasData));
                }

                if (JSON.stringify(materialesData) !== cachedMateriales) {
                    setMateriales(materialesData);
                    localStorage.setItem(`materiales_${id}`, JSON.stringify(materialesData));
                }

                if (JSON.stringify(materialesDistintosData) !== cachedMaterialesDistintos) {
                    setMaterialesDistintos(materialesDistintosData);
                    localStorage.setItem(`materialesDistintos_${id}`, JSON.stringify(materialesDistintosData));
                }
            } catch (error) {
                console.error("Error al cargar los datos del proyecto", error);
            }
        };

        // Carga inicial desde caché
        const cachedEstructuras = localStorage.getItem(`estructuras_${id}`);
        const cachedMateriales = localStorage.getItem(`materiales_${id}`);
        const cachedMaterialesDistintos = localStorage.getItem(`materialesDistintos_${id}`);

        if (cachedEstructuras && cachedMateriales && cachedMaterialesDistintos) {
            setEstructuras(JSON.parse(cachedEstructuras));
            setMateriales(JSON.parse(cachedMateriales));
            setMaterialesDistintos(JSON.parse(cachedMaterialesDistintos));
        }

        // Realizar la llamada a la API para verificar datos nuevos
        fetchData();

    }, [authData.token, id]);

    const indexOfLastEstructura = currentPageEstructuras * itemsPerPage;
    const indexOfFirstEstructura = indexOfLastEstructura - itemsPerPage;
    const currentEstructuras = estructuras.slice(indexOfFirstEstructura, indexOfLastEstructura);
    const totalPagesEstructuras = Math.ceil(estructuras.length / itemsPerPage);

    const indexOfLastMaterial = currentPageMateriales * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentMateriales = materiales.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPagesMateriales = Math.ceil(materiales.length / itemsPerPage);

    const indexOfLastMaterialDistinto = currentPageMaterialesDistintos * itemsPerPage;
    const indexOfFirstMaterialDistinto = indexOfLastMaterialDistinto - itemsPerPage;
    const currentMaterialesDistintos = materialesDistintos.slice(indexOfFirstMaterialDistinto, indexOfLastMaterialDistinto);
    const totalPagesMaterialesDistintos = Math.ceil(materialesDistintos.length / itemsPerPage);

    const handleNextFive = (setCurrentPage) => {
        setCurrentPage((prevPage) => Math.min(prevPage + 5, totalPagesEstructuras));
    };

    const handlePrevFive = (setCurrentPage) => {
        setCurrentPage((prevPage) => Math.max(prevPage - 5, 1));
    };

    const handleFirstPage = (setCurrentPage) => {
        setCurrentPage(1);
    };

    const handleLastPage = (setCurrentPage) => {
        setCurrentPage(totalPagesEstructuras);
    };
    return (
        <div className="container-projects">
            {authData.token ? (
                <div className="main-content">
                    <h2>Detalles del Proyecto</h2>

                    {/* Botones para cambiar de tabla */}
                    <div>
                        <button onClick={() => setTablaActual("estructuras")}>Estructuras</button>
                        <button onClick={() => setTablaActual("materiales")}>Materiales</button>
                        <button onClick={() => setTablaActual("materialesDistintos")}>Materiales Distintos</button>
                    </div>

                    {/* Mostrar tabla según la selección */}
                    {tablaActual === "estructuras" && (
                        <div>
                            <h3>Listado de Estructuras</h3>
                            <div className="table-container-accounts">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Descripción</th>
                                            <th>Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentEstructuras.map((estructura) => (
                                            <tr key={estructura.id}>
                                                <td>{estructura.id}</td>
                                                <td>{estructura.estructura.codigo}</td>
                                                <td>{estructura.estructura.nombre}</td>
                                                <td>{estructura.cantidad}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination">
                                <button onClick={() => handleFirstPage(setCurrentPageEstructuras)}>Primero</button>
                                <button onClick={() => handlePrevFive(setCurrentPageEstructuras)}>-5</button>
                                {[...Array(totalPagesEstructuras).keys()].slice(Math.max(currentPageEstructuras - 3, 0), Math.min(currentPageEstructuras + 2, totalPagesEstructuras)).map(page => (
                                    <button
                                        key={page + 1}
                                        onClick={() => setCurrentPageEstructuras(page + 1)}
                                        className={currentPageEstructuras === page + 1 ? "active" : ""}
                                    >
                                        {page + 1}
                                    </button>
                                ))}
                                <button onClick={() => handleNextFive(setCurrentPageEstructuras)}>+ 5</button>
                                <button onClick={() => handleLastPage(setCurrentPageEstructuras)}>Último</button>
                            </div>
                        </div>
                    )}

                    {tablaActual === "materiales" && (
                        <div>
                            <h3>Listado de Materiales</h3>
                            <div className="table-container-accounts">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Unidad</th>
                                            <th>Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentMateriales.map((material) => (
                                            <tr key={material.id}>
                                                <td>{material.id}</td>
                                                <td>{material.material.nombre}</td>
                                                <td>{material.unidad}</td>
                                                <td>{material.cantidad}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination">
                                <button onClick={() => handleFirstPage(setCurrentPageMateriales)}>Primero</button>
                                <button onClick={() => handlePrevFive(setCurrentPageMateriales)}>-5</button>
                                {[...Array(totalPagesMateriales).keys()].slice(Math.max(currentPageMateriales - 3, 0), Math.min(currentPageMateriales + 2, totalPagesMateriales)).map(page => (
                                    <button
                                        key={page + 1}
                                        onClick={() => setCurrentPageMateriales(page + 1)}
                                        className={currentPageMateriales === page + 1 ? "active" : ""}
                                    >
                                        {page + 1}
                                    </button>
                                ))}
                                <button onClick={() => handleNextFive(setCurrentPageMateriales)}>+5</button>
                                <button onClick={() => handleLastPage(setCurrentPageMateriales)}>Último</button>
                            </div>
                        </div>
                    )}

                    {tablaActual === "materialesDistintos" && (
                        <div>
                            <h3>Listado de Materiales Distintos</h3>
                            <div className="table-container-accounts">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre del Material</th>
                                            <th>Unidad</th>
                                            <th>Cantidad Distinta</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentMaterialesDistintos && currentMaterialesDistintos.length > 0 ? (
                                            currentMaterialesDistintos.map((materialDistinto) => {
                                                // Verifica que materialDistinto y materialDistinto.material estén definidos
                                                if (materialDistinto && materialDistinto.material) {
                                                    return (
                                                        <tr key={materialDistinto.material.id}>
                                                            <td>{materialDistinto.material.id}</td>
                                                            <td>{materialDistinto.material.nombre}</td>
                                                            <td>{materialDistinto.unidad}</td>
                                                            <td>{materialDistinto.cantidad}</td>
                                                        </tr>
                                                    );
                                                } else {
                                                    // Maneja el caso en que no hay datos válidos
                                                    return null; // O puedes mostrar un mensaje alternativo
                                                }
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={4}>No hay materiales disponibles.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="pagination">
                                <button onClick={() => handleFirstPage(setCurrentPageMaterialesDistintos)}>Primero</button>
                                <button onClick={() => handlePrevFive(setCurrentPageMaterialesDistintos)}>-5</button>
                                {[...Array(totalPagesMaterialesDistintos).keys()].slice(Math.max(currentPageMaterialesDistintos - 3, 0), Math.min(currentPageMaterialesDistintos + 2, totalPagesMaterialesDistintos)).map(page => (
                                    <button
                                        key={page + 1}
                                        onClick={() => setCurrentPageMaterialesDistintos(page + 1)}
                                        className={currentPageMaterialesDistintos === page + 1 ? "active" : ""}
                                    >
                                        {page + 1}
                                    </button>
                                ))}
                                <button onClick={() => handleNextFive(setCurrentPageMaterialesDistintos)}>+5</button>
                                <button onClick={() => handleLastPage(setCurrentPageMaterialesDistintos)}>Último</button>
                            </div>
                        </div>
                    )}


                </div>
            ) : (
                <p>No estás autorizado</p>
            )}
        </div>
    );
};

export default EstructurasMaterialesProject;
