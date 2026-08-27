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
          <header className="social-feed-heading">
            <h1>Rede Plouty</h1>
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
