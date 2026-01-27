import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import './Nav.css'

export const ConsultantNav = () => {
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
                        to='/consultant/dashboard'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Inicio
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to='/consultant/fields'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Parcelas
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to='/consultant/reports'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Reportes
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to='/consultant/messages'
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
