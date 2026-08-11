import React, { useState } from 'react';

export default function ProducerFilters({
  tipo,
  setTipo,
  regiao,
  setRegiao,
  reputacaoMin,
  setReputacaoMin,
  reputacaoMax,
  setReputacaoMax,
  onReset
}) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleMinChange = (e) => {
    const val = parseFloat(e.target.value);
    setReputacaoMin(val);
    if (val > reputacaoMax) {
      setReputacaoMax(val);
    }
  };

  const handleMaxChange = (e) => {
    const val = parseFloat(e.target.value);
    setReputacaoMax(val);
    if (val < reputacaoMin) {
      setReputacaoMin(val);
    }
  };

  return (
    <aside className="col-md-3">
      <div className="card filtro-card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center d-md-block">
            <h3 className="mb-0 mb-md-3 fs-5 fw-bold text-brand-success">
              <i className="bi bi-funnel me-1"></i> Filtros
            </h3>
            <button
              className="btn btn-sm btn-outline-primary d-md-none"
              type="button"
              onClick={() => setIsOpenMobile(!isOpenMobile)}
            >
              <i className="bi bi-sliders"></i> {isOpenMobile ? 'Ocultar' : 'Filtrar'}
            </button>
          </div>

          <div className={`mt-3 mt-md-0 ${isOpenMobile ? 'd-block' : 'd-none d-md-block'}`}>
            <div className="mb-3">
              <label className="form-label fw-semibold small">Tipo de Produtor</label>
              <select
                className="form-select"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="verduras-frutas">Verduras e Frutas</option>
                <option value="graos-cereais">Grãos e Cereais</option>
                <option value="produtos-organicos">Produtos Orgânicos</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Localização</label>
              <select
                className="form-select"
                value={regiao}
                onChange={(e) => setRegiao(e.target.value)}
              >
                <option value="Todas as regiões">Todas as regiões</option>
                <option value="Sudeste">Sudeste</option>
                <option value="Nordeste">Nordeste</option>
                <option value="Centro-Oeste">Centro-Oeste</option>
                <option value="Sul">Sul</option>
              </select>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label mb-0 fw-semibold small">Reputação Mínima</label>
                <span className="range-value">
                  {reputacaoMin.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                className="form-range"
                min="0"
                max="5"
                step="0.1"
                value={reputacaoMin}
                onChange={handleMinChange}
              />
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label mb-0 fw-semibold small">Reputação Máxima</label>
                <span className="range-value">
                  {reputacaoMax.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                className="form-range"
                min="0"
                max="5"
                step="0.1"
                value={reputacaoMax}
                onChange={handleMaxChange}
              />
            </div>

            {(tipo !== 'Todos' || regiao !== 'Todas as regiões' || reputacaoMin > 0 || reputacaoMax < 5) && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary w-100 mt-2"
                onClick={onReset}
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i> Limpar Filtros
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
