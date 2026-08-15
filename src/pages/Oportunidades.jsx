import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DemandCard from '../components/home/DemandCard';
import RangeStepper from '../components/common/RangeStepper';
import { initialDemands } from '../data/demandsData';
import { useDialogFocus } from '../hooks/useDialogFocus';

const MAX_DISTANCE = 200;

export default function Oportunidades() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState('Todas');
  const [urgency, setUrgency] = useState('Todas');
  const [distance, setDistance] = useState(MAX_DISTANCE);
  const [sort, setSort] = useState('relevance');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const filtersRef = useRef(null);
  const filtersCloseRef = useRef(null);
  const closeMobileFilters = useCallback(() => setMobileFiltersOpen(false), []);
  useDialogFocus(mobileFiltersOpen, closeMobileFilters, filtersRef, filtersCloseRef);
  const search = searchParams.get('search') || '';

  const filteredDemands = useMemo(() => {
    const normalized = search.toLowerCase().trim();
    const result = initialDemands.filter((demand) => {
      const haystack = `${demand.title} ${demand.product} ${demand.institution} ${demand.location} ${demand.description}`.toLowerCase();
      return (!normalized || haystack.includes(normalized))
        && (category === 'Todas' || demand.category === category)
        && (urgency === 'Todas' || demand.urgency === urgency)
        && demand.distanceKm <= distance;
    });
    return [...result].sort((a, b) => {
      if (sort === 'distance') return a.distanceKm - b.distanceKm;
      if (sort === 'deadline') return new Date(a.proposalDeadline) - new Date(b.proposalDeadline);
      return 0;
    });
  }, [category, distance, search, sort, urgency]);

  const clearFilters = () => {
    setCategory('Todas');
    setUrgency('Todas');
    setDistance(MAX_DISTANCE);
    setSearchParams({});
  };

  return (
    <main id="conteudo-principal" className="workspace-main opportunities-page">
      <div className="shell-container">
        <section className="page-heading">
          <div><span className="eyebrow">Mercado agrícola</span><h1>Oportunidades de fornecimento</h1><p>Compare demandas reais do protótipo e encontre o melhor encaixe para sua produção.</p></div>
          <div className="mock-label"><i className="bi bi-database" aria-hidden="true" /> Dados demonstrativos</div>
        </section>

        <div className="opportunities-layout">
          {mobileFiltersOpen && <button type="button" className="filters-backdrop" onClick={closeMobileFilters} aria-label="Fechar filtros" />}
          <aside id="opportunity-filters" ref={filtersRef} className={`filters-panel ${mobileFiltersOpen ? 'is-open' : ''}`} aria-label="Filtros de oportunidades" role={mobileFiltersOpen ? 'dialog' : undefined} aria-modal={mobileFiltersOpen ? 'true' : undefined}>
            <div className="filters-title"><div><span className="eyebrow">Refine sua busca</span><h2>Filtros</h2></div><button ref={filtersCloseRef} className="icon-button filters-close" type="button" onClick={closeMobileFilters} aria-label="Fechar filtros"><i className="bi bi-x-lg" /></button></div>
            <div className="filter-group">
              <label htmlFor="opportunity-search">Produto ou instituição</label>
              <div className="field-with-icon"><i className="bi bi-search" aria-hidden="true" /><input id="opportunity-search" type="search" value={search} placeholder="Ex.: batata, escola" onChange={(event) => setSearchParams(event.target.value ? { search: event.target.value } : {}, { replace: true })} /></div>
            </div>
            <div className="filter-group">
              <label htmlFor="category-filter">Tipo de compra</label>
              <select id="category-filter" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>Todas</option>{[...new Set(initialDemands.map((item) => item.category))].map((value) => <option key={value}>{value}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="urgency-filter">Urgência</label>
              <select id="urgency-filter" value={urgency} onChange={(event) => setUrgency(event.target.value)}><option>Todas</option><option>Alta</option><option>Média</option><option>Baixa</option></select>
            </div>
            <RangeStepper
              id="distance-filter"
              className="filter-group range-filter"
              label="Distância máxima"
              min={10}
              max={MAX_DISTANCE}
              step={10}
              value={distance}
              onChange={setDistance}
              formatValue={(currentDistance) => currentDistance === MAX_DISTANCE ? 'Qualquer' : `${currentDistance} km`}
              getValueText={(currentDistance) => currentDistance === MAX_DISTANCE ? 'Qualquer distância' : `Até ${currentDistance} quilômetros`}
              decreaseLabel="Diminuir distância máxima em 10 quilômetros"
              increaseLabel="Aumentar distância máxima em 10 quilômetros"
            />
            <button type="button" className="btn btn-ghost w-100" onClick={clearFilters}>Limpar filtros</button>
            <div className="filter-help"><i className="bi bi-lightbulb" aria-hidden="true" /><p><strong>Dica</strong>Atualize sua disponibilidade na página inicial para receber sugestões mais precisas.</p></div>
          </aside>

          <section className="results-panel">
            <div className="results-toolbar">
              <div role="status" aria-live="polite" aria-atomic="true"><strong>{filteredDemands.length} {filteredDemands.length === 1 ? 'oportunidade' : 'oportunidades'}</strong><span>{search ? ` para “${search}”` : ' compatíveis com o perfil demonstrativo'}</span></div>
              <div className="results-controls">
                <button type="button" className="btn btn-secondary mobile-filter-button" onClick={() => setMobileFiltersOpen(true)} aria-expanded={mobileFiltersOpen} aria-controls="opportunity-filters"><i className="bi bi-sliders" /> Filtrar</button>
                <label htmlFor="sort-opportunities">Ordenar</label><select id="sort-opportunities" value={sort} onChange={(event) => setSort(event.target.value)}><option value="relevance">Mais relevantes</option><option value="deadline">Prazo mais próximo</option><option value="distance">Menor distância</option></select>
              </div>
            </div>
            {filteredDemands.length ? (
              <div className="opportunity-list">{filteredDemands.map((demand) => <DemandCard key={demand.id} demand={demand} />)}</div>
            ) : (
              <div className="empty-state"><span><i className="bi bi-search" /></span><h2>Nenhuma oportunidade encontrada</h2><p>Tente ampliar a distância ou remover algum filtro.</p><button className="btn btn-primary" type="button" onClick={clearFilters}>Redefinir filtros</button></div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
