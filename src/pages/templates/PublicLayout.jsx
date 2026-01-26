import { Outlet } from "react-router";
import { useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useNav } from "../../contexts/NavContext";
import { HomeNav } from "../HomeNav";

import "./PublicLayout.css";


export const PublicLayout = () => {
  const { setNav } = useNav();

  useEffect(() => {
    setNav(<HomeNav />);
    return () => setNav(null);
  }, [setNav]);

  return (
    <div className="public-layout">
      <Header />
      <main className="public-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
