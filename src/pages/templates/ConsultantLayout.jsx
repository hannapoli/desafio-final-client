import { Outlet } from 'react-router';
import { Header } from '../../components/Header';
import { ConsultantNav } from './ConsultantNav';


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
