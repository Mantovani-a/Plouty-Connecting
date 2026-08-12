import React from 'react';

export default function SolutionCard({ id, icon, gradient, title, description, isHighlighted }) {
  return (
    <div className="col-md-4">
      <div
        id={id}
        className={`card h-100 p-3 text-center ${isHighlighted ? 'card-destacado' : ''}`}
      >
        <div className="card-body">
          <div
            className="avatar-placeholder mx-auto mb-3 d-flex align-items-center justify-content-center text-white fs-3"
            style={{ background: gradient }}
          >
            <i className={`bi ${icon}`}></i>
          </div>
          <h4 className="fs-5 fw-bold mb-2">{title}</h4>
          <p className="text-secondary small">{description}</p>
        </div>
      </div>
    </div>
  );
}
