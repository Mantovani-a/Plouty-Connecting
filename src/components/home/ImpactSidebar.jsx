import React from 'react';

export default function ImpactSidebar() {
  return (
    <aside className="col-md-3 d-none d-md-block">
      <div className="card destaque-card">
        <div className="card-body p-3">
          <h4 className="fs-6 fw-bold mb-3 text-brand-success">
            <i className="bi bi-globe2 me-1"></i> Impacto Social & ODS
          </h4>
          <p className="text-secondary" style={{ fontSize: '0.9em' }}>
            A Plouty apoia diretamente o <strong>ODS 2 (Fome Zero e Agricultura Sustentável)</strong> da ONU:
          </p>

          <div
            className="p-3 rounded-3 border border-suave text-center mb-3"
            style={{ background: 'var(--fundo-busca)' }}
          >
            <strong className="text-brand-success fs-4 d-block">4.500</strong>
            <small className="text-secondary d-block" style={{ fontSize: '0.7em' }}>
              Crianças alimentadas este mês
            </small>
          </div>

          <div className="progress mb-2" style={{ height: '10px' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: '75%' }}
              aria-valuenow="75"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div className="d-flex justify-content-between mb-3" style={{ fontSize: '0.78em' }}>
            <span className="text-muted">75% da meta mensal</span>
            <span className="text-brand-success fw-bold">Meta: 6.000</span>
          </div>

          <div className="pt-3 border-top" style={{ fontSize: '0.82em', color: 'var(--texto-secundario)' }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-check-circle-fill text-brand-success"></i>
              <span>12.4t de alimentos salvos</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-people-fill text-brand-success"></i>
              <span>120+ produtores conectados</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
