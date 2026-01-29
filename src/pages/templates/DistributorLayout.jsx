import { Outlet } from 'react-router';
import { Header } from '../../components/Header';
import {DistributorNav} from './DistributorNav'

/**
 * DistributorLayout component.
 *
 * Layout base para las vistas del rol Distribuidor.
 * Define la estructura común de navegación
 * y contenido de esta sección.
 *
 * @component
 * @returns {JSX.Element}
 */

export const DistributorLayout = () => {
    return (
        <>
            <Header>
                <DistributorNav />
            </Header>
            <main className='flexColumn'>
                <Outlet />
            </main>
        </>
    );
};
