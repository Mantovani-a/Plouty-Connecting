import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import Avatar from '../common/Avatar';

export default function ProfileSummary({ onNavigate }) {
  const { endDemoSession, isProducer, profile } = useWorkspace();

  return (
    <div className="profile-summary">
      <div className="profile-summary-head">
        <Avatar className="profile-avatar profile-avatar-large" src={profile.avatar} initials={profile.initials} alt={`Foto de ${profile.name}`} />
        <div>
          <h3>{profile.name}</h3>
          <p>{profile.role}</p>
          <span><i className="bi bi-geo-alt" aria-hidden="true" /> {profile.location}</span>
        </div>
      </div>

      <div className="verification-line">
        <i className="bi bi-patch-check-fill" aria-hidden="true" />
        <span>{profile.verification}</span>
      </div>

      <dl className="trust-metrics">
        <div><dt>Avaliação</dt><dd>{profile.reputation} <small>({profile.reviews})</small></dd></div>
        <div><dt>Negócios</dt><dd>{profile.completedDeals}</dd></div>
        <div><dt>Resposta</dt><dd>{profile.responseRate}</dd></div>
      </dl>

      <nav className="profile-menu" aria-label="Opções do perfil">
        <NavLink to="/inicio" end onClick={onNavigate}><i className="bi bi-house-door" aria-hidden="true" /> Início</NavLink>
        <NavLink to="/operacao" end onClick={onNavigate}><i className="bi bi-grid-1x2" aria-hidden="true" /> Minha operação</NavLink>
        <NavLink to="/negocios" onClick={onNavigate}><i className="bi bi-kanban" aria-hidden="true" /> Meus negócios</NavLink>
        <NavLink to={isProducer ? '/oportunidades' : '/explorar'} onClick={onNavigate}><i className={`bi ${isProducer ? 'bi-briefcase' : 'bi-people'}`} aria-hidden="true" /> {isProducer ? 'Oportunidades' : 'Produtores'}</NavLink>
      </nav>

      <div className="profile-readiness">
        <div className="d-flex justify-content-between"><strong>Perfil comercial</strong><span>82%</span></div>
        <div className="progress-track" aria-label="Perfil comercial 82% completo"><span style={{ width: '82%' }} /></div>
        <small>{isProducer ? 'Adicione sua área de entrega para receber oportunidades mais próximas.' : 'Adicione os critérios de compra para comparar produtores com mais precisão.'}</small>
      </div>

      <a href="/entrar" onClick={() => { endDemoSession(); onNavigate?.(); }} className="text-link profile-exit">
        <i className="bi bi-box-arrow-right" aria-hidden="true" /> Sair da demonstração
      </a>
    </div>
  );
}
