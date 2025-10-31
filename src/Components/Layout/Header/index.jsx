import React, { useState, useEffect } from "react";
import "./Header.scss";

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
        <img src="imagem (4).jpeg" alt="Administrador" />
        <div>
          <p>{usuarioNome || "Administrador"}</p>
          <p>Admin</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
