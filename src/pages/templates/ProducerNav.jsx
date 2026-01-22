import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import './Nav.css'

export const ProducerNav = () => {
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
            <Link to='/' className='navLogo'>AgroSync</Link>

            <div className='navMenuIcon' onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className={`navMenu ${isMenuOpen ? 'visible' : ''}`}>
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
                        to='/producer/fields/manage'
                        className={({ isActive }) => isActive ? 'nav-link-active' : ''}>
                        Gestionar parcelas
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
                    <Link to='/' onClick={handleLogout}>Logout</Link>
                </li>
            </ul>
        </nav>
    )
}
