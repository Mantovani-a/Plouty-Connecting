import React from 'react';

export default function FeedEmptyState() {
  return (
    <section className="social-feed-empty" aria-labelledby="social-empty-title">
      <span><i className="bi bi-people" aria-hidden="true" /></span>
      <h2 id="social-empty-title">A rede está pronta para novas histórias</h2>
      <p>Quando produtores e instituições compartilharem experiências, elas aparecerão aqui.</p>
    </section>
  );
}

