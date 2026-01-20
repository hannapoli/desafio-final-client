import { Outlet } from 'react-router';
import { Header } from '../../components/Header';
import { AnaystNav } from './AnalystNav';

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
