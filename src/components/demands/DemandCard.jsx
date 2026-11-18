import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useCommerce } from '../../context/CommerceContext';
import DemandCreator from './DemandCreator';

export default function DemandCard({ demand, onOpenMessages, onFeedback }) {
  const { profile } = useWorkspace();
  const { proposals, editDemand, closeDemand, sendProposal } = useCommerce();
  const [editing, setEditing] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [offer, setOffer] = useState({ price: '', quantity: '', deadline: '', notes: '' });
  const ownDemand = profile.id === demand.profileId;
  const canPropose = profile.kind !== 'buyer' && !ownDemand && demand.status === 'open';
  const existingProposal = proposals.find((item) => item.demandId === demand.id && item.producerId === profile.id);

  const handleOpenChat = () => {
    if (onOpenMessages) {
      onOpenMessages(demand.profileId, { demandId: demand.id, proposalId: existingProposal?.id });
    }
    if (onFeedback) {
      onFeedback(`Canal de negociação aberto com ${demand.org}!`);
    }
  };

  const handleProposal = (event) => {
    event.preventDefault();
    const result = sendProposal(profile.id, demand.id, offer);
    if (result.changed) { setProposalOpen(false); onFeedback?.('Proposta enviada ao comprador.'); }
    else onFeedback?.('Confira os dados da proposta antes de enviar.');
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
    <article id={`demand-${demand.id}`} className="card demand-card mb-3 shadow-sm border-suave" aria-labelledby={`demand-title-${demand.id}`}>
      <div className="card-body p-3 p-sm-4">
        {/* Top Header */}
        <div className="d-flex align-items-start gap-3 mb-3">
          {demand.profileId ? <Link to={`/perfil/${demand.profileId}`} className="demand-avatar-badge flex-shrink-0 d-flex align-items-center justify-content-center" aria-label={`Ver perfil de ${demand.org}`}>
            <i className={`bi ${demand.icon || 'bi-mortarboard-fill'}`} aria-hidden="true" />
          </Link> : <div className="demand-avatar-badge flex-shrink-0 d-flex align-items-center justify-content-center"><i className={`bi ${demand.icon || 'bi-mortarboard-fill'}`} aria-hidden="true" /></div>}

          <div className="flex-grow-1 min-w-0">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <h2 id={`demand-title-${demand.id}`} className="fs-6 fw-bold mb-0 text-brand-dark d-flex align-items-center gap-2">
                  {demand.profileId ? <Link to={`/perfil/${demand.profileId}`} className="profile-inline-link">{demand.org}</Link> : <span>{demand.org}</span>}
                  <i className="bi bi-patch-check-fill text-brand-success" title="Instituição verificada" aria-label="Verificada" />
                </h2>
                <span className="small text-muted">{demand.institutionType || 'Instituição compradora'}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className={`badge px-2 py-1 ${getUrgencyBadge(demand.urgency)}`}>
                  {demand.urgency === 'Alta' ? 'Urgente' : demand.category}
                </span>
                {demand.status === 'closed' && <span className="badge bg-secondary-subtle text-secondary-emphasis border">Encerrada</span>}
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
                <span key={idx} className="badge demand-product-badge d-inline-flex align-items-center gap-1 py-1 px-2">
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
            <i className="bi bi-calendar-check text-brand-success" aria-hidden="true" />
            <span>Prazo: <strong>{demand.deadline}</strong></span>
          </div>
        )}

        {/* Actions */}
        <div className="demand-actions d-flex flex-wrap align-items-center gap-2 pt-3 border-top">
          {ownDemand && demand.status === 'open' && <>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>Editar demanda</button>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setConfirmClose(true)}>Encerrar demanda</button>
          </>}
          {canPropose && (existingProposal
            ? <Link to={`/negociacoes#proposal-${existingProposal.id}`} className="btn btn-secondary btn-sm">Ver proposta · {existingProposal.status === 'pending' ? 'Em análise' : existingProposal.status === 'accepted' ? 'Aceita' : existingProposal.status === 'declined' ? 'Recusada' : 'Encerrada'}</Link>
            : <button type="button" className="btn btn-primary btn-sm" onClick={() => setProposalOpen(true)}>Enviar proposta</button>)}
          {!ownDemand && <button type="button" className="btn btn-secondary btn-sm" onClick={handleOpenChat}>Enviar mensagem</button>}
          {ownDemand && <Link to="/negociacoes" className="btn btn-secondary btn-sm">Ver propostas recebidas</Link>}
        </div>
        {confirmClose && <div className="commerce-confirm" role="group" aria-label="Confirmar encerramento da demanda">
          <span>Encerrar esta demanda? Propostas pendentes também serão encerradas.</span>
          <button type="button" onClick={() => { closeDemand(profile.id, demand.id); setConfirmClose(false); onFeedback?.('Demanda encerrada.'); }}>Confirmar encerramento</button>
          <button type="button" onClick={() => setConfirmClose(false)}>Manter aberta</button>
        </div>}
        {editing && <DemandCreator key={demand.id} currentProfile={profile} demand={demand}
          onSave={(values) => { const result = editDemand(profile.id, demand.id, values); if (result.changed) setEditing(false); return result; }}
          onCancel={() => setEditing(false)} onFeedback={onFeedback} />}
        {proposalOpen && <form className="commerce-form" onSubmit={handleProposal}>
          <h3>Proposta para {demand.org}</h3>
          <div className="commerce-fields">
            <label>Preço total (R$)<input type="number" min="0.01" step="0.01" required value={offer.price} onChange={(event) => setOffer({ ...offer, price: event.target.value })} /></label>
            <label>Quantidade e unidade<input type="text" required maxLength="120" value={offer.quantity} onChange={(event) => setOffer({ ...offer, quantity: event.target.value })} placeholder="Ex.: 120 unidades de alface" /></label>
            <label>Prazo de entrega<input type="text" required maxLength="120" value={offer.deadline} onChange={(event) => setOffer({ ...offer, deadline: event.target.value })} placeholder="Ex.: toda terça-feira" /></label>
            <label>Observações<textarea rows="3" maxLength="500" value={offer.notes} onChange={(event) => setOffer({ ...offer, notes: event.target.value })} /></label>
          </div>
          <div><button type="submit" className="btn btn-primary btn-sm">Enviar proposta</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setProposalOpen(false)}>Cancelar</button></div>
        </form>}
      </div>
    </article>
  );
}
