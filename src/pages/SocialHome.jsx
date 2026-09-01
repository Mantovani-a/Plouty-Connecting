import React, { useEffect, useRef, useState } from 'react';
import FeedEmptyState from '../components/social/FeedEmptyState';
import PostComposer from '../components/social/PostComposer';
import SocialPost from '../components/social/SocialPost';
import SocialSidebar from '../components/social/SocialSidebar';
import { useWorkspace } from '../context/WorkspaceContext';
import { socialFeedPosts } from '../data/socialFeedData';

export default function SocialHome() {
  const { profile, isProducer } = useWorkspace();
  const [feedback, setFeedback] = useState('');
  const feedbackTimerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(feedbackTimerRef.current), []);

  const showFeedback = (message) => {
    window.clearTimeout(feedbackTimerRef.current);
    setFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(''), 3600);
  };

  return (
    <main id="conteudo-principal" className="workspace-main social-feed-main">
      <div className="social-feed-shell">
        <div className="social-feed-primary">
          <header className="social-feed-heading d-flex align-items-center justify-content-between flex-wrap gap-2">
            <h1>Rede Plouty</h1>
            <a
              href="https://www.youtube.com/watch?v=_lUoH_IZhv4"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-compact d-inline-flex align-items-center gap-2"
              aria-label="Assistir Pitch Vídeo no YouTube"
            >
              <i className="bi bi-play-circle-fill text-danger" aria-hidden="true" style={{ fontSize: '1.1rem' }} />
              <span>Pitch Vídeo</span>
            </a>
          </header>

          <PostComposer profile={profile} onFeedback={showFeedback} />

          <section className="social-feed-list" aria-label="Publicações da rede Plouty">
            {socialFeedPosts.length ? socialFeedPosts.map((post) => (
              <SocialPost key={post.id} post={post} onFeedback={showFeedback} />
            )) : <FeedEmptyState />}
          </section>
        </div>

        <SocialSidebar profile={profile} isProducer={isProducer} onFeedback={showFeedback} />
      </div>

      <div className={`social-toast ${feedback ? 'is-visible' : ''}`} role="status" aria-live="polite" aria-atomic="true">
        {feedback && <><i className="bi bi-check-circle-fill" aria-hidden="true" /><span>{feedback}</span><button type="button" onClick={() => setFeedback('')} aria-label="Fechar feedback"><i className="bi bi-x-lg" aria-hidden="true" /></button></>}
      </div>
    </main>
  );
}
