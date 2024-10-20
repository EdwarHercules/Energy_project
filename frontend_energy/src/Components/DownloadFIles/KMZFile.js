import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useParams } from "react-router-dom";
import { descargarKmz, descargarGDB, descargarExcel } from "../geopuntos/geoPuntoService";
import PlanesModal from "../../Pages/Planes"; // Importa el nuevo componente de planes
import "../../Styles/Files.css";

const DescargarArchivosButton = () => {
  const { authData } = useAuth();
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  const handleDescargarKmz = async () => {
    if (isUserAllowedToDownload("KMZ")) {
      try {
        await descargarKmz(id, authData.token);
        console.log(`Archivo KMZ del proyecto ${id} descargado correctamente.`);
      } catch (error) {
        console.error("Error al descargar el archivo KMZ:", error);
      }
    } else {
      setModalOpen(true);
    }
  };

  const handleDownloadExcel = async () => {
    if (isUserAllowedToDownload("Excel")) {
      try {
        await descargarExcel(id, authData.token);
      } catch (error) {
        console.error("No se pudo descargar el archivo Excel:", error);
      }
    } else {
      setModalOpen(true);
    }
  };

  const handleDescargarGDB = async () => {
    if (isUserAllowedToDownload("GDB")) {
      try {
        await descargarGDB(id, authData.token);
      } catch (error) {
        console.error("Error al descargar el archivo GDB:", error);
      }
    } else {
      setModalOpen(true);
    }
  };

  const isUserAllowedToDownload = (fileType) => {
    const rolesAllowed = ["ROL_USER_ADMIN", "ROLE_USER_PRUEBA", "ROL_USER_ADVANCED"];
    const rolesPremium = ["ROL_USER_PREMIUM"];

    const userHasAllowedRole = authData?.roles?.some(role => rolesAllowed.includes(role));
    const userHasPremiumRole = authData?.roles?.some(role => rolesPremium.includes(role)) && fileType === "Excel";

    return userHasAllowedRole || userHasPremiumRole;
  };

  return (
    <div className="descargar-archivos-container">
      <div className="botones">
        <button onClick={handleDescargarKmz} className="btn-descargar-kmz">
          Descargar KMZ
        </button>
        <button onClick={handleDownloadExcel} className="btn-descargar-excel">
          Descargar Excel
        </button>
        <button onClick={handleDescargarGDB} className="btn-descargar-gdb">
          Descargar GDB
        </button>
      </div>

      <PlanesModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  );
};

export default DescargarArchivosButton;
