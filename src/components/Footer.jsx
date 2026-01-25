import {Link} from 'react-router';
import './Footer.css'

export const Footer = () => {
  return (
    <footer className='footer fullContainer flexContainer'>
        <p>&copy; 2026 AgroSync</p>
        <p><Link to='#'>Todos derechos reservados</Link></p>
      </footer>
  )
}
