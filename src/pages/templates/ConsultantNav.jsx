import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useNav } from '../../contexts/NavContext';
import './Nav.css'

export const ConsultantNav = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const {isNavOpen, setIsNavOpen} = useNav();

    const toggleMenu = () => {
        setIsNavOpen(!isNavOpen);
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        setIsNavOpen(false);
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

            <ul className={`navMenu ${isNavOpen ? 'visible' : ''}`}>
                <li>
                <NavLink to="/consultant/alerts">Alertas</NavLink>
                </li>

                <li>
                <NavLink to="/consultant/reports">Reportes</NavLink>
                </li>

                <li>
                <NavLink to="/consultant/messages">Mensajes</NavLink>
                </li>

                <li>
                <Link to="/" onClick={handleLogout}>Logout</Link>
                </li>
            </ul>
        </nav>
    )
}
