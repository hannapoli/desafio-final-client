import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

/**
 * PrivateRoutes
 *
 * Componente de control de acceso para rutas protegidas.
 * Restringe el acceso según el estado de autenticación
 * y los roles permitidos.
 *
 * Mientras se resuelve el estado inicial de autenticación,
 * evita renderizar o redirigir prematuramente.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes protegidos
 * @param {string[]} props.allowedRoles - Roles autorizados para acceder
 */
export const PrivateRoutes = ({ children, allowedRoles }) => {
    const { role, isLogged, initialLoading } = useAuth();

    if (initialLoading) {
        return <div>Cargando...</div>;
    }

    if (!isLogged || !allowedRoles.includes(role)) {
        return <Navigate to='/' />;
    };

    return children;
}
