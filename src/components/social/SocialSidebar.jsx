import React, { useEffect, useState } from 'react';
import Avatar from '../common/Avatar';
import { socialSuggestions, socialTopics } from '../../data/socialSidebarData';

function ProfileCover({ src, alt }) {
  const [loadFailed, setLoadFailed] = useState(false);
  const hasImage = Boolean(src) && !loadFailed;

  useEffect(() => setLoadFailed(false), [src]);

  return (
    <div className={`social-profile-cover ${hasImage ? 'has-photo' : 'is-placeholder'}`}>
      {hasImage
        ? <img className="w-100 h-100 object-fit-cover" src={src} alt={alt} onError={() => setLoadFailed(true)} />
        : <div role="img" aria-label={alt}><span aria-hidden="true" /></div>}
    </div>
  );
}

function UserSummaryCard({ profile }) {
  return (
    <section className="social-side-card social-user-summary card d-block" aria-labelledby="social-user-summary-title">
      <ProfileCover src={profile.coverImage} alt={`Capa demonstrativa de ${profile.name}`} />
      <div className="social-user-summary-body">
        <Avatar className="social-user-avatar" src={profile.avatar} initials={profile.initials} alt={`Foto de ${profile.name}`} />
        <div className="social-user-identity d-flex flex-column">
          <div className="d-flex align-items-center gap-2">
            <h2 id="social-user-summary-title">{profile.name}</h2>
            {profile.verified && <i className="bi bi-patch-check-fill" aria-label="Perfil verificado" />}
          </div>
          <p className="mb-0 text-muted">{profile.role}</p>
        </div>
        <p className="social-user-description">{profile.description}</p>
        <dl className="social-user-details">
          <div className="d-flex align-items-center gap-2"><dt><i className="bi bi-geo-alt" aria-hidden="true" /><span className="visually-hidden">Localização</span></dt><dd>{profile.location}</dd></div>
          <div className="d-flex align-items-center gap-2"><dt><i className="bi bi-buildings" aria-hidden="true" /><span className="visually-hidden">Organização</span></dt><dd>{profile.organization}</dd></div>
        </dl>
        <div className="social-user-stats" aria-label="Resumo de confiança">
          <div><strong>{profile.completedDeals}</strong><span>negócios concluídos</span></div>
          <div><strong>{profile.reputation}</strong><span>reputação · {profile.reviews} avaliações</span></div>
        </div>
      </div>
    </section>
  );
}

function TopicsCard() {
  return (
    <section className="social-side-card social-topics card d-block" aria-labelledby="social-topics-title">
      <div className="social-side-card-heading">
        <span aria-hidden="true"><i className="bi bi-broadcast" /></span>
        <h2 id="social-topics-title">Em pauta na rede</h2>
      </div>
      <ol>
        {socialTopics.map((topic, index) => (
          <li key={topic.id}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div className="d-flex flex-column"><strong className="text-truncate">{topic.label}</strong><small>{topic.recentPosts} publicações recentes</small></div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SuggestionsCard({ suggestions, onFeedback }) {
  const [sentRequests, setSentRequests] = useState({});

  const sendRequest = (suggestion) => {
    if (sentRequests[suggestion.id]) return;
    setSentRequests((current) => ({ ...current, [suggestion.id]: true }));
    onFeedback(`Solicitação demonstrativa enviada para ${suggestion.name}.`);
  };

  return (
    <section className="social-side-card social-suggestions card d-block" aria-labelledby="social-suggestions-title">
      <div className="social-side-card-heading">
        <span aria-hidden="true"><i className="bi bi-people" /></span>
        <h2 id="social-suggestions-title">Pessoas e instituições que talvez conheça</h2>
      </div>
      <ul>
        {suggestions.slice(0, 3).map((suggestion) => {
          const requestSent = Boolean(sentRequests[suggestion.id]);
          return (
            <li key={suggestion.id}>
              <Avatar className="social-suggestion-avatar" src={suggestion.avatar} initials={suggestion.initials} alt={`Foto de ${suggestion.name}`} />
              <div className="d-flex flex-column"><strong className="text-truncate">{suggestion.name}</strong><span>{suggestion.type}</span><small>{suggestion.detail}</small></div>
              <button type="button" className={`d-inline-flex align-items-center justify-content-center gap-1 ${requestSent ? 'is-sent' : ''}`} onClick={() => sendRequest(suggestion)} disabled={requestSent}>
                <i className={`bi ${requestSent ? 'bi-check2' : 'bi-person-plus'}`} aria-hidden="true" />
                {requestSent ? 'Solicitação enviada' : 'Conectar'}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function SocialSidebar({ profile, isProducer, onFeedback }) {
  const suggestions = socialSuggestions[isProducer ? 'producer' : 'buyer'];

  return (
    <aside className="social-feed-sidebar" aria-label="Resumo e descobertas da rede">
      <UserSummaryCard profile={profile} />
      <TopicsCard />
      <SuggestionsCard suggestions={suggestions} onFeedback={onFeedback} />
    </aside>
  );
}
