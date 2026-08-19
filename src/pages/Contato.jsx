import React from 'react';
import FormField from '../components/common/FormField';
import { useContactForm } from '../hooks/useContactForm';

const SUBJECT_OPTIONS = [
  { value: 'suporte', label: 'Preciso de suporte' },
  { value: 'vendas', label: 'Quero vender minha produção' },
  { value: 'compras', label: 'Quero comprar para uma instituição' },
  { value: 'outros', label: 'Outro assunto' }
];

export default function Contato() {
  const { formData, errors, isSuccess, handleChange, handleBlur, handleSubmit } = useContactForm();

  return (
    <main id="conteudo-principal" className="contact-page">
      <div className="shell-container contact-grid">
        <section className="contact-intro">
          <span className="eyebrow d-inline-flex align-items-center gap-2">Fale com a Plouty</span>
          <h1>Uma conversa direta, como deve ser.</h1>
          <p className="text-muted">
            Conte onde você está na jornada: vendendo sua produção, organizando uma compra institucional ou conhecendo o projeto.
          </p>

          <div className="contact-channel d-flex align-items-start gap-3">
            <span className="flex-shrink-0"><i className="bi bi-life-preserver" /></span>
            <div className="d-flex flex-column gap-1">
              <strong>Suporte ao uso</strong>
              <p className="mb-0 text-muted">Ajuda para produtores e instituições no protótipo.</p>
              <a href="mailto:suporte@plouty.com.br">suporte@plouty.com.br</a>
            </div>
          </div>

          <div className="contact-channel d-flex align-items-start gap-3">
            <span className="earth flex-shrink-0"><i className="bi bi-building-check" /></span>
            <div className="d-flex flex-column gap-1">
              <strong>Parcerias institucionais</strong>
              <p className="mb-0 text-muted">Faculdades, cooperativas e organizações interessadas.</p>
              <a href="mailto:parcerias@plouty.com.br">parcerias@plouty.com.br</a>
            </div>
          </div>

          <div className="contact-note d-flex align-items-start gap-2">
            <i className="bi bi-clock" />
            <span className="d-flex flex-column gap-1">
              <strong>Retorno demonstrativo</strong>
              Este formulário valida os campos, mas ainda não envia mensagens para um servidor.
            </span>
          </div>
        </section>

        <section className="contact-form-panel" aria-labelledby="contact-title">
          <span className="eyebrow d-inline-flex align-items-center gap-2">Envie uma mensagem</span>
          <h2 id="contact-title">Como podemos ajudar?</h2>

          {isSuccess && (
            <div className="feedback-banner success d-flex align-items-center gap-3 mb-4" role="status">
              <i className="bi bi-check-circle-fill" />
              <span>
                <strong>Mensagem validada.</strong> Em produção, ela seria encaminhada à equipe Plouty.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <FormField
              id="nome"
              label="Nome completo"
              placeholder="Seu nome ou da instituição"
              value={formData.nome}
              error={errors.nome}
              onChange={(event) => handleChange('nome', event.target.value)}
              onBlur={() => handleBlur('nome')}
              required
            />
            <FormField
              id="email"
              type="email"
              label="E-mail"
              placeholder="voce@exemplo.com.br"
              value={formData.email}
              error={errors.email}
              onChange={(event) => handleChange('email', event.target.value)}
              onBlur={() => handleBlur('email')}
              required
            />
            <FormField
              id="assunto"
              type="select"
              label="Assunto"
              value={formData.assunto}
              options={SUBJECT_OPTIONS}
              onChange={(event) => handleChange('assunto', event.target.value)}
            />
            <FormField
              id="mensagem"
              type="textarea"
              label="Mensagem"
              placeholder="Explique brevemente o que você precisa."
              rows={5}
              maxLength={500}
              value={formData.mensagem}
              error={errors.mensagem}
              onChange={(event) => handleChange('mensagem', event.target.value)}
              onBlur={() => handleBlur('mensagem')}
              required
            />
            <button className="btn btn-primary w-100" type="submit">
              Validar mensagem <i className="bi bi-arrow-right" />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
