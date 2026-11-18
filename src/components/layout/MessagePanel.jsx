import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { getUnreadConversationCount } from '../../data/messagesData';
import { useProfiles } from '../../context/ProfilesContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useCommerce } from '../../context/CommerceContext';
import Avatar from '../common/Avatar';

export default function MessagePanel({ conversations, isOpen, onOpen, onClose, targetBusinessKey, targetDemandId, targetProposalId }) {
  const { getProfileById } = useProfiles();
  const { profile: actor } = useWorkspace();
  const { messages, readAt, sendMessage, markRead } = useCommerce();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedContext, setSelectedContext] = useState({});
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState('');
  const [startedProfiles, setStartedProfiles] = useState([]);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const launcherRef = useRef(null);
  const openedFromLauncherRef = useRef(false);
  const threadRef = useRef(null);
  const isModal = useMediaQuery('(max-width: 1180px)');
  const dynamicContacts = [...new Set(messages.flatMap((message) => message.senderId === actor.id ? [message.recipientId]
    : message.recipientId === actor.id ? [message.senderId] : []))];
  const allConversations = useMemo(() => [...new Set([...conversations.map((item) => item.profileId), ...dynamicContacts, ...startedProfiles])]
    .map((profileId) => {
      const profile = getProfileById(profileId);
      const seed = conversations.find((item) => item.profileId === profileId);
      const latest = messages.filter((item) => item.senderId === actor.id && item.recipientId === profileId
        || item.senderId === profileId && item.recipientId === actor.id).at(-1);
      const readTimestamp = readAt[`${actor.id}|${profileId}`] || '';
      const hasUnreadDynamic = Boolean(latest && latest.senderId === profileId && latest.createdAt > readTimestamp);
      const hasUnreadSeed = Boolean(seed?.unread && !readTimestamp);
      return profile ? { id: profileId, profileId, name: profile.name, initials: profile.initials, avatar: profile.avatar,
        role: profile.role, verified: profile.verified, lastMessage: latest?.body || seed?.lastMessage || 'Nova conversa demonstrativa',
        time: latest ? new Date(latest.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : seed?.time || 'Agora',
        unread: hasUnreadDynamic || hasUnreadSeed,
        messages: seed?.messages || [] } : null;
    }).filter(Boolean), [actor.id, conversations, dynamicContacts.join('|'), getProfileById, messages, readAt, startedProfiles]);
  const unreadCount = allConversations.filter((conversation) => conversation.unread).length;
  const selectedConversation = allConversations.find((conversation) => conversation.profileId === selectedId) || null;
  const threadMessages = useMemo(() => (
    selectedConversation
      ? [...selectedConversation.messages, ...messages.filter((message) => message.senderId === actor.id && message.recipientId === selectedId
        || message.senderId === selectedId && message.recipientId === actor.id).map((message) => ({ ...message,
        sender: message.senderId === actor.id ? 'me' : 'contact',
        time: new Date(message.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }), localOnly: true }))]
      : []
  ), [actor.id, messages, selectedConversation, selectedId]);

  useDialogFocus(isOpen && isModal, onClose, panelRef, closeRef);

  useEffect(() => {
    if (!isOpen || isModal) return undefined;
    const openedFromLauncher = openedFromLauncherRef.current;
    const previousFocus = document.activeElement;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (openedFromLauncher) {
        window.requestAnimationFrame(() => launcherRef.current?.focus());
      } else {
        previousFocus?.focus?.();
      }
      openedFromLauncherRef.current = false;
    };
  }, [isModal, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedId(null);
      setDraft('');
      setFeedback('');
      return;
    }
    if (targetBusinessKey) {
      if (targetBusinessKey !== actor.id && getProfileById(targetBusinessKey)) {
        setStartedProfiles((current) => current.includes(targetBusinessKey) ? current : [...current, targetBusinessKey]);
        setSelectedId(targetBusinessKey);
        setSelectedContext({ demandId: targetDemandId, proposalId: targetProposalId });
      } else {
        setSelectedId(null);
      }
    }
  }, [actor.id, getProfileById, isOpen, targetBusinessKey, targetDemandId, targetProposalId]);

  useEffect(() => {
    if (isOpen && selectedConversation?.unread) {
      markRead(actor.id, selectedConversation.profileId);
    }
  }, [actor.id, isOpen, markRead, selectedConversation]);

  useEffect(() => {
    if (selectedConversation && threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [selectedConversation, threadMessages.length]);

  const handleSelectConversation = (conversationId) => {
    setSelectedId(conversationId);
    setSelectedContext({});
    setDraft('');
    setFeedback('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !selectedConversation) return;
    sendMessage(actor.id, selectedConversation.profileId, body, selectedContext);
    setDraft('');
    setFeedback('Mensagem salva neste navegador e disponível para o outro perfil demonstrativo.');
  };

  if (!isOpen) {
    return (
      <div id="plouty-messages-panel" className="message-dock-collapsed">
        <button
          ref={launcherRef}
          type="button"
          className="message-dock-launcher"
          onClick={() => {
            openedFromLauncherRef.current = true;
            onOpen();
          }}
          aria-expanded="false"
        >
          <span className="message-launcher-icon d-inline-flex align-items-center justify-content-center flex-shrink-0"><i className="bi bi-chat-left-text" aria-hidden="true" /></span>
          <strong>Mensagens</strong>
          {unreadCount > 0 && <span className="message-unread-count d-inline-flex align-items-center justify-content-center" aria-label={`${unreadCount} mensagens não lidas`}>{unreadCount}</span>}
        </button>
      </div>
    );
  }

  const panel = (
    <section
      id="plouty-messages-panel"
      ref={panelRef}
      className={`message-dock card d-flex flex-column is-open ${selectedConversation ? 'showing-thread' : 'showing-list'}`}
      role={isModal ? 'dialog' : 'region'}
      aria-modal={isModal ? 'true' : undefined}
      aria-labelledby="message-panel-title"
    >
      <header className="message-dock-header">
        {selectedConversation ? (
          <button type="button" className="icon-button" onClick={() => handleSelectConversation(null)} aria-label="Voltar para conversas">
            <i className="bi bi-arrow-left" aria-hidden="true" />
          </button>
        ) : (
          <span className="message-launcher-icon d-inline-flex align-items-center justify-content-center flex-shrink-0" aria-hidden="true"><i className="bi bi-chat-left-text" /></span>
        )}
        <div className="d-flex flex-column gap-1">
          <h2 id="message-panel-title" className="text-truncate">
            {selectedConversation ? <Link to={`/perfil/${selectedConversation.profileId}`} onClick={onClose} className="profile-inline-link">{selectedConversation.name}</Link> : 'Mensagens'}
          </h2>
          {selectedConversation && <span className="text-truncate">{selectedConversation.role}</span>}
        </div>
        <button ref={closeRef} type="button" className="icon-button message-dock-close" onClick={onClose} aria-label={isModal ? 'Fechar mensagens' : 'Recolher mensagens'}>
          <i className={`bi ${isModal ? 'bi-x-lg' : 'bi-chevron-down'}`} aria-hidden="true" />
        </button>
      </header>

      {!selectedConversation ? (
        <div className="message-conversation-list flex-grow-1" aria-label="Lista de conversas">
          <div className="message-demo-note d-flex align-items-start gap-2">
            <i className="bi bi-info-circle" aria-hidden="true" />
            <span className="d-flex flex-column gap-1"><strong>Experiência demonstrativa</strong> Estas conversas são dados fictícios e estáveis do protótipo.</span>
          </div>
          {!allConversations.length && (
            <div className="message-empty-state text-center p-4">
              <i className="bi bi-chat-square-dots" aria-hidden="true" />
              <strong>Nenhuma conversa por aqui</strong>
              <p className="text-muted mb-0">Quando uma negociação iniciar, o contato relacionado aparecerá nesta lista.</p>
            </div>
          )}
          {allConversations.map((conversation) => (
            <div key={conversation.id} className={`conversation-item w-100 ${conversation.unread ? 'is-unread' : ''}`}>
              <Link to={`/perfil/${conversation.profileId}`} onClick={onClose} className="profile-avatar-link" aria-label={`Ver perfil de ${conversation.name}`}>
                <Avatar className="conversation-avatar" src={conversation.avatar} initials={conversation.initials} alt="" />
              </Link>
              <span className="conversation-preview d-flex flex-column gap-1">
                <span className="d-flex align-items-center gap-1"><Link to={`/perfil/${conversation.profileId}`} onClick={onClose} className="profile-inline-link"><strong className="text-truncate">{conversation.name}</strong></Link>{conversation.verified && <i className="bi bi-patch-check-fill" aria-label="Perfil verificado" />}</span>
                <button type="button" className="conversation-preview-action text-muted text-truncate" onClick={() => handleSelectConversation(conversation.id)}>
                  {conversation.lastMessage}
                </button>
              </span>
              <button type="button" className="conversation-open-action" onClick={() => handleSelectConversation(conversation.id)} aria-label={`Abrir conversa com ${conversation.name}`}>
                <time>{conversation.time}</time><i className="bi bi-chat-left-text" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="message-thread-view d-flex flex-column flex-grow-1">
          <div ref={threadRef} className="message-thread flex-grow-1" aria-label={`Conversa com ${selectedConversation.name}`}>
            <div className="thread-context d-flex align-items-center gap-2"><i className="bi bi-shield-check" aria-hidden="true" /><span>Conversa demonstrativa sobre oportunidades, propostas e entregas.</span></div>
            {selectedContext.demandId && <div className="thread-context"><Link to={`/demandas#demand-${selectedContext.demandId}`} onClick={onClose}>Ver demanda relacionada</Link>
              {selectedContext.proposalId && <> · <Link to={`/negociacoes#proposal-${selectedContext.proposalId}`} onClick={onClose}>Ver proposta</Link></>}</div>}
            {threadMessages.map((message) => (
              <div key={message.id} className={`thread-message d-flex flex-column gap-1 is-${message.sender}`}>
                <p>{message.body}</p>
                <span>{message.time}{message.localOnly ? ' · demonstração local' : ''}</span>
                {message.demandId && <Link to={`/demandas#demand-${message.demandId}`} onClick={onClose}>Demanda relacionada</Link>}
                {message.proposalId && <Link to={`/negociacoes#proposal-${message.proposalId}`} onClick={onClose}>Proposta relacionada</Link>}
              </div>
            ))}
          </div>
          <form className="message-composer" onSubmit={handleSubmit}>
            <label className="visually-hidden" htmlFor="message-draft">Escrever mensagem</label>
            <div className="d-grid align-items-center">
              <input
                id="message-draft"
                value={draft}
                onChange={(event) => { setDraft(event.target.value); setFeedback(''); }}
                placeholder="Escreva uma mensagem"
                autoComplete="off"
              />
              <button type="submit" className="message-send-button d-inline-flex align-items-center justify-content-center" disabled={!draft.trim()} aria-label="Enviar mensagem demonstrativa">
                <i className="bi bi-send" aria-hidden="true" />
              </button>
            </div>
            <p className="message-send-feedback" role="status" aria-live="polite">{feedback || 'Mensagens demonstrativas são salvas apenas neste navegador.'}</p>
          </form>
        </div>
      )}
    </section>
  );

  return isModal ? (
    <div className="message-panel-layer">
      <button type="button" className="drawer-backdrop" onClick={onClose} aria-label="Fechar mensagens" />
      {panel}
    </div>
  ) : panel;
}
