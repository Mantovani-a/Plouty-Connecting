import React, { useState } from 'react';
import AuthModal from '../components/auth/AuthModal';

export default function Entrar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userRole, setUserRole] = useState('produtor');

  const handleOpenAuth = (loginMode, defaultRole) => {
    setIsLogin(loginMode);
    if (defaultRole) setUserRole(defaultRole);
    setModalOpen(true);
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
            <button
              type="button"
              className="btn btn-link text-brand-success fw-bold text-decoration-none p-0 align-baseline"
              onClick={() => handleOpenAuth(true, 'produtor')}
            >
              Faça login aqui
            </button>{' '}
            | Primeira vez?{' '}
            <button
              type="button"
              className="btn btn-link text-brand-success fw-bold text-decoration-none p-0 align-baseline"
              onClick={() => handleOpenAuth(false, 'produtor')}
            >
              Crie sua conta
            </button>
          </p>
        </div>
      </div>

      {/* Modal de Autenticação Modular */}
      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        userRole={userRole}
        setUserRole={setUserRole}
      />
    </main>
  );
}
