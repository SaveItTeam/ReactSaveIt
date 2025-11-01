import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logos/essentiaLogoVerde.svg";
import "./Login.scss";

export default function LoginAdm() {
  const navigate = useNavigate();
  const backendURL = "https://apisaveit.onrender.com";
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setEmailError("");
    setSenhaError("");

    const email = e.target.admEmail.value.trim();
    const senha = e.target.admSenha.value.trim();

    if (!email) {
      setEmailError("O campo de email é obrigatório.");
      return;
    }
    if (!senha) {
      setSenhaError("O campo de senha é obrigatório.");
      return;
    }

    setLoading(true);

    try {
      const loginResponse = await fetch(`${backendURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: email,
          password: senha,
        }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => null);
        throw new Error(
          (errorData && errorData.message) ||
            "Credenciais inválidas. Verifique seu email e senha."
        );
      }
      const adminResponse = await fetch(
        `${backendURL}/api/admin/buscar-por-email?email=${encodeURIComponent(
          email
        )}`,
        { credentials: "include" }
      );

      if (!adminResponse.ok) {
        const errorData = await adminResponse.json().catch(() => null);
        throw new Error(
          (errorData && errorData.message) ||
            "Erro ao buscar informações do administrador."
        );
      }

      const adminData = await adminResponse.json();

      localStorage.setItem("usuarioNome", adminData.name);
      localStorage.setItem("usuarioEmail", adminData.email);

      navigate("/pagamentos");
    } catch (err) {
      setSenhaError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adm-login-wrapper">
      <Link to="/" className="adm-btn-voltar" aria-label="Voltar para início">
        &#8249;
      </Link>

      <main className="adm-login-card" role="main">
        <img src={logo} alt="Essentia" className="adm-login-logo" />
        <h1 className="adm-login-title">Entre como administrador</h1>
        <p className="adm-login-subtitle">
          Acesse o painel para controlar informações da sua indústria.
        </p>

        <form className="adm-login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="admEmail">Email</label>
          <input
            id="admEmail"
            name="admEmail"
            type="email"
            placeholder="Digite seu email"
            autoComplete="email"
            className={emailError ? "input-error" : ""}
          />
          {emailError && <p className="adm-login-error">{emailError}</p>}

          <label htmlFor="admSenha">Senha</label>
          <input
            id="admSenha"
            name="admSenha"
            type="password"
            placeholder="Digite sua senha"
            autoComplete="current-password"
            className={senhaError ? "input-error" : ""}
          />
          {senhaError && <p className="adm-login-error">{senhaError}</p>}

          <button
            type="submit"
            className="adm-login-button"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </main>

      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="adm-svg-top"
        aria-hidden
      >
        <path
          fill="#6B8E4E"
          d="M22.3,-30.2C34.9,-26.7,55.2,-30.6,67.4,-24.7C79.6,-18.7,83.8,-3,83.3,13.1C82.7,29.3,77.4,45.9,65.4,52.8C53.4,59.7,34.7,57,20.4,54.2C6.1,51.4,-3.6,48.6,-14.3,46.4C-24.9,44.3,-36.3,42.8,-41.2,36.2C-46.2,29.6,-44.6,17.9,-45.9,6.8C-47.2,-4.3,-51.4,-14.8,-49,-23.3C-46.6,-31.8,-37.6,-38.2,-28.3,-43.1C-19.1,-48.1,-9.5,-51.7,-2.3,-48.1C4.9,-44.5,9.8,-33.6,22.3,-30.2Z"
          transform="translate(100 100)"
        />
      </svg>

      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="adm-svg-bottom"
        aria-hidden
      >
        <path
          fill="#6B8E4E"
          d="M22.3,-30.2C34.9,-26.7,55.2,-30.6,67.4,-24.7C79.6,-18.7,83.8,-3,83.3,13.1C82.7,29.3,77.4,45.9,65.4,52.8C53.4,59.7,34.7,57,20.4,54.2C6.1,51.4,-3.6,48.6,-14.3,46.4C-24.9,44.3,-36.3,42.8,-41.2,36.2C-46.2,29.6,-44.6,17.9,-45.9,6.8C-47.2,-4.3,-51.4,-14.8,-49,-23.3C-46.6,-31.8,-37.6,-38.2,-28.3,-43.1C-19.1,-48.1,-9.5,-51.7,-2.3,-48.1C4.9,-44.5,9.8,-33.6,22.3,-30.2Z"
          transform="translate(100 100)"
        />
      </svg>
    </div>
  );
}
