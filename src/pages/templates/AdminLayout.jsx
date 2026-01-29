import { Outlet } from 'react-router';
import { Header } from '../../components/Header';
import { AdminNav } from './AdminNav';

/**
 * AdminLayout component.
 *
 * Layout principal para las vistas del rol Administrador.
 * Define la estructura base y el contenedor común
 * para las páginas administrativas.
 *
 * @component
 * @returns {JSX.Element}
 */
export const AdminLayout = () => {
    return (
        <>
            <Header>
                <AdminNav />
            </Header>
            <main className='flexColumn'>
                <Outlet />
            </main>
        </>
    );
};
