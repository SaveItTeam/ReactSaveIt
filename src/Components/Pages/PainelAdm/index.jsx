import React, { useEffect, useState } from "react";
import "../Produtos/Produtos.css";
import { X, Edit3, Trash2, KeyRound } from "lucide-react";

const PainelAdm = () => {
  const [dadosAdm, setDadosAdm] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [popupAcoes, setPopupAcoes] = useState(null);
  const [editarAdm, setEditarAdm] = useState(null);
  const [mostrarSenhaPopup, setMostrarSenhaPopup] = useState(false);

  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  const [popupMensagem, setPopupMensagem] = useState({ texto: "", tipo: "" });

  const [errosCadastro, setErrosCadastro] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [novoAdm, setNovoAdm] = useState({
    name: "",
    email: "",
    password: "",
    write: false,
  });

  const backendURL = "https://apisaveit.onrender.com";

  const fetchDadosAdm = async () => {
    try {
      setCarregando(true);
      const res = await fetch(`${backendURL}/api/admin/selecionar`, {
        headers: {
          Authorization: "Bearer essentiasaveit-193812-paoea-oei",
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Erro ao buscar dados do administrador");
      const data = await res.json();
      const listaSemSenha = (Array.isArray(data) ? data : [data]).map(
        ({ password, ...rest }) => rest
      );
      setDadosAdm(listaSemSenha);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchDadosAdm();
  }, []);

  const mostrarFeedback = (texto, tipo = "sucesso") => {
    setPopupMensagem({ texto, tipo });
    setTimeout(() => setPopupMensagem({ texto: "", tipo: "" }), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrosCadastro({ name: "", email: "", password: "" });

    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    let erros = {};
    let temErro = false;

    if (!novoAdm.name.trim()) {
      erros.name = "O nome é obrigatório.";
      temErro = true;
    }
    if (!novoAdm.email.trim()) {
      erros.email = "O email é obrigatório.";
      temErro = true;
    } else if (!emailRegex.test(novoAdm.email)) {
      erros.email = "Use um email válido do Gmail.";
      temErro = true;
    }
    if (!novoAdm.password.trim()) {
      erros.password = "A senha é obrigatória.";
      temErro = true;
    } else if (!senhaRegex.test(novoAdm.password)) {
      erros.password = "A senha deve ter 8+ caracteres, 1 letra maiúscula e 1 número.";
      temErro = true;
    }

    if (temErro) {
      setErrosCadastro(erros);
      return;
    }

    try {
      const res = await fetch(`${backendURL}/api/admin/inserir`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer essentiasaveit-193812-paoea-oei",
        },
        body: JSON.stringify(novoAdm),
      });

      if (!res.ok) throw new Error("Erro ao inserir administrador");
      mostrarFeedback("Funcionário cadastrado com sucesso!");
      setMostrarPopup(false);
      setNovoAdm({ name: "", email: "", password: "", write: false });
      fetchDadosAdm(); // recarrega lista
    } catch (err) {
      mostrarFeedback(err.message, "erro");
    }
  };

  const handleEditarAdm = async (e) => {
    e.preventDefault();

    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;

    if (!editarAdm.name.trim()) {
      mostrarFeedback("O nome é obrigatório.", "erro");
      return;
    }
    if (!editarAdm.email.trim()) {
      mostrarFeedback("O email é obrigatório.", "erro");
      return;
    }
    if (!emailRegex.test(editarAdm.email)) {
      mostrarFeedback("Use um email válido do Gmail.", "erro");
      return;
    }

    try {
      const res = await fetch(`${backendURL}/api/admin/atualizarParcial/${editarAdm.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer essentiasaveit-193812-paoea-oei",
        },
        body: JSON.stringify(editarAdm),
      });

      if (!res.ok) throw new Error("Erro ao atualizar funcionário");
      mostrarFeedback("Funcionário atualizado com sucesso!");
      setEditarAdm(null);
      fetchDadosAdm();
    } catch (err) {
      mostrarFeedback(err.message, "erro");
    }
  };


  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    setErroSenha("");

    if (!senhaAntiga || !novaSenha || !confirmarSenha) {
      setErroSenha("Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroSenha("As senhas novas não coincidem.");
      return;
    }

    try {
      const verificar = await fetch(`${backendURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editarAdm.email,
          password: senhaAntiga,
        }),
      });

      if (!verificar.ok) {
        setErroSenha("Senha antiga incorreta.");
        return;
      }

      const atualizar = await fetch(`${backendURL}/api/admin/atualizarParcial/${editarAdm.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer essentiasaveit-193812-paoea-oei",
        },
        body: JSON.stringify({ password: novaSenha }),
      });

      if (!atualizar.ok) throw new Error("Erro ao atualizar senha.");

      mostrarFeedback("Senha atualizada com sucesso!");
      setMostrarSenhaPopup(false);
      setSenhaAntiga("");
      setNovaSenha("");
      setConfirmarSenha("");
      fetchDadosAdm();
    } catch (err) {
      setErroSenha(err.message);
    }
  };

  const handleDeletarAdm = async (id) => {
    try {
      const res = await fetch(`${backendURL}/api/admin/excluir/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer essentiasaveit-193812-paoea-oei",
        },
      });
      if (!res.ok) throw new Error("Erro ao deletar funcionário");
      mostrarFeedback("Funcionário deletado!");
      setPopupAcoes(null);
      fetchDadosAdm();
    } catch (err) {
      mostrarFeedback(err.message, "erro");
    }
  };

  if (carregando) return <p style={{ textAlign: "center" }}>Carregando...</p>;
  if (erro) return <p style={{ color: "red", textAlign: "center" }}>{erro}</p>;

  return (
    <main>
      <section id="painel-pagamentos">
        <div id="texto-principal" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>Informações dos Administradores</h1>
            <hr />
            <p>Dados carregados do backend (sem exibir senha).</p>
          </div>
          <button style={buttonAdd} onClick={() => setMostrarPopup(true)}>
            + Funcionário
          </button>
        </div>

        {dadosAdm.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Permissão de Escrita</th>
              </tr>
            </thead>
            <tbody>
              {dadosAdm.map((adm, index) => (
                <tr key={index} onClick={() => setPopupAcoes(adm)} style={{ cursor: "pointer" }}>
                  <td>{adm.id}</td>
                  <td>{adm.name}</td>
                  <td>{adm.email}</td>
                  <td style={{ color: adm.write ? "green" : "red" }}>
                    {adm.write ? "Sim" : "Não"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>Nenhum administrador encontrado.</p>
        )}
      </section>

      {mostrarPopup || editarAdm || popupAcoes || mostrarSenhaPopup ? (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            {/* adicionar */}
            {mostrarPopup && (
              <>
                <h2>Adicionar Funcionário</h2>
                <form onSubmit={handleSubmit} style={formStyle}>
                  <label>Nome</label>
                  <input style={inputStyle} value={novoAdm.name} onChange={(e) => setNovoAdm({ ...novoAdm, name: e.target.value })} />
                  {errosCadastro.name && <p style={erroStyle}>{errosCadastro.name}</p>}

                  <label>Email</label>
                  <input style={inputStyle} value={novoAdm.email} onChange={(e) => setNovoAdm({ ...novoAdm, email: e.target.value })} />
                  {errosCadastro.email && <p style={erroStyle}>{errosCadastro.email}</p>}

                  <label>Senha</label>
                  <input type="password" style={inputStyle} value={novoAdm.password} onChange={(e) => setNovoAdm({ ...novoAdm, password: e.target.value })} />
                  {errosCadastro.password && <p style={erroStyle}>{errosCadastro.password}</p>}

                  <label style={checkboxLabelStyle}>
                    <input type="checkbox" checked={novoAdm.write} onChange={(e) => setNovoAdm({ ...novoAdm, write: e.target.checked })} />
                    Permissão de Escrita
                  </label>

                  <div style={buttonRowStyle}>
                    <button type="button" onClick={() => setMostrarPopup(false)} style={buttonStyle}>Fechar</button>
                    <button type="submit" style={buttonStyle}>Cadastrar</button>
                  </div>
                </form>
              </>
            )}

            {editarAdm && !mostrarSenhaPopup && (
              <>
                <h2>Editar Funcionário</h2>
                <form onSubmit={handleEditarAdm} style={formStyle}>
                  <label>Nome</label>
                  <input
                    style={inputStyle}
                    value={editarAdm.name}
                    onChange={(e) => setEditarAdm({ ...editarAdm, name: e.target.value })}
                  />

                  <label>Email</label>
                  <input
                    style={inputStyle}
                    value={editarAdm.email}
                    onChange={(e) => setEditarAdm({ ...editarAdm, email: e.target.value })}
                  />

                  <label style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={editarAdm.write}
                      onChange={(e) => setEditarAdm({ ...editarAdm, write: e.target.checked })}
                    />
                    Permissão de Escrita
                  </label>

                  <div style={buttonRowStyle}>
                    <button
                      type="button"
                      onClick={() => setMostrarSenhaPopup(true)}
                      style={buttonStyleEdit}
                    >
                      <KeyRound size={16} /> Alterar Senha
                    </button>

                    <button type="submit" style={buttonStyle}>Salvar</button>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setEditarAdm(null)}
                      style={{ ...buttonStyle, backgroundColor: "#e63946", width: "100%" }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            )}

            {mostrarSenhaPopup && (
              <>
                <h2>Alterar Senha</h2>
                <form onSubmit={handleAlterarSenha} style={formStyle}>
                  <label>Senha Antiga</label>
                  <input type="password" style={inputStyle} value={senhaAntiga} onChange={(e) => setSenhaAntiga(e.target.value)} />

                  <label>Nova Senha</label>
                  <input type="password" style={inputStyle} value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />

                  <label>Confirmar Nova Senha</label>
                  <input type="password" style={inputStyle} value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />

                  {erroSenha && <p style={erroStyle}>{erroSenha}</p>}

                  <div style={buttonRowStyle}>
                    <button type="button" onClick={() => setMostrarSenhaPopup(false)} style={buttonStyle}>Voltar</button>
                    <button type="submit" style={buttonStyle}>Atualizar</button>
                  </div>
                </form>
              </>
            )}

            {popupAcoes && !editarAdm && !mostrarPopup && (
              <>
                <h3 style={{marginBottom:"10px"}}>O que deseja fazer com <b>{popupAcoes.name}</b>?</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <button onClick={() => { setEditarAdm(popupAcoes); setPopupAcoes(null); }} style={buttonStyleEdit}>
                    <Edit3 size={16} /> Editar
                  </button>
                  <button onClick={() => handleDeletarAdm(popupAcoes.id)} style={{ ...buttonStyle, backgroundColor: "#e63946" }}>
                    <Trash2 size={16} /> Deletar
                  </button>
                  <button onClick={() => setPopupAcoes(null)} style={buttonStyle}>
                    <X size={16} /> Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {popupMensagem.texto && (
        <div
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            backgroundColor: popupMensagem.tipo === "erro" ? "#e63946" : "#2d6a4f",
            color: "white",
            padding: "12px 18px",
            borderRadius: "10px",
            fontWeight: "500",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            fontSize: "0.95rem",
            opacity: 0.95,
            animation: "fadeInOut 2.5s ease-in-out",
            transition: "all 0.3s ease",
          }}
        >
          {popupMensagem.texto}
        </div>
      )
    }
    </main>
  );
};

// Estilos pra reutilizar nos botao 
const overlayStyle = 
{ 
  position: "fixed", 
  top: 0, 
  left: 0, 
  width: "100vw", 
  height: "100vh", 
  backgroundColor: "rgba(0,0,0,0.4)", 
  display: "flex", 
  justifyContent: "center", 
  alignItems: "center", 
  zIndex: 9999 
};
const popupStyle = 
{ 
  backgroundColor: "#fff", 
  borderRadius: "12px", 
  width: "400px", 
  padding: "25px 30px", 
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)", 
  textAlign: "center" 
};
const inputStyle = 
{ 
  padding: "10px", 
  borderRadius: "6px", 
  border: "1px solid #ccc" 
};
const erroStyle = 
{
  color: "#d32f2f", 
  fontSize: "0.85rem", 
  marginTop: "-6px", 
  marginBottom: "4px" 
};
const checkboxLabelStyle = 
{ 
  display: "flex", 
  alignItems: "center", 
  gap: "8px", 
  marginTop: "10px" 
};
const buttonRowStyle = 
{ 
  display: "flex", 
  justifyContent: "space-between", 
  gap: "10px", 
  marginTop: "20px" 
};
const buttonStyle = 
{ 
  backgroundColor: "#2d6a4f", 
  color: "white", 
  border: "none", 
  padding: "10px 12px", 
  borderRadius: "6px", 
  cursor: "pointer", 
  fontWeight: "bold", 
  width: "100%" 
};
const buttonStyleEdit = 
{ 
  backgroundColor: "#ccc", 
  color: "#2d6a4f", 
  border: "none", 
  padding: "10px 12px", 
  borderRadius: "6px", 
  cursor: "pointer", 
  fontWeight: "bold", 
  width: "100%" 
};
const buttonAdd = 
{ 
  backgroundColor: "#2d6a4f",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer", 
  fontWeight: "bold" 
};
const formStyle = { 
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  textAlign: "left" 
};


export default PainelAdm;
