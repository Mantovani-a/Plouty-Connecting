import React from 'react';
import { formatISODateTime } from '../../utils/dateUtils';

const stateMeta = {
  complete: { icon: 'bi-check-lg', label: 'Concluída' },
  current: { icon: 'bi-arrow-right', label: 'Etapa atual' },
  upcoming: { icon: 'bi-circle', label: 'Próxima etapa' }
};

export default function BusinessFlowPanel({ flow, onOpenMessages }) {
  if (!flow?.recentUpdate || !flow.steps?.length) {
    return (
      <section className="business-flow-panel business-flow-empty" aria-label="Acompanhamento indisponível">
        <i className="bi bi-signpost-split" aria-hidden="true" />
        <div>
          <strong>Acompanhamento ainda não configurado</strong>
          <p>Quando houver eventos para este negócio, eles aparecerão aqui em ordem cronológica.</p>
        </div>
      </section>
    );
  }

  const titleId = `business-flow-title-${flow.key}`;

  return (
    <section className="business-flow-panel" aria-labelledby={titleId}>
      <div className="business-flow-header">
        <div>
          <span className="demo-kicker"><i className="bi bi-bezier2" aria-hidden="true" /> Simulação do fluxo futuro</span>
          <h3 id={titleId}>{flow.label || 'Jornada comercial prevista'}</h3>
          <p>Uma prévia de como propostas, contratos e entregas poderão ser acompanhados quando houver backend.</p>
        </div>
        <span className="mock-label"><i className="bi bi-database" aria-hidden="true" /> Dados demonstrativos</span>
      </div>

      <div className="business-recent-update">
        <span aria-hidden="true"><i className="bi bi-bell" /></span>
        <div>
          <small>Atualização recente · {formatISODateTime(flow.recentUpdate.occurredAt)}</small>
          <strong>{flow.recentUpdate.title}</strong>
          <p>{flow.recentUpdate.description}</p>
        </div>
      </div>

      <ol className="business-timeline" aria-label="Etapas do negócio">
        {flow.steps.map((step) => {
          const meta = stateMeta[step.state] || stateMeta.upcoming;
          return (
            <li key={step.id} className={`timeline-step is-${step.state}`}>
              <span className="timeline-marker" aria-hidden="true"><i className={`bi ${meta.icon}`} /></span>
              <div className="timeline-copy">
                <div>
                  <strong>{step.title}</strong>
                  <span>{step.occurredAt ? formatISODateTime(step.occurredAt) : meta.label}</span>
                </div>
                <p>{step.description}</p>
              </div>
              <span className="timeline-state">{meta.label}</span>
            </li>
          );
        })}
      </ol>

      <div className="business-flow-footer">
        <p><i className="bi bi-info-circle" aria-hidden="true" /> Esta timeline é fixa e demonstrativa; nenhuma atualização foi carregada ou salva em servidor.</p>
        {onOpenMessages && (
          <button type="button" className="btn btn-secondary" onClick={() => onOpenMessages(flow.key)}>
            <i className="bi bi-chat-left-text" aria-hidden="true" /> Abrir conversa relacionada
          </button>
        )}
      </div>
    </section>
  );
}
