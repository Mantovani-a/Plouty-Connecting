import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../components/common/Toast';
import { useCommerce } from '../context/CommerceContext';
import { useProfiles } from '../context/ProfilesContext';
import { useWorkspace } from '../context/WorkspaceContext';

const labels = { pending: 'Em análise', accepted: 'Aceita', declined: 'Recusada', closed: 'Demanda encerrada' };
const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

function ProposalCard({ proposal, demand, counterpart, received, onDecision, onOpenMessages }) {
  return <article id={`proposal-${proposal.id}`} className="proposal-card card">
    <div className="proposal-card-heading"><span className={`proposal-status is-${proposal.status}`}>{labels[proposal.status]}</span>
      <time dateTime={proposal.createdAt}>{new Date(proposal.createdAt).toLocaleDateString('pt-BR')}</time></div>
    <h3><Link to={`/perfil/${counterpart.id}`} className="profile-inline-link">{counterpart.name}</Link></h3>
    <p>{counterpart.role} · {counterpart.location}</p>
    <div className="proposal-demand"><strong>Demanda</strong><Link to={`/demandas#demand-${demand.id}`}>{demand.description}</Link></div>
    <dl><div><dt>Preço total</dt><dd>{money(proposal.price)}</dd></div><div><dt>Quantidade</dt><dd>{proposal.quantity}</dd></div>
      <div><dt>Prazo</dt><dd>{proposal.deadline}</dd></div></dl>
    {proposal.notes && <p className="proposal-notes">{proposal.notes}</p>}
    <div className="proposal-actions">
      {received && proposal.status === 'pending' && demand.status === 'open' && <>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => onDecision(proposal.id, 'accepted')}>Aceitar proposta</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onDecision(proposal.id, 'declined')}>Recusar proposta</button>
      </>}
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => onOpenMessages(counterpart.id, { demandId: demand.id, proposalId: proposal.id })}>Abrir conversa</button>
    </div>
  </article>;
}

export default function Negociacoes({ onOpenMessages }) {
  const { profile } = useWorkspace();
  const { getProfileById } = useProfiles();
  const { proposals, demands, decideProposal } = useCommerce();
  const [feedback, setFeedback] = useState('');
  const received = proposals.filter((proposal) => proposal.buyerId === profile.id);
  const sent = proposals.filter((proposal) => proposal.producerId === profile.id);
  const decide = (id, decision) => {
    const result = decideProposal(profile.id, id, decision);
    setFeedback(result.changed ? decision === 'accepted' ? 'Proposta aceita. O produtor foi avisado na conversa.' : 'Proposta recusada. O produtor foi avisado na conversa.' : 'Não foi possível atualizar a proposta.');
  };
  const render = (items, isReceived) => items.length ? items.map((proposal) => {
    const demand = demands.find((item) => item.id === proposal.demandId);
    const counterpart = getProfileById(isReceived ? proposal.producerId : proposal.buyerId);
    return demand && counterpart ? <ProposalCard key={proposal.id} proposal={proposal} demand={demand} counterpart={counterpart}
      received={isReceived} onDecision={decide} onOpenMessages={onOpenMessages} /> : null;
  }) : <div className="network-empty card"><i className="bi bi-file-earmark-text" aria-hidden="true" /><p>Nenhuma proposta nesta seção.</p></div>;

  return <main id="conteudo-principal" className="workspace-main negotiations-page"><div className="shell-container negotiations-shell">
    <header className="page-heading"><span className="eyebrow">Relações comerciais</span><h1>Negociações</h1>
      <p>Acompanhe propostas vinculadas às demandas e converse diretamente com a outra parte.</p></header>
    <div className="negotiations-summary"><span><strong>{received.length}</strong> recebidas</span><span><strong>{sent.length}</strong> enviadas</span>
      <Link to="/demandas" className="btn btn-primary">Explorar demandas</Link></div>
    {profile.kind === 'buyer' ? (
      <>
        <section className="negotiations-section" aria-labelledby="received-title"><h2 id="received-title">Propostas recebidas</h2>{render(received, true)}</section>
        <section className="negotiations-section" aria-labelledby="sent-title"><h2 id="sent-title">Propostas enviadas</h2>{render(sent, false)}</section>
      </>
    ) : (
      <>
        <section className="negotiations-section" aria-labelledby="sent-title"><h2 id="sent-title">Propostas enviadas</h2>{render(sent, false)}</section>
        <section className="negotiations-section" aria-labelledby="received-title"><h2 id="received-title">Propostas recebidas</h2>{render(received, true)}</section>
      </>
    )}
  </div><Toast message={feedback} onClose={() => setFeedback('')} /></main>;
}
