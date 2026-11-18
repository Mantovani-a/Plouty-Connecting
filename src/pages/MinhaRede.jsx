import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import Toast from '../components/common/Toast';
import ConnectionAction from '../components/network/ConnectionAction';
import { useNetwork } from '../context/NetworkContext';
import { useProfiles } from '../context/ProfilesContext';
import { useWorkspace } from '../context/WorkspaceContext';

const normalizeText = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
const kindLabel = { producer: 'Produtor rural', cooperative: 'Cooperativa', buyer: 'Comprador institucional' };

function NetworkPerson({ profile, onFeedback }) {
  return (
    <article className="network-person">
      <Link to={`/perfil/${profile.id}`} className="profile-avatar-link" aria-label={`Ver perfil de ${profile.name}`}>
        <Avatar className="network-person-avatar" src={profile.avatar} initials={profile.initials} alt="" />
      </Link>
      <div className="network-person-copy">
        <span>{kindLabel[profile.kind]}</span>
        <h3><Link to={`/perfil/${profile.id}`} className="profile-inline-link">{profile.name}</Link></h3>
        <p>{profile.role}</p>
        <small><i className="bi bi-geo-alt" aria-hidden="true" /> {profile.location}</small>
      </div>
      <ConnectionAction targetId={profile.id} onFeedback={onFeedback} />
    </article>
  );
}

function NetworkSection({ id, title, count, profiles, emptyMessage, onFeedback }) {
  return (
    <section id={id} className="network-section card" aria-labelledby={`${id}-title`}>
      <div className="network-section-heading">
        <h2 id={`${id}-title`}>{title}</h2>
        <span>{count}</span>
      </div>
      {profiles.length ? profiles.map((profile) => <NetworkPerson key={profile.id} profile={profile} onFeedback={onFeedback} />) :
        <div className="network-empty"><i className="bi bi-people" aria-hidden="true" /><p>{emptyMessage}</p></div>}
    </section>
  );
}

export default function MinhaRede() {
  const { profile: actor } = useWorkspace();
  const { profiles, getProfileById } = useProfiles();
  const { status, connectionsFor, incomingFor, outgoingFor } = useNetwork();
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState('');

  const connected = connectionsFor(actor.id).map(getProfileById).filter(Boolean);
  const incoming = incomingFor(actor.id).map((request) => getProfileById(request.fromId)).filter(Boolean);
  const outgoing = outgoingFor(actor.id).map((request) => getProfileById(request.toId)).filter(Boolean);
  const suggestions = profiles.filter((candidate) => candidate.id !== actor.id && status(actor.id, candidate.id) === 'none')
    .sort((a, b) => Number(b.region === actor.region) - Number(a.region === actor.region));

  const search = normalizeText(query.trim());
  const matches = (person) => !search || normalizeText(`${person.name} ${person.role} ${person.location}`).includes(search);
  const sections = [
    { id: 'minhas-conexoes', title: 'Minhas conexões', all: connected, empty: 'Você ainda não tem conexões nesta rede demonstrativa.' },
    { id: 'solicitacoes-recebidas', title: 'Solicitações recebidas', all: incoming, empty: 'Nenhuma solicitação recebida no momento.' },
    { id: 'solicitacoes-enviadas', title: 'Solicitações enviadas', all: outgoing, empty: 'Você não enviou solicitações pendentes.' },
    { id: 'sugestoes', title: 'Sugestões profissionais', all: suggestions, empty: 'Não há novas sugestões para este perfil.' }
  ];

  return (
    <main id="conteudo-principal" className="workspace-main network-page">
      <div className="shell-container network-shell">
        <header className="network-page-heading">
          <div><span className="eyebrow">Relações profissionais na Plouty</span><h1>Minha Rede</h1>
            <p>Encontre produtores, cooperativas e compradores e acompanhe suas solicitações de conexão.</p></div>
          <div className="network-summary" aria-label="Resumo da minha rede">
            <span><strong>{connected.length}</strong> conexões</span>
            <span><strong>{incoming.length}</strong> recebidas</span>
            <span><strong>{outgoing.length}</strong> enviadas</span>
          </div>
        </header>

        <div className="network-search card">
          <label htmlFor="network-search"><i className="bi bi-search" aria-hidden="true" /> Buscar na minha rede</label>
          <div><input id="network-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder="Nome, atuação ou localização" />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca"><i className="bi bi-x-lg" aria-hidden="true" /></button>}
          </div>
        </div>

        <div className="network-sections">
          {sections.map((section) => {
            const visible = section.all.filter(matches);
            return <NetworkSection key={section.id} id={section.id} title={section.title} count={section.all.length}
              profiles={visible} onFeedback={setFeedback}
              emptyMessage={search ? 'Nenhum perfil desta seção corresponde à busca.' : section.empty} />;
          })}
        </div>
      </div>
      <Toast message={feedback} onClose={() => setFeedback('')} />
    </main>
  );
}
