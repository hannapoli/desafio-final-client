import './PopUp.css'

export const PopUp = ({ isOpen, onClose, children, className }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={`popup-content${className ? ' ' + className : ''}`}>
                <button className="popup-close" onClick={onClose}>x</button>
                {children}
            </div>
        </div>
    )
}
