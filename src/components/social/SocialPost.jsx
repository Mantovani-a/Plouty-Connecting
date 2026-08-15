import React, { useEffect, useMemo, useRef, useState } from 'react';
import FeedMedia from './FeedMedia';
import Avatar from '../common/Avatar';

async function copyShareText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const temporaryField = document.createElement('textarea');
  temporaryField.value = value;
  temporaryField.setAttribute('readonly', '');
  temporaryField.style.position = 'fixed';
  temporaryField.style.opacity = '0';
  document.body.appendChild(temporaryField);
  temporaryField.select();
  const copied = document.execCommand('copy');
  temporaryField.remove();
  if (!copied) throw new Error('copy-unavailable');
}

const countLabel = (value, singular, plural) => `${value} ${value === 1 ? singular : plural}`;

export default function SocialPost({ post, currentProfile, onFeedback }) {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [localComments, setLocalComments] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const interactionLocksRef = useRef({});
  const cooldownTimersRef = useRef([]);
  const commentInputRef = useRef(null);
  const commentsId = `post-comments-${post.id}`;
  const reactionCount = post.reactionCount + (liked ? 1 : 0);
  const repostCount = post.repostCount + (reposted ? 1 : 0);
  const commentCount = post.commentCount + localComments.length;
  const visibleComments = useMemo(() => [...post.comments, ...localComments].slice(-2), [localComments, post.comments]);

  useEffect(() => () => cooldownTimersRef.current.forEach((timer) => window.clearTimeout(timer)), []);

  const runWithCooldown = (key, action) => {
    if (interactionLocksRef.current[key]) return;
    interactionLocksRef.current[key] = true;
    action();
    cooldownTimersRef.current.push(window.setTimeout(() => {
      interactionLocksRef.current[key] = false;
    }, 450));
  };

  const toggleLike = () => runWithCooldown('like', () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    onFeedback(nextLiked ? 'Publicação curtida.' : 'Curtida removida.');
  });

  const toggleRepost = () => runWithCooldown('repost', () => {
    const nextReposted = !reposted;
    setReposted(nextReposted);
    onFeedback(nextReposted ? 'Publicação republicada nesta demonstração.' : 'Republicação desfeita.');
  });

  const toggleComments = () => {
    const nextOpen = !commentsOpen;
    setCommentsOpen(nextOpen);
    if (nextOpen) window.requestAnimationFrame(() => commentInputRef.current?.focus());
  };

  const submitComment = (event) => {
    event.preventDefault();
    const body = commentDraft.trim();
    if (!body) return;
    setLocalComments((current) => [...current, {
      id: `local-comment-${post.id}-${current.length + 1}`,
      initials: currentProfile.initials,
      name: currentProfile.name,
      avatar: currentProfile.avatar,
      text: body,
      time: 'agora'
    }]);
    setCommentDraft('');
    onFeedback('Comentário adicionado somente neste dispositivo.');
  };

  const sharePost = async () => {
    if (interactionLocksRef.current.share || isSharing) return;
    interactionLocksRef.current.share = true;
    setIsSharing(true);
    const url = `${window.location.origin}/inicio#post-${post.id}`;
    const shareData = { title: `Publicação de ${post.author.name} na Plouty`, text: post.text, url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        onFeedback('Compartilhamento aberto no seu dispositivo.');
      } else {
        await copyShareText(`${shareData.title}\n\n${shareData.text}\n${url}`);
        onFeedback('Texto e link demonstrativo copiados.');
      }
    } catch (error) {
      if (error?.name === 'AbortError') onFeedback('Compartilhamento cancelado.');
      else onFeedback('Não foi possível compartilhar neste navegador.');
    } finally {
      setIsSharing(false);
      cooldownTimersRef.current.push(window.setTimeout(() => {
        interactionLocksRef.current.share = false;
      }, 450));
    }
  };

  return (
    <article id={`post-${post.id}`} className="social-post" aria-labelledby={`post-author-${post.id}`}>
      <header className="social-post-header">
        <Avatar className={`social-author-avatar is-${post.author.type}`} src={post.author.avatar} initials={post.author.initials} alt={`Foto de ${post.author.name}`} />
        <div className="social-author-copy">
          <div><h2 id={`post-author-${post.id}`}>{post.author.name}</h2>{post.author.verified && <i className="bi bi-patch-check-fill" aria-label="Identidade verificada" />}</div>
          <p>{post.author.role}</p>
          <time>{post.publishedAt}</time>
        </div>
        {post.isLocal && <span className="local-post-label"><i className="bi bi-device-ssd" aria-hidden="true" /> Local</span>}
      </header>

      {post.text && <p className="social-post-text">{post.text}</p>}
      <FeedMedia media={post.postImage || post.image} />

      <div className="social-post-metrics" aria-label={`${countLabel(reactionCount, 'curtida', 'curtidas')}, ${countLabel(commentCount, 'comentário', 'comentários')} e ${countLabel(repostCount, 'republicação', 'republicações')}`}>
        <span><i className="bi bi-hand-thumbs-up-fill" aria-hidden="true" /> {reactionCount}</span>
        <span>{countLabel(commentCount, 'comentário', 'comentários')}</span>
        <span>{countLabel(repostCount, 'republicação', 'republicações')}</span>
      </div>

      <div className="social-post-actions" aria-label="Ações da publicação">
        <button type="button" className={liked ? 'is-active' : ''} onClick={toggleLike} aria-pressed={liked}>
          <i className={`bi ${liked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`} aria-hidden="true" /> Curtir
        </button>
        <button type="button" className={commentsOpen ? 'is-active' : ''} onClick={toggleComments} aria-expanded={commentsOpen} aria-controls={commentsId}>
          <i className="bi bi-chat-left" aria-hidden="true" /> Comentar
        </button>
        <button type="button" className={reposted ? 'is-active' : ''} onClick={toggleRepost} aria-pressed={reposted}>
          <i className="bi bi-arrow-repeat" aria-hidden="true" /> Republicar
        </button>
        <button type="button" onClick={sharePost} disabled={isSharing} aria-busy={isSharing || undefined}>
          <i className="bi bi-share" aria-hidden="true" /> {isSharing ? 'Abrindo…' : 'Compartilhar'}
        </button>
      </div>

      {commentsOpen && (
        <section id={commentsId} className="social-comments" aria-label={`Comentários da publicação de ${post.author.name}`}>
          <div className="social-comment-list">
            {visibleComments.map((comment) => (
              <article key={comment.id} className="social-comment">
                <Avatar className="social-comment-avatar" src={comment.avatar} initials={comment.initials} alt={`Foto de ${comment.name}`} />
                <div><strong>{comment.name}</strong><p>{comment.text}</p><time>{comment.time}</time></div>
              </article>
            ))}
          </div>
          {commentCount > 2 && <p className="social-comments-note">Mostrando os dois comentários mais recentes.</p>}
          <form className="social-comment-form" onSubmit={submitComment}>
            <Avatar className="profile-avatar" src={currentProfile.avatar} initials={currentProfile.initials} alt={`Foto de ${currentProfile.name}`} />
            <div>
              <label className="visually-hidden" htmlFor={`comment-${post.id}`}>Comentar na publicação de {post.author.name}</label>
              <textarea ref={commentInputRef} id={`comment-${post.id}`} value={commentDraft} rows="2" maxLength="500" placeholder="Escreva um comentário profissional" onChange={(event) => setCommentDraft(event.target.value)} />
              <div className="social-comment-form-actions">
                <span>{commentDraft.length}/500</span>
                <button type="button" className="btn btn-ghost" onClick={() => { setCommentDraft(''); setCommentsOpen(false); }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={!commentDraft.trim()}>Comentar</button>
              </div>
            </div>
          </form>
        </section>
      )}
    </article>
  );
}
