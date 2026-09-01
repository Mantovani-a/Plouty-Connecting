import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useWorkspace, WorkspaceProvider } from './context/WorkspaceContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import ProfileDrawer from './components/layout/ProfileDrawer';
import MessagePanel from './components/layout/MessagePanel';
import { buyerConversations, getUnreadConversationCount, producerConversations } from './data/messagesData';

import SocialHome from './pages/SocialHome';
import Explorar from './pages/Explorar';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import Entrar from './pages/Entrar';

const PRODUCT_PATHS = ['/inicio', '/explorar', '/contato'];

function getEntryDestination(search) {
  const candidate = new URLSearchParams(search).get('retorno');
  if (
    !candidate ||
    typeof candidate !== 'string' ||
    !candidate.startsWith('/') ||
    candidate.startsWith('//') ||
    candidate.includes('\\')
  ) {
    return '/inicio';
  }
  try {
    const parsed = new URL(candidate, 'https://plouty.local');
    if (parsed.origin !== 'https://plouty.local' || !PRODUCT_PATHS.includes(parsed.pathname)) {
      return '/inicio';
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return '/inicio';
  }
}

function ProtectedRoute({ children }) {
  const { hasSession } = useWorkspace();
  const location = useLocation();

  if (!hasSession) {
    const returnPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/entrar?retorno=${encodeURIComponent(returnPath)}`} replace state={{ from: location }} />;
  }

  return children;
}

function PublicEntryRoute() {
  const { hasSession } = useWorkspace();
  const location = useLocation();
  return hasSession ? <Navigate to={getEntryDestination(location.search)} replace /> : <Entrar />;
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
    <div className={`d-flex flex-column min-vh-100 ${isProductArea ? 'app-shell has-message-dock' : 'public-shell'}`}>
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <Navbar
        variant={isProductArea ? 'product' : 'public'}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenMessages={() => activePanel?.type === 'messages' ? closeActivePanel() : openMessages()}
        messagesOpen={activePanel?.type === 'messages'}
        unreadMessages={unreadMessages}
      />

      <ProfileDrawer isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

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
        <Route path="/inicio" element={<ProtectedRoute><SocialHome /></ProtectedRoute>} />
        <Route path="/explorar" element={<ProtectedRoute><Explorar onOpenMessages={openMessages} /></ProtectedRoute>} />
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
