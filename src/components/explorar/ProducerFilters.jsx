import React, { useCallback, useRef, useState } from 'react';
import { useDialogFocus } from '../../hooks/useDialogFocus';

export default function ProducerFilters({
  tipo,
  setTipo,
  categoria,
  setCategoria,
  produto,
  setProduto,
  regiao,
  setRegiao,
  reputacaoMin,
  setReputacaoMin,
  onReset
}) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const filtersRef = useRef(null);
  const closeRef = useRef(null);
  const closeFilters = useCallback(() => setIsOpenMobile(false), []);
  useDialogFocus(isOpenMobile, closeFilters, filtersRef, closeRef);
  const activeFilters = tipo !== 'Todos' || categoria !== 'Todos' || produto || regiao !== 'Todas as regiões' || reputacaoMin > 0;

  return (
    <>
      <button
        className="btn btn-secondary producer-filter-trigger"
        type="button"
        onClick={() => setIsOpenMobile((open) => !open)}
        aria-expanded={isOpenMobile}
        aria-controls="producer-filter-fields"
      >
        <i className="bi bi-sliders" /> {isOpenMobile ? 'Ocultar filtros' : 'Filtrar perfis'}
      </button>

      {isOpenMobile && (
        <button
          type="button"
          className="filters-backdrop"
          onClick={closeFilters}
          aria-label="Fechar filtros"
        />
      )}

      <aside
        ref={filtersRef}
        className={`producer-filters filters-panel card d-block ${isOpenMobile ? 'is-open' : ''}`}
        aria-label="Filtros de perfis"
        role={isOpenMobile ? 'dialog' : undefined}
        aria-modal={isOpenMobile ? 'true' : undefined}
      >
        <div className="filters-title d-flex justify-content-between align-items-start gap-2">
          <div>
            <span className="eyebrow d-inline-flex align-items-center gap-2">Descoberta profissional</span>
            <h2>Filtros</h2>
          </div>
          <button
            ref={closeRef}
            className="icon-button filters-close"
            type="button"
            onClick={closeFilters}
            aria-label="Fechar filtros"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div id="producer-filter-fields" className="filter-fields">
          <div className="filter-group"><label htmlFor="profile-category">Categoria</label>
            <select id="profile-category" value={categoria} onChange={(event) => { setCategoria(event.target.value); if (event.target.value === 'buyer') setTipo('Todos'); }}>
              <option value="Todos">Todos os perfis</option><option value="producer">Produtores</option>
              <option value="cooperative">Cooperativas</option><option value="buyer">Compradores institucionais</option>
            </select></div>
          <div className="filter-group">
            <label htmlFor="producer-type">Tipo de produção</label>
            <select
              id="producer-type"
              value={tipo}
              onChange={(event) => setTipo(event.target.value)}
              disabled={categoria === 'buyer'}
            >
              <option value="Todos">Todos</option>
              <option value="verduras-frutas">Hortifruti</option>
              <option value="graos-cereais">Grãos e cereais</option>
              <option value="produtos-organicos">Produtos orgânicos</option>
            </select>
          </div>

          <div className="filter-group"><label htmlFor="profile-product">Produto</label>
            <input id="profile-product" type="search" value={produto} onChange={(event) => setProduto(event.target.value)} placeholder="Ex.: mandioca" /></div>

          <div className="filter-group">
            <label htmlFor="producer-region">Região</label>
            <select
              id="producer-region"
              value={regiao}
              onChange={(event) => setRegiao(event.target.value)}
            >
              <option>Todas as regiões</option>
              <option>Sudeste</option>
              <option>Nordeste</option>
              <option>Centro-Oeste</option>
              <option>Sul</option>
            </select>
          </div>

          <div className="filter-group">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label htmlFor="producer-rating" className="mb-0">Avaliação mínima</label>
              <strong>{reputacaoMin > 0 ? `${reputacaoMin.toFixed(1)} ★` : 'Todas'}</strong>
            </div>
            <input
              id="producer-rating"
              type="range"
              className="form-range"
              min="0"
              max="5"
              step="0.5"
              value={reputacaoMin}
              onChange={(e) => setReputacaoMin(Number(e.target.value))}
            />
          </div>

          {activeFilters && (
            <button type="button" className="btn btn-ghost w-100" onClick={onReset}>
              Limpar filtros
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
