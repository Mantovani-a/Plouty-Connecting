import React, { useState } from 'react';

export default function AuthModal({
  isOpen,
  onClose,
  isLogin,
  setIsLogin,
  userRole,
  setUserRole
}) {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.senha) return;
    onClose();
    setFormData({ nome: '', email: '', senha: '' });
  };

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1050 }}
      ></div>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1055 }}
        role="dialog"
        aria-modal="true"
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
                onClick={onClose}
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
                      name="nome"
                      className="form-control"
                      placeholder={userRole === 'produtor' ? 'Ex: João Carlos Silva' : 'Ex: Escola Municipal Sol Nascente'}
                      value={formData.nome}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="mb-3 text-start">
                  <label className="form-label small fw-semibold">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="exemplo@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3 text-start">
                  <label className="form-label small fw-semibold">Senha</label>
                  <input
                    type="password"
                    name="senha"
                    className="form-control"
                    placeholder="••••••••"
                    value={formData.senha}
                    onChange={handleChange}
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
                  <button
                    type="button"
                    className="btn btn-link text-brand-success fw-bold text-decoration-none p-0 align-baseline"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Cadastre-se' : 'Faça login'}
                  </button>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
