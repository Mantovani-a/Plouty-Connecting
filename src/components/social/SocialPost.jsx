import React, { useEffect, useRef, useState } from 'react';
import FeedMedia from './FeedMedia';
import Avatar from '../common/Avatar';

const countLabel = (value, singular, plural) => `${value} ${value === 1 ? singular : plural}`;

export default function SocialPost({ post, onFeedback }) {
  const [liked, setLiked] = useState(false);
  const lockRef = useRef(false);
  const timerRef = useRef(null);
  const reactionCount = (post.reactionCount || 0) + (liked ? 1 : 0);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const toggleLike = () => {
    if (lockRef.current) return;
    lockRef.current = true;
    const nextLiked = !liked;
    setLiked(nextLiked);
    if (onFeedback) {
      onFeedback(nextLiked ? 'Publicação curtida.' : 'Curtida removida.');
    }
    timerRef.current = window.setTimeout(() => {
      lockRef.current = false;
    }, 450);
  };

  return (
    <article id={`post-${post.id}`} className="social-post card d-block" aria-labelledby={`post-author-${post.id}`}>
      <header className="social-post-header">
        <Avatar
          className={`social-author-avatar is-${post.author.type}`}
          src={post.author.avatar}
          initials={post.author.initials}
          alt={`Foto de ${post.author.name}`}
        />
        <div className="social-author-copy">
          <div className="d-flex align-items-center gap-2">
            <h2 id={`post-author-${post.id}`}>{post.author.name}</h2>
            {post.author.verified && <i className="bi bi-patch-check-fill" aria-label="Identidade verificada" />}
          </div>
          <p className="mb-0 text-muted">{post.author.role}</p>
          <time>{post.publishedAt}</time>
        </div>
        {post.isLocal && (
          <span className="local-post-label">
            <i className="bi bi-device-ssd" aria-hidden="true" /> Local
          </span>
        )}
      </header>

      {post.text && <p className="social-post-text">{post.text}</p>}
      <FeedMedia media={post.postImage || post.image} />

      <div className="social-post-metrics d-flex align-items-center gap-3" aria-label={countLabel(reactionCount, 'curtida', 'curtidas')}>
        <span className="d-inline-flex align-items-center gap-1 me-auto">
          <i className="bi bi-hand-thumbs-up-fill" aria-hidden="true" /> {countLabel(reactionCount, 'curtida', 'curtidas')}
        </span>
      </div>

      <div className="social-post-actions d-flex align-items-center" aria-label="Ações da publicação">
        <button
          type="button"
          className={`d-inline-flex align-items-center justify-content-center gap-2 ${liked ? 'is-active' : ''}`}
          onClick={toggleLike}
          aria-pressed={liked}
        >
          <i className={`bi ${liked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`} aria-hidden="true" /> Curtir
        </button>
      </div>
    </article>
  );
}
