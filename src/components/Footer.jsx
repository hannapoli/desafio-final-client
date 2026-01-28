import { useState } from 'react';
import { Link } from 'react-router';
import { Terminos } from './Terminos';
import { Contact } from './Contact';
import './Footer.css'

export const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <footer className='footer fullContainer flexContainer'>
        <p className='textLink' onClick={() => setShowContact(true)}>Contacto</p>
        <p className='textLink' onClick={() => setShowTerms(true)}>Términos y Condiciones</p>
        <p>&copy; 2026 AgroSync</p>
      </footer>
      <Contact showPopup={showContact} onClose={() => setShowContact(false)} />
      <Terminos showPopup={showTerms} onClose={() => setShowTerms(false)} />
    </>
  )
}
