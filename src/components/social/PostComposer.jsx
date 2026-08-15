import React, { useEffect, useRef, useState } from 'react';
import FeedMedia from './FeedMedia';
import Avatar from '../common/Avatar';

const POST_CHARACTER_LIMIT = 1000;
const MAX_LOCAL_IMAGE_BYTES = 1_500_000;

export default function PostComposer({ profile, onPublish, onFeedback }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isReadingImage, setIsReadingImage] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef(null);
  const imageButtonRef = useRef(null);
  const publishTimerRef = useRef(null);
  const readerRef = useRef(null);
  const canPublish = Boolean(text.trim() || image?.src) && !isReadingImage && !isPublishing;

  useEffect(() => () => {
    window.clearTimeout(publishTimerRef.current);
    if (readerRef.current?.readyState === FileReader.LOADING) readerRef.current.abort();
  }, []);

  const handleImageSelection = (event) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onFeedback('Escolha um arquivo de imagem válido.');
      return;
    }
    if (file.size > MAX_LOCAL_IMAGE_BYTES) {
      onFeedback('Para esta demonstração, use uma imagem de até 1,5 MB.');
      return;
    }

    setExpanded(true);
    setIsReadingImage(true);
    const reader = new FileReader();
    readerRef.current = reader;
    reader.onload = () => {
      setImage({ src: String(reader.result), alt: `Imagem selecionada para a publicação de ${profile.name}`, label: file.name });
      setIsReadingImage(false);
    };
    reader.onerror = () => {
      setIsReadingImage(false);
      onFeedback('Não foi possível ler essa imagem. Tente outro arquivo.');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    window.requestAnimationFrame(() => imageButtonRef.current?.focus());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canPublish) return;
    setIsPublishing(true);
    publishTimerRef.current = window.setTimeout(() => {
      onPublish({ text: text.trim(), image });
      setText('');
      setImage(null);
      setExpanded(false);
      setIsPublishing(false);
      publishTimerRef.current = null;
    }, 450);
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
        rows={expanded ? 5 : 2}
        maxLength={POST_CHARACTER_LIMIT}
        placeholder="O que aconteceu na sua produção, instituição ou parceria?"
        aria-describedby="social-post-counter social-post-local-note"
        disabled={isPublishing}
        onFocus={() => setExpanded(true)}
        onChange={(event) => { setText(event.target.value); setExpanded(true); }}
      />

      {image && <FeedMedia media={image} onRemove={removeImage} className="composer-media-preview" />}

      <div className="social-composer-toolbar">
        <div className="social-composer-media-action">
          <input ref={fileInputRef} id="social-post-image" className="visually-hidden" type="file" accept="image/*" tabIndex="-1" aria-hidden="true" onChange={handleImageSelection} disabled={isPublishing || isReadingImage} />
          <button ref={imageButtonRef} className="social-media-button" type="button" onClick={() => fileInputRef.current?.click()} disabled={isPublishing || isReadingImage}>
            <i className="bi bi-image" aria-hidden="true" /> {isReadingImage ? 'Preparando imagem…' : 'Adicionar imagem'}
          </button>
          <small id="social-post-local-note">Somente neste dispositivo</small>
        </div>
        <span id="social-post-counter" className="social-character-counter" aria-live="polite">{text.length}/{POST_CHARACTER_LIMIT}</span>
        <button className="btn btn-primary social-publish-button" type="submit" disabled={!canPublish} aria-busy={isPublishing || undefined}>
          {isPublishing ? <><span className="button-spinner" aria-hidden="true" /> Publicando…</> : <><i className="bi bi-send" aria-hidden="true" /> Publicar</>}
        </button>
      </div>
    </form>
  );
}
