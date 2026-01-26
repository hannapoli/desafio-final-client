import { useState } from 'react';
import './ChatBot.css';
import { useAuth } from '../hooks/useAuth';

export const ChatBot = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        // console.log(user.uid, user.role);
    };

    return (
        <>
            {/* El botón para abrir el chat */}
            <button className="chatbot-button" onClick={toggleChat}>💬</button>

            {/* Chat Popup */}
            {isOpen && (
                <div className="chatbot-popup-overlay centeredContent" onClick={toggleChat}>
                    <div className="chatbot-popup-content" onClick={(e) => e.stopPropagation()}>
                        <div className="chatbot-header">
                            <h3>Chat de Soporte</h3>
                            <button className="chatbot-close-btn" onClick={toggleChat}>×</button>
                        </div>
                        <iframe
                            src={`${import.meta.env.VITE_CHATBOT_URL}?user_id=${user.uid}&rol=${user.role}`}
                            className="chatbot-iframe"
                            title="Chatbot de Soporte"
                            allow="microphone"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
