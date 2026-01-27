import { Outlet } from "react-router";
import { Header } from "../../components/Header";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNav } from "../../contexts/NavContext";

import { ProducerNav } from "./ProducerNav";
import { ConsultantNav } from "./ConsultantNav";
import { DirectorNav } from "./DirectorNav";
// (añade AnalystNav / DistributorNav si existen)

export const ChatLayout = () => {
  const { role } = useAuth();
  const { setNav } = useNav();

  useEffect(() => {
    switch (role) {
      case 'productor':
        setNav(<ProducerNav />);
        break;
      case 'asesor':
        setNav(<ConsultantNav />);
        break;
      case 'director':
        setNav(<DirectorNav />);
        break;
      default:
        setNav(null);
    }

    return () => setNav(null);
  }, [role, setNav]);

  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      {/* SIN FOOTER */}
    </div>
  );
};
