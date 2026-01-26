import { Outlet } from "react-router";
import { Footer } from "../../components/Footer";

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
