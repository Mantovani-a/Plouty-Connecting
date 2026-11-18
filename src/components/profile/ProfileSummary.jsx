import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import Avatar from '../common/Avatar';

export default function ProfileSummary({ onNavigate }) {
  const { endDemoSession, isProducer, profile } = useWorkspace();

  if (!profile) return null;
  const completionFields = [profile.name, profile.role, profile.location, profile.description,
    profile.about, profile.products?.length, profile.contactEmail || profile.contactPhone,
    ...(isProducer ? [profile.capacity] : [])];
  const completion = Math.round(completionFields.filter(Boolean).length / completionFields.length * 100);

  return (
    <div className="profile-summary">
      <div className="profile-summary-head d-flex align-items-center gap-3">
        <Avatar
          className="profile-avatar profile-avatar-large"
          src={profile.avatar}
          initials={profile.initials}
          alt={`Avatar de ${profile.name}`}
        />
        <div>
          <h3>{profile.name}</h3>
          <p className="mb-0">{profile.role}</p>
          <span>
            <i className="bi bi-geo-alt" aria-hidden="true" /> {profile.location}
          </span>
        </div>
      </div>

      <div className="verification-line d-flex align-items-center gap-2">
        <i className="bi bi-patch-check-fill" aria-hidden="true" />
        <span>{profile.verification}</span>
      </div>

      <dl className="trust-metrics">
        <div>
          <dt>Avaliação</dt>
          <dd>{profile.reputation} <small>({profile.reviews})</small></dd>
        </div>
        <div>
          <dt>Negócios</dt>
          <dd>{profile.completedDeals}</dd>
        </div>
        <div>
          <dt>Resposta</dt>
          <dd>{profile.responseRate}</dd>
        </div>
      </dl>

      <nav className="profile-menu d-flex flex-column gap-1 mt-3" aria-label="Opções do perfil">
        <NavLink to={`/perfil/${profile.id}`} onClick={onNavigate} className="d-flex align-items-center gap-2">
          <i className="bi bi-person-vcard" aria-hidden="true" /> Meu perfil
        </NavLink>
        <NavLink to="/inicio" end onClick={onNavigate} className="d-flex align-items-center gap-2">
          <i className="bi bi-house-door" aria-hidden="true" /> Início
        </NavLink>
        <NavLink to="/explorar" onClick={onNavigate} className="d-flex align-items-center gap-2">
          <i className="bi bi-compass" aria-hidden="true" /> Explorar
        </NavLink>
        <NavLink to="/minha-rede" onClick={onNavigate} className="d-flex align-items-center gap-2">
          <i className="bi bi-people" aria-hidden="true" /> Minha Rede
        </NavLink>
        <NavLink to="/negociacoes" onClick={onNavigate} className="d-flex align-items-center gap-2">
          <i className="bi bi-file-earmark-text" aria-hidden="true" /> Negociações
        </NavLink>
        <NavLink to="/notificacoes" onClick={onNavigate} className="d-flex align-items-center gap-2">
          <i className="bi bi-bell" aria-hidden="true" /> Notificações
        </NavLink>
        <NavLink to="/configuracoes" onClick={onNavigate} className="d-flex align-items-center gap-2">
          <i className="bi bi-gear" aria-hidden="true" /> Configurações
        </NavLink>
        <NavLink to="/contato" onClick={onNavigate} className="d-flex align-items-center gap-2">
          <i className="bi bi-headset" aria-hidden="true" /> Fale com a Plouty
        </NavLink>
      </nav>

      <div className="profile-readiness">
        <div className="d-flex justify-content-between">
          <strong>Perfil comercial</strong>
          <span>{completion}%</span>
        </div>
        <div className="progress-track" aria-label={`Perfil comercial ${completion}% completo`}>
          <span style={{ width: `${completion}%` }} />
        </div>
        <small>
          {profile.contactEmail || profile.contactPhone
            ? 'Informações principais cadastradas nesta demonstração.'
            : 'Adicione e-mail ou telefone de contato no seu perfil.'}
        </small>
      </div>

      <NavLink
        to="/entrar"
        onClick={() => {
          endDemoSession();
          onNavigate?.();
        }}
        className="text-link profile-exit d-inline-flex align-items-center gap-2 mt-3"
      >
        <i className="bi bi-box-arrow-right" aria-hidden="true" /> Sair da demonstração
      </NavLink>
    </div>
  );
}
