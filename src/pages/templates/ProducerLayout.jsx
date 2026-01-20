import { Outlet } from 'react-router';
import { Header } from '../../components/Header';
import { ProducerNav } from './ProducerNav';

export const ProducerLayout = () => {
    return (
        <>
            <Header>
                <ProducerNav />
            </Header>
            <main className='flexColumn'>
                <Outlet />
            </main>
        </>
    );
};
