import React from "react";
import { Link } from "react-router-dom";
import { 
  BarChart2,
  PieChart,
  AlertTriangle,
  List,
  Settings,
  UserCog,
  MessageSquare // ← Ícone do Chatbot
} from "lucide-react";
import "./Navbar.scss";
import essentiaLogoBranco from "../../../assets/logos/essentiaLogoBranco.svg"

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li className="logo">
          <img className="essentiaLogoVerdeImg" src={essentiaLogoBranco} alt="Logo Essentia" />
        </li>

        <div className="menu">
          <li>
            <Link to="/dashboard">
              <BarChart2 size={22} />
              <span>Dash 1</span>
            </Link>
          </li>
          <li>
            <Link to="#">
              <PieChart size={22} />
              <span>Dash 2</span>
            </Link>
          </li>
          <li>
            <Link to="/pagamentos">
              <List size={22} />
              <span>Listar Empresas</span>
            </Link>
          </li>
          <li>
            <Link to="/painel-adm">
              <UserCog size={22} />
              <span>Administrador</span>
            </Link>
          </li>
          <li>
            <Link to="/chatbot">
              <MessageSquare size={22} />
              <span>Chatbot</span>
            </Link>
          </li>
        </div>

        <li className="settings">
          <Link to="#">
            <Settings size={22} />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
