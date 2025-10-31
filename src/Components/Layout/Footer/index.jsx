import React from "react";
import "./Footer.scss";

import svgBranco from "../../../assets/logos/essentiaLogoBranco.svg"
import svgVerde from "../../../assets/logos/essentiaLogoVerde.svg"
const Footer = () => {
  return (
    <footer>
      <div>
        <img
          src={svgBranco}
          alt="logo Essentia"
        />
        <p>Pela essência de um mundo melhor.</p>
        <div>
          <a href=""><i className="ri-instagram-line"></i></a>
          <a href=""><i className="ri-mail-line"></i></a>
        </div>
      </div>

      <div>
        <h4>Links Rápidos</h4>
        <nav>
          <a href="index.html">Início</a>
          <a href="landingPage/html/essentia.html">Sobre Nós</a>
          <a href="landingPage/html/saveit.html">SaveIt</a>
          <a href="landingPage/html/contato.html">Contato</a>
        </nav>
      </div>

      <address>
        <h4>Contato</h4>
        <a href="">Rua Irineu José Bordon, 355</a>
        <p>(11) 3456-7890</p>
        <a href="mailto:essentia.saveit@gmail.com" target="_blank" rel="noreferrer">
          essentia.saveit@gmail.com
        </a>
      </address>

      <div>
        <hr />
        <h4>&copy; 2025 Essentia. Todos os direitos reservados.</h4>
      </div>
    </footer>
  );
};

export default Footer;
