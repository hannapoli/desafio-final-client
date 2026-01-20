import { Outlet } from 'react-router';
import { Header } from '../../components/Header';
import { DirectorNav } from './DirectorNav';

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
