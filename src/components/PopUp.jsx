import './PopUp.css'

export const PopUp = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="popup-content">
                <button className="popup-close" onClick={onClose}>x</button>
                {children}
            </div>
        </div>
    )
}
