import React from 'react';
import FormField from '../components/common/FormField';
import { useContactForm } from '../hooks/useContactForm';

const ASSUNTO_OPTIONS = [
  { value: 'suporte', label: 'Suporte Técnico' },
  { value: 'vendas', label: 'Quero vender meus produtos' },
  { value: 'compras', label: 'Quero comprar para minha instituição' },
  { value: 'outros', label: 'Outros assuntos' }
];

export default function Contato() {
  const {
    formData,
    errors,
    isSuccess,
    handleChange,
    handleBlur,
    handleSubmit
  } = useContactForm();

  return (
    <main className="container my-auto py-4">
      <div className="row g-4">
        {/* Left Side: Info */}
        <div className="col-12 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h2>Como podemos ajudar?</h2>
              <p className="text-secondary mb-4">
                Seja você um produtor buscando expandir suas vendas ou uma instituição querendo otimizar compras, nossa equipe está pronta para auxiliar.
              </p>

              <div className="mb-3">
                <strong>Suporte ao Usuário</strong>
                <br />
                <span className="text-secondary">suporte@plouty.com.br</span>
              </div>

              <div className="mb-3">
                <strong>Parcerias Institucionais</strong>
                <br />
                <span className="text-secondary">parcerias@plouty.com.br</span>
              </div>

              <div className="text-center mt-auto pt-4">
                <img
                  src="/images/logo-connecting.png"
                  alt="Plouty Connecting Logo"
                  className="img-fluid"
                  style={{ maxHeight: '60px', opacity: 0.95 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="col-12 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              {isSuccess && (
                <div
                  id="success-banner"
                  className="alert alert-success mb-3 animate__animated animate__fadeIn"
                  role="alert"
                >
                  <h4 className="alert-heading h5 mb-1">
                    <i className="bi bi-check-circle-fill me-2"></i> Mensagem Enviada!
                  </h4>
                  <p className="mb-0 small">
                    Agradecemos pelo seu contato. Nossa equipe responderá em breve.
                  </p>
                </div>
              )}

              <form id="form-contato" onSubmit={handleSubmit} noValidate>
                <FormField
                  id="nome"
                  label="Nome Completo"
                  placeholder="Seu nome ou da sua instituição"
                  value={formData.nome}
                  error={errors.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  onBlur={() => handleBlur('nome')}
                />

                <FormField
                  id="email"
                  type="email"
                  label="E-mail"
                  placeholder="exemplo@email.com"
                  value={formData.email}
                  error={errors.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                />

                <FormField
                  id="assunto"
                  type="select"
                  label="Assunto"
                  value={formData.assunto}
                  options={ASSUNTO_OPTIONS}
                  onChange={(e) => handleChange('assunto', e.target.value)}
                />

                <FormField
                  id="mensagem"
                  type="textarea"
                  label="Mensagem"
                  placeholder="Como podemos te ajudar hoje?"
                  rows={5}
                  maxLength={500}
                  value={formData.mensagem}
                  error={errors.mensagem}
                  onChange={(e) => handleChange('mensagem', e.target.value)}
                  onBlur={() => handleBlur('mensagem')}
                />

                <button type="submit" className="btn btn-primary w-100">
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
