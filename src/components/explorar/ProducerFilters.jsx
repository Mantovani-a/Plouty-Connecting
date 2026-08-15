import React, { useCallback, useRef, useState } from 'react';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import RangeStepper from '../common/RangeStepper';

export default function ProducerFilters({
  tipo,
  setTipo,
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
  const activeFilters = tipo !== 'Todos' || regiao !== 'Todas as regiões' || reputacaoMin > 0;

  return (
    <>
      <button
        className="btn btn-secondary producer-filter-trigger"
        type="button"
        onClick={() => setIsOpenMobile((open) => !open)}
        aria-expanded={isOpenMobile}
        aria-controls="producer-filter-fields"
      >
        <i className="bi bi-sliders" /> {isOpenMobile ? 'Ocultar filtros' : 'Filtrar produtores'}
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
        className={`producer-filters filters-panel ${isOpenMobile ? 'is-open' : ''}`}
        aria-label="Filtros de produtores"
        role={isOpenMobile ? 'dialog' : undefined}
        aria-modal={isOpenMobile ? 'true' : undefined}
      >
        <div className="filters-title">
          <div>
            <span className="eyebrow">Busca de fornecedores</span>
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
          <div className="filter-group">
            <label htmlFor="producer-type">Tipo de produção</label>
            <select
              id="producer-type"
              value={tipo}
              onChange={(event) => setTipo(event.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="verduras-frutas">Hortifruti</option>
              <option value="graos-cereais">Grãos e cereais</option>
              <option value="produtos-organicos">Produtos orgânicos</option>
            </select>
          </div>

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

          <RangeStepper
            id="producer-rating"
            className="filter-group range-filter"
            label="Avaliação mínima"
            min={0}
            max={5}
            step={0.1}
            value={reputacaoMin}
            onChange={setReputacaoMin}
            formatValue={(currentRating) => currentRating.toFixed(1)}
            getValueText={(currentRating) =>
              `${currentRating.toFixed(1).replace('.', ',')} de 5 estrelas`
            }
            decreaseLabel="Diminuir avaliação mínima em 0,1 estrela"
            increaseLabel="Aumentar avaliação mínima em 0,1 estrela"
          />

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
