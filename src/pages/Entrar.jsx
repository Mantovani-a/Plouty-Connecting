import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';

const ROLE_CONTENT = {
  producer: {
    emailExample: 'nome@produtor.com.br',
    destination: 'Você entrará no espaço de produtor, com oportunidades, propostas e produção disponível.'
  },
  buyer: {
    emailExample: 'compras@instituicao.com.br',
    destination: 'Você entrará no espaço institucional, com demandas, fornecedores e contratos.'
  }
};

export default function Entrar() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { startDemoSession } = useWorkspace();

  const roleContent = role ? ROLE_CONTENT[role] : null;

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: '' }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!role) {
      newErrors.role = 'Escolha Produtor ou Instituição para continuar.';
    }
    if (!email.trim()) {
      newErrors.email = 'Informe o e-mail usado na Plouty.';
    }
    if (!password) {
      newErrors.password = 'Informe sua senha.';
    } else if (password.length < 8) {
      newErrors.password = 'Use pelo menos 8 caracteres.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      startDemoSession(role);
      navigate('/inicio');
    }
  };

  return (
    <main id="conteudo-principal" className="auth-page d-flex align-items-center">
      <div className="auth-field-pattern" aria-hidden="true" />
      <div className="shell-container login-page-grid">
        <section className="login-intro" aria-labelledby="login-story-title">
          <span className="eyebrow d-inline-flex align-items-center gap-2">Conexões, reputação e negócios agrícolas</span>
          <h1 id="login-story-title">
            A rede profissional que conecta quem produz a quem alimenta comunidades.
          </h1>
          <p>
            Na Plouty, produtores rurais e instituições constroem relações de confiança, encontram
            oportunidades e conduzem propostas, negociações e contratos em um só ambiente.
          </p>
          <div className="login-intro-actions pt-2">
            <a
              href="https://www.youtube.com/watch?v=_lUoH_IZhv4"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary d-inline-flex align-items-center gap-2"
              aria-label="Assistir Pitch Vídeo no YouTube"
            >
              <i className="bi bi-play-circle-fill text-danger" aria-hidden="true" style={{ fontSize: '1.25rem' }} />
              <span>Assistir Pitch Vídeo</span>
            </a>
          </div>
        </section>

        <section className="login-panel" aria-labelledby="login-title">
          <div className="login-panel-heading">
            <span className="eyebrow d-inline-flex align-items-center gap-2">Acesso à plataforma</span>
            <h2 id="login-title">Entre na demonstração</h2>
            <p>Escolha como você participa da rede e acesse o painel correspondente.</p>
          </div>

          <fieldset
            className={`login-role-fieldset ${errors.role ? 'has-error' : ''}`}
            aria-invalid={Boolean(errors.role)}
          >
            <legend>Quero entrar como</legend>
            <div className="login-role-switch">
              <label className={role === 'producer' ? 'active' : ''}>
                <input
                  type="radio"
                  name="login-role"
                  value="producer"
                  checked={role === 'producer'}
                  onChange={() => handleRoleChange('producer')}
                />
                <span className="login-role-icon d-inline-flex align-items-center justify-content-center">
                  <i className="bi bi-person-workspace" aria-hidden="true" />
                </span>
                <span className="d-flex flex-column">
                  <strong>Produtor</strong>
                  <small>Ofertar e negociar produção</small>
                </span>
                <i className="bi bi-check-circle-fill role-selection-check" aria-hidden="true" />
              </label>
              <label className={role === 'buyer' ? 'active' : ''}>
                <input
                  type="radio"
                  name="login-role"
                  value="buyer"
                  checked={role === 'buyer'}
                  onChange={() => handleRoleChange('buyer')}
                />
                <span className="login-role-icon d-inline-flex align-items-center justify-content-center">
                  <i className="bi bi-building" aria-hidden="true" />
                </span>
                <span className="d-flex flex-column">
                  <strong>Instituição</strong>
                  <small>Comprar e gerir fornecimento</small>
                </span>
                <i className="bi bi-check-circle-fill role-selection-check" aria-hidden="true" />
              </label>
            </div>
            <p id="login-role-destination" className="login-role-destination d-flex align-items-start gap-2" aria-live="polite">
              <i className="bi bi-arrow-right-circle" aria-hidden="true" />{' '}
              {roleContent?.destination ||
                'Selecione o perfil que representa sua participação nesta demonstração.'}
            </p>
            {errors.role && (
              <p id="login-role-error" className="field-error" role="alert">
                <i className="bi bi-exclamation-circle" aria-hidden="true" /> {errors.role}
              </p>
            )}
          </fieldset>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label htmlFor="login-email">E-mail</label>
              <div className={`login-input ${errors.email ? 'has-error' : email ? 'is-valid' : ''}`}>
                <i className="bi bi-envelope" aria-hidden="true" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder={roleContent?.emailExample || 'Escolha um perfil acima'}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p id="login-email-error" className="field-error" role="alert">
                  <i className="bi bi-exclamation-circle" aria-hidden="true" /> {errors.email}
                </p>
              )}
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Senha</label>
              <div className={`login-input ${errors.password ? 'has-error' : password ? 'is-valid' : ''}`}>
                <i className="bi bi-lock" aria-hidden="true" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="Mínimo de 8 caracteres"
                  autoComplete="current-password"
                />
                <button
                  className="d-inline-flex align-items-center justify-content-center"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                </button>
              </div>
              {errors.password && (
                <p id="login-password-error" className="field-error" role="alert">
                  <i className="bi bi-exclamation-circle" aria-hidden="true" /> {errors.password}
                </p>
              )}
            </div>

            <button
              className="btn btn-primary login-submit d-flex align-items-center justify-content-between w-100"
              type="submit"
            >
              <span>Entrar na demonstração</span>
              <i className="bi bi-arrow-right" aria-hidden="true" />
            </button>
          </form>

          <div className="login-demo-disclaimer d-flex gap-2">
            <i className="bi bi-info-circle" aria-hidden="true" />
            <p>
              <strong>Acesso demonstrativo: </strong>Não existe autenticação no backend. O perfil
              escolhido fica apenas nesta aba; a senha não é armazenada.
            </p>
          </div>
          <p className="login-registration-note">
            O cadastro de novas contas ainda depende da próxima etapa técnica do projeto.
          </p>
        </section>

        <section
          className="login-story-details"
          aria-label="Como uma conexão comercial acontece na Plouty"
        >
          <div className="login-connection" aria-label="Exemplo demonstrativo de conexão comercial">
            <div className="connection-party d-flex align-items-center gap-2">
              <span className="connection-avatar d-inline-flex align-items-center justify-content-center flex-shrink-0">JC</span>
              <div className="d-flex flex-column">
                <small>Produtor familiar</small>
                <strong>João Carlos</strong>
                <em><i className="bi bi-patch-check-fill" /> CAF validado</em>
              </div>
            </div>
            <div className="connection-path" aria-hidden="true">
              <i className="bi bi-arrow-right" />
            </div>
            <div className="connection-deal d-flex flex-column gap-1 text-start">
              <span>OPORTUNIDADE</span>
              <strong>180 kg de frutas</strong>
              <small>fornecimento semanal</small>
            </div>
            <div className="connection-path" aria-hidden="true">
              <i className="bi bi-arrow-right" />
            </div>
            <div className="connection-party institution d-flex align-items-center gap-2">
              <span className="connection-avatar d-inline-flex align-items-center justify-content-center flex-shrink-0"><i className="bi bi-hospital" /></span>
              <div className="d-flex flex-column">
                <small>Comprador institucional</small>
                <strong>Hospital Regional</strong>
                <em><i className="bi bi-shield-check" /> Instituição verificada</em>
              </div>
            </div>
          </div>

          <ul className="login-trust-list">
            <li>
              <i className="bi bi-people" aria-hidden="true" />
              <span className="d-flex flex-column gap-1">
                <strong>Relações profissionais</strong>Conexões entre quem produz e quem compra para comunidades.
              </span>
            </li>
            <li>
              <i className="bi bi-patch-check" aria-hidden="true" />
              <span className="d-flex flex-column gap-1">
                <strong>Reputação em contexto</strong>Avaliações, entregas e documentos apoiam decisões mais seguras.
              </span>
            </li>
            <li>
              <i className="bi bi-briefcase" aria-hidden="true" />
              <span className="d-flex flex-column gap-1">
                <strong>Negócios acompanhados</strong>Oportunidades, propostas e contratos organizados em cada etapa.
              </span>
            </li>
          </ul>
          <p className="login-impact-note d-flex align-items-center gap-2 mt-3">
            <i className="bi bi-globe-americas" aria-hidden="true" /> Projeto acadêmico alinhado à ODS 2 — Fome Zero e Agricultura Sustentável.
          </p>
        </section>
      </div>
    </main>
  );
}
