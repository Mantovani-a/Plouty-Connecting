import React, { useState } from 'react';
import logoConnecting from '../assets/logo-connecting.png';

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: 'suporte',
    mensagem: ''
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateNome = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'O campo Nome Completo não pode ser vazio.';
    const words = trimmed.split(/\s+/);
    if (words.length < 2) {
      return 'O nome deve conter pelo menos nome e sobrenome (duas palavras).';
    }
    for (let word of words) {
      if (word.length < 2) {
        return 'Cada palavra do nome deve conter no mínimo 2 letras.';
      }
    }
    return '';
  };

  const validateEmail = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'O campo E-mail não pode ser vazio.';
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(trimmed)) {
      return 'Insira um formato de e-mail válido (ex: exemplo@email.com).';
    }
    return '';
  };

  const validateMensagem = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'O campo Mensagem não pode ser vazio.';
    if (trimmed.length > 500) return 'A mensagem ultrapassou o limite de 500 caracteres.';
    return '';
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      let err = '';
      if (field === 'nome') err = validateNome(value);
      if (field === 'email') err = validateEmail(value);
      if (field === 'mensagem') err = validateMensagem(value);
      setErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(false);

    const nomeErr = validateNome(formData.nome);
    const emailErr = validateEmail(formData.email);
    const msgErr = validateMensagem(formData.mensagem);

    if (nomeErr || emailErr || msgErr) {
      setErrors({
        nome: nomeErr,
        email: emailErr,
        mensagem: msgErr
      });
      return;
    }

    setErrors({});
    setIsSuccess(true);
    setFormData({
      nome: '',
      email: '',
      assunto: 'suporte',
      mensagem: ''
    });
  };

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
                  src={logoConnecting}
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
                <div id="success-banner" className="alert alert-success mb-3 animate__animated animate__fadeIn" role="alert">
                  <h4 className="alert-heading h5 mb-1">
                    <i className="bi bi-check-circle-fill me-2"></i> Mensagem Enviada!
                  </h4>
                  <p className="mb-0 small">Agradecemos pelo seu contato. Nossa equipe responderá em breve.</p>
                </div>
              )}

              <form id="form-contato" onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    id="nome"
                    className={`form-control ${errors.nome ? 'input-error' : ''}`}
                    placeholder="Seu nome ou da sua instituição"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    onBlur={() => setErrors(prev => ({ ...prev, nome: validateNome(formData.nome) }))}
                  />
                  {errors.nome && (
                    <div className="error-message d-block" id="error-nome">
                      {errors.nome}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control ${errors.email ? 'input-error' : ''}`}
                    placeholder="exemplo@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => setErrors(prev => ({ ...prev, email: validateEmail(formData.email) }))}
                  />
                  {errors.email && (
                    <div className="error-message d-block" id="error-email">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="assunto" className="form-label">Assunto</label>
                  <select
                    id="assunto"
                    className="form-select"
                    value={formData.assunto}
                    onChange={(e) => handleChange('assunto', e.target.value)}
                  >
                    <option value="suporte">Suporte Técnico</option>
                    <option value="vendas">Quero vender meus produtos</option>
                    <option value="compras">Quero comprar para minha instituição</option>
                    <option value="outros">Outros assuntos</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="mensagem" className="form-label">Mensagem</label>
                  <textarea
                    id="mensagem"
                    className={`form-control ${errors.mensagem ? 'input-error' : ''}`}
                    rows={5}
                    placeholder="Como podemos te ajudar hoje?"
                    maxLength={500}
                    value={formData.mensagem}
                    onChange={(e) => handleChange('mensagem', e.target.value)}
                    onBlur={() => setErrors(prev => ({ ...prev, mensagem: validateMensagem(formData.mensagem) }))}
                  ></textarea>

                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <div className="error-message" id="error-mensagem" style={{ display: errors.mensagem ? 'block' : 'none' }}>
                      {errors.mensagem}
                    </div>
                    <div className={`char-counter ${formData.mensagem.length >= 500 ? 'limit-reached' : ''}`} id="char-counter">
                      {formData.mensagem.length} / 500 caracteres
                    </div>
                  </div>
                </div>

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
