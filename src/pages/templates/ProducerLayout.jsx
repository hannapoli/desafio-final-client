import { Outlet } from 'react-router';
import { useEffect } from 'react';
import { ProducerNav } from './ProducerNav';
import { useNav } from '../../contexts/NavContext';

export const ProducerLayout = () => {
  const { setNav } = useNav();

  useEffect(() => {
    setNav(<ProducerNav />);
    return () => setNav(null);
  }, [setNav]);

  return <Outlet />;
};
