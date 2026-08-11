import React, { useState } from 'react';

export default function Entrar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userRole, setUserRole] = useState('produtor');
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });

  const handleOpenAuth = (loginMode, defaultRole) => {
    setIsLogin(loginMode);
    if (defaultRole) setUserRole(defaultRole);
    setModalOpen(true);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.senha) return;
    setModalOpen(false);
    setFormData({ nome: '', email: '', senha: '' });
  };

  return (
    <main className="container my-auto py-5">
      <div className="row justify-content-center w-100 mx-auto">
        <div className="col-12 col-lg-10 text-center">
          <h1 className="fw-bold mb-2">Bem-vindo à Plouty</h1>
          <p className="lead text-secondary mb-4">
            Conectando produtores rurais e compradores institucionais
          </p>

          <div className="row mt-4 g-4 text-start">
            <div className="col-md-6">
              <div
                className="card h-100 cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={() => handleOpenAuth(false, 'produtor')}
              >
                <div className="card-body">
                  <h3 className="fs-5 fw-bold mb-3 text-brand-success">
                    <i className="bi bi-person-workspace me-2"></i> Para Produtores
                  </h3>
                  <p className="text-secondary small mb-0">
                    Acesso a grandes compradores institucionais, garantia de venda antecipada e profissionalização do escoamento agrícola. Venda seus produtos frescos diretamente para escolas, hospitais e instituições públicas.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div
                className="card h-100 cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={() => handleOpenAuth(false, 'instituicao')}
              >
                <div className="card-body">
                  <h3 className="fs-5 fw-bold mb-3 text-brand-success">
                    <i className="bi bi-building me-2"></i> Para Instituições
                  </h3>
                  <p className="text-secondary small mb-0">
                    Encontre produtores locais de alimentos frescos e de alta qualidade nutricional. Rastreabilidade total, conformidade regulatória e entrega garantida. Garanta segurança alimentar com produtos da região.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 d-flex justify-content-center gap-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleOpenAuth(false, 'produtor')}
            >
              Criar Conta
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => handleOpenAuth(true, 'produtor')}
            >
              Fazer Login
            </button>
          </div>

          <p className="mt-4 text-secondary small">
            Já possui conta?{' '}
            <a
              href="#login"
              className="text-brand-success fw-bold text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                handleOpenAuth(true, 'produtor');
              }}
            >
              Faça login aqui
            </a>{' '}
            | Primeira vez?{' '}
            <a
              href="#criar"
              className="text-brand-success fw-bold text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                handleOpenAuth(false, 'produtor');
              }}
            >
              Crie sua conta
            </a>
          </p>
        </div>
      </div>

      {/* Modal de Autenticação */}
      {modalOpen && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setModalOpen(false)}
            style={{ zIndex: 1050 }}
          ></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content card border-suave shadow-lg">
                <div className="modal-header border-bottom border-suave p-3">
                  <h5 className="modal-title fw-bold fs-5">
                    {isLogin ? 'Fazer Login' : 'Criar Nova Conta'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setModalOpen(false)}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="d-flex justify-content-center gap-2 mb-3">
                    <button
                      type="button"
                      className={`btn btn-sm ${userRole === 'produtor' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setUserRole('produtor')}
                    >
                      <i className="bi bi-person-fill me-1"></i> Produtor
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${userRole === 'instituicao' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setUserRole('instituicao')}
                    >
                      <i className="bi bi-building me-1"></i> Instituição
                    </button>
                  </div>

                  <form onSubmit={handleAuthSubmit}>
                    {!isLogin && (
                      <div className="mb-3 text-start">
                        <label className="form-label small fw-semibold">
                          {userRole === 'produtor' ? 'Nome Completo' : 'Nome da Instituição / Razão Social'}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={userRole === 'produtor' ? 'Ex: João Carlos Silva' : 'Ex: Escola Municipal Sol Nascente'}
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          required
                        />
                      </div>
                    )}

                    <div className="mb-3 text-start">
                      <label className="form-label small fw-semibold">E-mail</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="exemplo@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3 text-start">
                      <label className="form-label small fw-semibold">Senha</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={formData.senha}
                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold mt-2">
                      {isLogin ? 'Entrar na Plataforma' : 'Finalizar Cadastro'}
                    </button>
                  </form>

                  <div className="text-center mt-3 pt-3 border-top border-suave">
                    <small className="text-secondary">
                      {isLogin ? 'Não tem uma conta? ' : 'Já possui uma conta? '}
                      <a
                        href="#toggle"
                        className="text-brand-success fw-bold text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsLogin(!isLogin);
                        }}
                      >
                        {isLogin ? 'Cadastre-se' : 'Faça login'}
                      </a>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
