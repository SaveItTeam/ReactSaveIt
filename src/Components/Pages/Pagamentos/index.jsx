import React, { useState, useEffect } from "react";
import "./Pagamentos.scss";
import { useNavigate } from "react-router-dom";
import { Mail, Eye, X } from "lucide-react";

const PainelPagamentos = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [mensagemEmail, setMensagemEmail] = useState("");
  const [popupAcoes, setPopupAcoes] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(false);
  const [empresaCarregandoProdutos, setEmpresaCarregandoProdutos] = useState(null);
  const navigate = useNavigate();

  const backendURL = "https://apisaveit.onrender.com";

  const loginBackend = async () => {
    try {
      const response = await fetch(`${backendURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "paulino@gmail.com", password: "Senha1234" }),
        credentials: "include",
      });
      const text = await response.text();
      const data = JSON.parse(text);
      if (response.ok) setAutenticado(true);
      else throw new Error(data.error || "Falha no login");
    } catch (err) {
      setErro(err.message);
      setLoading(false);
    }
  };

  const fetchPagamentos = async () => {
    try {
      const response = await fetch(`${backendURL}/api/payments/detailed`, {
        credentials: "include",
      });
      const text = await response.text();
      const data = JSON.parse(text);
      setPagamentos(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpresa = async (id) => {
    try {
      const res = await fetch(`${backendURL}/api/enterprise/listarId/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setEmpresaSelecionada(data);
    } catch (err) {
      console.error(err);
    }
  };


  const fetchProdutos = async (enterpriseId) => {
    try {
      setCarregandoProdutos(true);
      setEmpresaCarregandoProdutos(enterpriseId);
      setProdutos([]);
      const res = await fetch(`${backendURL}/api/product/with-showcase-status/${enterpriseId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setProdutos(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setErro("Erro ao carregar produtos");
    } finally {
      setCarregandoProdutos(false);
      setEmpresaCarregandoProdutos(null);
    }
  };

  const enviarEmail = () => {
    if (!empresaSelecionada?.email) {
      alert("Esta empresa não possui email cadastrado.");
      return;
    }
    const email = empresaSelecionada.email;
    const dominio = email.split("@")[1].toLowerCase();
    const assunto = encodeURIComponent(
      `Atualização sobre o pagamento - ${empresaSelecionada.name || "Empresa"}`
    );
    const corpo = encodeURIComponent(mensagemEmail || "Olá, tudo bem?");
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${assunto}&body=${corpo}`;
    const outlook = `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${assunto}&body=${corpo}`;
    if (dominio.includes("gmail")) return window.open(gmail, "_blank");
    if (dominio.includes("outlook") || dominio.includes("hotmail") || dominio.includes("live"))
      return window.open(outlook, "_blank");
    window.location.href = `mailto:${email}?subject=${assunto}&body=${corpo}`;
  };

  useEffect(() => {
    loginBackend();
  }, []);

  useEffect(() => {
    if (autenticado) fetchPagamentos();
  }, [autenticado]);

  const getStatusColor = (status) => {
    if (!status) return "#E6A122";
    const s = status.toLowerCase();
    if (s === "ativo") return "#6B8E4E";
    if (s === "inativo") return "#E63C22";
    return "#E6A122";
  };

  if (loading) return <p style={{ textAlign: "center" }}>Carregando pagamentos...</p>;
  if (erro) return <p style={{ color: "red", textAlign: "center" }}>{erro}</p>;

  return (
    <main>
      <section id="painel-pagamentos">
        <div id="texto-principal">
          <div>
            <h1>Gerencie sua assinatura</h1>
            <hr />
            <p>Clique em uma empresa para visualizar detalhes.</p>
          </div>
        </div>

        {carregandoProdutos ? (
          <div className="carregando-produtos">
            <div className="spinner"></div>
            <p>Carregando produtos da empresa...</p>
          </div>
        ) : produtos.length > 0 ? (
          <div className="produtos-lista">
            <h2>Produtos da empresa</h2>
            {produtos.map((p, i) => (
              <div key={i} className="produto-item">
                <p><strong>Nome:</strong> {p.nomeProduto}</p>
                <p><strong>Validade:</strong> {new Date(p.dataValidade).toLocaleDateString("pt-BR")}</p>
                <p><strong>Na vitrine:</strong> {p.estaNaVitrine}</p>
                <p><strong>Quantidade:</strong> {p.quantidadeVitrine}</p>
              </div>
            ))}
            <div className="modal-buttons">
              <button onClick={() => setProdutos([])}>Voltar</button>
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Plano</th>
                <th>Data do Pagamento</th>
                <th>Valor</th>
                <th>Status</th>
                <th>ID</th>
                <th>Forma de Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((p, i) => {
                const dataFormatada = p.paymentDate
                  ? new Date(p.paymentDate).toLocaleString("pt-BR")
                  : "-";
                const valorFormatado = p.amount
                  ? p.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                  : "-";
                const statusEmpresa = p.statusEmpresa || p.status || p.statusPagamento;
                return (
                  <tr
                    key={i}
                    onClick={() => setPopupAcoes(p.enterpriseId)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{p.enterpriseName || "SaveIt Pro"}</td>
                    <td>{p.planName || "-"}</td>
                    <td>{dataFormatada}</td>
                    <td>{valorFormatado}</td>
                    <td style={{ color: getStatusColor(statusEmpresa), fontWeight: "bold" }}>
                      {statusEmpresa || "Desconhecido"}
                    </td>
                    <td>{p.enterpriseId}</td>
                    <td>{p.paymentMethod}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {popupAcoes && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>O que deseja fazer?</h3>
            <div className="botoes-acoes">
              <button
                onClick={async () => {
                  await fetchEmpresa(popupAcoes);
                  setPopupAcoes(null);
                }}
                className="flex items-center gap-2"
              >
                <Mail size={18} /> Enviar E-mail
              </button>

              <button
                onClick={() => {
                  localStorage.setItem("idEmpresa", popupAcoes);
                  setPopupAcoes(null);
                  navigate("/produtos");
                }}
                className="flex items-center gap-2"
              >
                <Eye size={18} /> Ver Produtos
              </button>

              <button
                className="cancelar flex items-center gap-2"
                onClick={() => setPopupAcoes(null)}
              >
                <X size={18} /> Cancelar
            </button>
            </div>
          </div>
        </div>
      )}

      {empresaSelecionada && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{empresaSelecionada.name}</h2>
            <p><strong>Email:</strong> {empresaSelecionada.email || "Não disponível"}</p>
            <p><strong>Plano:</strong> {empresaSelecionada.planName || "-"}</p>
            <textarea
              value={mensagemEmail}
              onChange={(e) => setMensagemEmail(e.target.value)}
              placeholder="Escreva sua mensagem..."
            />
            <div className="modal-buttons">
              <button onClick={() => setEmpresaSelecionada(null)}>Fechar</button>
              <button onClick={enviarEmail}>Enviar Email</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PainelPagamentos;
