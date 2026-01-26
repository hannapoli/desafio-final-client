import { useState } from 'react';
import { Link } from 'react-router';
import { Terminos } from './Terminos';
import './Footer.css'

export const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <footer className='footer fullContainer flexContainer'>
        <p><Link to='#' className='textLink'>Contacto</Link></p>
        <p className='textLink' onClick={() => setShowTerms(true)}>Términos y Condiciones</p>
        <p>&copy; 2026 AgroSync</p>
      </footer>
      <Terminos showPopup={showTerms} onClose={() => setShowTerms(false)} />
    </>
  )
}
