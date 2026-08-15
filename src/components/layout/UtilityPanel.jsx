import React, { useRef } from 'react';
import {
  buyerNotificationItems,
  notificationItems
} from '../../data/dashboardData';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function UtilityPanel({ type, isOpen, onClose }) {
  const { isProducer } = useWorkspace();
  const closeButtonRef = useRef(null);
  const panelRef = useRef(null);
  const title = 'Notificações';
  const items = isProducer ? notificationItems : buyerNotificationItems;

  useDialogFocus(isOpen, onClose, panelRef, closeButtonRef);

  if (!isOpen) return null;

  return (
    <div className="drawer-layer">
      <button className="drawer-backdrop" type="button" onClick={onClose} aria-label={`Fechar ${title.toLowerCase()}`} />
      <aside ref={panelRef} className="side-drawer" role="dialog" aria-modal="true" aria-labelledby="utility-panel-title">
        <div className="drawer-header">
          <div>
            <span className="eyebrow">Central de atividade</span>
            <h2 id="utility-panel-title">{title}</h2>
          </div>
          <button ref={closeButtonRef} type="button" className="icon-button" onClick={onClose} aria-label="Fechar painel">
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>
        <div className="drawer-list">
          {items.map((item) => (
            <article key={item.id} className="drawer-list-item">
              <span className="activity-icon" aria-hidden="true">
                <i className="bi bi-bell" />
              </span>
              <div>
                <strong>{item.sender || item.title}</strong>
                <p>{item.text}</p>
                <small>{item.time}</small>
              </div>
            </article>
          ))}
        </div>
        <p className="mock-note"><i className="bi bi-info-circle" aria-hidden="true" /> Notificações demonstrativas. Atualizações em tempo real dependem de backend.</p>
      </aside>
    </div>
  );
}
