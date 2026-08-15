import React, { useState } from 'react';

export default function ProducerCard({ producer }) {
  const [saved, setSaved] = useState(false);
  const [contacted, setContacted] = useState(false);

  return (
    <article className="producer-card">
      <div className="producer-head">
        <span className="producer-avatar" aria-hidden="true">
          {producer.name.split(' ').slice(0, 2).map((part) => part[0]).join('')}
        </span>
        <div className="producer-identity">
          <div>
            <h2>{producer.name}</h2>
            {producer.verified && (
              <i
                className="bi bi-patch-check-fill verified-icon"
                title="Perfil verificado"
                aria-label="Perfil verificado"
              />
            )}
          </div>
          <p>{producer.role}</p>
          <span>
            <i className="bi bi-geo-alt" aria-hidden="true" /> {producer.location}
          </span>
        </div>
        <button
          type="button"
          className={`save-button ${saved ? 'is-saved' : ''}`}
          onClick={() => setSaved((value) => !value)}
          aria-pressed={saved}
          aria-label={saved ? 'Remover produtor dos salvos' : 'Salvar produtor'}
        >
          <i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'}`} />
        </button>
      </div>

      <p className="producer-description">{producer.description}</p>

      <div className="producer-tags">
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

      <div className={`availability-line availability-${producer.availability.status}`}>
        <span>
          <i className="bi bi-circle-fill" aria-hidden="true" /> {producer.availability.label}
        </span>
        <strong>{producer.availability.summary}</strong>
      </div>

      <div className="verification-tags" aria-label="Verificações">
        {producer.verifications.map((item) => (
          <span key={item}>
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

      <div className="producer-actions">
        <button
          className="btn btn-primary"
          type="button"
        >
          Entrar em contato
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
