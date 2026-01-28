import './ViewerPopup.css';

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
