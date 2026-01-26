import { useState } from "react";
import { NavContext } from "./NavContext";

export const NavProvider = ({ children }) => {
    const [nav, setNav] = useState(null);
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        <NavContext.Provider value={{ nav, setNav, isNavOpen, setIsNavOpen }}>
        {children}
        </NavContext.Provider>
  );
}
