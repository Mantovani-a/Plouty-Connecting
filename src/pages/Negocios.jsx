import React, { useEffect, useState } from 'react';
import { businessPipeline, buyerBusinessPipeline } from '../data/dashboardData';
import { getBusinessFlowFixture } from '../data/businessFlowData';
import { useWorkspace } from '../context/WorkspaceContext';
import BusinessFlowPanel from '../components/business/BusinessFlowPanel';

const stageLabels = {
  all: 'Todos',
  proposal: 'Propostas',
  negotiation: 'Negociação',
  active: 'Ativos'
};

export default function Negocios({ onOpenMessages }) {
  const { isProducer } = useWorkspace();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const pipeline = isProducer ? businessPipeline : buyerBusinessPipeline;
  const businesses = filter === 'all' ? pipeline : pipeline.filter((item) => item.stageKey === filter);
  const roleKey = isProducer ? 'producer' : 'buyer';

  useEffect(() => {
    setSelected(null);
  }, [filter, isProducer]);

  return (
    <main id="conteudo-principal" className="workspace-main businesses-page">
      <div className="shell-container">
        <section className="page-heading">
          <div>
            <span className="eyebrow">Acompanhamento comercial</span>
            <h1>Meus negócios</h1>
            <p>
              {isProducer
                ? 'Veja o próximo passo de cada proposta, negociação e contrato do protótipo.'
                : 'Acompanhe demandas, propostas recebidas e contratos do protótipo em um só lugar.'}
            </p>
          </div>
          <div className="mock-label">
            <i className="bi bi-database" /> Dados demonstrativos
          </div>
        </section>

        <div className="business-tabs" aria-label="Filtrar negócios">
          {Object.entries(stageLabels).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              className={filter === key ? 'active' : ''}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="business-list" aria-label="Lista de negócios">
          {businesses.map((business) => {
            const isSelected = selected === `${roleKey}-${business.id}`;
            const flowId = `business-flow-${roleKey}-${business.id}`;

            return (
              <article key={`${roleKey}-${business.id}`} className="business-row">
                <span className={`business-stage-icon stage-${business.stageKey}`}>
                  <i
                    className={`bi ${
                      business.stageKey === 'active'
                        ? 'bi-file-earmark-check'
                        : business.stageKey === 'negotiation'
                          ? 'bi-arrow-left-right'
                          : 'bi-send'
                    }`}
                  />
                </span>

                <div className="business-copy">
                  <span className={`status-chip stage-${business.stageKey}`}>{business.stage}</span>
                  <h2>{business.title}</h2>
                  <p>{business.counterpart}</p>
                </div>

                <div className="business-progress">
                  <div>
                    <span>Andamento</span>
                    <strong>{business.progress}%</strong>
                  </div>
                  <div className="progress-track">
                    <i style={{ '--progress': `${business.progress}%` }} />
                  </div>
                  <small>{business.nextStep}</small>
                </div>

                <strong className="business-value">{business.value}</strong>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelected(isSelected ? null : `${roleKey}-${business.id}`)}
                  aria-expanded={isSelected}
                  aria-controls={flowId}
                  aria-label={`${isSelected ? 'Recolher' : 'Acompanhar'} ${business.title}`}
                >
                  {isSelected ? 'Recolher' : 'Acompanhar'}
                </button>

                {isSelected && (
                  <div id={flowId} className="business-detail">
                    <BusinessFlowPanel
                      flow={getBusinessFlowFixture(roleKey, business.id)}
                      onOpenMessages={onOpenMessages}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
