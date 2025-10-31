import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Layout/Navbar";
import Header from "./Components/Layout/Header";
import React, { useState } from "react";

import DashboardPage from "./Components/Pages/Dashboard/DashboardPage";
import PainelFuncionarios from "./Components/Pages/PainelAdm";
import AdicionarFuncionarioForm from "./Components/Pages/AdicionarFuncionario";
import Pagamentos from "./Components/Pages/Pagamentos";
import ProdutosPage from "./Components/Pages/Produtos";
import Login from "./Components/Pages/Login";
import Chatbot from "./Components/Pages/Chatbot";
import RotaProtegida from "./Components/Pages/Routes";

export default function App() {
  const [funcionarios, setFuncionarios] = useState();

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <RotaProtegida>
            <>
              <Navbar />
              <Header />
              <DashboardPage />
            </>
          </RotaProtegida>
        }
      />
      <Route
        path="/pagamentos"
        element={
          <RotaProtegida>
            <>
              <Navbar />
              <Header />
              <Pagamentos />
            </>
          </RotaProtegida>
        }
      />
      <Route
        path="/produtos"
        element={
          <RotaProtegida>
            <>
              <Navbar />
              <Header />
              <ProdutosPage />
            </>
          </RotaProtegida>
        }
      />
      <Route
        path="/painel-adm"
        element={
          <RotaProtegida>
            <>
              <Navbar />
              <Header />
              <PainelFuncionarios
                funcionarios={funcionarios}
                onAdicionarClick={() => setShowForm(true)}
              />
            </>
          </RotaProtegida>
        }
      />
      <Route
        path="/chatbot"
        element={
          <RotaProtegida>
            <>
              <Navbar />
              <Header />
              <Chatbot />
            </>
          </RotaProtegida>
        }
      />
    </Routes>
  );
}
