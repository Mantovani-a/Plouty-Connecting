import React, { useState } from 'react';
import Avatar from '../common/Avatar';

const POST_CHARACTER_LIMIT = 1000;

export default function PostComposer({ profile, onPublish, onFeedback }) {
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    if (onFeedback) {
      onFeedback('Publicação demonstrativa registrada nesta sessão.');
    }
    setText('');
    setExpanded(false);
  };

  return (
    <form className={`social-composer ${expanded ? 'is-expanded' : ''}`} onSubmit={handleSubmit} noValidate>
      <div className="social-composer-head">
        <Avatar className="profile-avatar" src={profile.avatar} initials={profile.initials} alt={`Foto de ${profile.name}`} />
        <div>
          <label htmlFor="social-post-text">Compartilhe uma experiência, entrega ou conquista</label>
          <small>Conte algo relevante para produtores, instituições e comunidades.</small>
        </div>
      </div>

      <textarea
        id="social-post-text"
        value={text}
        rows={expanded ? 4 : 2}
        maxLength={POST_CHARACTER_LIMIT}
        placeholder="O que aconteceu na sua produção, instituição ou parceria?"
        aria-describedby="social-post-counter"
        onFocus={() => setExpanded(true)}
        onChange={(event) => { setText(event.target.value); setExpanded(true); }}
      />

      <div className="social-composer-toolbar">
        <div className="social-composer-media-action">
          <button className="social-media-button" type="button" onClick={() => onFeedback && onFeedback('Upload de imagens disponível nas próximas versões.')}>
            <i className="bi bi-image" aria-hidden="true" /> Adicionar imagem
          </button>
          <small id="social-post-local-note">Modo demonstrativo</small>
        </div>
        <span id="social-post-counter" className="social-character-counter" aria-live="polite">{text.length}/{POST_CHARACTER_LIMIT}</span>
        <button className="btn btn-primary social-publish-button" type="submit" disabled={!text.trim()}>
          <i className="bi bi-send" aria-hidden="true" /> Publicar
        </button>
      </div>
    </form>
  );
}
