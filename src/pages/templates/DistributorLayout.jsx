import { Outlet } from 'react-router';
import { Header } from '../../components/Header';
import {DistributorNav} from './DistributorNav'

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
