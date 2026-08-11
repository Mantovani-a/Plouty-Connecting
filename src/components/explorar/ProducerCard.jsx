import React, { useState } from 'react';

export default function ProducerCard({ producer }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(producer.likes);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikesCount(prev => prev + 1);
    } else {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    }
  };

  return (
    <article className="card card-produtor mb-3" style={{ transition: 'all 0.3s ease' }}>
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          <div className="post-avatar me-2"></div>
          <div className="flex-grow-1">
            <h4 className="mb-0 fs-6 fw-bold">{producer.name}</h4>
            <small className="text-muted">{producer.role}</small>
            <br />
            <small>
              <i className="bi bi-geo-alt-fill text-brand-success me-1"></i>
              {producer.location}
            </small>
          </div>
          <span className="badge badge-reputacao">
            {producer.reputation.toFixed(1)}
          </span>
        </div>

        <p className="mt-2 mb-2">{producer.description}</p>

        {producer.tags && producer.tags.length > 0 && (
          <div className="mb-2">
            {producer.tags.map((tag, idx) => (
              <span key={idx} className="badge bg-secondary me-1">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mb-2">
          <small className="stats-produtor text-muted">
            {likesCount} curtidas • {producer.comments} comentários • {producer.contacts} contatos
          </small>
        </div>

        <div className="d-flex gap-2">
          <button
            className={`btn ${liked ? 'btn-primary' : 'btn-outline-primary'} btn-like`}
            onClick={handleLike}
          >
            {liked ? 'Curtido' : 'Curtir'}
          </button>
          <button className="btn btn-outline-primary btn-comentar">
            Comentar
          </button>
          <button className="btn btn-primary btn-contato">
            Entrar em Contato
          </button>
        </div>
      </div>
    </article>
  );
}
