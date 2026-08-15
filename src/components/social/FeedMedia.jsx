import React, { useEffect, useState } from 'react';

export default function FeedMedia({ media, onRemove, className = '' }) {
  const [loadFailed, setLoadFailed] = useState(false);
  const hasImage = Boolean(media?.src) && !loadFailed;

  useEffect(() => setLoadFailed(false), [media?.src]);

  return (
    <figure className={`social-media-frame ${hasImage ? 'has-image' : 'is-placeholder'} ${className}`.trim()}>
      {hasImage ? (
        <img src={media.src} alt={media.alt || ''} loading="lazy" decoding="async" onError={() => setLoadFailed(true)} />
      ) : (
        <div className="social-media-placeholder" role="img" aria-label={media?.alt || 'Imagem demonstrativa ainda não adicionada'}>
          <span><i className="bi bi-image" aria-hidden="true" /></span>
          <strong>Imagem demonstrativa</strong>
          <small>{loadFailed ? `${media?.label || 'Fotografia local'} · arquivo ainda não adicionado` : (media?.label || 'Espaço preparado para uma fotografia local')}</small>
        </div>
      )}
      {onRemove && (
        <button type="button" className="remove-social-image" onClick={onRemove} aria-label="Remover imagem selecionada">
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>
      )}
    </figure>
  );
}
