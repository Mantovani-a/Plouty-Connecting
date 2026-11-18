import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import FeedEmptyState from '../components/social/FeedEmptyState';
import PostComposer from '../components/social/PostComposer';
import SocialPost from '../components/social/SocialPost';
import SocialSidebar from '../components/social/SocialSidebar';
import Toast from '../components/common/Toast';
import { useWorkspace } from '../context/WorkspaceContext';
import { useSocial } from '../context/SocialContext';
import { useNetwork } from '../context/NetworkContext';
import { useProfiles } from '../context/ProfilesContext';
import { readAllDemands } from '../utils/demandSearch';
import { useCommerce } from '../context/CommerceContext';

export default function SocialHome() {
  const { profile, isProducer } = useWorkspace();
  const { posts, createPost } = useSocial();
  const { connectionsFor } = useNetwork();
  const { getProfileById } = useProfiles();
  const { demands } = useCommerce();
  const [filter, setFilter] = useState('recentes');
  const [feedback, setFeedback] = useState('');
  const feedbackTimerRef = useRef(null);

  const connectedIds = connectionsFor(profile.id);
  const visiblePosts = posts.filter((post) => filter === 'conexoes'
    ? post.authorId === profile.id || connectedIds.includes(post.authorId)
    : filter === 'oportunidades' ? getProfileById(post.authorId)?.kind === 'buyer' : true);
  const opportunities = filter === 'oportunidades' ? readAllDemands(demands, getProfileById).filter((demand) => demand.status === 'open').slice(0, 3) : [];

  useEffect(() => () => window.clearTimeout(feedbackTimerRef.current), []);

  const showFeedback = (message) => {
    window.clearTimeout(feedbackTimerRef.current);
    setFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(''), 3800);
  };

  const handlePublishPost = ({ text, image }) => {
    const { saved } = createPost(profile.id, text, image);
    showFeedback(saved ? 'Publicação registrada e mantida neste navegador!' : 'Publicação visível nesta sessão; não foi possível salvá-la no navegador.');
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

          <div className="feed-filters" role="group" aria-label="Filtrar publicações">
            {[['recentes', 'Recentes'], ['conexoes', 'Conexões'], ['oportunidades', 'Oportunidades']].map(([value, label]) => (
              <button key={value} type="button" className={filter === value ? 'is-active' : ''}
                aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>
            ))}
          </div>

          {filter === 'oportunidades' && <section className="feed-opportunities card" aria-label="Demandas em destaque">
            <h2>Demandas em destaque</h2>
            {opportunities.map((demand) => <Link key={demand.id} to={`/demandas#demand-${demand.id}`}>
              <strong>{demand.org}</strong><span>{demand.products.join(' · ')}</span><i className="bi bi-arrow-right" aria-hidden="true" />
            </Link>)}
          </section>}

          <section className="social-feed-list" aria-label="Publicações da rede Plouty">
            {visiblePosts.length ? (
              visiblePosts.map((post) => (
                <SocialPost
                  key={post.id}
                  post={post}
                  currentProfile={profile}
                  onFeedback={showFeedback}
                />
              ))
            ) : (
              filter === 'recentes' ? <FeedEmptyState /> : <div className="network-empty card"><i className="bi bi-journal-text" aria-hidden="true" /><p>Nenhuma publicação encontrada neste filtro.</p></div>
            )}
          </section>
        </div>

        <SocialSidebar profile={profile} isProducer={isProducer} onFeedback={showFeedback} />
      </div>

      <Toast message={feedback} onClose={() => setFeedback('')} />
    </main>
  );
}
