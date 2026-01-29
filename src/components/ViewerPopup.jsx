import './ViewerPopup.css';

/**
 * ViewerPopup component.
 *
 * Componente modal reutilizable que muestra contenido
 * superpuesto a la interfaz principal.
 *
 * Se cierra al hacer clic fuera del contenido o al
 * pulsar el botón de cierre.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Indica si el popup está visible
 * @param {Function} props.onClose - Función para cerrar el popup
 * @param {React.ReactNode} props.children - Contenido renderizado dentro del popup
 * @returns {JSX.Element|null} Popup con contenido o null si está cerrado
 */
export const ViewerPopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="viewer-popup-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="viewer-popup-content">
        <button className="viewer-popup-close" onClick={onClose} aria-label="Cerrar">×</button>
        {children}
      </div>
    </div>
  );
};
