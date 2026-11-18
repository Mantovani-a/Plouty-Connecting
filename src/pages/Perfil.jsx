import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import ProfileEditor from '../components/profile/ProfileEditor';
import ConnectionAction from '../components/network/ConnectionAction';
import SocialPost from '../components/social/SocialPost';
import Toast from '../components/common/Toast';
import { useWorkspace } from '../context/WorkspaceContext';
import { useProfiles } from '../context/ProfilesContext';
import { useNetwork } from '../context/NetworkContext';
import { useSocial } from '../context/SocialContext';

export default function Perfil({ onOpenMessages }) {
  const { id } = useParams();
  const { getProfileById, saveProfile } = useProfiles();
  const { connectionsFor } = useNetwork();
  const profile = getProfileById(id);
  const { profile: currentProfile } = useWorkspace();
  const [feedback, setFeedback] = useState('');
  const { posts: allPosts } = useSocial();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { setFeedback(''); setIsEditing(false); }, [id]);

  if (!profile) {
    return (
      <main id="conteudo-principal" className="workspace-main profile-page">
        <div className="shell-container profile-not-found card">
          <i className="bi bi-person-x" aria-hidden="true" />
          <h1>Perfil não encontrado</h1>
          <p>Esse endereço não corresponde a um perfil demonstrativo da rede.</p>
          <Link to="/explorar" className="btn btn-primary">Explorar fornecedores</Link>
        </div>
      </main>
    );
  }

  const isOwnProfile = currentProfile?.id === profile.id;
  const connections = connectionsFor(profile.id).map(getProfileById).filter(Boolean);
  const posts = allPosts.filter((post) => post.authorId === profile.id);

  const handleSave = (values) => {
    const saved = saveProfile(profile.id, values);
    setIsEditing(false);
    setFeedback(saved
      ? 'Perfil atualizado neste navegador.'
      : 'Perfil atualizado nesta sessão; o navegador não permitiu salvá-lo.');
  };

  return (
    <main id="conteudo-principal" className={`workspace-main profile-page ${isOwnProfile ? 'is-own-profile' : 'is-visited-profile'}`}>
      <div className="shell-container profile-layout">
        <div className="profile-main-column">
          <article className="profile-hero card">
            <div className="profile-cover">
              <span>Rede Plouty</span>
            </div>
            <div className="profile-hero-body">
              <Avatar className="profile-hero-avatar" src={profile.avatar} initials={profile.initials} alt={`Avatar de ${profile.name}`} />
              <div className="profile-hero-content">
                <span className="eyebrow">{profile.kind === 'buyer' ? 'Comprador institucional' : profile.kind === 'cooperative' ? 'Cooperativa' : 'Produtor rural'}</span>
                <h1>{profile.name} {profile.verified && <i className="bi bi-patch-check-fill profile-verified" aria-label="Perfil demonstrativo verificado" />}</h1>
                <p className="profile-headline">{profile.role}</p>
                <p className="profile-summary-description">{profile.description}</p>
                <p className="profile-location"><i className="bi bi-geo-alt" aria-hidden="true" /> {profile.location} <span>·</span> {connections.length} {connections.length === 1 ? 'conexão' : 'conexões'}</p>
                <div className="profile-actions">
                  {!isOwnProfile && (
                    <>
                      <ConnectionAction targetId={profile.id} onFeedback={setFeedback} />
                      <button type="button" className="btn btn-secondary" onClick={() => onOpenMessages(profile.id)}>
                        <i className="bi bi-chat-left-text" aria-hidden="true" /> Enviar mensagem
                      </button>
                    </>
                  )}
                  {isOwnProfile && <>
                    <span className="profile-own-badge"><i className="bi bi-person-check" aria-hidden="true" /> Meu perfil demonstrativo</span>
                    <button type="button" className="btn btn-primary" onClick={() => setIsEditing((open) => !open)} aria-expanded={isEditing} aria-controls="profile-editor">
                      <i className="bi bi-pencil-square" aria-hidden="true" /> {isEditing ? 'Fechar edição' : 'Editar perfil'}
                    </button>
                  </>}
                </div>
              </div>
            </div>
          </article>

          {isOwnProfile && isEditing && <ProfileEditor key={profile.id} profile={profile} onSave={handleSave} onCancel={() => setIsEditing(false)} />}

          <section className="profile-section card" aria-labelledby="profile-about-title">
            <h2 id="profile-about-title">Apresentação</h2>
            <p>{profile.about || profile.description}</p>
            <div className="profile-detail-line"><i className="bi bi-building" aria-hidden="true" /><span>{profile.organization}</span></div>
            <div className="profile-detail-line"><i className="bi bi-shield-check" aria-hidden="true" /><span>{profile.verification}</span></div>
            {(profile.contactEmail || profile.contactPhone) && <div className="profile-contact-list">
              <h3>Contato profissional</h3>
              {profile.contactEmail && <div className="profile-detail-line"><i className="bi bi-envelope" aria-hidden="true" /><span>{profile.contactEmail}</span></div>}
              {profile.contactPhone && <div className="profile-detail-line"><i className="bi bi-telephone" aria-hidden="true" /><span>{profile.contactPhone}</span></div>}
            </div>}
          </section>

          <section className="profile-section card" aria-labelledby="profile-products-title">
            <h2 id="profile-products-title">{profile.kind === 'buyer' ? 'Produtos de interesse' : 'Produtos e especialidades'}</h2>
            <div className="profile-product-list">
              {profile.products.map((product) => <span key={product}><i className="bi bi-leaf" aria-hidden="true" /> {product}</span>)}
            </div>
            {profile.kind !== 'buyer' && profile.capacity && <p className="profile-capacity"><i className="bi bi-box-seam" aria-hidden="true" /> <strong>Capacidade:</strong> {profile.capacity}</p>}
          </section>

          <section className="profile-section profile-posts" aria-labelledby="profile-posts-title">
            <div className="profile-section-heading"><h2 id="profile-posts-title">Publicações</h2><span>{posts.length} {posts.length === 1 ? 'publicação' : 'publicações'}</span></div>
            {posts.length ? posts.map((post) => (
              <SocialPost key={post.id} post={post} currentProfile={currentProfile} onFeedback={setFeedback} />
            )) : <div className="profile-empty-posts card"><i className="bi bi-journal-text" aria-hidden="true" /><p>Este perfil ainda não publicou na rede.</p></div>}
          </section>
        </div>

        <aside className="profile-side-column" aria-label="Reputação e conexões">
          <section className="profile-section card profile-reputation">
            <h2>Reputação profissional</h2>
            <div className="profile-rating"><i className="bi bi-star-fill" aria-hidden="true" /><strong>{profile.reputation.toFixed(1).replace('.', ',')}</strong><span>de 5 · {profile.reviews} avaliações</span></div>
            <dl>
              <div><dt>{profile.kind === 'buyer' ? 'Parcerias concluídas' : 'Entregas concluídas'}</dt><dd>{profile.completedDeals}</dd></div>
              <div><dt>Taxa de resposta</dt><dd>{profile.responseRate}%</dd></div>
            </dl>
            <small>Dados fictícios para demonstração da experiência.</small>
          </section>
          <section className="profile-section card profile-connections">
            <h2>Conexões da rede</h2>
            <p>Produtores e instituições com relações demonstrativas neste perfil.</p>
            {connections.map((connection) => (
              <Link key={connection.id} to={`/perfil/${connection.id}`} className="profile-connection-row">
                <Avatar src={connection.avatar} initials={connection.initials} alt="" />
                <span><strong>{connection.name}</strong><small>{connection.role}</small></span>
                <i className="bi bi-chevron-right" aria-hidden="true" />
              </Link>
            ))}
          </section>
        </aside>
      </div>
      <Toast message={feedback} onClose={() => setFeedback('')} />
    </main>
  );
}
