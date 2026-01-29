import { Outlet } from 'react-router';
import { Header } from '../../components/Header';
import { AnaystNav } from './AnalystNav';

/**
 * AuthLayout component.
 *
 * Layout utilizado para las páginas de autenticación.
 * Proporciona una estructura común para login,
 * registro y flujos relacionados con acceso de usuarios.
 *
 * @component
 * @returns {JSX.Element}
 */

export const AnalystLayout = () => {
    return (
        <>
            <Header>
                <AnaystNav />
            </Header>
            <main className='flexColumn'>
                <Outlet />
            </main>
        </>
    );
};
