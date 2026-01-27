import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useNav } from '../../contexts/NavContext';
import './Nav.css'

export const ProducerNav = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isNavOpen, setIsNavOpen } = useNav();

  const toggleMenu = () => setIsNavOpen(!isNavOpen);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    setIsNavOpen(false);
    navigate('/');
  };

    return (
        <nav className='flexContainer'>
            <Link to='/' className='navbar-brand' style={{ textDecoration: 'none' }}>
                <img className="logo" src="/logo.png" alt="AgroSync" />
                <span className="brand-name">AgroSync</span>
            </Link>

            <div className='navMenuIcon' onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className={`navMenu ${isNavOpen ? 'visible' : ''}`}>
                <li>
                    <NavLink
                        to='/producer/dashboard'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Inicio
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/producer/fields/all'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Mis parcelas
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/producer/reports'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Reportes
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to='/producer/messages'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Mensajes
                    </NavLink>
                </li>
                <li>
                    <Link to='/' onClick={handleLogout} className="logout-link">Logout</Link>
                </li>
            </ul>
        </nav>
    );
};
