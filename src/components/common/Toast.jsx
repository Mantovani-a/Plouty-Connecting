import React from 'react';

export default function Toast({ message, onClose }) {
  return (
    <div
      className={`social-toast ${message ? 'is-visible' : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message && (
        <>
          <i className="bi bi-check-circle-fill" aria-hidden="true" />
          <span>{message}</span>
          <button type="button" onClick={onClose} aria-label="Fechar notificação">
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
