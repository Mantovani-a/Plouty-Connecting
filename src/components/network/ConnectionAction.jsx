import React, { useEffect, useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { useProfiles } from '../../context/ProfilesContext';
import { useWorkspace } from '../../context/WorkspaceContext';

const stateLabels = {
  none: 'Conectar',
  outgoing: 'Solicitação enviada',
  incoming: 'Aceitar conexão',
  connected: 'Conectado'
};
const stateIcons = {
  none: 'bi-person-plus',
  outgoing: 'bi-clock-history',
  incoming: 'bi-person-check',
  connected: 'bi-check-circle'
};

export default function ConnectionAction({ targetId, onFeedback, compact = false, showSecondary = true }) {
  const { profile: actor } = useWorkspace();
  const { getProfileById } = useProfiles();
  const { status: statusFor, act } = useNetwork();
  const [confirmRemove, setConfirmRemove] = useState(false);
  const target = getProfileById(targetId);
  const status = actor && target ? statusFor(actor.id, target.id) : 'self';

  useEffect(() => setConfirmRemove(false), [status, targetId]);
  if (!actor || !target || status === 'self') return null;

  const perform = (action) => {
    const result = act(action, actor.id, target.id);
    if (!result.changed) return;
    const message = {
      send: `Solicitação enviada para ${target.name}.`,
      cancel: `Solicitação para ${target.name} cancelada.`,
      accept: `Você aceitou a conexão com ${target.name}.`,
      decline: `Solicitação de ${target.name} recusada.`,
      remove: `Conexão com ${target.name} removida.`
    }[action];
    onFeedback?.(result.saved ? message : `${message} Alteração apenas nesta sessão; o navegador não permitiu salvá-la.`);
    setConfirmRemove(false);
  };

  return (
    <div className={`connection-action-group ${compact ? 'is-compact' : ''}`}>
      <button type="button"
        className={compact ? 'connection-action-main' : `btn ${status === 'none' || status === 'incoming' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => perform(status === 'incoming' ? 'accept' : 'send')}
        disabled={status === 'outgoing' || status === 'connected'}>
        <i className={`bi ${stateIcons[status]}`} aria-hidden="true" /> {stateLabels[status]}
      </button>
      {showSecondary && status === 'outgoing' &&
        <button type="button" className={compact ? 'connection-action-secondary' : 'btn btn-secondary'} onClick={() => perform('cancel')}>Cancelar solicitação</button>}
      {showSecondary && status === 'incoming' &&
        <button type="button" className={compact ? 'connection-action-secondary' : 'btn btn-secondary'} onClick={() => perform('decline')}>Recusar</button>}
      {showSecondary && status === 'connected' && !confirmRemove &&
        <button type="button" className={compact ? 'connection-action-secondary' : 'btn btn-secondary'} onClick={() => setConfirmRemove(true)}>Remover conexão</button>}
      {confirmRemove && <div className="connection-remove-confirm" role="group" aria-label={`Confirmar remoção da conexão com ${target.name}`}>
        <span>Remover conexão com {target.name}?</span>
        <button type="button" onClick={() => perform('remove')}>Confirmar remoção</button>
        <button type="button" onClick={() => setConfirmRemove(false)}>Manter conexão</button>
      </div>}
    </div>
  );
}
