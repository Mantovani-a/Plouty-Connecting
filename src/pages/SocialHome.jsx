import React, { useEffect, useMemo, useRef, useState } from 'react';
import FeedEmptyState from '../components/social/FeedEmptyState';
import PostComposer from '../components/social/PostComposer';
import SocialPost from '../components/social/SocialPost';
import SocialSidebar from '../components/social/SocialSidebar';
import { useWorkspace } from '../context/WorkspaceContext';
import { socialFeedPosts } from '../data/socialFeedData';
import '../styles/social-feed.css';

const LOCAL_SOCIAL_POSTS_KEY = 'plouty.demo.social-posts.v1';
const MAX_LOCAL_POSTS = 12;

function readLocalPosts() {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LOCAL_SOCIAL_POSTS_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((post) => post?.id && post?.author && Array.isArray(post.comments)).slice(0, MAX_LOCAL_POSTS);
  } catch {
    return [];
  }
}

export default function SocialHome() {
  const { profile, isProducer } = useWorkspace();
  const [localPosts, setLocalPosts] = useState(readLocalPosts);
  const [feedback, setFeedback] = useState('');
  const feedbackTimerRef = useRef(null);
  const posts = useMemo(() => [...localPosts, ...socialFeedPosts], [localPosts]);

  useEffect(() => () => window.clearTimeout(feedbackTimerRef.current), []);

  const showFeedback = (message) => {
    window.clearTimeout(feedbackTimerRef.current);
    setFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(''), 3600);
  };

  const publishPost = ({ text, image }) => {
    const post = {
      id: `local-post-${Date.now()}`,
      author: {
        initials: profile.initials,
        name: profile.name,
        role: profile.role,
        type: isProducer ? 'producer' : 'institution',
        avatar: profile.avatar,
        verified: true
      },
      publishedAt: 'Publicado agora neste dispositivo',
      text,
      postImage: image || {
        src: null,
        alt: `Publicação de ${profile.name} sem fotografia`,
        label: 'Publicação local sem imagem'
      },
      reactionCount: 0,
      commentCount: 0,
      repostCount: 0,
      comments: [],
      isLocal: true
    };
    const nextPosts = [post, ...localPosts].slice(0, MAX_LOCAL_POSTS);
    let stored = true;
    try {
      window.localStorage.setItem(LOCAL_SOCIAL_POSTS_KEY, JSON.stringify(nextPosts));
    } catch {
      stored = false;
    }
    setLocalPosts(nextPosts);
    showFeedback(stored
      ? 'Publicação adicionada e mantida somente neste dispositivo.'
      : 'Publicação adicionada nesta tela, mas o navegador não permitiu armazená-la.');
  };

  return (
    <main id="conteudo-principal" className="workspace-main social-feed-main">
      <div className="social-feed-shell">
        <div className="social-feed-primary">
          <header className="social-feed-heading">
            <span className="eyebrow">Início · Rede Plouty</span>
            <h1>O que acontece na rede Plouty</h1>
            <p>Experiências de produção, fornecimento e parceria que aproximam quem cultiva de quem alimenta comunidades.</p>
          </header>

          <PostComposer profile={profile} onPublish={publishPost} onFeedback={showFeedback} />

          <section className="social-feed-list" aria-label="Publicações da rede Plouty">
            {posts.length ? posts.map((post) => (
              <SocialPost key={post.id} post={post} currentProfile={profile} onFeedback={showFeedback} />
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
