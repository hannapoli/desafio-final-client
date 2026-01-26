import { useEffect } from "react";
import { useNav } from "../contexts/NavContext"
import './Header.css'

export const Header = ({ children }) => {
const { nav, isNavOpen, setIsNavOpen } = useNav();

// 🔑 CIERRE GLOBAL POR TECLADO
  useEffect(() => {
    if (!isNavOpen) return;

    const handleKeyDown = () => {
      setIsNavOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNavOpen, setIsNavOpen]);

  // 🔑 CIERRE GLOBAL POR CLICK EN CUALQUIER LINK/BOTÓN DEL NAV
  const handleHeaderClick = (e) => {
    if (!isNavOpen) return;

    const target = e.target;

    // Si se hace click en un enlace o botón
    if (
      target.closest('a') ||
      target.closest('button')
    ) {
      setIsNavOpen(false);
    }
  };


    return (
        <header className='Header-global fullContainer' onClickCapture={handleHeaderClick}>
            {nav}
            {children}
        </header>
    )
}
