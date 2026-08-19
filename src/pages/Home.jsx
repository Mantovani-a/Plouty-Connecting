import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import DemandCard from '../components/home/DemandCard';
import DemandCreator from '../components/home/DemandCreator';
import ImpactSidebar from '../components/home/ImpactSidebar';
import { initialDemands } from '../data/demandsData';
import { buyerSummary, producerSummary } from '../data/dashboardData';
import { initialProducers } from '../data/producersData';
import { useWorkspace } from '../context/WorkspaceContext';
import { formatISODateShort } from '../utils/dateUtils';

export default function Operation({ onOpenMessages }) {
  const { isProducer } = useWorkspace();
  if (!isProducer) return <BuyerHome onOpenMessages={onOpenMessages} />;
  return <ProducerHome onOpenMessages={onOpenMessages} />;
}

function ProducerHome({ onOpenMessages }) {
  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  }).format(new Date());
  const todayLabel = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <main id="conteudo-principal" className="workspace-main">
      <div className="shell-container">
        <section className="workspace-hero d-flex align-items-end justify-content-between gap-4 flex-wrap" aria-labelledby="home-title">
          <div>
            <span className="context-label d-inline-flex align-items-center gap-2">
              <i className="bi bi-sun" aria-hidden="true" /> {todayLabel}
            </span>
            <h1 id="home-title">Bom dia, João.</h1>
            <p className="mb-0 text-muted">Há novas compras institucionais perto da sua região e uma proposta aguardando retorno.</p>
          </div>
          <div className="hero-actions d-flex gap-2 flex-shrink-0">
            <NavLink className="btn btn-primary" to="/explorar">
              Explorar oportunidades <i className="bi bi-arrow-right" aria-hidden="true" />
            </NavLink>
          </div>
        </section>

        <section className="summary-strip" aria-label="Resumo operacional">
          {producerSummary.map((item) => (
            <article key={item.label} className={`summary-item d-flex align-items-center gap-3 tone-${item.tone}`}>
              <span className="summary-icon d-inline-flex align-items-center justify-content-center flex-shrink-0">
                <i className={`bi ${item.icon}`} aria-hidden="true" />
              </span>
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.detail}</small>
              </div>
            </article>
          ))}
        </section>

        <div className="workspace-layout">
          <section className="workspace-feed" aria-labelledby="recommended-title">
            <div className="section-title-row opportunity-list-title d-flex align-items-start justify-content-between gap-3">
              <div>
                <span className="eyebrow d-inline-flex align-items-center gap-2">Selecionadas para sua produção</span>
                <h2 id="recommended-title">Oportunidades recomendadas</h2>
                <p className="mb-0 text-muted">Compatibilidade calculada com base nos produtos, volume e distância do perfil demonstrativo.</p>
              </div>
              <NavLink to="/explorar" className="text-link flex-shrink-0">
                Ver todas <i className="bi bi-arrow-right" aria-hidden="true" />
              </NavLink>
            </div>
            <div className="opportunity-list">
              {initialDemands.slice(0, 3).map((demand) => (
                <DemandCard key={demand.id} demand={demand} compact headingLevel={3} />
              ))}
            </div>
          </section>

          <ImpactSidebar onOpenMessages={onOpenMessages} />
        </div>
      </div>
    </main>
  );
}

