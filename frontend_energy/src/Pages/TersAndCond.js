import React from "react";
import "../Styles/TerAndCond.css"; // Asegúrate de crear un archivo CSS para estilos

const TermsAndConditionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-terminos">
      <div className="modal-content-terminos">
        <div className="modal-header">
          <h2>Términos y Condiciones</h2>
          <button onClick={onClose} className="btn-cerrar-terminos">X</button> {/* Botón de cerrar */}
        </div>
        <div className="modal-body">
          <p>
            Al utilizar nuestra aplicación, aceptas los siguientes términos y condiciones. Si no estás de acuerdo, te recomendamos que no utilices el servicio.
          </p>
          <ul>
            <li>
              <strong>1. Aceptación de los Términos:</strong> Al acceder y utilizar esta aplicación, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo, no debes usar la aplicación.
            </li>
            <li>
              <strong>2. Modificaciones de los Términos:</strong> Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones se publicarán en esta página y entrarán en vigor de inmediato. Tu uso continuado de la aplicación después de cualquier cambio constituirá tu aceptación de los nuevos términos.
            </li>
            <li>
              <strong>3. Propiedad de Datos:</strong> Todos los datos y contenido que subas a la aplicación son de tu propiedad. Sin embargo, al utilizar nuestros servicios, nos otorgas un derecho no exclusivo, transferible, sublicenciable y libre de regalías para utilizar, reproducir, modificar, publicar y distribuir dicho contenido.
            </li>
            <li>
              <strong>4. Uso de la Aplicación:</strong> Te comprometes a usar la aplicación solo para fines legales y de acuerdo con todas las leyes aplicables. No podrás utilizar la aplicación para ningún propósito fraudulento o no autorizado.
            </li>
            <li>
              <strong>5. Limitación de Responsabilidad:</strong> La aplicación se proporciona "tal cual" y "según disponibilidad". No garantizamos que la aplicación sea ininterrumpida, libre de errores o segura. En ningún caso seremos responsables por daños directos, indirectos, incidentales, especiales, consecuentes o punitivos que surjan de tu uso o incapacidad para usar la aplicación.
            </li>
            <li>
              <strong>6. Indemnización:</strong> Aceptas indemnizar y mantener indemne a la aplicación, sus afiliados, directores, empleados y agentes de cualquier reclamación, daño, pérdida, responsabilidad o gasto, incluidos honorarios de abogados, que surjan de tu uso de la aplicación o de tu incumplimiento de estos términos.
            </li>
            <li>
              <strong>7. Enlaces a Terceros:</strong> La aplicación puede contener enlaces a sitios web de terceros. No somos responsables del contenido, políticas de privacidad o prácticas de esos sitios. Te recomendamos que leas los términos y condiciones y las políticas de privacidad de cualquier sitio web de terceros que visites.
            </li>
            <li>
              <strong>8. Ley Aplicable:</strong> Estos términos se regirán e interpretarán de acuerdo con las leyes del país donde operamos, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
            </li>
            <li>
              <strong>9. Modificación del Servicio:</strong> Nos reservamos el derecho de modificar o descontinuar la aplicación, o cualquier parte de ella, en cualquier momento y sin previo aviso.
            </li>
            <li>
              <strong>10. Contacto:</strong> Si tienes preguntas sobre estos términos, contáctanos a través del correo electrónico proporcionado en la aplicación.
            </li>
          </ul>
        </div>
        <button onClick={onClose} className="btn-cerrar-terminos">Cerrar</button>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
