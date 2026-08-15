import React, { useRef } from 'react';
import ProfileSummary from '../profile/ProfileSummary';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useDialogFocus } from '../../hooks/useDialogFocus';

export default function ProfileDrawer({ isOpen, onClose }) {
  const closeButtonRef = useRef(null);
  const drawerRef = useRef(null);
  const { isProducer } = useWorkspace();
  useDialogFocus(isOpen, onClose, drawerRef, closeButtonRef);

  if (!isOpen) return null;

  return (
    <div className="drawer-layer">
      <button className="drawer-backdrop" type="button" onClick={onClose} aria-label="Fechar perfil" />
      <aside ref={drawerRef} className="side-drawer profile-drawer" role="dialog" aria-modal="true" aria-labelledby="profile-drawer-title">
        <div className="drawer-header">
          <div>
            <span className="eyebrow">Conta de {isProducer ? 'produtor' : 'comprador'}</span>
            <h2 id="profile-drawer-title">Meu perfil</h2>
          </div>
          <button ref={closeButtonRef} type="button" className="icon-button" onClick={onClose} aria-label="Fechar perfil">
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>
        <ProfileSummary onNavigate={onClose} />
      </aside>
    </div>
  );
}
