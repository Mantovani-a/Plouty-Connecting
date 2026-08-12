import React, { useRef, useState } from 'react';
import { problemsData, solutionsData } from '../data/aboutData';
import ProblemCard from '../components/sobre/ProblemCard';
import SolutionCard from '../components/sobre/SolutionCard';

export default function Sobre() {
  const problemaRef = useRef(null);
  const solucaoRef = useRef(null);
  const [highlightedGroup, setHighlightedGroup] = useState(null);

  const triggerHighlight = (group, refElement) => {
    if (refElement && refElement.current) {
      refElement.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setHighlightedGroup(group);
    setTimeout(() => {
      setHighlightedGroup(null);
    }, 2000);
  };

  return (
    <>
      <section className="hero bg-light py-4 mb-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="fw-bold mb-3">Cultivo Local. Abundância Sustentável.</h1>
              <p className="lead fs-6 text-secondary mb-4">
                A Plouty conecta pequenos produtores rurais a compradores institucionais através de uma plataforma inteligente, garantindo alimento fresco, redução de desperdício e fomento à economia local.
              </p>
              <div className="d-flex gap-2 mb-4">
                <button
                  id="btn-como-funciona"
                  className="btn btn-primary flex-grow-1"
                  onClick={() => triggerHighlight('solucao', solucaoRef)}
                >
                  Como Funciona
                </button>
                <button
                  id="btn-entenda-problema"
                  className="btn btn-outline-primary flex-grow-1"
                  onClick={() => triggerHighlight('problema', problemaRef)}
                >
                  Entenda o Problema
                </button>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <img
                src="/images/hero-agricultura.jpg"
                alt="Agricultor segurando alimentos frescos"
                className="img-fluid rounded-4 shadow-sm"
                style={{ maxHeight: '380px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      <main className="container my-3">
        {/* Seção O Problema */}
        <section className="problema py-4" id="secao-problema" ref={problemaRef}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="mb-4 fw-bold">O Problema: Logística Ineficiente e Desperdício</h2>
              <p className="lead text-secondary">
                O escoamento da agricultura familiar no Brasil enfrenta barreiras que prejudicam o produtor e encarecem o prato do consumidor final.
              </p>
              <p className="text-secondary">
                Pequenos agricultores cultivam alimentos de alta qualidade, mas a falta de conexão direta com grandes compradores institucionais (como escolas e hospitais) gera uma dependência de intermediários. Isso reduz drasticamente a renda de quem produz e aumenta o desperdício de alimentos frescos ao longo da cadeia logística.
              </p>
              <div
                className="alert border-0 d-flex align-items-center gap-2 mt-4"
                style={{
                  backgroundColor: 'rgba(89, 154, 108, 0.1)',
                  color: 'var(--cor-verde-claro)',
                  borderLeft: '4px solid var(--cor-verde-claro)',
                  borderRadius: '4px'
                }}
              >
                <i className="bi bi-info-circle-fill fs-4" style={{ color: 'var(--cor-verde-claro)' }}></i>
                <span>
                  Cerca de <strong>30% de toda a produção agrícola</strong> nacional é desperdiçada antes de chegar à mesa.
                </span>
              </div>
            </div>

            <div className="col-lg-6 mt-4 mt-lg-0">
              {problemsData.map((item) => (
                <ProblemCard
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  isHighlighted={highlightedGroup === 'problema'}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Seção Solução / Como Funciona */}
        <section className="solucao py-4 border-top border-suave" ref={solucaoRef}>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Como a Plouty Transforma a Cadeia</h2>
            <p className="text-secondary">Criando uma ponte digital direta, transparente e confiável.</p>
          </div>

          <div className="row g-4">
            {solutionsData.map((item) => (
              <SolutionCard
                key={item.id}
                id={item.id}
                icon={item.icon}
                gradient={item.gradient}
                title={item.title}
                description={item.description}
                isHighlighted={highlightedGroup === 'solucao'}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
