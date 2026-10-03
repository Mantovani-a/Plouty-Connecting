import React, { useState } from 'react';

export default function DemandCard({ demand, onOpenMessages, onFeedback }) {
  const [interessado, setInteressado] = useState(false);

  const toggleInteresse = () => {
    const nextState = !interessado;
    setInteressado(nextState);
    if (onFeedback) {
      onFeedback(
        nextState
          ? `Interesse registrado na demanda de ${demand.org}!`
          : 'Interesse removido desta demanda.'
      );
    }
  };

  const handleOpenChat = () => {
    if (onOpenMessages) {
      onOpenMessages(demand.businessKey || demand.org);
    }
    if (onFeedback) {
      onFeedback(`Canal de negociação aberto com ${demand.org}!`);
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'Alta':
        return 'badge-danger bg-danger-subtle text-danger border border-danger-subtle';
      case 'Média':
        return 'badge-warning bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      default:
        return 'badge-info bg-info-subtle text-info-emphasis border border-info-subtle';
    }
  };

  return (
    <article className="card demand-card mb-3 shadow-sm border-suave" aria-labelledby={`demand-title-${demand.id}`}>
      <div className="card-body p-3 p-sm-4">
        {/* Top Header */}
        <div className="d-flex align-items-start gap-3 mb-3">
          <div className="demand-avatar-badge flex-shrink-0 d-flex align-items-center justify-content-center">
            <i className={`bi ${demand.icon || 'bi-mortarboard-fill'}`} aria-hidden="true" />
          </div>

          <div className="flex-grow-1 min-w-0">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <h2 id={`demand-title-${demand.id}`} className="fs-6 fw-bold mb-0 text-brand-dark d-flex align-items-center gap-2">
                  <span>{demand.org}</span>
                  <i className="bi bi-patch-check-fill text-brand-success" title="Instituição verificada" aria-label="Verificada" />
                </h2>
                <span className="small text-muted">{demand.institutionType || 'Instituição compradora'}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className={`badge px-2 py-1 ${getUrgencyBadge(demand.urgency)}`}>
                  {demand.urgency === 'Alta' ? 'Urgente' : demand.category}
                </span>
              </div>
            </div>

            <div className="demand-meta small text-muted mt-1 d-flex align-items-center gap-2 flex-wrap">
              <span><i className="bi bi-geo-alt-fill text-brand-success me-1" />{demand.location}</span>
              <span>•</span>
              <span><i className="bi bi-clock me-1" />{demand.timeAgo}</span>
            </div>
          </div>
        </div>

        {/* ODS 2 Badge */}
        {demand.odsGoal && (
          <div className="ods-target-pill mb-2 p-1 px-2 rounded-2 small d-inline-flex align-items-center gap-2 bg-success-subtle text-success-emphasis border border-success-subtle">
            <i className="bi bi-tree-fill" aria-hidden="true" />
            <span className="fw-semibold">{demand.odsGoal}</span>
          </div>
        )}

        {/* Description */}
        <p className="demand-description text-secondary mb-3 mt-1">
          {demand.description}
        </p>

        {/* Products requested */}
        {demand.products && demand.products.length > 0 && (
          <div className="mb-3">
            <span className="small fw-bold text-muted d-block mb-1">Produtos e volumes solicitados:</span>
            <div className="d-flex flex-wrap gap-2">
              {demand.products.map((item, idx) => (
                <span key={idx} className="badge bg-light text-dark border d-inline-flex align-items-center gap-1 py-1 px-2">
                  <i className="bi bi-box-seam text-brand-success" aria-hidden="true" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Deadline */}
        {demand.deadline && (
          <div className="small text-muted mb-3 d-flex align-items-center gap-2">
            <i className="bi bi-calendar-check text-primary" aria-hidden="true" />
            <span>Prazo: <strong>{demand.deadline}</strong></span>
          </div>
        )}

        {/* Actions */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 border-top">
          <div className="d-flex gap-2 flex-wrap">
            <button
              type="button"
              className={`btn btn-sm d-inline-flex align-items-center gap-1 ${
                interessado ? 'btn-success' : 'btn-outline-success'
              }`}
              onClick={toggleInteresse}
            >
              <i className={`bi ${interessado ? 'bi-check-circle-fill' : 'bi-hand-thumbs-up'}`} aria-hidden="true" />
              <span>{interessado ? 'Interesse Registrado' : 'Tenho Interesse'}</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
              onClick={handleOpenChat}
            >
              <i className="bi bi-chat-left-dots" aria-hidden="true" />
              <span>Negociar / Enviar Proposta</span>
            </button>
          </div>

          <span className="text-muted small">
            <i className="bi bi-shield-check me-1 text-success" />
            Conexão Direta
          </span>
        </div>
      </div>
    </article>
  );
}
