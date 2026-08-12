import React from 'react';
import { NavLink } from 'react-router-dom';

const PROFILE_NAV_ITEMS = [
  { to: '/', label: 'Painel Principal', icon: 'bi-grid-1x2', isRoute: true, end: true },
  { to: '#culturas', label: 'Minhas Culturas', icon: 'bi-tree', isRoute: false },
  { to: '/explorar', label: 'Demandas Abertas', icon: 'bi-file-earmark-text', isRoute: true },
  { to: '#mensagens', label: 'Mensagens', icon: 'bi-chat-left-text', isRoute: false },
  { to: '#config', label: 'Configurações', icon: 'bi-gear', isRoute: false }
];

export default function ProfileSummary({ onNavigate }) {
  const handleItemClick = (e, isRoute) => {
    if (!isRoute) {
      e.preventDefault();
    }
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <>
      <div className="text-center pb-3 mb-3 border-bottom border-suave">
        <div className="avatar-placeholder mb-3 d-flex align-items-center justify-content-center text-white fs-4 fw-bold mx-auto">
          JC
        </div>
        <h4 className="mb-1">João Carlos</h4>
        <p className="text-muted mb-0" style={{ fontSize: '0.85em' }}>
          <i className="bi bi-geo-alt-fill text-brand-success"></i> Minas Gerais
        </p>
        <small className="text-brand-success fw-bold" style={{ fontSize: '0.78em' }}>
          Produtor Familiar
        </small>
      </div>

      <div className="d-flex justify-content-around align-items-center py-2 mt-3 border-top border-bottom border-suave text-center mb-3">
        <div>
          <div className="fs-5 fw-bold text-brand-success">10</div>
          <div
            className="text-secondary text-uppercase"
            style={{ fontSize: '0.7em', letterSpacing: '0.5px' }}
          >
            Contratos
          </div>
        </div>
        <div
          className="border-end border-suave h-100"
          style={{ width: '1px', minHeight: '30px' }}
        ></div>
        <div>
          <div className="fs-5 fw-bold text-brand-success">
            4.8 <i className="bi bi-star-fill" style={{ fontSize: '0.85em' }}></i>
          </div>
          <div
            className="text-secondary text-uppercase"
            style={{ fontSize: '0.7em', letterSpacing: '0.5px' }}
          >
            Reputação
          </div>
        </div>
      </div>

      <nav className="d-flex flex-column gap-2 mt-3 pt-3 border-top border-suave">
        {PROFILE_NAV_ITEMS.map((item) =>
          item.isRoute ? (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `dashboard-nav-item ${isActive ? 'active' : ''}`}
              onClick={(e) => handleItemClick(e, true)}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ) : (
            <a
              key={item.label}
              href={item.to}
              className="dashboard-nav-item"
              onClick={(e) => handleItemClick(e, false)}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </a>
          )
        )}
      </nav>
    </>
  );
}
