import React from 'react';

export default function ProblemCard({ icon, title, description, isHighlighted }) {
  return (
    <div className={`card mb-3 ${isHighlighted ? 'card-destacado' : ''}`}>
      <div className="card-body p-4">
        <h4 className="d-flex align-items-center gap-2 mb-2 fs-5">
          <i className={`bi ${icon} text-brand-success`}></i> {title}
        </h4>
        <p className="text-secondary small mb-0">{description}</p>
      </div>
    </div>
  );
}
