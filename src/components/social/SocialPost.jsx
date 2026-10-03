import React, { useEffect, useRef, useState } from 'react';
import FeedMedia from './FeedMedia';
import Avatar from '../common/Avatar';

const countLabel = (value, singular, plural) => `${value} ${value === 1 ? singular : plural}`;

export default function SocialPost({ post, currentProfile, onFeedback }) {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [localComments, setLocalComments] = useState([]);
  const [isSharing, setIsSharing] = useState(false);

  const lockRef = useRef(false);
  const timerRef = useRef(null);
  const commentInputRef = useRef(null);

  const reactionCount = (post.reactionCount || 0) + (liked ? 1 : 0);
  const repostCount = (post.repostCount || 0) + (reposted ? 1 : 0);
  const allComments = [...(post.comments || []), ...localComments];
  const commentCount = (post.commentCount || (post.comments?.length || 0)) + localComments.length;

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const toggleLike = () => {
    if (lockRef.current) return;
    lockRef.current = true;
    const nextLiked = !liked;
    setLiked(nextLiked);
    onFeedback?.(nextLiked ? 'Publicação curtida!' : 'Curtida removida.');
    timerRef.current = window.setTimeout(() => {
      lockRef.current = false;
    }, 400);
  };

  const toggleRepost = () => {
    const nextReposted = !reposted;
    setReposted(nextReposted);
    onFeedback?.(nextReposted ? 'Publicação republicada no seu perfil demonstrativo!' : 'Republicação desfeita.');
  };

  const toggleComments = () => {
    const nextOpen = !commentsOpen;
    setCommentsOpen(nextOpen);
    if (nextOpen) {
      window.requestAnimationFrame(() => commentInputRef.current?.focus());
    }
  };

  const submitComment = (event) => {
    event.preventDefault();
    const trimmed = commentDraft.trim();
    if (!trimmed) return;

    const newComment = {
      id: `comment-${post.id}-${Date.now()}`,
      initials: currentProfile?.initials || 'VC',
      name: currentProfile?.name || 'Você',
      avatar: currentProfile?.avatar,
      text: trimmed,
      time: 'agora mesmo'
    };

    setLocalComments((prev) => [...prev, newComment]);
    setCommentDraft('');
    onFeedback?.('Comentário publicado nesta discussão!');
  };

  const sharePost = async () => {
    if (isSharing) return;
    setIsSharing(true);
    const postUrl = `${window.location.origin}/inicio#post-${post.id}`;
    const shareData = {
      title: `Publicação de ${post.author.name} na Plouty`,
      text: post.text,
      url: postUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        onFeedback?.('Compartilhamento concluído!');
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n${postUrl}`);
        onFeedback?.('Link da publicação copiado para a área de transferência!');
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        onFeedback?.('Não foi possível compartilhar neste dispositivo.');
      }
    } finally {
      setIsSharing(false);
    }
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

      <div className="social-post-metrics d-flex align-items-center flex-wrap gap-2 gap-sm-3" aria-label={`${countLabel(reactionCount, 'curtida', 'curtidas')}, ${countLabel(commentCount, 'comentário', 'comentários')} e ${countLabel(repostCount, 'republicação', 'republicações')}`}>
        <span className="d-inline-flex align-items-center gap-1 me-auto">
          <i className="bi bi-hand-thumbs-up-fill" aria-hidden="true" /> {countLabel(reactionCount, 'curtida', 'curtidas')}
        </span>
        <button type="button" className="btn btn-link p-0 text-decoration-none text-muted metrics-sub-link" onClick={toggleComments}>
          {countLabel(commentCount, 'comentário', 'comentários')}
        </button>
        <span className="text-muted">·</span>
        <span className="text-muted">
          {countLabel(repostCount, 'republicação', 'republicações')}
        </span>
      </div>

      <div className="social-post-actions" aria-label="Ações da publicação">
        <button
          type="button"
          className={`d-inline-flex align-items-center justify-content-center gap-1 gap-sm-2 ${liked ? 'is-active text-success' : ''}`}
          onClick={toggleLike}
          aria-pressed={liked}
        >
          <i className={`bi ${liked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`} aria-hidden="true" />
          <span>Curtir</span>
        </button>

        <button
          type="button"
          className={`d-inline-flex align-items-center justify-content-center gap-1 gap-sm-2 ${commentsOpen ? 'is-active text-primary' : ''}`}
          onClick={toggleComments}
          aria-expanded={commentsOpen}
        >
          <i className="bi bi-chat-left" aria-hidden="true" />
          <span>Comentar</span>
        </button>

        <button
          type="button"
          className={`d-inline-flex align-items-center justify-content-center gap-1 gap-sm-2 ${reposted ? 'is-active text-warning' : ''}`}
          onClick={toggleRepost}
          aria-pressed={reposted}
        >
          <i className="bi bi-arrow-repeat" aria-hidden="true" />
          <span>Republicar</span>
        </button>

        <button
          type="button"
          className="d-inline-flex align-items-center justify-content-center gap-1 gap-sm-2"
          onClick={sharePost}
          disabled={isSharing}
        >
          <i className="bi bi-share" aria-hidden="true" />
          <span>{isSharing ? 'Copiando…' : 'Compartilhar'}</span>
        </button>
      </div>

      {commentsOpen && (
        <section className="social-comments" aria-label={`Comentários da publicação de ${post.author.name}`}>
          <div className="social-comment-list mb-3">
            {allComments.length > 0 ? (
              allComments.map((comment) => (
                <article key={comment.id} className="social-comment">
                  <Avatar
                    className="social-comment-avatar"
                    src={comment.avatar}
                    initials={comment.initials}
                    alt={`Foto de ${comment.name}`}
                  />
                  <div className="social-comment-body">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <strong className="text-brand-dark">{comment.name}</strong>
                      <time className="text-muted small">{comment.time}</time>
                    </div>
                    <p className="mb-0 mt-1">{comment.text}</p>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-muted small mb-0 py-2 text-center">Seja o primeiro a comentar nesta publicação!</p>
            )}
          </div>

          <form className="social-comment-form" onSubmit={submitComment}>
            <div className="d-flex align-items-start gap-2">
              <Avatar
                className="profile-avatar flex-shrink-0"
                src={currentProfile?.avatar}
                initials={currentProfile?.initials || 'VC'}
                alt={`Foto de ${currentProfile?.name || 'Você'}`}
              />
              <div className="flex-grow-1">
                <textarea
                  ref={commentInputRef}
                  id={`comment-input-${post.id}`}
                  className="form-control form-control-sm"
                  rows="2"
                  maxLength="500"
                  placeholder="Escreva um comentário profissional ou construtivo..."
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                />
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <span className="text-muted small">{commentDraft.length}/500</span>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm px-2 py-1"
                      onClick={() => {
                        setCommentDraft('');
                        setCommentsOpen(false);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm px-3 py-1"
                      disabled={!commentDraft.trim()}
                    >
                      Comentar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
      )}
    </article>
  );
}

