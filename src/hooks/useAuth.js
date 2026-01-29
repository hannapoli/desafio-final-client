import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * 
 * Permite obtener el estado del usuario, tokens y funciones de login/logout 
 * definidos en el AuthProvider.
 * 
 * @returns {Object} El valor del contexto de autenticación (user, login, logout, etc).
 * @example
 * const { user, logout } = useAuth();
 */
export const useAuth = () => {
    return useContext(AuthContext);
}