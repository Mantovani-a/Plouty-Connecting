import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { socialSuggestionIds, socialTopics } from '../../data/socialSidebarData';
import { useProfiles } from '../../context/ProfilesContext';
import ConnectionAction from '../network/ConnectionAction';

function ProfileCover() {
  return <div className="social-profile-cover is-placeholder" aria-hidden="true"><div><span /></div></div>;
}

function UserSummaryCard({ profile }) {
  return (
    <section className="social-side-card social-user-summary card d-block" aria-labelledby="social-user-summary-title">
      <ProfileCover />
      <div className="social-user-summary-body">
        <Link to={`/perfil/${profile.id}`} className="profile-avatar-link" aria-label={`Ver perfil de ${profile.name}`}>
          <Avatar className="social-user-avatar" src={profile.avatar} initials={profile.initials} alt="" />
        </Link>
        <div className="social-user-identity d-flex flex-column">
          <div className="d-flex align-items-center gap-2">
            <h2 id="social-user-summary-title"><Link to={`/perfil/${profile.id}`} className="profile-inline-link">{profile.name}</Link></h2>
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
  return (
    <section className="social-side-card social-suggestions card d-block" aria-labelledby="social-suggestions-title">
      <div className="social-side-card-heading">
        <span aria-hidden="true"><i className="bi bi-people" /></span>
        <h2 id="social-suggestions-title">Pessoas e instituições que talvez conheça</h2>
      </div>
      <ul>
        {suggestions.slice(0, 3).map((suggestion) => (
            <li key={suggestion.id}>
              <Link to={`/perfil/${suggestion.id}`} className="profile-avatar-link" aria-label={`Ver perfil de ${suggestion.name}`}><Avatar className="social-suggestion-avatar" src={suggestion.avatar} initials={suggestion.initials} alt="" /></Link>
              <div className="d-flex flex-column"><strong className="text-truncate"><Link to={`/perfil/${suggestion.id}`} className="profile-inline-link">{suggestion.name}</Link></strong><span>{suggestion.role}</span><small>{suggestion.location}</small></div>
              <ConnectionAction targetId={suggestion.id} compact showSecondary={false} onFeedback={onFeedback} />
            </li>
        ))}
      </ul>
    </section>
  );
}

export default function SocialSidebar({ profile, isProducer, onFeedback }) {
  const { getProfileById } = useProfiles();
  const suggestions = socialSuggestionIds[isProducer ? 'producer' : 'buyer'].map(getProfileById).filter(Boolean);

  return (
    <aside className="social-feed-sidebar" aria-label="Resumo e descobertas da rede">
      <UserSummaryCard profile={profile} />
      <TopicsCard />
      <SuggestionsCard suggestions={suggestions} onFeedback={onFeedback} />
    </aside>
  );
}
