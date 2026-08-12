import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProducerFilters from '../components/explorar/ProducerFilters';
import ProducerCard from '../components/explorar/ProducerCard';
import { initialProducers } from '../data/producersData';

export default function Explorar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';

  const [tipo, setTipo] = useState('Todos');
  const [regiao, setRegiao] = useState('Todas as regiões');
  const [reputacaoMin, setReputacaoMin] = useState(0.0);
  const [reputacaoMax, setReputacaoMax] = useState(5.0);

  const resetFilters = () => {
    setTipo('Todos');
    setRegiao('Todas as regiões');
    setReputacaoMin(0.0);
    setReputacaoMax(5.0);
    setSearchParams({});
  };

  const filteredProducers = useMemo(() => {
    return initialProducers.filter((prod) => {
      // Search term filter
      const textToSearch = `${prod.name} ${prod.role} ${prod.location} ${prod.description} ${prod.tags.join(' ')}`.toLowerCase();
      const matchSearch = !searchParam || textToSearch.includes(searchParam.toLowerCase().trim());

      // Type filter
      const matchTipo = tipo === 'Todos' || prod.types.some(t => t.includes(tipo));

      // Region filter
      const matchRegiao = regiao === 'Todas as regiões' || prod.region === regiao;

      // Reputation filter
      const matchReputacao = prod.reputation >= reputacaoMin && prod.reputation <= reputacaoMax;

      return matchSearch && matchTipo && matchRegiao && matchReputacao;
    });
  }, [searchParam, tipo, regiao, reputacaoMin, reputacaoMax]);

  return (
    <main className="container my-3">
      <div className="row">
        {/* Filters sidebar */}
        <ProducerFilters
          tipo={tipo}
          setTipo={setTipo}
          regiao={regiao}
          setRegiao={setRegiao}
          reputacaoMin={reputacaoMin}
          setReputacaoMin={setReputacaoMin}
          reputacaoMax={reputacaoMax}
          setReputacaoMax={setReputacaoMax}
          onReset={resetFilters}
        />

        {/* Central Feed */}
        <section className="col-md-6">
          {searchParam && (
            <div className="alert alert-info py-2 px-3 mb-3 d-flex justify-content-between align-items-center">
              <span>
                <i className="bi bi-search me-2"></i>
                Resultados para: <strong>"{searchParam}"</strong>
              </span>
              <button
                type="button"
                className="btn-close btn-sm"
                aria-label="Limpar busca"
                onClick={() => setSearchParams({})}
              ></button>
            </div>
          )}

          {filteredProducers.length > 0 ? (
            filteredProducers.map((producer) => (
              <ProducerCard key={producer.id} producer={producer} />
            ))
          ) : (
            <div
              id="sem-resultados"
              className="alert border-0 text-center mt-3"
              style={{
                backgroundColor: 'rgba(74, 124, 89, 0.1)',
                color: 'var(--cor-verde-claro)',
                borderLeft: '4px solid var(--cor-verde-claro)',
                borderRadius: '4px'
              }}
            >
              <i className="bi bi-info-circle fs-4 d-block mb-2 text-brand-success"></i>
              <strong>Nenhum produtor encontrado</strong>
              <br />
              Tente ajustar os filtros ou redefinir a busca.
              <div className="mt-3">
                <button className="btn btn-sm btn-outline-success" onClick={resetFilters}>
                  Redefinir Filtros
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Right side info preview */}
        <aside className="col-md-3 d-none d-md-block">
          <div className="card destaque-card">
            <div className="card-body">
              <h3 className="fs-5 fw-bold mb-3 text-brand-success">
                <i className="bi bi-stars me-1"></i> Destaques
              </h3>
              <div className="mb-3">
                <strong className="d-block mb-1">Produtores Verificados</strong>
                <p className="text-secondary small mb-0">
                  Conheça os produtores com melhor reputação na plataforma Plouty.
                </p>
              </div>
              <div className="mb-3">
                <strong className="d-block mb-1">Ofertas de Estação</strong>
                <p className="text-secondary small mb-0">
                  Produtos frescos disponíveis agora. Qualidade garantida para sua instituição.
                </p>
              </div>
              <div>
                <strong className="d-block mb-1">Como Funciona</strong>
                <p className="text-secondary small mb-0">
                  Saiba como conectar com produtores e formalizar suas compras na Plouty.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
