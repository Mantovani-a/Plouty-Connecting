import React from 'react';
import ProfileSummary from '../profile/ProfileSummary';

export default function ProfileDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="offcanvas-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1045 }}
      ></div>
      <div
        className="offcanvas offcanvas-start show"
        tabIndex="-1"
        style={{ visibility: 'visible', zIndex: 1050 }}
        aria-labelledby="offcanvasProfileLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasProfileLabel">
            Meu Perfil
          </h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
        <div className="offcanvas-body">
          <ProfileSummary onNavigate={onClose} />
        </div>
      </div>
    </>
  );
}
