import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { useWorkspace } from '../../context/WorkspaceContext';
import { getStorageItem, setStorageItem } from '../../utils/storage';

const SAVED_PROFILES_KEY = 'plouty.demo.saved-profiles.v1';

export default function ProducerCard({ producer, onOpenMessages }) {
  const { profile } = useWorkspace();
  const isOwnProfile = profile?.id === producer.id;
  const [saved, setSaved] = useState(() => Boolean(getStorageItem(SAVED_PROFILES_KEY, {})[profile?.id]?.includes(producer.id)));
  const initials = producer.initials;

  useEffect(() => {
    setSaved(Boolean(getStorageItem(SAVED_PROFILES_KEY, {})[profile?.id]?.includes(producer.id)));
  }, [profile?.id, producer.id]);

  const toggleSaved = () => {
    if (!profile || isOwnProfile) return;
    const stored = getStorageItem(SAVED_PROFILES_KEY, {});
    const current = Array.isArray(stored[profile.id]) ? stored[profile.id] : [];
    const next = saved ? current.filter((id) => id !== producer.id) : [...new Set([...current, producer.id])];
    if (setStorageItem(SAVED_PROFILES_KEY, { ...stored, [profile.id]: next })) setSaved(!saved);
  };

  return (
    <article className="producer-card card d-block">
      <div className="producer-head d-flex align-items-center gap-3">
        <Link to={`/perfil/${producer.id}`} className="profile-avatar-link" aria-label={`Ver perfil de ${producer.name}`}>
          <Avatar
            className="producer-avatar d-inline-flex align-items-center justify-content-center flex-shrink-0"
            src={producer.avatar}
            initials={initials}
            alt=""
          />
        </Link>
        <div className="producer-identity d-flex flex-column">
          <div className="d-flex align-items-center gap-2">
            <h2><Link to={`/perfil/${producer.id}`} className="profile-inline-link">{producer.name}</Link></h2>
            {producer.verified && (
              <i
                className="bi bi-patch-check-fill verified-icon"
                title="Perfil verificado"
                aria-label="Perfil verificado"
              />
            )}
          </div>
          <p className="mb-0">{producer.role}</p>
          <span>
            <i className="bi bi-geo-alt" aria-hidden="true" /> {producer.location}
          </span>
        </div>
        {!isOwnProfile && <button
          type="button"
          className={`save-button d-inline-flex align-items-center justify-content-center ms-auto ${saved ? 'is-saved' : ''}`}
          onClick={toggleSaved}
          aria-pressed={saved}
          aria-label={saved ? 'Remover produtor dos salvos' : 'Salvar produtor'}
        >
          <i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'}`} />
        </button>}
      </div>

      <p className="producer-description">{producer.description}</p>

      <div className="producer-tags d-flex flex-wrap gap-2">
        {producer.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <dl className="producer-trust-grid">
        <div>
          <dt>Avaliação</dt>
          <dd>
            <i className="bi bi-star-fill" /> {producer.reputation.toFixed(1)}{' '}
            <small>({producer.reviews})</small>
          </dd>
        </div>
        <div>
          <dt>Entregas concluídas</dt>
          <dd>{producer.completedDeliveries}</dd>
        </div>
        <div>
          <dt>Pontualidade</dt>
          <dd>{producer.onTimeRate}%</dd>
        </div>
        <div>
          <dt>Taxa de resposta</dt>
          <dd>
            {producer.responseRate}% <small>· {producer.responseTime}</small>
          </dd>
        </div>
      </dl>

      <div className={`availability-line d-flex flex-wrap justify-content-between align-items-center gap-2 availability-${producer.availability.status}`}>
        <span>
          <i className="bi bi-circle-fill" aria-hidden="true" /> {producer.availability.label}
        </span>
        <strong>{producer.availability.summary}</strong>
      </div>

      <div className="verification-tags d-flex flex-wrap gap-2 mt-2" aria-label="Verificações">
        {producer.verifications.map((item) => (
          <span key={item} className="d-inline-flex align-items-center gap-1">
            <i className="bi bi-shield-check" aria-hidden="true" /> {item}
          </span>
        ))}
      </div>

      <blockquote className="recent-review">
        <p>“{producer.recentReview.comment}”</p>
        <footer>
          {producer.recentReview.author} · {producer.recentReview.timeAgo}
        </footer>
      </blockquote>

      <div className="producer-actions d-flex flex-wrap gap-2 mt-3">
        {isOwnProfile ? (
          <Link className="btn btn-primary" to={`/perfil/${producer.id}`}>Meu perfil</Link>
        ) : (
          <>
            <button className="btn btn-primary" type="button" onClick={() => onOpenMessages?.(producer.id)}>
              <i className="bi bi-chat-left-text" aria-hidden="true" /> Entrar em contato
            </button>
            <button className="btn btn-secondary" type="button" onClick={toggleSaved}>
              {saved ? 'Salvo' : 'Salvar perfil'}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
