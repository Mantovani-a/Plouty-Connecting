import React, { useState } from 'react';

export default function DemandCard({ demand }) {
  const [interessado, setInteressado] = useState(false);

  return (
    <article className="card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-start mb-3">
          <div className="demand-icon-container me-2">
            <i className={`bi ${demand.icon || 'bi-mortarboard-fill'} text-white`}></i>
          </div>
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between w-100 gap-2 flex-grow-1">
            <div>
              <h5 className="mb-0 fs-6">{demand.org}</h5>
              <div className="demand-card-meta">
                <span>
                  <i className="bi bi-geo-alt-fill text-brand-success"></i> {demand.location}
                </span>
                <span>•</span>
                <span>{demand.timeAgo}</span>
              </div>
            </div>
            <span className="badge badge-categoria px-2 py-1">{demand.category}</span>
          </div>
        </div>

        <p className="mb-3 text-secondary">{demand.description}</p>

        {demand.products && demand.products.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mt-3 mb-3">
            {demand.products.map((item, idx) => (
              <span key={idx} className="demand-product-tag">
                <i className="bi bi-box-seam"></i> {item}
              </span>
            ))}
          </div>
        )}

        <div className="d-flex gap-2">
          <button
            className={`btn ${interessado ? 'btn-success' : 'btn-primary'} btn-interesse`}
            onClick={() => setInteressado(!interessado)}
          >
            {interessado ? (
              <>
                <i className="bi bi-check2-circle me-1"></i> Interesse Registrado
              </>
            ) : (
              'Tenho Interesse'
            )}
          </button>
          <button className="btn btn-outline-secondary">
            Ver Detalhes
          </button>
        </div>
      </div>
    </article>
  );
}
