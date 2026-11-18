import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FeedMedia from './FeedMedia';
import Avatar from '../common/Avatar';
import { useProfiles } from '../../context/ProfilesContext';
import { useSocial } from '../../context/SocialContext';

const countLabel = (value, singular, plural) => `${value} ${value === 1 ? singular : plural}`;
const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(date);
};

export default function SocialPost({ post, currentProfile, onFeedback }) {
  const { getProfileById } = useProfiles();
  const { data, editPost, deletePost, toggleLike: saveLike, toggleRepost: saveRepost, addComment, recordShare } = useSocial();
  const author = getProfileById(post.authorId) || currentProfile;
  const liked = (data.likes[post.id] || []).includes(currentProfile?.id);
  const reposted = (data.reposts[post.id] || []).includes(currentProfile?.id);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(post.text || '');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const commentInputRef = useRef(null);

  const reactionCount = (post.reactionCount || 0) + (data.likes[post.id] || []).length;
  const repostCount = (post.repostCount || 0) + (data.reposts[post.id] || []).length;
  const allComments = [...(post.comments || []), ...(data.comments[post.id] || [])];
  const commentCount = (post.commentCount || (post.comments?.length || 0)) + (data.comments[post.id] || []).length;
  const ownPost = post.authorId === currentProfile?.id;
  const media = post.postImage?.src ? post.postImage : post.image?.src ? post.image : post.mediaPlaceholder;

  const toggleLike = () => {
    saveLike(post.id, currentProfile.id);
    onFeedback?.(liked ? 'Curtida removida.' : 'Publicação curtida!');
  };

  const toggleRepost = () => {
    saveRepost(post.id, currentProfile.id);
    onFeedback?.(reposted ? 'Republicação desfeita.' : 'Republicação registrada.');
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

    addComment(post.id, currentProfile.id, trimmed);
    setCommentDraft('');
    onFeedback?.('Comentário publicado nesta discussão!');
  };

  const sharePost = async () => {
    if (isSharing) return;
    setIsSharing(true);
    const postUrl = `${window.location.origin}/inicio#post-${post.id}`;
    const shareData = {
      title: `Publicação de ${author.name} na Plouty`,
      text: post.text,
      url: postUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        recordShare(post.id, currentProfile.id);
        onFeedback?.('Compartilhamento concluído!');
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n${postUrl}`);
        recordShare(post.id, currentProfile.id);
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

  const submitEdit = (event) => {
    event.preventDefault();
    const result = editPost(post.id, currentProfile.id, editDraft);
    if (result.changed) { setEditing(false); onFeedback?.('Publicação atualizada.'); }
  };

  const removePost = () => {
    deletePost(post.id, currentProfile.id);
    onFeedback?.('Publicação excluída.');
  };

  return (
    <article id={`post-${post.id}`} className="social-post card d-block" aria-labelledby={`post-author-${post.id}`}>
      <header className="social-post-header">
        <Link to={`/perfil/${author.id}`} className="social-author-link" aria-label={`Ver perfil de ${author.name}`}>
          <Avatar
            className={`social-author-avatar is-${author.kind}`}
            src={author.avatar}
            initials={author.initials}
            alt=""
          />
        </Link>
        <div className="social-author-copy">
          <div className="d-flex align-items-center gap-2">
            <Link to={`/perfil/${author.id}`} className="social-author-link"><h2 id={`post-author-${post.id}`}>{author.name}</h2></Link>
            {author.verified && <i className="bi bi-patch-check-fill" aria-label="Identidade demonstrativa verificada" />}
          </div>
          <p className="mb-0 text-muted">{author.role}</p>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </div>
        {post.isLocal && (
          <span className="local-post-label">
            <i className="bi bi-device-ssd" aria-hidden="true" /> Local
          </span>
        )}
        {ownPost && <div className="social-post-owner-actions">
          <button type="button" onClick={() => { setEditDraft(post.text || ''); setEditing(true); setConfirmDelete(false); }}>Editar</button>
          <button type="button" onClick={() => { setConfirmDelete(true); setEditing(false); }}>Excluir</button>
        </div>}
      </header>

      {editing ? <form className="social-post-edit" onSubmit={submitEdit}>
        <label htmlFor={`edit-${post.id}`}>Editar publicação</label>
        <textarea id={`edit-${post.id}`} value={editDraft} maxLength="1000" rows="4" onChange={(event) => setEditDraft(event.target.value)} />
        <div><button type="submit" className="btn btn-primary btn-sm" disabled={!editDraft.trim() && !post.postImage?.src}>Salvar</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Cancelar</button></div>
      </form> : post.text && <p className="social-post-text">{post.text}</p>}
      {confirmDelete && <div className="social-post-delete" role="group" aria-label="Confirmar exclusão da publicação">
        <span>Excluir esta publicação?</span><button type="button" onClick={removePost}>Confirmar exclusão</button>
        <button type="button" onClick={() => setConfirmDelete(false)}>Manter publicação</button>
      </div>}
      {media && <FeedMedia media={media} />}

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
          className={`d-inline-flex align-items-center justify-content-center gap-1 gap-sm-2 ${commentsOpen ? 'is-active text-brand-success' : ''}`}
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
        <section className="social-comments" aria-label={`Comentários da publicação de ${author.name}`}>
          <div className="social-comment-list mb-3">
            {allComments.length > 0 ? (
              allComments.map((comment) => {
                const commenter = getProfileById(comment.authorId) || currentProfile;
                return <article key={comment.id} className="social-comment">
                  <Link to={`/perfil/${commenter.id}`} className="social-author-link" aria-label={`Ver perfil de ${commenter.name}`}>
                    <Avatar className="social-comment-avatar" src={commenter.avatar} initials={commenter.initials} alt="" />
                  </Link>
                  <div className="social-comment-body">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <Link to={`/perfil/${commenter.id}`} className="social-author-link"><strong className="text-brand-dark">{commenter.name}</strong></Link>
                      <time className="text-muted small">{comment.time}</time>
                    </div>
                    <p className="mb-0 mt-1">{comment.text}</p>
                  </div>
                </article>;
              })
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
                alt={`Avatar de ${currentProfile?.name || 'Você'}`}
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

