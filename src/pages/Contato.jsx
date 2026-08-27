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
  const { formData, errors, validatedFields, isSuccess, handleChange, handleBlur, handleSubmit } = useContactForm();

  const isValid = (field) => Boolean(
    validatedFields[field]
    && !errors[field]
    && String(formData[field] ?? '').trim()
  );

  return (
    <main id="conteudo-principal" className="contact-page">
      <div className="shell-container contact-grid">
        <section className="contact-intro">
          <header className="contact-intro-heading">
            <span className="eyebrow d-inline-flex align-items-center gap-2">Fale com a Plouty</span>
            <div className="contact-connection-cue" aria-hidden="true">
              <span className="d-inline-flex align-items-center justify-content-center"><i className="bi bi-person-workspace" /></span>
              <i className="bi bi-link-45deg" />
              <span className="earth d-inline-flex align-items-center justify-content-center"><i className="bi bi-buildings" /></span>
            </div>
            <h1>Vamos conversar?</h1>
            <p>Estamos aqui para aproximar produtores, instituições e novas oportunidades.</p>
          </header>

          <div className="contact-channels">
            <div className="contact-channel d-flex align-items-start gap-3">
              <span className="d-inline-flex align-items-center justify-content-center flex-shrink-0"><i className="bi bi-life-preserver" /></span>
              <div className="d-flex flex-column gap-1">
                <strong>Suporte ao uso</strong>
                <p className="mb-0 text-muted">Ajuda para produtores e instituições no protótipo.</p>
                <a href="mailto:suporte@plouty.com.br">suporte@plouty.com.br</a>
              </div>
            </div>

            <div className="contact-channel d-flex align-items-start gap-3">
              <span className="earth d-inline-flex align-items-center justify-content-center flex-shrink-0"><i className="bi bi-building-check" /></span>
              <div className="d-flex flex-column gap-1">
                <strong>Parcerias institucionais</strong>
                <p className="mb-0 text-muted">Faculdades, cooperativas e organizações interessadas.</p>
                <a href="mailto:parcerias@plouty.com.br">parcerias@plouty.com.br</a>
              </div>
            </div>
          </div>

          <div className="contact-note d-flex align-items-start gap-2">
            <i className="bi bi-info-circle" aria-hidden="true" />
            <span className="d-flex flex-column gap-1">
              <strong>Retorno demonstrativo</strong>
              Os dados são validados apenas nesta demonstração. Nenhuma mensagem é enviada ou armazenada em servidor.
            </span>
          </div>
        </section>

        <section className="contact-form-panel" aria-labelledby="contact-title">
          <header className="contact-form-heading">
            <span className="eyebrow d-inline-flex align-items-center gap-2">Envie uma mensagem</span>
            <h2 id="contact-title">Como podemos ajudar?</h2>
          </header>

          {isSuccess && (
            <div className="feedback-banner success d-flex align-items-center gap-3 mb-4" role="status">
              <i className="bi bi-check-circle-fill" />
              <span>
                <strong>Validação concluída.</strong> Nenhum dado foi enviado ou armazenado.
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
              valid={isValid('nome')}
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
              valid={isValid('email')}
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
              onBlur={() => handleBlur('assunto')}
              valid={isValid('assunto')}
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
              valid={isValid('mensagem')}
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
