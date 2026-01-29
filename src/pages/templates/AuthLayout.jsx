import { Outlet } from "react-router";
import { Footer } from "../../components/Footer";

/**
 * AuthLayout component.
 *
 * Layout utilizado para las páginas de autenticación.
 * Proporciona una estructura común para vistas como
 * login y registro, incluyendo un footer compartido.
 *
 * @component
 * @returns {JSX.Element}
 */

export const AuthLayout = () => {
  return (
    <div>
      <main className="auth-layout">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
