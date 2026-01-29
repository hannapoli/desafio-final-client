import { createContext, useContext } from 'react';

// Exportar el contexto para que le provider pueda usarlo
/**
 * Contexto para el control de la navegación y menús.
 * Permite gestionar de forma global qué elementos de la interfaz mostrar según el flujo de la aplicación.
 */
export const NavContext = createContext(null);

/**
 * Hook para acceder a las funciones y estado del NavContext.
 * @returns {Object} Valores del contexto de navegación.
 * @throws {Error} Si se utiliza fuera del NavProvider.
 */
 export const useNav = () => {
  const context = useContext(NavContext);

  if (!context) {
    throw new Error("useNav debe usasrse dentro del un NavProvider")
  }
  return context;
};
