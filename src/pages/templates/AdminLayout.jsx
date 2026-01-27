import { Outlet } from 'react-router';
import { Header } from '../../components/Header';
import { AdminNav } from './AdminNav';

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
