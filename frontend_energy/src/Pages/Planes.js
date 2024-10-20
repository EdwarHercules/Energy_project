import React, { useState } from "react";
import "../Styles/Planes.css"; // Importa el CSS de estilos para el modal de planes
import TermsAndConditionsModal from "./TersAndCond"; // Asegúrate de la ruta correcta

const PlanesModal = ({ isOpen, onClose }) => {
  const [termsModalOpen, setTermsModalOpen] = useState(false); // Estado para el modal de términos
  const [acceptTerms, setAcceptTerms] = useState(false); // Estado para aceptar términos

  const onOpenTerms = () => {
    setTermsModalOpen(true);
  };

  const closeTermsModal = () => {
    setTermsModalOpen(false);
  };

  const handleAcceptTerms = (e) => {
    setAcceptTerms(e.target.checked);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-planes">
      <div className="modal-content-planes">
        <button onClick={onClose} className="close-button">X</button>
        <h2>No tienes permiso para acceder a estas funciones.</h2>
        <p>Para acceder a esta funcionalidad, considera adquirir uno de nuestros planes:</p>

        <div className="planes-list">
          <div className="plan">
            <h3>Plan Premium</h3>
            <p>
              <strong>Características:</strong>
            </p>
            <ul>
              <li>Crear puntos de localización.</li>
              <li>Ver el listado de estructuras y materiales.</li>
              <li>Acceder al mapa y visualizar puntos.</li>
              <li>Descargar archivos Excel.</li>
            </ul>
            <p><strong>Precio Mensual:</strong> $19.99</p>
            <p><strong>Precio Anual:</strong> $199.99</p>
          </div>
          <div className="plan">
            <h3>Plan Advanced</h3>
            <p>
              <strong>Características:</strong>
            </p>
            <ul>
              <li>Todo en el Plan Premium.</li>
              <li>Ver las estructuras en los puntos.</li>
              <li>Visualizar las imagenes de las estructuras al agregar una estructura</li>
              <li>Descargar archivos Excel, KMZ y GDB.</li>
            </ul>
            <p><strong>Precio Mensual:</strong> $39.99</p>
            <p><strong>Precio Anual:</strong> $399.99</p>
          </div>
        </div>

        <div className="terms-container">
          <label>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={handleAcceptTerms}
            />{" "}
            Acepto los Términos y Condiciones
          </label>
        </div>

        {acceptTerms && (
          <div className="email-message">
            <p>Para más información, envíanos un mensaje a través de:</p>
            <ul>
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=eduarhercules1999@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gmail-link"
                >
                  Gmail
                </a>
              </li>
              <li>
                <a
                  href="https://outlook.live.com/owa/?path=/mail/action/compose&to=eduarhercules1999@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="outlook-link"
                >
                  Outlook
                </a>
              </li>
            </ul>
          </div>
        )}

        <p>
          <button onClick={onOpenTerms} className="btn-ver-terminos">
            Ver Términos y Condiciones
          </button>
        </p>
        <button onClick={onClose} className="btn-cerrar-modal">Cerrar</button>
      </div>

      <TermsAndConditionsModal
        isOpen={termsModalOpen}
        onClose={closeTermsModal}
      />
    </div>
  );
};

export default PlanesModal;