function BuyerHome({ onOpenMessages }) {
  const [showCreator, setShowCreator] = useState(false);
  const [demandsList, setDemandsList] = useState([
    {
      id: 1,
      product: 'Hortaliças para merenda escolar',
      quantity: '260 kg/mês',
      deadline: '2026-08-16',
      status: 'Recebendo propostas',
      proposals: 4
    },
    {
      id: 2,
      product: 'Frutas da estação',
      quantity: '180 kg/semana',
      deadline: '2026-08-19',
      status: 'Em análise',
      proposals: 7
    }
  ]);

  const handleAddDemand = (newDemand) => {
    setDemandsList((prev) => [newDemand, ...prev]);
    setShowCreator(false);
  };

  return (
    <main id="conteudo-principal" className="workspace-main buyer-home">
      <div className="shell-container">
        <section className="workspace-hero d-flex align-items-end justify-content-between gap-4 flex-wrap" aria-labelledby="buyer-home-title">
          <div>
            <span className="context-label d-inline-flex align-items-center gap-2">
              <i className="bi bi-building" /> Comprador institucional · demonstração
            </span>
            <h1 id="buyer-home-title">Bom dia, equipe Caminhos.</h1>
            <p className="mb-0 text-muted">Organize suas compras, compare propostas e encontre produtores com capacidade comprovada.</p>
          </div>
          <div className="hero-actions d-flex gap-2 flex-shrink-0">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreator((prev) => !prev)}
            >
              <i className={`bi ${showCreator ? 'bi-x-lg' : 'bi-plus-lg'}`} />{' '}
              {showCreator ? 'Fechar publicação' : 'Publicar demanda'}
            </button>
            <NavLink className="btn btn-secondary" to="/explorar">
              <i className="bi bi-people" /> Encontrar produtores
            </NavLink>
          </div>
        </section>

        <section className="summary-strip" aria-label="Resumo operacional do comprador">
          {buyerSummary.map((item) => (
            <article key={item.label} className={`summary-item d-flex align-items-center gap-3 tone-${item.tone}`}>
              <span className="summary-icon d-inline-flex align-items-center justify-content-center flex-shrink-0">
                <i className={`bi ${item.icon}`} />
              </span>
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.detail}</small>
              </div>
            </article>
          ))}
        </section>

        <div className="workspace-layout buyer-layout">
          <section className="workspace-feed" aria-labelledby="buyer-demands-title">
            {showCreator && (
              <div className="mb-4">
                <DemandCreator
                  onAddDemand={handleAddDemand}
                  onCancel={() => setShowCreator(false)}
                />
              </div>
            )}

            <div className="section-title-row opportunity-list-title d-flex align-items-start justify-content-between gap-3">
              <div>
                <span className="eyebrow d-inline-flex align-items-center gap-2">Sua operação de compra</span>
                <h2 id="buyer-demands-title">Demandas recentes</h2>
                <p className="mb-0 text-muted">Acompanhe propostas e prazos sem perder o próximo passo.</p>
              </div>
            </div>
            <div className="buyer-demand-list">
              {demandsList.map((demand) => {
                const deadlineLabel = formatISODateShort(demand.deadline) || 'a definir';
                const deliveryLabel = formatISODateShort(demand.delivery);
                return (
                  <article key={demand.id}>
                    <span className="buyer-demand-icon flex-shrink-0">
                      <i className="bi bi-clipboard2-data" />
                    </span>
                    <div className="d-flex flex-column">
                      <span className="status-chip">{demand.status}</span>
                      <h3>{demand.product}</h3>
                      <p className="mb-0 text-muted">
                        {demand.quantity || 'Quantidade informada na publicação'} · propostas até {deadlineLabel}
                        {deliveryLabel ? ` · entrega em ${deliveryLabel}` : ''}
                      </p>
                    </div>
                    <strong>{demand.proposals} propostas</strong>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => onOpenMessages?.()}
                    >
                      Conversar
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="buyer-sidebar" aria-label="Fornecedores recomendados">
            <section className="sidebar-section">
              <span className="eyebrow">Fornecedores em destaque</span>
              <h2>Produtores para conhecer</h2>
              <div className="producer-shortlist">
                {initialProducers.slice(0, 3).map((producer) => (
                  <NavLink to="/explorar" key={producer.id}>
                    <span className="profile-avatar">
                      {producer.name
                        .split(' ')
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join('')}
                    </span>
                    <span>
                      <strong>{producer.name}</strong>
                      <small>
                        <i className="bi bi-star-fill" /> {producer.reputation.toFixed(1)} ·{' '}
                        {producer.completedDeliveries} entregas
                      </small>
                    </span>
                    <i className="bi bi-chevron-right" />
                  </NavLink>
                ))}
              </div>
              <NavLink className="text-link" to="/explorar">
                Ver todos os produtores <i className="bi bi-arrow-right" />
              </NavLink>
            </section>

            <section className="impact-note">
              <span>
                <i className="bi bi-shield-check" /> Compra responsável
              </span>
              <strong>3 fornecedores</strong>
              <p>com documentação validada nas suas negociações demonstrativas.</p>
              <button
                type="button"
                className="text-link"
                onClick={() => onOpenMessages?.()}
              >
                Abrir mensagens
              </button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
