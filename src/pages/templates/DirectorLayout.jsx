import { Outlet } from 'react-router';
import { DirectorNav } from './DirectorNav';
import { useEffect } from 'react';
import { useNav } from '../../contexts/NavContext';

export const DirectorLayout = () => {
    const { setNav } = useNav();

    useEffect(() => {
        setNav(<DirectorNav />);
        return () => setNav(null)
    },[setNav])

    return <Outlet />
};
