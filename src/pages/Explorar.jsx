import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProducerFilters from '../components/explorar/ProducerFilters';
import ProducerCard from '../components/explorar/ProducerCard';
import { initialProducers } from '../data/producersData';

export default function Explorar({ onOpenMessages }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';
  const [tipo, setTipo] = useState('Todos');
  const [regiao, setRegiao] = useState('Todas as regiões');
  const [reputacaoMin, setReputacaoMin] = useState(0);

  const resetFilters = () => {
    setTipo('Todos');
    setRegiao('Todas as regiões');
    setReputacaoMin(0);
    setSearchParams({});
  };

  const filteredProducers = useMemo(() => {
    return initialProducers.filter((producer) => {
      const haystack = `${producer.name} ${producer.role} ${producer.location} ${producer.description} ${producer.tags.join(' ')}`.toLowerCase();
      return (
        (!searchParam || haystack.includes(searchParam.toLowerCase().trim())) &&
        (tipo === 'Todos' || producer.types.includes(tipo)) &&
        (regiao === 'Todas as regiões' || producer.region === regiao) &&
        producer.reputation >= reputacaoMin
      );
    });
  }, [searchParam, tipo, regiao, reputacaoMin]);

  return (
    <main id="conteudo-principal" className="workspace-main producers-page">
      <div className="shell-container">
        <section className="page-heading d-flex align-items-end justify-content-between gap-4 flex-wrap">
          <div>
            <span className="eyebrow d-inline-flex align-items-center gap-2">Rede de fornecimento</span>
            <h1>Produtores e cooperativas</h1>
            <p className="mb-0 text-muted">
              Perfis comerciais com disponibilidade, histórico de entrega e documentos demonstrativos.
            </p>
          </div>
          <div className="mock-label d-inline-flex align-items-center gap-2">
            <i className="bi bi-database" /> Dados demonstrativos
          </div>
        </section>

        <div className="producers-layout">
          <ProducerFilters
            tipo={tipo}
            setTipo={setTipo}
            regiao={regiao}
            setRegiao={setRegiao}
            reputacaoMin={reputacaoMin}
            setReputacaoMin={setReputacaoMin}
            onReset={resetFilters}
          />

          <section className="producer-results">
            <div className="results-toolbar d-flex align-items-center justify-content-between gap-3 mb-3">
              <div role="status" aria-live="polite" aria-atomic="true">
                <strong>
                  {filteredProducers.length} {filteredProducers.length === 1 ? 'fornecedor' : 'fornecedores'}
                </strong>
                <span>
                  {searchParam ? ` para “${searchParam}”` : ' com dados comerciais no protótipo'}
                </span>
              </div>
            </div>

            {filteredProducers.length ? (
              filteredProducers.map((producer) => (
                <ProducerCard key={producer.id} producer={producer} onOpenMessages={onOpenMessages} />
              ))
            ) : (
              <div className="empty-state">
                <span><i className="bi bi-people" /></span>
                <h2>Nenhum fornecedor encontrado</h2>
                <p>Ajuste os filtros para ampliar os resultados.</p>
                <button className="btn btn-primary" onClick={resetFilters}>
                  Redefinir filtros
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
