import React, { useState, useEffect, useRef } from "react";
import { Moon, Sun } from "lucide-react";
import "./Chatbot.css";

const Chatbot = () => {
  const API_URL = import.meta.env.VITE_FAQ_API_URL;
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      sender: "ai",
      text: "👋 Olá! Eu sou o assistente virtual do SaveIt. Como posso te ajudar hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [darkMode, setDarkMode] = useState(prefersDark);
  const chatBoxRef = useRef(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    document.body.classList.toggle("chat-dark", darkMode);
  }, [darkMode]);

  const appendMessage = (sender, text) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), sender, text }]);
  };

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || sending) return;

    appendMessage("user", question);
    setInput("");
    setSending(true);

    const loadingId = Date.now() + "-loading";
    setMessages((prev) => [...prev, { id: loadingId, sender: "ai loading", text: "digitando..." }]);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      setMessages((prev) => prev.filter((m) => m.id !== loadingId));

      if (!res.ok) {
        let errText = `Erro HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          if (errJson?.detail) errText = errJson.detail;
        } catch {}
        appendMessage("ai error", `Erro: ${errText}`);
        setSending(false);
        return;
      }

      const data = await res.json();
      const answer = data?.answer || "Desculpe — a IA não retornou uma resposta válida.";
      appendMessage("ai", answer);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));
      const networkMsg = String(err.message || err);
      const errorMessage = networkMsg.includes("Failed to fetch")
        ? "Erro de conexão (CORS/rede). Tente hospedar o frontend em um domínio real."
        : `Erro: ${networkMsg}`;
      appendMessage("ai error", errorMessage);
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <main className="chat-root">
      <div className={`chat-card ${darkMode ? "dark" : "light"}`} role="region" aria-label="Chat SaveIt">
        <header className="chat-header">
          <div className="chat-title">
            <h2>Assistente de FAQ SaveIt</h2>
            <p className="chat-sub">Pergunte sobre as funcionalidades do sistema</p>
          </div>

          <div className="header-actions">
            <button
              aria-label="Alternar tema"
              title="Alternar tema"
              onClick={() => setDarkMode((s) => !s)}
              className="theme-toggle"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>
        <div ref={chatBoxRef} id="chat-box" className="chat-box" role="log" aria-live="polite">
          {messages.map((m) => {
            const cls =
              m.sender.startsWith("user") ? "msg user" : m.sender.includes("error") ? "msg ai error" : m.sender.includes("loading") ? "msg ai loading" : "msg ai";
            return (
              <div key={m.id} className={cls}>
                {m.sender.includes("loading") ? (
                  <div className="typing">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                ) : (
                  <div className="msg-text">{m.text}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="chat-input-area" role="form" aria-label="Enviar mensagem">
          <input
            type="text"
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            aria-label="Mensagem"
            className="chat-input"
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            className="send-button"
            aria-label="Enviar"
            disabled={sending}
            title="Enviar"
          >
            {sending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Chatbot;
