import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import FeedEmptyState from '../components/social/FeedEmptyState';
import PostComposer from '../components/social/PostComposer';
import SocialPost from '../components/social/SocialPost';
import SocialSidebar from '../components/social/SocialSidebar';
import Toast from '../components/common/Toast';
import { useWorkspace } from '../context/WorkspaceContext';
import { socialFeedPosts } from '../data/socialFeedData';
import { getStorageItem, setStorageItem } from '../utils/storage';

const LOCAL_SOCIAL_POSTS_KEY = 'plouty.demo.social-posts.v1';

export default function SocialHome() {
  const { profile, isProducer } = useWorkspace();
  const [localPosts, setLocalPosts] = useState(() => getStorageItem(LOCAL_SOCIAL_POSTS_KEY, []));
  const [feedback, setFeedback] = useState('');
  const feedbackTimerRef = useRef(null);

  const posts = useMemo(() => [...localPosts, ...socialFeedPosts], [localPosts]);

  useEffect(() => () => window.clearTimeout(feedbackTimerRef.current), []);

  const showFeedback = (message) => {
    window.clearTimeout(feedbackTimerRef.current);
    setFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(''), 3800);
  };

  const handlePublishPost = ({ text, image }) => {
    const newPost = {
      id: `local-post-${Date.now()}`,
      author: {
        initials: profile.initials || 'VC',
        name: profile.name || 'Você',
        role: profile.role || (isProducer ? 'Produtor Rural' : 'Instituição Compradora'),
        type: isProducer ? 'producer' : 'institution',
        avatar: profile.avatar,
        verified: true
      },
      publishedAt: 'Publicado agora mesmo',
      text,
      postImage: image,
      reactionCount: 0,
      commentCount: 0,
      repostCount: 0,
      comments: [],
      isLocal: true
    };

    const nextPosts = [newPost, ...localPosts];
    setLocalPosts(nextPosts);
    setStorageItem(LOCAL_SOCIAL_POSTS_KEY, nextPosts);
    showFeedback('Publicação registrada e mantida na rede!');
  };

  return (
    <main id="conteudo-principal" className="workspace-main social-feed-main">
      <div className="social-feed-shell">
        <div className="social-feed-primary">
          <header className="social-feed-heading d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div>
              <span className="eyebrow d-block mb-1">Rede de Abastecimento Sustentável</span>
              <h1 className="h3 mb-0">Rede Plouty</h1>
            </div>

            <div className="d-flex align-items-center gap-2">
              <NavLink
                to="/demandas"
                className="btn btn-outline-success btn-compact d-inline-flex align-items-center gap-1"
              >
                <i className="bi bi-box-seam-fill" aria-hidden="true" />
                <span>Demandas</span>
              </NavLink>

              <a
                href="https://www.youtube.com/watch?v=AOllpt6I7u4"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-compact d-inline-flex align-items-center gap-2"
                aria-label="Assistir Pitch Vídeo no YouTube"
              >
                <i className="bi bi-play-circle-fill text-danger" aria-hidden="true" style={{ fontSize: '1.1rem' }} />
                <span>Pitch Vídeo</span>
              </a>
            </div>
          </header>

          <PostComposer
            profile={profile}
            onPublish={handlePublishPost}
            onFeedback={showFeedback}
          />

          <section className="social-feed-list" aria-label="Publicações da rede Plouty">
            {posts.length ? (
              posts.map((post) => (
                <SocialPost
                  key={post.id}
                  post={post}
                  currentProfile={profile}
                  onFeedback={showFeedback}
                />
              ))
            ) : (
              <FeedEmptyState />
            )}
          </section>
        </div>

        <SocialSidebar profile={profile} isProducer={isProducer} onFeedback={showFeedback} />
      </div>

      <Toast message={feedback} onClose={() => setFeedback('')} />
    </main>
  );
}
