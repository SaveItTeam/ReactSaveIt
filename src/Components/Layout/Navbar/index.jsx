import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Link } from "react-router-dom";
import {
  BarChart2,
  PieChart,
  AlertTriangle,
  List,
  UserCog,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import "./Navbar.scss";
import essentiaLogoBranco from "../../../assets/logos/essentiaLogoBranco.svg";

const Navbar = forwardRef((_, ref) => {
  const [menuAberto, setMenuAberto] = useState(false);

  useImperativeHandle(ref, () => ({
    toggleMenu: () => setMenuAberto((prev) => !prev),
    fecharMenu: () => setMenuAberto(false),
  }));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuAberto(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) setMenuAberto(false);
  };

  return (
    <>
      <nav className={`navbar ${menuAberto ? "aberta" : ""}`}>
        <ul>
          <li className="logo">
            <img src={essentiaLogoBranco} alt="Logo Essentia" />
          </li>

          <div className="menu">
            <li>
              <Link to="/dashboard" onClick={handleLinkClick}>
                <BarChart2 size={22} />
                <span>Dash 1</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard2" onClick={handleLinkClick}>
                <PieChart size={22} />
                <span>Dash 2</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard3" onClick={handleLinkClick}>
                <AlertTriangle size={22} />
                <span>Dash 3</span>
              </Link>
            </li>
            <li>
              <Link to="/pagamentos" onClick={handleLinkClick}>
                <List size={22} />
                <span>Listar Empresas</span>
              </Link>
            </li>
            <li>
              <Link to="/painel-adm" onClick={handleLinkClick}>
                <UserCog size={22} />
                <span>Administrador</span>
              </Link>
            </li>
            <li>
              <Link to="/chatbot" onClick={handleLinkClick}>
                <MessageSquare size={22} />
                <span>Chatbot</span>
              </Link>
            </li>
          </div>
          
        <li className="settings">
          <Link to="#">
            
          </Link>
        </li>
        </ul>
      </nav>
    </>
  );
});

export default Navbar;
