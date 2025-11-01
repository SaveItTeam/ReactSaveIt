document.querySelectorAll(".status-pagamento").forEach(e => {
    if(e.textContent === "Pendente") {
        e.style.color = "#E63C22";
    } else {
        e.style.color = "#6B8E4E";
    }
})
const darkMode = document.querySelector(".dark-mode");
const lightMode = document.querySelector(".light-mode");
darkMode.addEventListener("click", () => {
  document.documentElement.classList.add("darkMode");
  darkMode.style.background = "rgba(176, 186, 195, 0.25)";
  lightMode.style.background = "none";
  jsp === "funcionario.jsp" ?  document.querySelector(".topo").classList.add("dark") : null;
});

lightMode.addEventListener("click", () => {
  document.documentElement.classList.remove("darkMode");
  lightMode.style.background = "rgba(176, 186, 195, 0.25)";
  darkMode.style.background = "none";
  jsp === "funcionario.jsp" ?  document.querySelector(".topo").classList.remove("dark") : null;
});
