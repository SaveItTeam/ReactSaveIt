import React, { useEffect, useState } from "react";
import "./Produtos.css";

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [mensagemEmail, setMensagemEmail] = useState("");
  const [mostrarCampoEmail, setMostrarCampoEmail] = useState(false);
  const [emailEmpresa, setEmailEmpresa] = useState("");
  const [emailError, setEmailError] = useState("");

  const backendURL = "http://localhost:8080";

  useEffect(() => {
    const idEmpresa = localStorage.getItem("idEmpresa");
    if (!idEmpresa) {
      setErro("Nenhuma empresa selecionada.");
      setCarregando(false);
      return;
    }

    const fetchProdutos = async (enterpriseId) => {
      try {
        setCarregando(true);
        const res = await fetch(
          `${backendURL}/api/product/with-showcase-status/${enterpriseId}`,
          {
            headers: {
              Authorization: "Bearer essentiasaveit-193812-paoea-oei",
              Accept: "*/*",
            },
          }
        );

        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const data = await res.json();
        setProdutos(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    };

    fetchProdutos(idEmpresa);
  }, []);

  const getValidadeStyle = (dataValidade) => {
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diffDias = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
    const diffMeses = diffDias / 30;

    if (diffDias < 0)
      return { color: "#e63946", fontWeight: "bold" }; // vermelho — vencido
    if (diffMeses < 3)
      return { color: "#fb8500", fontWeight: "bold" }; // laranja — < 3 meses
    return { color: "#2a9d8f", fontWeight: "bold" }; // verde — > 3 meses
  };

  const isVitrineAtiva = (valor) => {
    if (valor === true || valor === 1) return true;
    if (valor === false || valor === 0) return false;

    if (typeof valor === "string") {
      const normalizado = valor.trim().toLowerCase();
      return ["sim", "s", "true", "y", "yes", "ativo"].includes(normalizado);
    }

    return false;
  };

  const getVitrineStyle = (estaNaVitrine) => {
    return isVitrineAtiva(estaNaVitrine)
      ? { color: "#6B8E4E", fontWeight: "bold" }
      : { color: "#9e2a2b", fontWeight: "bold" };
  };

  if (carregando)
    return <p style={{ textAlign: "center" }}>Carregando produtos...</p>;
  if (erro)
    return <p style={{ color: "red", textAlign: "center" }}>{erro}</p>;

  const enviarEmail = () => {
    setEmailError("");

    if (!emailEmpresa) {
      setEmailError("Digite o e-mail da empresa antes de enviar.");
      return;
    }

    const dominio = emailEmpresa.split("@")[1]?.toLowerCase();
    const assunto = encodeURIComponent(
      `Informações sobre o produto - ${produtoSelecionado?.nomeProduto}`
    );
    const corpo = encodeURIComponent(
      mensagemEmail ||
        `Olá, tudo bem?\n\nEstou entrando em contato sobre o produto "${produtoSelecionado?.nomeProduto}" da empresa ${produtoSelecionado?.nomeEmpresa}.`
    );

    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailEmpresa}&su=${assunto}&body=${corpo}`;
    const outlookURL = `https://outlook.live.com/mail/0/deeplink/compose?to=${emailEmpresa}&subject=${assunto}&body=${corpo}`;
    const mailtoURL = `mailto:${emailEmpresa}?subject=${assunto}&body=${corpo}`;

    if (dominio.includes("gmail")) {
      window.open(gmailURL, "_blank");
    } else if (
      dominio.includes("outlook") ||
      dominio.includes("hotmail") ||
      dominio.includes("live") ||
      dominio.includes("msn") ||
      dominio.includes("germinare")
    ) {
      window.open(outlookURL);
    } else {
      window.location.href = mailtoURL;
    }

    setMostrarCampoEmail(false);
    setMensagemEmail("");
    setEmailEmpresa("");
  };

  return (
    <main>
      <section id="painel-pagamentos">
        <div id="texto-principal">
          <div>
            <h1>Produtos da Empresa</h1>
            <hr />
            <p>Clique em um produto para visualizar detalhes.</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Empresa</th>
              <th>Validade</th>
              <th>Na Vitrine</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p, i) => (
              <tr
                key={i}
                onClick={() => {
                  setProdutoSelecionado(p);
                  setMostrarCampoEmail(false);
                  setEmailError("");
                  setMensagemEmail(
                    `Olá, tudo bem?\n\nEstou entrando em contato sobre o produto "${p.nomeProduto}" da empresa ${p.nomeEmpresa}.`
                  );
                }}
                style={{ cursor: "pointer" }}
              >
                <td>{p.nomeProduto}</td>
                <td>{p.nomeEmpresa}</td>
                <td style={getValidadeStyle(p.dataValidade)}>
                  {new Date(p.dataValidade).toLocaleDateString("pt-BR")}
                </td>
                <td style={getVitrineStyle(p.estaNaVitrine)}>
                  {isVitrineAtiva(p.estaNaVitrine) ? "Sim" : "Não"}
                </td>
                <td>{p.quantidadeVitrine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {produtoSelecionado && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{produtoSelecionado.nomeProduto}</h2>
            <p>
              <strong>Empresa:</strong> {produtoSelecionado.nomeEmpresa}
            </p>
            <p>
              <strong>Validade:</strong>{" "}
              <span style={getValidadeStyle(produtoSelecionado.dataValidade)}>
                {new Date(
                  produtoSelecionado.dataValidade
                ).toLocaleDateString("pt-BR")}
              </span>
            </p>
            <p>
              <strong>Na vitrine:</strong>{" "}
              <span style={getVitrineStyle(produtoSelecionado.estaNaVitrine)}>
                {isVitrineAtiva(produtoSelecionado.estaNaVitrine)
                  ? "Sim"
                  : "Não"}
              </span>
            </p>
            <p>
              <strong>Quantidade:</strong>{" "}
              {produtoSelecionado.quantidadeVitrine}
            </p>

            <textarea
              value={mensagemEmail}
              onChange={(e) => setMensagemEmail(e.target.value)}
              placeholder="Escreva sua mensagem..."
            />

            {mostrarCampoEmail && (
              <div style={{ marginTop: "15px" }}>
                <input
                  type="email"
                  placeholder="Digite o e-mail da empresa"
                  value={emailEmpresa}
                  onChange={(e) => setEmailEmpresa(e.target.value)}
                  className={emailError ? "input-error" : ""}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: emailError
                      ? "1px solid #e63946"
                      : "1px solid #ccc",
                    marginBottom: "5px",
                  }}
                />
                {emailError && (
                  <p
                    style={{
                      color: "#e63946",
                      fontSize: "0.9em",
                      marginBottom: "10px",
                    }}
                  >
                    {emailError}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    marginTop: "15px",
                  }}
                >
                  <button
                    onClick={() => setProdutoSelecionado(null)}
                    style={{
                      backgroundColor: "#ccc",
                      color: "#333",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      flex: 1,
                    }}
                  >
                    Fechar
                  </button>

                  <button
                    onClick={enviarEmail}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "#fff",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      flex: 1,
                    }}
                  >
                    Confirmar envio
                  </button>
                </div>
              </div>
            )}

            {!mostrarCampoEmail && (
              <div
                className="modal-buttons"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button
                  onClick={() => setProdutoSelecionado(null)}
                  style={{
                    backgroundColor: "#ccc",
                    color: "#333",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Fechar
                </button>
                <button
                  onClick={() => setMostrarCampoEmail(true)}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Enviar Email
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default ProdutosPage;
