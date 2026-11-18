import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationsContext';
import { useProfiles } from '../context/ProfilesContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { useNetwork } from '../context/NetworkContext';
import { useSocial } from '../context/SocialContext';
import Avatar from '../components/common/Avatar';

const iconFor = {
  connection_request: 'bi-person-plus', connection_accepted: 'bi-people',
  like: 'bi-heart', comment: 'bi-chat-left-text',
  proposal_received: 'bi-file-earmark-text', proposal_accepted: 'bi-check-circle',
  proposal_declined: 'bi-x-circle', message: 'bi-envelope'
};

function describe(item, actorName) {
  const text = {
    connection_request: `${actorName} enviou uma solicitação de conexão.`,
    connection_accepted: `${actorName} aceitou sua conexão.`,
    like: `${actorName} curtiu sua publicação.`,
    comment: `${actorName} comentou sua publicação.`,
    proposal_received: `${actorName} enviou uma proposta para sua demanda.`,
    proposal_accepted: `${actorName} aceitou sua proposta.`,
    proposal_declined: `${actorName} recusou sua proposta.`,
    message: `${actorName} enviou uma mensagem.`
  };
  return text[item.type] || 'Nova atividade na rede.';
}

function targetFor(item, profileId, connectionStatus, posts) {
  if (item.type === 'connection_request') {
    const status = connectionStatus(profileId, item.actorId);
    return status === 'incoming' ? '/minha-rede#solicitacoes-recebidas'
      : status === 'connected' ? '/minha-rede#minhas-conexoes' : `/perfil/${item.actorId}`;
  }
  if (item.type === 'connection_accepted') return connectionStatus(profileId, item.actorId) === 'connected'
    ? '/minha-rede#minhas-conexoes' : `/perfil/${item.actorId}`;
  if (item.type === 'like' || item.type === 'comment') return posts.some((post) => post.id === item.postId)
    ? `/inicio#post-${item.postId}` : `/perfil/${profileId}`;
  if (item.type.startsWith('proposal_')) return `/negociacoes#proposal-${item.proposalId}`;
  return null;
}

export default function Notificacoes({ onOpenMessages }) {
  const { profile } = useWorkspace();
  const { getProfileById } = useProfiles();
  const { status: connectionStatus } = useNetwork();
  const { posts } = useSocial();
  const { notificationsFor, markRead, markAllRead } = useNotifications();
  const [filter, setFilter] = useState('all');
  const items = notificationsFor(profile.id);
  const unread = items.filter((item) => !item.readAt).length;
  const visible = filter === 'unread' ? items.filter((item) => !item.readAt) : items;

  return <main id="conteudo-principal" className="workspace-main activity-page">
    <div className="shell-container activity-shell">
      <header className="page-heading"><span className="eyebrow">Atividades da sua rede</span>
        <h1>Notificações</h1><p>Solicitações, publicações, propostas e conversas relacionadas ao seu perfil.</p></header>
      <div className="activity-toolbar">
        <div className="activity-tabs" role="group" aria-label="Filtrar notificações">
          <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Todas</button>
          <button type="button" className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Não lidas ({unread})</button>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" disabled={!unread} onClick={() => markAllRead(profile.id)}>Marcar todas como lidas</button>
      </div>
      {visible.length ? <div className="activity-list">
        {visible.map((item) => {
          const actor = getProfileById(item.actorId);
          const path = targetFor(item, profile.id, connectionStatus, posts);
          const open = () => {
            markRead(profile.id, item.id);
            if (item.type === 'message') onOpenMessages?.(item.actorId,
              { demandId: item.demandId || undefined, proposalId: item.proposalId || undefined });
          };
          return <article key={item.id} className={`activity-item card ${item.readAt ? '' : 'is-unread'}`}>
            <Link to={actor ? `/perfil/${actor.id}` : '/inicio'} className="activity-avatar" aria-label={`Ver perfil de ${actor?.name || 'usuário'}`}>
              <Avatar initials={actor?.initials || 'PL'} alt="" />
            </Link>
            <div className="activity-content">
              <span className="activity-kind"><i className={`bi ${iconFor[item.type] || 'bi-bell'}`} aria-hidden="true" /> {item.type === 'message' ? 'Mensagem' : item.type.startsWith('proposal_') ? 'Proposta' : item.type.startsWith('connection_') ? 'Conexão' : item.type === 'like' ? 'Curtida' : 'Comentário'}</span>
              <p>{describe(item, actor?.name || 'Um perfil')}</p>
              {item.preview && <small className="activity-preview">“{item.preview}”</small>}
              <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</time>
            </div>
            <div className="activity-actions">
              {path ? <Link to={path} onClick={open} className="btn btn-primary btn-sm">Ver conteúdo</Link>
                : <button type="button" onClick={open} className="btn btn-primary btn-sm">Abrir conversa</button>}
              {!item.readAt && <button type="button" className="activity-read" onClick={() => markRead(profile.id, item.id)}>Marcar como lida</button>}
            </div>
          </article>;
        })}
      </div> : <div className="activity-empty card"><i className="bi bi-bell" aria-hidden="true" />
        <h2>{filter === 'unread' ? 'Tudo em dia' : 'Nenhuma notificação ainda'}</h2>
        <p>{filter === 'unread' ? 'Você leu todas as notificações.' : 'Novas interações da rede aparecerão aqui.'}</p></div>}
    </div>
  </main>;
}
