import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import logoImg from '../../assets/logo_P.png';

export default function Navbar({ onOpenProfile }) {
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explorar?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container navbar-mobile-layout">
          {/* Brand Logo */}
          <NavLink to="/" className="navbar-brand me-auto">
            <img src={logoImg} alt="Plouty Logo" className="d-none d-md-block" height="40" />
            <img src={logoImg} alt="Plouty Logo" className="d-md-none" height="35" />
          </NavLink>

          {/* Desktop Search */}
          <div className="navbar-search-container mx-auto my-0 d-none d-lg-block">
            <form onSubmit={handleSearchSubmit} className="position-relative">
              <input
                type="text"
                className="form-control navbar-search-input"
                placeholder="O que a Plouty pode te ajudar?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i
                className="bi bi-search search-icon-inside"
                onClick={handleSearchSubmit}
                style={{ cursor: 'pointer' }}
              ></i>
            </form>
          </div>

          {/* Actions on Mobile / Desktop */}
          <div className="navbar-actions-wrapper">
            <button
              className="btn-mobile-search d-lg-none"
              type="button"
              aria-label="Abrir busca"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <i className={`bi ${mobileSearchOpen ? 'bi-x-lg' : 'bi-search'}`}></i>
            </button>

            <div className="theme-toggle-header-wrapper">
              <button
                id="theme-toggle-floating"
                className="theme-toggle-btn"
                aria-label="Alternar modo escuro/claro"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              >
                {theme === 'dark' ? (
                  <i className="bi bi-sun-fill"></i>
                ) : (
                  <i className="bi bi-moon-fill"></i>
                )}
              </button>
            </div>

            <button
              className="btn-nav-profile d-md-none"
              type="button"
              onClick={onOpenProfile}
              aria-label="Perfil do Usuário"
            >
              <div className="nav-profile-avatar-thumbnail"></div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarNav">
            <ul className="navbar-nav ms-auto ms-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-house-door-fill"></i> Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/explorar"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-compass-fill"></i> Explorar
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/entrar"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-person-fill"></i> Entrar
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/sobre"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-info-circle-fill"></i> Sobre Nós
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/contato"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-envelope-fill"></i> Contato
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      <div className={`mobile-search-overlay d-lg-none ${mobileSearchOpen ? 'show' : ''}`}>
        <div className="container py-2 px-3">
          <form onSubmit={handleSearchSubmit} className="position-relative">
            <input
              type="text"
              className="form-control mobile-search-input"
              placeholder="O que a Plouty pode te ajudar?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus={mobileSearchOpen}
            />
            <i
              className="bi bi-search search-icon-inside"
              onClick={handleSearchSubmit}
              style={{ cursor: 'pointer' }}
            ></i>
          </form>
        </div>
      </div>
    </header>
  );
}
