import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import './Nav.css'

/**
 * DistributorNav component.
 *
 * Barra de navegación específica del rol Distribuidor.
 * Permite acceder a dashboards y vistas
 * relacionadas con su actividad.
 *
 * @component
 * @returns {JSX.Element}
 */

export const DistributorNav = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
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

            <ul className={`navMenu ${isMenuOpen ? 'visible' : ''}`}>
                <li>
                    <NavLink
                        to='/distributor/dashboard'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Inicio
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to='/distributor/routes'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Mis rutas
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to='/distributor/messages'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Mensajes
                    </NavLink>
                </li>

                <li>
                    <Link to='/' onClick={handleLogout}>Logout</Link>
                </li>
            </ul>
        </nav>
    )
}
