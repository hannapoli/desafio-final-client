import { Outlet } from 'react-router';
import { Header } from '../../components/Header';
import { ConsultantNav } from './ConsultantNav';

/**
 * ConsultantLayout component.
 *
 * Layout base para las vistas del rol Consultor.
 * Define la estructura común de navegación
 * y contenido para este perfil.
 *
 * @component
 * @returns {JSX.Element}
 */

export const ConsultantLayout = () => {
    return (
        <>
            <Header>
                <ConsultantNav />
            </Header>
            <main className='flexColumn'>
                <Outlet />
            </main>
        </>
    );
};
