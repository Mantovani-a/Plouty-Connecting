import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';

const INITIAL_FORM = { email: '', password: '' };
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

const INTERNAL_PATHS = ['/inicio', '/operacao', '/oportunidades', '/negocios', '/explorar'];
const ROLE_INTERNAL_PATHS = {
  producer: ['/inicio', '/operacao', '/oportunidades', '/negocios'],
  buyer: ['/inicio', '/operacao', '/explorar', '/negocios']
};

function validateLogin(form, role) {
  const errors = {};
  if (!role) errors.role = 'Escolha Produtor ou Instituição para continuar.';
  if (!form.email.trim()) {
    errors.email = 'Informe o e-mail usado na Plouty.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = role
      ? `Digite um e-mail válido, como ${ROLE_CONTENT[role].emailExample}.`
      : 'Digite um e-mail válido.';
  }
  if (!form.password) {
    errors.password = 'Informe sua senha.';
  } else if (form.password.length < 8) {
    errors.password = 'A senha precisa ter pelo menos 8 caracteres.';
  }
  return errors;
}

function normalizeInternalDestination(candidate, role) {
  if (typeof candidate !== 'string' || !candidate.startsWith('/') || candidate.startsWith('//')) {
    return null;
  }
  const parsed = new URL(candidate, 'https://plouty.local');
  if (!INTERNAL_PATHS.includes(parsed.pathname) || !ROLE_INTERNAL_PATHS[role]?.includes(parsed.pathname)) {
    return null;
  }
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

function getReturnDestination(location, role) {
  const queryDestination = new URLSearchParams(location.search).get('retorno');
  const safeQueryDestination = normalizeInternalDestination(queryDestination, role);
  if (safeQueryDestination) return safeQueryDestination;

  const locationState = location.state;
  const previousLocation = locationState?.from;
  return (
    normalizeInternalDestination(
      previousLocation
        ? `${previousLocation.pathname}${previousLocation.search || ''}${previousLocation.hash || ''}`
        : null,
      role
    ) || '/inicio'
  );
}

export default function Entrar() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [role, setLoginRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { startDemoSession } = useWorkspace();
  const roleContent = role ? ROLE_CONTENT[role] : null;

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSuccessMessage('');
  };

  const handleRoleChange = (nextRole) => {
    if (isLoading || nextRole === role) return;
    setLoginRole(nextRole);
    setErrors((current) => ({ ...current, role: '', email: '' }));
    setSuccessMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.clearTimeout(timerRef.current);
    const nextErrors = validateLogin(form, role);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    setSuccessMessage('');
    timerRef.current = window.setTimeout(() => {
      startDemoSession(role);
      setForm((current) => ({ ...current, password: '' }));
      setSuccessMessage('Acesso demonstrativo validado. Abrindo seu espaço na Plouty…');
      navigate(getReturnDestination(location, role), { replace: true });
      timerRef.current = null;
    }, 650);
  };

  return (
    <main id="conteudo-principal" className="auth-page">
      <div className="auth-field-pattern" aria-hidden="true" />
      <div className="shell-container login-page-grid">
        <section className="login-intro" aria-labelledby="login-story-title">
          <span className="eyebrow">Conexões, reputação e negócios agrícolas</span>
          <h1 id="login-story-title">
            A rede profissional que conecta quem produz a quem alimenta comunidades.
          </h1>
          <p>
            Na Plouty, produtores rurais e instituições constroem relações de confiança, encontram
            oportunidades e conduzem propostas, negociações e contratos em um só ambiente.
          </p>
        </section>

        <section className="login-panel" aria-labelledby="login-title">
          <div className="login-panel-heading">
            <span className="eyebrow">Acesso à plataforma</span>
            <h2 id="login-title">Entre na demonstração</h2>
            <p>Escolha como você participa da rede e acesse o painel correspondente.</p>
          </div>

          <fieldset
            className={`login-role-fieldset ${errors.role ? 'has-error' : ''}`}
            disabled={isLoading}
            aria-invalid={Boolean(errors.role)}
            aria-describedby={
              errors.role
                ? 'login-role-error login-role-destination'
                : 'login-role-destination'
            }
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
                  aria-describedby="login-role-destination"
                />
                <span className="login-role-icon">
                  <i className="bi bi-person-workspace" aria-hidden="true" />
                </span>
                <span>
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
                  aria-describedby="login-role-destination"
                />
                <span className="login-role-icon">
                  <i className="bi bi-building" aria-hidden="true" />
                </span>
                <span>
                  <strong>Instituição</strong>
                  <small>Comprar e gerir fornecimento</small>
                </span>
                <i className="bi bi-check-circle-fill role-selection-check" aria-hidden="true" />
              </label>
            </div>
            <p id="login-role-destination" className="login-role-destination" aria-live="polite">
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
              <div className={`login-input ${errors.email ? 'has-error' : ''}`}>
                <i className="bi bi-envelope" aria-hidden="true" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={roleContent?.emailExample || 'Escolha um perfil acima'}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                  disabled={isLoading}
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
              <div className={`login-input ${errors.password ? 'has-error' : ''}`}>
                <i className="bi bi-lock" aria-hidden="true" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo de 8 caracteres"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                  disabled={isLoading}
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
              className="btn btn-primary login-submit"
              type="submit"
              disabled={isLoading || Boolean(successMessage)}
            >
              {successMessage ? (
                <>
                  <span className="button-spinner" aria-hidden="true" /> Abrindo a Plouty…
                </>
              ) : isLoading ? (
                <>
                  <span className="button-spinner" aria-hidden="true" /> Validando acesso…
                </>
              ) : (
                <>
                  <span>Entrar na demonstração</span>
                  <i className="bi bi-arrow-right" aria-hidden="true" />
                </>
              )}
            </button>
            <div className="login-status" aria-live="polite">
              {successMessage && (
                <p className="login-success">
                  <i className="bi bi-check-circle-fill" aria-hidden="true" /> {successMessage}
                </p>
              )}
            </div>
          </form>

          <div className="login-demo-disclaimer">
            <i className="bi bi-info-circle" aria-hidden="true" />
            <p>
              <strong>Acesso demonstrativo</strong>Não existe autenticação no backend. O perfil
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
            <div className="connection-party">
              <span className="connection-avatar">JC</span>
              <div>
                <small>Produtor familiar</small>
                <strong>João Carlos</strong>
                <em><i className="bi bi-patch-check-fill" /> CAF validado</em>
              </div>
            </div>
            <div className="connection-path" aria-hidden="true">
              <i className="bi bi-arrow-right" />
            </div>
            <div className="connection-deal">
              <span>OPORTUNIDADE</span>
              <strong>180 kg de frutas</strong>
              <small>fornecimento semanal</small>
            </div>
            <div className="connection-path" aria-hidden="true">
              <i className="bi bi-arrow-right" />
            </div>
            <div className="connection-party institution">
              <span className="connection-avatar"><i className="bi bi-hospital" /></span>
              <div>
                <small>Comprador institucional</small>
                <strong>Hospital Regional</strong>
                <em><i className="bi bi-shield-check" /> Instituição verificada</em>
              </div>
            </div>
          </div>

          <ul className="login-trust-list">
            <li>
              <i className="bi bi-people" aria-hidden="true" />
              <span>
                <strong>Relações profissionais</strong>Conexões entre quem produz e quem compra para comunidades.
              </span>
            </li>
            <li>
              <i className="bi bi-patch-check" aria-hidden="true" />
              <span>
                <strong>Reputação em contexto</strong>Avaliações, entregas e documentos apoiam decisões mais seguras.
              </span>
            </li>
            <li>
              <i className="bi bi-briefcase" aria-hidden="true" />
              <span>
                <strong>Negócios acompanhados</strong>Oportunidades, propostas e contratos organizados em cada etapa.
              </span>
            </li>
          </ul>
          <p className="login-impact-note">
            <i className="bi bi-globe-americas" aria-hidden="true" /> Projeto acadêmico alinhado à ODS 2 — Fome Zero e Agricultura Sustentável.
          </p>
        </section>
      </div>
    </main>
  );
}
