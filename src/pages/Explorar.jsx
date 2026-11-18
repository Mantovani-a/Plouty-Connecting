import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProducerFilters from '../components/explorar/ProducerFilters';
import ProducerCard from '../components/explorar/ProducerCard';
import BuyerCard from '../components/explorar/BuyerCard';
import { useProfiles } from '../context/ProfilesContext';
import { normalizeSearch } from '../utils/demandSearch';

export default function Explorar({ onOpenMessages }) {
  const { profiles } = useProfiles();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';
  const [tipo, setTipo] = useState('Todos');
  const [categoria, setCategoria] = useState('Todos');
  const [produto, setProduto] = useState('');
  const [regiao, setRegiao] = useState('Todas as regiões');
  const [reputacaoMin, setReputacaoMin] = useState(0);

  const resetFilters = () => {
    setTipo('Todos');
    setCategoria('Todos');
    setProduto('');
    setRegiao('Todas as regiões');
    setReputacaoMin(0);
    setSearchParams({});
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter((producer) => {
      const haystack = normalizeSearch(`${producer.name} ${producer.role} ${producer.location} ${producer.description} ${producer.products.join(' ')}`);
      return (
        (!searchParam || haystack.includes(normalizeSearch(searchParam))) &&
        (categoria === 'Todos' || producer.kind === categoria) &&
        (tipo === 'Todos' || producer.types?.includes(tipo)) &&
        (!produto || normalizeSearch(producer.products.join(' ')).includes(normalizeSearch(produto))) &&
        (regiao === 'Todas as regiões' || producer.region === regiao) &&
        producer.reputation >= reputacaoMin
      );
    });
  }, [profiles, searchParam, tipo, categoria, produto, regiao, reputacaoMin]);

  return (
    <main id="conteudo-principal" className="workspace-main producers-page">
      <div className="shell-container">
        <section className="page-heading d-flex align-items-end justify-content-between gap-4 flex-wrap">
          <div>
            <span className="eyebrow d-inline-flex align-items-center gap-2">Rede de fornecimento</span>
            <h1>Explorar profissionais</h1>
            <p className="mb-0 text-muted">
              Produtores, cooperativas e compradores institucionais da rede agrícola.
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
            categoria={categoria}
            setCategoria={setCategoria}
            produto={produto}
            setProduto={setProduto}
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
                  {filteredProfiles.length} {filteredProfiles.length === 1 ? 'perfil' : 'perfis'}
                </strong>
                <span>
                  {searchParam ? ` para “${searchParam}”` : ' na rede demonstrativa'}
                </span>
              </div>
            </div>

            {filteredProfiles.length ? (
              filteredProfiles.map((producer) => (
                producer.kind === 'buyer'
                  ? <BuyerCard key={producer.id} buyer={producer} onOpenMessages={onOpenMessages} />
                  : <ProducerCard key={producer.id} producer={producer} onOpenMessages={onOpenMessages} />
              ))
            ) : (
              <div className="empty-state">
                <span><i className="bi bi-people" /></span>
                <h2>Nenhum perfil encontrado</h2>
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
