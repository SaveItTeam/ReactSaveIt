import React, { useState, useEffect, useRef } from "react";
import "./Header.scss";
import imagemSaveIt from "../../../assets/logos/saveIt.svg";
import Navbar from "../Navbar";

const Header = () => {
  const navbarRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuarioNome, setUsuarioNome] = useState("");

  useEffect(() => {
    const nomeSalvo = localStorage.getItem("usuarioNome");
    if (nomeSalvo) setUsuarioNome(nomeSalvo);
  }, []);

  const toggleMenu = () => {
    navbarRef.current.toggleMenu();
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      <Navbar ref={navbarRef} />
      <div className="header">
        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className="administrador">
          <img src={imagemSaveIt} alt="Administrador" />
          <div>
            <p>{usuarioNome || "Administrador"}</p>
            <p>Admin</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
