import { createContext, useContext } from 'react';

// Exportar el contexto para que le provider pueda usarlo
export const NavContext = createContext(null);

 export const useNav = () => {
  const context = useContext(NavContext);

  if (!context) {
    throw new Error("useNav debe usasrse dentro del un NavProvider")
  }
  return context;
};
