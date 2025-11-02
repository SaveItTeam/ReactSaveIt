import React, { useState, useEffect } from "react";
import "./Header.scss";
import imagemSaveIt from "./logoSaveit.png";
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuarioNome, setUsuarioNome] = useState("");

  useEffect(() => {
    const nomeSalvo = localStorage.getItem("usuarioNome");
    if (nomeSalvo) {
      setUsuarioNome(nomeSalvo);
    }
  }, []);

  const toggleMenu = () => {
    const nav = document.querySelector("nav");
    nav.classList.toggle("open");
    setMenuOpen(!menuOpen);
  };

  return (
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
  );
};

export default Header;
