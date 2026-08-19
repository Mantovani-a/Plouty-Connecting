import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { BUYER_NAV_ITEMS, PRODUCER_NAV_ITEMS, PUBLIC_NAV_ITEMS } from '../../data/navigationData';
import { useWorkspace } from '../../context/WorkspaceContext';
import Avatar from '../common/Avatar';

function Brand({ compact = false }) {
  return (
    <NavLink to={compact ? '/inicio' : '/'} className="brand d-inline-flex align-items-center gap-2 flex-shrink-0" aria-label="Plouty — página inicial">
      <img src="/images/logo_P.png" alt="" width="42" height="42" />
      {!compact && (
        <span className="brand-copy d-flex flex-column">
          <strong>Plouty</strong>
          <small>negócios que alimentam</small>
        </span>
      )}
    </NavLink>
  );
}

export default function Navbar({ variant = 'product', onOpenProfile, onOpenMessages, messagesOpen = false, unreadMessages = 0 }) {
  const { theme, toggleTheme } = useTheme();
  const { hasSession, isProducer, profile } = useWorkspace();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navigationItems = isProducer ? PRODUCER_NAV_ITEMS : BUYER_NAV_ITEMS;
  const isEntryPage = location.pathname === '/' || location.pathname === '/entrar';

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const term = searchTerm.trim();
    const target = '/explorar';
    navigate(term ? `${target}?search=${encodeURIComponent(term)}` : target);
    setMobileSearchOpen(false);
  };

  if (variant === 'public') {
    return (
      <header className="site-header site-header-public">
        <div className="shell-container site-header-inner d-flex align-items-center justify-content-between gap-3 h-100">
          <Brand />
          <div className="d-flex align-items-center gap-3 ms-auto">
            <nav className="public-navigation d-none d-md-flex align-items-center gap-1" aria-label="Navegação institucional">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `d-inline-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="header-actions d-flex align-items-center gap-2">
              <button className="icon-button" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}>
                <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon-stars'}`} aria-hidden="true" />
              </button>
              {hasSession ? (
                <NavLink to="/inicio" className="btn btn-primary btn-compact">Ir ao painel</NavLink>
              ) : !isEntryPage ? (
                <NavLink to="/entrar" className="btn btn-primary btn-compact">Entrar</NavLink>
              ) : null}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="site-header product-header">
      <div className="shell-container product-header-inner d-flex align-items-center justify-content-between gap-3 h-100">
        <div className="d-flex align-items-center gap-3 gap-xl-4">
          <Brand compact />
          <nav className="product-navigation d-none d-lg-flex align-items-center gap-1" aria-label="Navegação principal">
            {navigationItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} aria-label={item.label} className={({ isActive }) => `d-inline-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}>
                <i className={`bi ${item.icon}`} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="d-flex align-items-center gap-2 gap-sm-3 ms-auto">
          <form className={`header-search d-flex align-items-center position-relative ${mobileSearchOpen ? 'is-open' : ''}`} role="search" onSubmit={handleSearchSubmit}>
            <label className="visually-hidden" htmlFor="busca-global">Buscar produtores ou demandas</label>
            <i className="bi bi-search" aria-hidden="true" />
            <input
              id="busca-global"
              type="search"
              placeholder="Buscar produtor, produto ou demanda"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit" className="visually-hidden-focusable">Buscar</button>
          </form>

          <div className="header-actions product-actions d-flex align-items-center gap-2 flex-shrink-0">
            <button className="icon-button mobile-search-trigger" type="button" onClick={() => setMobileSearchOpen((open) => !open)} aria-expanded={mobileSearchOpen} aria-controls="busca-global" aria-label="Abrir busca">
              <i className={`bi ${mobileSearchOpen ? 'bi-x-lg' : 'bi-search'}`} aria-hidden="true" />
            </button>
            <button className="icon-button message-trigger position-relative d-none d-lg-inline-grid" type="button" onClick={onOpenMessages} aria-label={`Mensagens${unreadMessages ? `, ${unreadMessages} não lidas` : ''}`} aria-expanded={messagesOpen} aria-controls="plouty-messages-panel">
              <i className="bi bi-chat-left-text" aria-hidden="true" />
              {unreadMessages > 0 && <span className="notification-dot" aria-hidden="true" />}
            </button>
            <button className="icon-button" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}>
              <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon-stars'}`} aria-hidden="true" />
            </button>
            <button className="profile-button d-flex align-items-center gap-2" type="button" onClick={onOpenProfile} aria-label={`Abrir perfil de ${profile?.name || 'Usuário'}`}>
              <Avatar className="profile-avatar" src={profile?.avatar} initials={profile?.initials || 'PL'} alt="" />
              <span className="profile-button-copy d-none d-lg-flex flex-column text-start">
                <strong>{profile?.shortName || 'Perfil'}</strong>
                <small>{isProducer ? 'Produtor' : 'Comprador'}</small>
              </span>
              <i className="bi bi-chevron-down d-none d-lg-inline-block" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
