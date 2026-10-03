import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DemandCreator from '../components/demands/DemandCreator';
import DemandCard from '../components/demands/DemandCard';
import Toast from '../components/common/Toast';
import { useWorkspace } from '../context/WorkspaceContext';
import { initialDemands } from '../data/demandsData';
import { getStorageItem, setStorageItem } from '../utils/storage';

const LOCAL_DEMANDS_KEY = 'plouty.demo.demands.v1';

export default function Demandas({ onOpenMessages }) {
  const { profile } = useWorkspace();
  const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get('search') || '';

  const [localDemands, setLocalDemands] = useState(() => getStorageItem(LOCAL_DEMANDS_KEY, []));
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [urgencyFilter, setUrgencyFilter] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [feedback, setFeedback] = useState('');
  const feedbackTimerRef = useRef(null);

  useEffect(() => {
    setSearchTerm(querySearch);
  }, [querySearch]);

  const allDemands = useMemo(() => [...localDemands, ...initialDemands], [localDemands]);

  useEffect(() => () => window.clearTimeout(feedbackTimerRef.current), []);

  const showFeedback = (message) => {
    window.clearTimeout(feedbackTimerRef.current);
    setFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(''), 3800);
  };

  const handleAddDemand = (newDemand) => {
    const nextDemands = [newDemand, ...localDemands];
    setLocalDemands(nextDemands);
    setStorageItem(LOCAL_DEMANDS_KEY, nextDemands);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    const trimmed = value.trim();
    if (trimmed) {
      setSearchParams({ search: trimmed });
    } else {
      setSearchParams({});
    }
  };

  const filteredDemands = useMemo(() => {
    const activeSearch = searchTerm.toLowerCase().trim();
    return allDemands.filter((demand) => {
      const searchHaystack = `${demand.org} ${demand.description} ${demand.location} ${(demand.products || []).join(' ')}`.toLowerCase();
      const matchesSearch = !activeSearch || searchHaystack.includes(activeSearch);
      const matchesCategory = categoryFilter === 'Todas' || demand.category === categoryFilter;
      const matchesUrgency = urgencyFilter === 'Todas' || demand.urgency === urgencyFilter;
      return matchesSearch && matchesCategory && matchesUrgency;
    });
  }, [allDemands, searchTerm, categoryFilter, urgencyFilter]);

  const resetFilters = () => {
    setCategoryFilter('Todas');
    setUrgencyFilter('Todas');
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <main id="conteudo-principal" className="workspace-main demands-page">
      <div className="shell-container">
        {/* Page Header */}
        <section className="page-heading d-flex align-items-end justify-content-between gap-4 flex-wrap mb-4">
          <div>
            <span className="eyebrow d-inline-flex align-items-center gap-2">
              <i className="bi bi-box-seam-fill text-brand-success" /> ODS 2 — Fome Zero e Agricultura Sustentável
            </span>
            <h1 className="h2 mb-1 text-brand-dark">Demandas</h1>
            <p className="mb-0 text-muted">
              Solicitações de abastecimento direto de escolas, hospitais, restaurantes e comunidades para produtores familiares.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle p-2">
              <i className="bi bi-check-all me-1" />
              {allDemands.length} demandas ativas
            </span>
          </div>
        </section>

        {/* Creator Component */}
        <DemandCreator
          currentProfile={profile}
          onAddDemand={handleAddDemand}
          onFeedback={showFeedback}
        />

        {/* Filter and Search Bar */}
        <div className="card mb-4 shadow-sm border-suave">
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-5">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-transparent border-end-0">
                    <i className="bi bi-search text-muted" />
                  </span>
                  <input
                    type="search"
                    className="form-control border-start-0"
                    placeholder="Buscar por produto, escola, hospital ou cidade..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-secondary border-start-0"
                      type="button"
                      onClick={() => handleSearchChange('')}
                      aria-label="Limpar termo de busca"
                    >
                      <i className="bi bi-x-lg" />
                    </button>
                  )}
                </div>
              </div>

              <div className="col-6 col-md-3">
                <select
                  className="form-select form-select-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  aria-label="Filtrar por categoria"
                >
                  <option value="Todas">Todas as categorias</option>
                  <option value="Demanda Emergencial">Emergencial</option>
                  <option value="Recorrência Semanal">Recorrência Semanal</option>
                  <option value="Parceria Local">Parceria Local</option>
                  <option value="Cotação Mensal">Cotação Mensal</option>
                </select>
              </div>

              <div className="col-6 col-md-2">
                <select
                  className="form-select form-select-sm"
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  aria-label="Filtrar por urgência"
                >
                  <option value="Todas">Todas urgências</option>
                  <option value="Alta">Urgente</option>
                  <option value="Média">Média</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <div className="col-12 col-md-2 text-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm w-100"
                  onClick={resetFilters}
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="demands-results-toolbar d-flex align-items-center justify-content-between mb-3 px-1">
          <span className="small text-muted fw-semibold">
            Mostrando {filteredDemands.length} de {allDemands.length} {allDemands.length === 1 ? 'demanda' : 'demandas'}
            {searchTerm && ` para "${searchTerm}"`}
          </span>
        </div>

        <section className="demands-grid" aria-label="Lista de demandas de compra">
          {filteredDemands.length > 0 ? (
            filteredDemands.map((demand) => (
              <DemandCard
                key={demand.id}
                demand={demand}
                onOpenMessages={onOpenMessages}
                onFeedback={showFeedback}
              />
            ))
          ) : (
            <div className="card text-center p-5 border-dashed">
              <div className="mb-3 text-muted">
                <i className="bi bi-inbox fs-1 text-secondary" />
              </div>
              <h3 className="h5 mb-1">Nenhuma demanda encontrada</h3>
              <p className="text-muted small mb-3">Tente alterar os termos da busca ou redefinir os filtros.</p>
              <div>
                <button type="button" className="btn btn-primary btn-sm" onClick={resetFilters}>
                  Redefinir filtros
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      <Toast message={feedback} onClose={() => setFeedback('')} />
    </main>
  );
}
