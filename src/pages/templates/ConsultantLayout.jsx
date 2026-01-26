import { Outlet } from 'react-router';
import { ConsultantNav } from './ConsultantNav';
import { useEffect } from 'react';
import { useNav } from '../../contexts/NavContext';


export const ConsultantLayout = () => {
    const { setNav } = useNav()

    useEffect(() => {
        setNav(<ConsultantNav />);
        return () => setNav(null)
    },[setNav])

    return <Outlet />
};
