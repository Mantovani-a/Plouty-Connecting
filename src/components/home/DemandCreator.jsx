import React, { useState } from 'react';

export default function DemandCreator({ onAddDemand }) {
  const [text, setText] = useState('');

  const handlePublish = () => {
    if (!text.trim()) return;

    const newDemand = {
      id: Date.now(),
      org: 'Minha Instituição',
      icon: 'bi-building',
      location: 'Brasil',
      timeAgo: 'Agora mesmo',
      category: 'Demanda Emergencial',
      description: text,
      products: ['Demanda Recente']
    };

    onAddDemand(newDemand);
    setText('');
  };

  return (
    <div className="card mb-4">
      <div className="card-body p-3">
        <h5 className="card-title fs-6 fw-bold mb-2 text-brand-success">
          <i className="bi bi-pencil-square me-1"></i> Nova Demanda
        </h5>
        <textarea
          id="textarea-demanda"
          className="post-creator-textarea form-control"
          placeholder="O que sua escola, hospital ou negócio precisa hoje? Ex: 50kg de batata-doce..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-suave">
          <div className="d-flex gap-2 post-creator-options-wrapper">
            <button className="post-creator-btn-opt" type="button" title="Inserir Imagem">
              <i className="bi bi-image"></i> <span>Imagem</span>
            </button>
            <button className="post-creator-btn-opt" type="button" title="Definir Localização">
              <i className="bi bi-geo-alt"></i> <span>Localização</span>
            </button>
            <button className="post-creator-btn-opt" type="button" title="Categoria">
              <i className="bi bi-tag"></i> <span>Categoria</span>
            </button>
          </div>
          <button
            id="btn-publicar-demanda"
            className="btn btn-primary btn-sm px-4"
            type="button"
            onClick={handlePublish}
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
