import React, { useState } from 'react';

export default function DemandCreator({ currentProfile, onAddDemand, onFeedback, demand = null, onSave, onCancel }) {
  const [expanded, setExpanded] = useState(Boolean(demand));
  const [description, setDescription] = useState(demand?.description || '');
  const [category, setCategory] = useState(demand?.category || 'Demanda Emergencial');
  const [urgency, setUrgency] = useState(demand?.urgency || 'Alta');
  const [productsInput, setProductsInput] = useState(demand?.products?.join(', ') || '');
  const [location, setLocation] = useState(demand?.location || currentProfile?.location || '');
  const [deadline, setDeadline] = useState(demand?.deadline || 'Entrega para os próximos 5 dias');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!description.trim() || !productsInput.trim() || !deadline.trim()) {
      onFeedback?.('Preencha descrição, produtos e prazo da demanda.');
      return;
    }

    const parsedProducts = productsInput
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const values = {
      icon: 'bi-building-fill',
      location: location.trim() || currentProfile?.location || 'Brasil',
      category,
      urgency,
      description: description.trim(),
      products: parsedProducts,
      deadline: deadline.trim(),
      odsGoal: demand?.odsGoal || 'ODS 2 — Fome Zero e Fortalecimento dos Produtores Locais'
    };

    const result = demand ? onSave?.(values) : onAddDemand?.(values);
    if (!result?.changed) { onFeedback?.('Não foi possível salvar esta demanda.'); return; }
    setDescription('');
    setProductsInput('');
    setExpanded(false);
    onFeedback?.(demand ? 'Demanda atualizada.' : 'Nova demanda publicada e visível na rede!');
  };

  return (
    <div className={`card demand-creator mb-4 shadow-sm border-suave ${expanded ? 'is-expanded' : ''}`}>
      <div className="card-body p-3 p-sm-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="p-2 rounded-circle bg-success-subtle text-success d-inline-flex align-items-center justify-content-center">
              <i className="bi bi-cart-plus-fill" aria-hidden="true" />
            </span>
            <div>
              <h2 className="fs-6 fw-bold mb-0 text-brand-dark">{demand ? 'Editar demanda' : 'Publicar Demanda de Compra Institucional'}</h2>
              <small className="text-muted">Conecte sua instituição a produtores locais da agricultura familiar (ODS 2).</small>
            </div>
          </div>
          {!expanded && !demand && (
            <button
              type="button"
              className="btn btn-outline-success btn-sm"
              onClick={() => setExpanded(true)}
            >
              <i className="bi bi-plus-lg me-1" /> Nova Demanda
            </button>
          )}
        </div>

        {expanded ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="demand-description" className="form-label small fw-semibold text-secondary">
                O que sua escola, hospital, restaurante ou comunidade precisa adquirir?
              </label>
              <textarea
                id="demand-description"
                className="form-control"
                rows="3"
                placeholder="Exemplo: Precisamos de hortaliças frescas e frutas da estação para abastecimento semanal de 500 refeições escolares..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="row g-2 mb-3">
              <div className="col-12 col-md-6">
                <label htmlFor="demand-products" className="form-label small fw-semibold text-secondary">
                  Itens e quantidades (separados por vírgula):
                </label>
                <input
                  id="demand-products"
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ex: 50kg de batata-doce, 30 maços de couve, 40kg de cenoura"
                  value={productsInput}
                  onChange={(e) => setProductsInput(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-3">
                <label htmlFor="demand-category" className="form-label small fw-semibold text-secondary">
                  Tipo de Demanda:
                </label>
                <select
                  id="demand-category"
                  className="form-select form-select-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Demanda Emergencial">Emergencial</option>
                  <option value="Recorrência Semanal">Recorrência Semanal</option>
                  <option value="Parceria Local">Parceria Local</option>
                  <option value="Cotação Mensal">Cotação Mensal</option>
                </select>
              </div>

              <div className="col-12 col-md-3">
                <label htmlFor="demand-urgency" className="form-label small fw-semibold text-secondary">
                  Nível de Urgência:
                </label>
                <select
                  id="demand-urgency"
                  className="form-select form-select-sm"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                >
                  <option value="Alta">Alta prioridade</option>
                  <option value="Média">Média</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-12 col-md-6">
                <label htmlFor="demand-location" className="form-label small fw-semibold text-secondary">
                  Local de Entrega / Região:
                </label>
                <input
                  id="demand-location"
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ex: Guarapari - ES"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="demand-deadline" className="form-label small fw-semibold text-secondary">
                  Prazo ou Previsão:
                </label>
                <input
                  id="demand-deadline"
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ex: Entregas semanais às terças"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-end gap-2 pt-2 border-top">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => { setExpanded(false); onCancel?.(); }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm px-3"
                disabled={!description.trim() || !productsInput.trim() || !deadline.trim()}
              >
                <i className="bi bi-check2-circle me-1" />
                {demand ? 'Salvar alterações' : 'Publicar Demanda ODS 2'}
              </button>
            </div>
          </form>
        ) : !demand && (
          <p className="text-muted small mb-0">
            Clique em <strong>Nova Demanda</strong> para solicitar cotações e propostas a produtores e cooperativas da sua região.
          </p>
        )}
      </div>
    </div>
  );
}
