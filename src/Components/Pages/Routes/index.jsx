import React from "react";
import { Navigate } from "react-router-dom";

export default function RotaProtegida({ children }) {
  const usuarioLogado = localStorage.getItem("usuarioNome");
  if (!usuarioLogado) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Apenas redireciona para o login se nao tiver logado