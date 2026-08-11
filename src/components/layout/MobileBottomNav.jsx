import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MobileBottomNav() {
  return (
    <div className="mobile-bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}>
        <i className="bi bi-house-door-fill"></i>
        <span>Home</span>
      </NavLink>
      <NavLink to="/explorar" className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}>
        <i className="bi bi-compass-fill"></i>
        <span>Explorar</span>
      </NavLink>
      <NavLink to="/entrar" className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}>
        <i className="bi bi-person-fill"></i>
        <span>Entrar</span>
      </NavLink>
      <NavLink to="/sobre" className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}>
        <i className="bi bi-info-circle-fill"></i>
        <span>Sobre Nós</span>
      </NavLink>
      <NavLink to="/contato" className={({ isActive }) => `mobile-bottom-nav-item ${isActive ? 'active' : ''}`}>
        <i className="bi bi-envelope-fill"></i>
        <span>Contato</span>
      </NavLink>
    </div>
  );
}
