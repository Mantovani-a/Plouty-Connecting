import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useWorkspace, WorkspaceProvider } from './context/WorkspaceContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import ProfileDrawer from './components/layout/ProfileDrawer';
import UtilityPanel from './components/layout/UtilityPanel';
import MessagePanel from './components/layout/MessagePanel';
import { buyerConversations, getUnreadConversationCount, producerConversations } from './data/messagesData';

import Operation from './pages/Home';
import SocialHome from './pages/SocialHome';
import Oportunidades from './pages/Oportunidades';
import Negocios from './pages/Negocios';
import Explorar from './pages/Explorar';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import Entrar from './pages/Entrar';

const PRODUCT_PATHS = ['/inicio', '/operacao', '/oportunidades', '/negocios', '/explorar'];
const ROLE_PRODUCT_PATHS = {
  producer: ['/inicio', '/operacao', '/oportunidades', '/negocios'],
  buyer: ['/inicio', '/operacao', '/explorar', '/negocios']
};

function getEntryDestination(search, role) {
  const candidate = new URLSearchParams(search).get('retorno');
  if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) return '/inicio';
  const parsed = new URL(candidate, 'https://plouty.local');
  if (!ROLE_PRODUCT_PATHS[role]?.includes(parsed.pathname)) return '/inicio';
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

function ProtectedRoute({ children, allowedRoles }) {
  const { hasSession, role } = useWorkspace();
  const location = useLocation();

  if (!hasSession) {
    const returnPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/entrar?retorno=${encodeURIComponent(returnPath)}`} replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
}

function PublicEntryRoute() {
  const { hasSession, role } = useWorkspace();
  const location = useLocation();
  return hasSession ? <Navigate to={getEntryDestination(location.search, role)} replace /> : <Entrar />;
}

function AppContent() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const { hasSession, isProducer } = useWorkspace();
  const location = useLocation();
  const isProductArea = hasSession
    && PRODUCT_PATHS.some((path) => location.pathname.startsWith(path));

  const conversations = isProducer ? producerConversations : buyerConversations;
  const unreadMessages = getUnreadConversationCount(conversations);
  const openMessages = useCallback((businessKey = null) => {
    setActivePanel({ type: 'messages', businessKey });
  }, []);
  const closeActivePanel = useCallback(() => setActivePanel(null), []);

  useEffect(() => {
    setProfileOpen(false);
    setActivePanel(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div className={isProductArea ? 'app-shell has-message-dock' : 'public-shell'}>
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <Navbar
        variant={isProductArea ? 'product' : 'public'}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenMessages={() => activePanel?.type === 'messages' ? closeActivePanel() : openMessages()}
        onOpenNotifications={() => setActivePanel({ type: 'notifications' })}
        messagesOpen={activePanel?.type === 'messages'}
        unreadMessages={unreadMessages}
      />

      <ProfileDrawer isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <UtilityPanel
        type="notifications"
        isOpen={activePanel?.type === 'notifications'}
        onClose={closeActivePanel}
      />

      {isProductArea && (
        <MessagePanel
          conversations={conversations}
          isOpen={activePanel?.type === 'messages'}
          targetBusinessKey={activePanel?.businessKey}
          onOpen={() => openMessages()}
          onClose={closeActivePanel}
        />
      )}

      <Routes>
        <Route path="/" element={<PublicEntryRoute />} />
        <Route path="/entrar" element={<PublicEntryRoute />} />
        <Route path="/inicio" element={<ProtectedRoute allowedRoles={['producer', 'buyer']}><SocialHome /></ProtectedRoute>} />
        <Route path="/operacao" element={<ProtectedRoute allowedRoles={['producer', 'buyer']}><Operation onOpenMessages={openMessages} /></ProtectedRoute>} />
        <Route path="/oportunidades" element={<ProtectedRoute allowedRoles={['producer']}><Oportunidades /></ProtectedRoute>} />
        <Route path="/negocios" element={<ProtectedRoute allowedRoles={['producer', 'buyer']}><Negocios onOpenMessages={openMessages} /></ProtectedRoute>} />
        <Route path="/explorar" element={<ProtectedRoute allowedRoles={['buyer']}><Explorar /></ProtectedRoute>} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="*" element={<Navigate to={hasSession ? '/inicio' : '/'} replace />} />
      </Routes>

      {!isProductArea && <Footer />}
      {isProductArea && (
        <MobileBottomNav
          onOpenMessages={() => activePanel?.type === 'messages' ? closeActivePanel() : openMessages()}
          messagesOpen={activePanel?.type === 'messages'}
          unreadMessages={unreadMessages}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </BrowserRouter>
      </WorkspaceProvider>
    </ThemeProvider>
  );
}
