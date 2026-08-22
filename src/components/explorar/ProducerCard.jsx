import React, { useState } from 'react';
import Avatar from '../common/Avatar';

export default function ProducerCard({ producer, onOpenMessages }) {
  const [saved, setSaved] = useState(false);
  const initials = producer.name.split(' ').slice(0, 2).map((part) => part[0]).join('');

  return (
    <article className="producer-card">
      <div className="producer-head d-flex align-items-center gap-3">
        <Avatar
          className="producer-avatar d-inline-flex align-items-center justify-content-center flex-shrink-0"
          src={producer.avatar}
          initials={initials}
          alt={`Foto de ${producer.name}`}
        />
        <div className="producer-identity d-flex flex-column">
          <div className="d-flex align-items-center gap-2">
            <h2>{producer.name}</h2>
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
        <button
          type="button"
          className={`save-button d-inline-flex align-items-center justify-content-center ms-auto ${saved ? 'is-saved' : ''}`}
          onClick={() => setSaved((value) => !value)}
          aria-pressed={saved}
          aria-label={saved ? 'Remover produtor dos salvos' : 'Salvar produtor'}
        >
          <i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'}`} />
        </button>
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

      <div className={`availability-line d-flex justify-content-between align-items-center gap-2 availability-${producer.availability.status}`}>
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

      <div className="producer-actions d-flex gap-2 mt-3">
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => onOpenMessages?.()}
        >
          <i className="bi bi-chat-left-text" aria-hidden="true" /> Entrar em contato
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => setSaved((value) => !value)}
        >
          {saved ? 'Salvo' : 'Salvar perfil'}
        </button>
      </div>
    </article>
  );
}
