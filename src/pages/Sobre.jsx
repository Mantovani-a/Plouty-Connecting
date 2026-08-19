import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { problemsData, solutionsData } from '../data/aboutData';

export default function Sobre() {
  const solutionRef = useRef(null);

  const showHowItWorks = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    solutionRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start'
    });
  };

  return (
    <main id="conteudo-principal" className="about-page">
      <section className="about-hero">
        <div className="shell-container about-hero-grid">
          <div className="about-hero-copy">
            <span className="eyebrow d-inline-flex align-items-center gap-2">Da lavoura para quem alimenta pessoas</span>
            <h1>Mais renda no campo. Mais alimento fresco perto de casa.</h1>
            <p>
              A Plouty aproxima pequenos produtores e compradores institucionais com oportunidades claras, reputação verificável e negociação direta.
            </p>
            <div className="hero-actions d-flex gap-2">
              <button className="btn btn-primary" type="button" onClick={showHowItWorks}>
                Conheça o caminho <i className="bi bi-arrow-down" />
              </button>
              <NavLink className="btn btn-secondary" to="/entrar">
                Participar da Plouty
              </NavLink>
            </div>
            <div className="about-principles d-flex flex-wrap gap-3 mt-4 pt-3">
              <span className="d-inline-flex align-items-center gap-2"><i className="bi bi-arrow-left-right" /> Sem intermediários</span>
              <span className="d-inline-flex align-items-center gap-2"><i className="bi bi-shield-check" /> Confiança comercial</span>
              <span className="d-inline-flex align-items-center gap-2"><i className="bi bi-geo-alt" /> Economia local</span>
            </div>
          </div>

          <figure className="about-hero-image">
            <img
              src="/images/hero-agricultura.webp"
              width="1600"
              height="1067"
              alt="Produtor rural inspecionando uma plantação ao ar livre"
              loading="eager"
            />
            <figcaption className="d-flex flex-column gap-1">
              <span>Conexões locais</span>
              <strong>Produção com destino antes da colheita.</strong>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="about-problem shell-container" aria-labelledby="problem-title">
        <div className="about-section-copy">
          <span className="eyebrow d-inline-flex align-items-center gap-2">O desafio</span>
          <h2 id="problem-title">Produzir bem não deveria significar vender mal.</h2>
          <p className="text-muted">
            Cadeias longas, pouca previsibilidade e burocracia tiram margem de quem planta e dificultam o acesso de instituições a alimentos frescos da própria região.
          </p>
        </div>
        <div className="problem-list">
          {problemsData.map((item, index) => (
            <article key={item.id}>
              <span>0{index + 1}</span>
              <i className={`bi ${item.icon}`} />
              <div className="d-flex flex-column gap-1">
                <h3>{item.title}</h3>
                <p className="mb-0 text-muted">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-path" ref={solutionRef} aria-labelledby="path-title">
        <div className="shell-container">
          <div className="about-section-copy centered">
            <span className="eyebrow d-inline-flex align-items-center gap-2">Como a Plouty aproxima as pontas</span>
            <h2 id="path-title">Um mercado construído ao redor da confiança.</h2>
            <p>A tecnologia organiza a oportunidade; as relações continuam humanas.</p>
          </div>
          <div className="path-grid">
            {solutionsData.map((item, index) => (
              <article key={item.id} className="d-flex flex-column gap-2">
                <span className="path-index">0{index + 1}</span>
                <i className={`bi ${item.icon}`} />
                <h3>{item.title}</h3>
                <p className="mb-0">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta shell-container d-flex align-items-center justify-content-between gap-4 flex-wrap">
        <div>
          <span className="eyebrow d-inline-flex align-items-center gap-2">ODS 2 na prática</span>
          <h2>Negócios melhores podem alimentar comunidades inteiras.</h2>
          <p className="mb-0 text-muted">O impacto começa quando produção e demanda deixam de caminhar separadas.</p>
        </div>
        <NavLink to="/entrar" className="btn btn-primary flex-shrink-0">
          Conhecer a experiência <i className="bi bi-arrow-right" />
        </NavLink>
      </section>
    </main>
  );
}
