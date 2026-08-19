import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { getUnreadConversationCount } from '../../data/messagesData';

export default function MessagePanel({ conversations, isOpen, onOpen, onClose, targetBusinessKey }) {
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState('');
  const [localMessages, setLocalMessages] = useState({});
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const launcherRef = useRef(null);
  const openedFromLauncherRef = useRef(false);
  const threadRef = useRef(null);
  const localIdRef = useRef(1);
  const isModal = useMediaQuery('(max-width: 1180px)');
  const unreadCount = getUnreadConversationCount(conversations);
  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) || null;
  const threadMessages = useMemo(() => (
    selectedConversation
      ? [...selectedConversation.messages, ...(localMessages[selectedConversation.id] || [])]
      : []
  ), [localMessages, selectedConversation]);

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
      const related = conversations.find((conversation) => conversation.businessKey === targetBusinessKey);
      setSelectedId(related?.id || null);
    }
  }, [conversations, isOpen, targetBusinessKey]);

  useEffect(() => {
    if (selectedConversation && threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [selectedConversation, threadMessages.length]);

  const handleSelectConversation = (conversationId) => {
    setSelectedId(conversationId);
    setDraft('');
    setFeedback('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !selectedConversation) return;
    const localMessage = {
      id: `local-${selectedConversation.id}-${localIdRef.current++}`,
      sender: 'me',
      body,
      time: 'agora',
      localOnly: true
    };
    setLocalMessages((current) => ({
      ...current,
      [selectedConversation.id]: [...(current[selectedConversation.id] || []), localMessage]
    }));
    setDraft('');
    setFeedback('Mensagem adicionada nesta sessão. Ela não foi enviada nem salva em servidor.');
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
          <span className="message-launcher-icon"><i className="bi bi-chat-left-text" aria-hidden="true" /></span>
          <span className="d-flex flex-column text-start"><strong>Mensagens</strong><small>Conversas comerciais</small></span>
          {unreadCount > 0 && <span className="message-unread-count" aria-label={`${unreadCount} mensagens não lidas`}>{unreadCount}</span>}
        </button>
      </div>
    );
  }

  const panel = (
    <section
      id="plouty-messages-panel"
      ref={panelRef}
      className={`message-dock d-flex flex-column is-open ${selectedConversation ? 'showing-thread' : 'showing-list'}`}
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
          <span className="message-launcher-icon" aria-hidden="true"><i className="bi bi-chat-left-text" /></span>
        )}
        <div className="d-flex flex-column gap-1">
          <h2 id="message-panel-title">{selectedConversation ? selectedConversation.name : 'Mensagens'}</h2>
          <span>{selectedConversation ? selectedConversation.role : 'Conexões comerciais da Plouty'}</span>
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
          {!conversations.length && (
            <div className="message-empty-state text-center p-4">
              <i className="bi bi-chat-square-dots" aria-hidden="true" />
              <strong>Nenhuma conversa por aqui</strong>
              <p className="text-muted mb-0">Quando uma negociação iniciar, o contato relacionado aparecerá nesta lista.</p>
            </div>
          )}
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              className={`conversation-item w-100 ${conversation.unread ? 'is-unread' : ''}`}
              onClick={() => handleSelectConversation(conversation.id)}
              aria-label={`Abrir conversa com ${conversation.name}${conversation.unread ? `, ${conversation.unread} não lidas` : ''}`}
            >
              <span className="conversation-avatar" aria-hidden="true">{conversation.initials}</span>
              <span className="conversation-preview d-flex flex-column gap-1">
                <span className="d-flex align-items-center gap-1"><strong>{conversation.name}</strong>{conversation.verified && <i className="bi bi-patch-check-fill" aria-label="Perfil verificado" />}</span>
                <small className="text-muted text-truncate">{conversation.lastMessage}</small>
              </span>
              <span className="conversation-meta d-flex flex-column align-items-end gap-1"><time>{conversation.time}</time>{conversation.unread > 0 && <i aria-label="Mensagem não lida" />}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="message-thread-view d-flex flex-column flex-grow-1">
          <div ref={threadRef} className="message-thread flex-grow-1" aria-label={`Conversa com ${selectedConversation.name}`}>
            <div className="thread-context d-flex align-items-center gap-2"><i className="bi bi-shield-check" aria-hidden="true" /><span>Conversa demonstrativa sobre oportunidades, contratos e entregas.</span></div>
            {threadMessages.map((message) => (
              <div key={message.id} className={`thread-message d-flex flex-column gap-1 is-${message.sender}`}>
                <p>{message.body}</p>
                <span>{message.time}{message.localOnly ? ' · somente nesta sessão' : ''}</span>
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
              <button type="submit" className="message-send-button" disabled={!draft.trim()} aria-label="Adicionar mensagem nesta sessão">
                <i className="bi bi-send" aria-hidden="true" />
              </button>
            </div>
            <p className="message-send-feedback" role="status" aria-live="polite">{feedback || 'O envio funciona somente nesta sessão demonstrativa.'}</p>
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
