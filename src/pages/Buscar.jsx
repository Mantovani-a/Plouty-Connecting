import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import { useProfiles } from '../context/ProfilesContext';
import { readAllDemands, normalizeSearch } from '../utils/demandSearch';
import { useCommerce } from '../context/CommerceContext';

export default function Buscar() {
  const [params, setParams] = useSearchParams();
  const query = params.get('search') || '';
  const needle = normalizeSearch(query);
  const { profiles, getProfileById } = useProfiles();
  const { demands: commerceDemands } = useCommerce();
  const people = needle ? profiles.filter((profile) => normalizeSearch(
    `${profile.name} ${profile.role} ${profile.location} ${profile.description} ${profile.products.join(' ')}`
  ).includes(needle)) : [];
  const demands = needle ? readAllDemands(commerceDemands, getProfileById).filter((demand) => normalizeSearch(
    `${demand.org} ${demand.description} ${demand.location} ${demand.category} ${demand.products.join(' ')}`
  ).includes(needle)) : [];

  return <main id="conteudo-principal" className="workspace-main discovery-page">
    <div className="shell-container discovery-shell">
      <header className="page-heading"><span className="eyebrow">Descoberta profissional</span><h1>Busca global</h1>
        <p>Encontre pessoas, instituições, produtos e demandas na Plouty.</p></header>
      <form className="discovery-search" onSubmit={(event) => { event.preventDefault(); const value = event.currentTarget.elements.search.value.trim(); setParams(value ? { search: value } : {}); }}>
        <label htmlFor="discovery-query">Buscar na rede</label><div><input id="discovery-query" name="search" type="search" defaultValue={query} key={query} placeholder="Nome, produto ou demanda" />
          <button type="submit" className="btn btn-primary">Buscar</button></div>
      </form>
      {!needle ? <div className="network-empty card"><i className="bi bi-search" aria-hidden="true" /><p>Digite um termo para pesquisar na rede.</p></div> : <>
        <section className="discovery-section" aria-labelledby="people-results"><div className="discovery-heading"><h2 id="people-results">Perfis</h2><span>{people.length}</span></div>
          {people.length ? people.map((person) => <Link key={person.id} to={`/perfil/${person.id}`} className="discovery-result card">
            <Avatar initials={person.initials} alt="" /><span><strong>{person.name}</strong><small>{person.role} · {person.location}</small><small>Produtos: {person.products.join(', ')}</small></span><i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>) : <p className="discovery-empty">Nenhum perfil encontrado.</p>}
        </section>
        <section className="discovery-section" aria-labelledby="demand-results"><div className="discovery-heading"><h2 id="demand-results">Demandas</h2><span>{demands.length}</span></div>
          {demands.length ? demands.map((demand) => <article key={demand.id} className="discovery-demand card">
            <span className="eyebrow">{demand.category} · {demand.status === 'closed' ? 'Encerrada' : 'Aberta'}</span><h3>{demand.org}</h3><p>{demand.description}</p>
            <small>{demand.products.join(' · ')}</small><div><Link to={`/perfil/${demand.profileId}`}>Ver instituição</Link><Link to={`/demandas#demand-${demand.id}`}>Ver demanda</Link></div>
          </article>) : <p className="discovery-empty">Nenhuma demanda encontrada.</p>}
        </section>
      </>}
    </div>
  </main>;
}
