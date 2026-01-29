import { Outlet } from 'react-router';
import { useEffect } from 'react';
import { ProducerNav } from './ProducerNav';
import { useNav } from '../../contexts/NavContext';

/**
 * ProducerLayout component.
 *
 * Layout base para las vistas del rol Productor.
 * Define la estructura común de navegación
 * y contenido de esta sección.
 *
 * @component
 * @returns {JSX.Element}
 */

export const ProducerLayout = () => {
  const { setNav } = useNav();

  useEffect(() => {
    setNav(<ProducerNav />);
    return () => setNav(null);
  }, [setNav]);

  return <Outlet />;
};
