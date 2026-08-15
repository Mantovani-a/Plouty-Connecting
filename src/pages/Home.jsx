import React from 'react';
import { NavLink } from 'react-router-dom';
import DemandCard from '../components/home/DemandCard';
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
        <section className="workspace-hero" aria-labelledby="home-title">
          <div>
            <span className="context-label">
              <i className="bi bi-sun" aria-hidden="true" /> {todayLabel}
            </span>
            <h1 id="home-title">Bom dia, João.</h1>
            <p>Há novas compras institucionais perto da sua região e uma proposta aguardando retorno.</p>
          </div>
          <div className="hero-actions">
            <NavLink className="btn btn-primary" to="/oportunidades">
              Encontrar oportunidades <i className="bi bi-arrow-right" aria-hidden="true" />
            </NavLink>
          </div>
        </section>

        <section className="summary-strip" aria-label="Resumo operacional">
          {producerSummary.map((item) => (
            <article key={item.label} className={`summary-item tone-${item.tone}`}>
              <span className="summary-icon">
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
            <div className="section-title-row opportunity-list-title">
              <div>
                <span className="eyebrow">Selecionadas para sua produção</span>
                <h2 id="recommended-title">Oportunidades recomendadas</h2>
                <p>Compatibilidade calculada com base nos produtos, volume e distância do perfil demonstrativo.</p>
              </div>
              <NavLink to="/oportunidades" className="text-link">
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
  const ownDemands = [
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
  ];

  return (
    <main id="conteudo-principal" className="workspace-main buyer-home">
      <div className="shell-container">
        <section className="workspace-hero" aria-labelledby="buyer-home-title">
          <div>
            <span className="context-label">
              <i className="bi bi-building" /> Comprador institucional · demonstração
            </span>
            <h1 id="buyer-home-title">Bom dia, equipe Caminhos.</h1>
            <p>Organize suas compras, compare propostas e encontre produtores com capacidade comprovada.</p>
          </div>
          <div className="hero-actions">
            <NavLink className="btn btn-secondary" to="/explorar">
              <i className="bi bi-people" /> Encontrar produtores
            </NavLink>
            <NavLink className="btn btn-primary" to="/negocios">
              <i className="bi bi-briefcase" /> Ver negócios
            </NavLink>
          </div>
        </section>

        <section className="summary-strip" aria-label="Resumo operacional do comprador">
          {buyerSummary.map((item) => (
            <article key={item.label} className={`summary-item tone-${item.tone}`}>
              <span className="summary-icon">
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
            <div className="section-title-row opportunity-list-title">
              <div>
                <span className="eyebrow">Sua operação de compra</span>
                <h2 id="buyer-demands-title">Demandas recentes</h2>
                <p>Acompanhe propostas e prazos sem perder o próximo passo.</p>
              </div>
            </div>
            <div className="buyer-demand-list">
              {ownDemands.map((demand) => {
                const deadlineLabel = formatISODateShort(demand.deadline) || 'a definir';
                const deliveryLabel = formatISODateShort(demand.delivery);
                return (
                  <article key={demand.id}>
                    <span className="buyer-demand-icon">
                      <i className="bi bi-clipboard2-data" />
                    </span>
                    <div>
                      <span className="status-chip">{demand.status}</span>
                      <h3>{demand.product}</h3>
                      <p>
                        {demand.quantity || 'Quantidade informada na publicação'} · propostas até {deadlineLabel}
                        {deliveryLabel ? ` · entrega em ${deliveryLabel}` : ''}
                      </p>
                    </div>
                    <strong>{demand.proposals} propostas</strong>
                    <NavLink to="/negocios" className="btn btn-secondary">
                      Analisar
                    </NavLink>
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
