import { Outlet } from 'react-router';
import { Header } from '../../components/Header';
import { DirectorNav } from './DirectorNav';

/**
 * DirectorLayout component.
 *
 * Layout base para las vistas del rol Director.
 * Define la estructura común de navegación
 * y contenido de esta sección.
 *
 * @component
 * @returns {JSX.Element}
 */

export const DirectorLayout = () => {
    return (
        <>
            <Header>
                <DirectorNav />
            </Header>
            <main className='flexColumn'>
                <Outlet />
            </main>
        </>
    );
};
