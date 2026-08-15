import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { problemsData, solutionsData } from '../data/aboutData';

export default function Sobre() {
  const solutionRef = useRef(null);
  const timeoutRef = useRef(null);
  useEffect(() => () => clearTimeout(timeoutRef.current), []);
  const showHowItWorks = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    solutionRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <main id="conteudo-principal" className="about-page">
      <section className="about-hero">
        <div className="shell-container about-hero-grid">
          <div className="about-hero-copy">
            <span className="eyebrow">Da lavoura para quem alimenta pessoas</span>
            <h1>Mais renda no campo. Mais alimento fresco perto de casa.</h1>
            <p>A Plouty aproxima pequenos produtores e compradores institucionais com oportunidades claras, reputação verificável e negociação direta.</p>
            <div className="hero-actions"><button className="btn btn-primary" type="button" onClick={showHowItWorks}>Conheça o caminho <i className="bi bi-arrow-down" /></button><NavLink className="btn btn-secondary" to="/entrar">Participar da Plouty</NavLink></div>
            <div className="about-principles"><span><i className="bi bi-arrow-left-right" /> Sem intermediários</span><span><i className="bi bi-shield-check" /> Confiança comercial</span><span><i className="bi bi-geo-alt" /> Economia local</span></div>
          </div>
          <figure className="about-hero-image">
            <img src="/images/hero-agricultura.webp" width="1600" height="1067" alt="Produtor rural inspecionando uma plantação ao ar livre" loading="eager" />
            <figcaption><span>Conexões locais</span><strong>Produção com destino antes da colheita.</strong></figcaption>
          </figure>
        </div>
      </section>

      <section className="about-problem shell-container" aria-labelledby="problem-title">
        <div className="about-section-copy"><span className="eyebrow">O desafio</span><h2 id="problem-title">Produzir bem não deveria significar vender mal.</h2><p>Cadeias longas, pouca previsibilidade e burocracia tiram margem de quem planta e dificultam o acesso de instituições a alimentos frescos da própria região.</p></div>
        <div className="problem-list">{problemsData.map((item, index) => <article key={item.id}><span>0{index + 1}</span><i className={`bi ${item.icon}`} /><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div>
      </section>

      <section className="about-path" ref={solutionRef} aria-labelledby="path-title">
        <div className="shell-container">
          <div className="about-section-copy centered"><span className="eyebrow">Como a Plouty aproxima as pontas</span><h2 id="path-title">Um mercado construído ao redor da confiança.</h2><p>A tecnologia organiza a oportunidade; as relações continuam humanas.</p></div>
          <div className="path-grid">{solutionsData.map((item, index) => <article key={item.id}><span className="path-index">0{index + 1}</span><i className={`bi ${item.icon}`} /><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
        </div>
      </section>

      <section className="about-cta shell-container"><div><span className="eyebrow">ODS 2 na prática</span><h2>Negócios melhores podem alimentar comunidades inteiras.</h2><p>O impacto começa quando produção e demanda deixam de caminhar separadas.</p></div><NavLink to="/entrar" className="btn btn-primary">Conhecer a experiência <i className="bi bi-arrow-right" /></NavLink></section>
    </main>
  );
}
