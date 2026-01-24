import { Outlet } from 'react-router';
import { Footer } from '../../components/Footer'; // Asumiendo que tienes un componente Footer

import "./AppLayou.css"

export const AppLayout = () => {
    return (
        <div className='app-container'>
            <main className='producer-main'> 
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
