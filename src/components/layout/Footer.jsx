import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell-container site-footer-inner">
        <div className="footer-brand d-flex align-items-center gap-3">
          <img src="/images/logo_P.png" alt="" width="38" height="38" />
          <div className="d-flex flex-column gap-1">
            <strong>Plouty</strong>
            <span>Mercado profissional agrícola baseado em confiança.</span>
          </div>
        </div>
        <nav className="d-flex align-items-center gap-4" aria-label="Links do rodapé">
          <NavLink to="/sobre">Sobre</NavLink>
          <NavLink to="/contato">Contato</NavLink>
          <NavLink to="/entrar">Entrar</NavLink>
        </nav>
        <small>Projeto acadêmico alinhado à ODS 2 · {new Date().getFullYear()}</small>
      </div>
    </footer>
  );
}
