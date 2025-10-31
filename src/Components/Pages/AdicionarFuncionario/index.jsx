// AdicionarFuncionarioForm.jsx
import React, { useState } from "react";

const AdicionarFuncionarioForm = ({ onAdicionar, onFechar }) => {
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [status, setStatus] = useState("Ativo");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdicionar({
      nome,
      cargo,
      status,
      dataContratacao: new Date().toLocaleDateString(),
      id: Date.now(),
    });
  };

  return (
    <form className="adicionar-funcionario" onSubmit={handleSubmit}>
      <div>
        <div>
          <h2>Adicionar Funcionário</h2>
          <button type="button" onClick={onFechar}>Fechar</button>
        </div>

        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input placeholder="Cargo" value={cargo} onChange={e => setCargo(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>

        <button type="submit">Adicionar Funcionário</button>
      </div>
    </form>
  );
};

export default AdicionarFuncionarioForm;
