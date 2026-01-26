import { Outlet } from 'react-router';
import { useNav } from '../../contexts/NavContext';
import { DistributorNav } from './DistributorNav';
import { useEffect } from 'react';

export const DistributorLayout = () => {
  const { setNav } = useNav();

  useEffect(() => {
    setNav(<DistributorNav />);
    return () => setNav(null);
  }, [setNav]);

  return (
    <Outlet />
  );
};
