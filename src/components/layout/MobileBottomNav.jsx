import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function MobileBottomNav({ onOpenMessages, messagesOpen = false, unreadMessages = 0 }) {
  const { isProducer } = useWorkspace();
  return (
    <nav className="mobile-bottom-nav" aria-label="Navegação móvel">
      <NavLink to="/inicio" end className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <i className="bi bi-house-door" aria-hidden="true" />
        <span>Início</span>
      </NavLink>
      <NavLink to="/operacao" end className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <i className="bi bi-grid-1x2" aria-hidden="true" />
        <span>Minha operação</span>
      </NavLink>
      <NavLink to={isProducer ? '/oportunidades' : '/explorar'} className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <i className={`bi ${isProducer ? 'bi-briefcase' : 'bi-people'}`} aria-hidden="true" />
        <span>{isProducer ? 'Oportunidades' : 'Produtores'}</span>
      </NavLink>
      <button type="button" className={`mobile-nav-item ${messagesOpen ? 'active' : ''}`} onClick={onOpenMessages} aria-expanded={messagesOpen} aria-controls="plouty-messages-panel">
        <i className="bi bi-chat-left-text" aria-hidden="true" />
        <span>Mensagens</span>
        {unreadMessages > 0 && <span className="mobile-unread-badge" aria-label={`${unreadMessages} mensagens não lidas`}>{unreadMessages}</span>}
      </button>
      <NavLink to="/negocios" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <i className="bi bi-kanban" aria-hidden="true" />
        <span>Negócios</span>
      </NavLink>
    </nav>
  );
}
