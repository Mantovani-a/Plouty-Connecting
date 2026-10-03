import React, { useEffect, useRef, useState } from 'react';
import Avatar from '../common/Avatar';
import FeedMedia from './FeedMedia';

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
    if (readerRef.current?.readyState === FileReader.LOADING) {
      readerRef.current.abort();
    }
  }, []);

  const handleImageSelection = (event) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onFeedback?.('Escolha um arquivo de imagem válido (PNG, JPG, WebP).');
      return;
    }

    if (file.size > MAX_LOCAL_IMAGE_BYTES) {
      onFeedback?.('Para esta demonstração, selecione uma imagem de até 1,5 MB.');
      return;
    }

    setExpanded(true);
    setIsReadingImage(true);
    const reader = new FileReader();
    readerRef.current = reader;

    reader.onload = () => {
      setImage({
        src: String(reader.result),
        alt: `Imagem anexada por ${profile.name}`,
        label: file.name
      });
      setIsReadingImage(false);
      onFeedback?.('Imagem anexada com sucesso!');
    };

    reader.onerror = () => {
      setIsReadingImage(false);
      onFeedback?.('Não foi possível ler esta imagem. Tente outro arquivo.');
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
      onPublish?.({
        text: text.trim(),
        image
      });
      setText('');
      setImage(null);
      setExpanded(false);
      setIsPublishing(false);
      publishTimerRef.current = null;
    }, 350);
  };

  return (
    <form className={`social-composer card d-block ${expanded ? 'is-expanded' : ''}`} onSubmit={handleSubmit} noValidate>
      <div className="social-composer-head">
        <Avatar className="profile-avatar" src={profile.avatar} initials={profile.initials} alt={`Foto de ${profile.name}`} />
        <div className="d-flex flex-column">
          <label htmlFor="social-post-text">Compartilhe uma experiência, entrega ou conquista</label>
          <small className="text-muted">Conte algo relevante para produtores, instituições e comunidades.</small>
        </div>
      </div>

      <textarea
        id="social-post-text"
        value={text}
        rows={expanded ? 4 : 2}
        maxLength={POST_CHARACTER_LIMIT}
        placeholder="O que aconteceu na sua produção, instituição ou parceria?"
        aria-describedby="social-post-counter"
        disabled={isPublishing}
        onFocus={() => setExpanded(true)}
        onChange={(event) => { setText(event.target.value); setExpanded(true); }}
      />

      {image && (
        <div className="composer-media-preview my-3">
          <FeedMedia media={image} onRemove={removeImage} />
        </div>
      )}

      <div className="social-composer-toolbar d-flex flex-wrap align-items-center justify-content-between gap-2 gap-sm-3 mt-3">
        <div className="social-composer-media-action d-flex align-items-center gap-2">
          <input
            ref={fileInputRef}
            id="social-post-image"
            className="visually-hidden"
            type="file"
            accept="image/*"
            tabIndex="-1"
            aria-hidden="true"
            onChange={handleImageSelection}
            disabled={isPublishing || isReadingImage}
          />
          <button
            ref={imageButtonRef}
            className="social-media-button d-inline-flex align-items-center gap-2"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPublishing || isReadingImage}
          >
            <i className="bi bi-image" aria-hidden="true" />
            <span>{isReadingImage ? 'Carregando foto…' : (image ? 'Trocar imagem' : 'Adicionar imagem')}</span>
          </button>
          <small id="social-post-local-note">Demonstração local</small>
        </div>

        <span id="social-post-counter" className="social-character-counter ms-auto" aria-live="polite">
          {text.length}/{POST_CHARACTER_LIMIT}
        </span>

        <button
          className="btn btn-primary social-publish-button"
          type="submit"
          disabled={!canPublish}
          aria-busy={isPublishing || undefined}
        >
          {isPublishing ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
              Publicando…
            </>
          ) : (
            <>
              <i className="bi bi-send me-1" aria-hidden="true" />
              Publicar
            </>
          )}
        </button>
      </div>
    </form>
  );
}

