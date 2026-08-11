import React from 'react';
import { NavLink } from 'react-router-dom';

export default function ProfileDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="offcanvas-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1045 }}
      ></div>
      <div
        className={`offcanvas offcanvas-start show`}
        tabIndex="-1"
        style={{ visibility: 'visible', zIndex: 1050 }}
        aria-labelledby="offcanvasProfileLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasProfileLabel">
            Meu Perfil
          </h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
        <div className="offcanvas-body">
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
            <NavLink to="/" className="dashboard-nav-item" onClick={onClose}>
              <i className="bi bi-grid-1x2"></i>
              <span>Painel Principal</span>
            </NavLink>
            <a href="#culturas" className="dashboard-nav-item" onClick={(e) => { e.preventDefault(); onClose(); }}>
              <i className="bi bi-tree"></i>
              <span>Minhas Culturas</span>
            </a>
            <NavLink to="/explorar" className="dashboard-nav-item" onClick={onClose}>
              <i className="bi bi-file-earmark-text"></i>
              <span>Demandas Abertas</span>
            </NavLink>
            <a href="#mensagens" className="dashboard-nav-item" onClick={(e) => { e.preventDefault(); onClose(); }}>
              <i className="bi bi-chat-left-text"></i>
              <span>Mensagens</span>
            </a>
            <a href="#config" className="dashboard-nav-item" onClick={(e) => { e.preventDefault(); onClose(); }}>
              <i className="bi bi-gear"></i>
              <span>Configurações</span>
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
