import { useState } from 'react';
import { PopUp } from './PopUp';
import './PopUp.css';

export const Contact = ({ showPopup, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess('');
        //Provisionalmente solo mostramos el mensaje de éxito.
        //En el futuro se implementará el envío real del formulario con Nodemailer o SendGrid.
        setSuccess('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(onClose, 3000);
    };

    return (
        <PopUp isOpen={showPopup} setSuccess={setSuccess} onClose={onClose}>
            <div className="contact-container">
                <h2 className="contact-title">Contáctanos</h2>
                <div className="contact-info">
                    <h3>AgroSync - Innovación Agrícola</h3>
                    <p>📍 Florida Kalea 56 01005, Vitoria-Gasteiz, España</p>
                    <p>📞 +34 945 123 456</p>
                    <p>✉️ contacto@agrosync.com</p>
                    <p>🕒 Lunes a Viernes: 9:00 - 17:30</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                    <h3>Envíanos un mensaje</h3>

                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="register-input"
                            placeholder="Tu nombre completo"
                            noValidate
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="register-input"
                            placeholder="tu@email.com"
                            noValidate
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Mensaje</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="register-input contact-textarea"
                            placeholder="Escribe tu mensaje aquí..."
                            rows="5"
                            noValidate
                        />
                    </div>

                    <button type="submit" className="register-btn contact-submit">
                        Enviar
                    </button>
                    {success && <p className="success-message">{success}</p>}

                </form>
            </div>
        </PopUp>
    );
};
