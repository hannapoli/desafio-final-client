import { Outlet } from "react-router";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

export const AppLayout = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer className="dark" />
    </div>
  );
};
