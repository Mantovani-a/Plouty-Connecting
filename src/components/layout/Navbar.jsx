import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { MAIN_NAV_ITEMS } from '../../data/navigationData';

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
            <img src="/images/logo_P.png" alt="Plouty Logo" className="d-none d-md-block" height="40" />
            <img src="/images/logo_P.png" alt="Plouty Logo" className="d-md-none" height="35" />
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
              {MAIN_NAV_ITEMS.map((item) => (
                <li key={item.to} className="nav-item">
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className={`bi ${item.icon}`}></i> {item.label}
                  </NavLink>
                </li>
              ))}
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
