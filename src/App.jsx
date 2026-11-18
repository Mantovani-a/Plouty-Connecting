import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PreferencesProvider, usePreferences } from './context/PreferencesContext';
import { NotificationsProvider, useNotifications } from './context/NotificationsContext';
import { useWorkspace, WorkspaceProvider } from './context/WorkspaceContext';
import { ProfilesProvider } from './context/ProfilesContext';
import { NetworkProvider } from './context/NetworkContext';
import { SocialProvider } from './context/SocialContext';
import { CommerceProvider, useCommerce } from './context/CommerceContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import ProfileDrawer from './components/layout/ProfileDrawer';
import MessagePanel from './components/layout/MessagePanel';
import MobilePreviewFrame from './components/layout/MobilePreviewFrame';
import { useMediaQuery } from './hooks/useMediaQuery';
import { buyerConversations, getUnreadConversationCount, producerConversations } from './data/messagesData';

import SocialHome from './pages/SocialHome';
import Demandas from './pages/Demandas';
import Explorar from './pages/Explorar';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import Entrar from './pages/Entrar';
import Perfil from './pages/Perfil';
import MinhaRede from './pages/MinhaRede';
import Buscar from './pages/Buscar';
import Negociacoes from './pages/Negociacoes';
import Notificacoes from './pages/Notificacoes';
import Configuracoes from './pages/Configuracoes';

const PRODUCT_PATHS = ['/inicio', '/demandas', '/explorar', '/minha-rede', '/negociacoes', '/buscar', '/contato', '/perfil', '/notificacoes', '/configuracoes'];

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
    const allowedProfile = /^\/perfil\/[a-z0-9-]+$/.test(parsed.pathname);
    if (parsed.origin !== 'https://plouty.local' || (!PRODUCT_PATHS.includes(parsed.pathname) && !allowedProfile)) {
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
  const { hasSession, profile } = useWorkspace();
  const { preferences, setMobilePreview } = usePreferences();
  const { notificationsFor } = useNotifications();
  const { messages, readAt } = useCommerce();
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 992px)');
  const isEmbeddedPreview = window.self !== window.top;
  const previewActive = !isEmbeddedPreview && isDesktop && hasSession && preferences.mobilePreview;
  const [previewEverOpen, setPreviewEverOpen] = useState(previewActive);
  const previewFrameRef = useRef(null);
  const isProductArea = hasSession
    && PRODUCT_PATHS.some((path) => location.pathname.startsWith(path));

  const conversations = profile?.id === 'joao-carlos' ? producerConversations
    : profile?.id === 'escola-caminhos' ? buyerConversations : [];
  const dynamicUnread = profile ? new Set(messages.filter((message) => message.recipientId === profile.id
    && message.createdAt > (readAt[`${profile.id}|${message.senderId}`] || '')).map((message) => message.senderId)).size : 0;
  const unreadMessages = getUnreadConversationCount(conversations) + dynamicUnread;
  const unreadNotifications = profile ? notificationsFor(profile.id).filter((item) => !item.readAt).length : 0;
  const openMessages = useCallback((targetProfileId = null, context = {}) => {
    setActivePanel({ type: 'messages', targetProfileId, ...context });
  }, []);
  const closeActivePanel = useCallback(() => setActivePanel(null), []);

  useEffect(() => { if (previewActive) setPreviewEverOpen(true); }, [previewActive]);
  useEffect(() => {
    if (!isEmbeddedPreview) return undefined;
    const onMessage = (event) => {
      if (event.origin !== window.location.origin || event.source !== window.parent
        || event.data?.type !== 'plouty-preview-navigate') return;
      const path = event.data.path;
      if (typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') && !path.includes('\\')
        && path !== `${location.pathname}${location.search}${location.hash}`) navigate(path);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [isEmbeddedPreview, location.hash, location.pathname, location.search, navigate]);
  useEffect(() => {
    if (previewActive) previewFrameRef.current?.contentWindow?.postMessage(
      { type: 'plouty-preview-navigate', path: `${location.pathname}${location.search}${location.hash}` }, window.location.origin);
  }, [previewActive, location.hash, location.pathname, location.search]);
  useEffect(() => {
    if (isEmbeddedPreview) {
      window.parent.postMessage({ type: 'plouty-preview-route', path: `${location.pathname}${location.search}${location.hash}` }, window.location.origin);
      return undefined;
    }
    const onMessage = (event) => {
      if (event.origin !== window.location.origin || event.source !== previewFrameRef.current?.contentWindow
        || event.data?.type !== 'plouty-preview-route') return;
      const path = event.data.path;
      if (typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') && !path.includes('\\')
        && path !== `${location.pathname}${location.search}${location.hash}`) navigate(path);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [isEmbeddedPreview, location.hash, location.pathname, location.search, navigate]);

  useEffect(() => {
    setProfileOpen(false);
    setActivePanel(null);
    if (location.hash) {
      window.requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.hash]);

  const appContent = (
    <div className={`d-flex flex-column min-vh-100 ${isProductArea ? 'app-shell has-message-dock' : 'public-shell'}`}>
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <Navbar
        variant={isProductArea ? 'product' : 'public'}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenMessages={() => activePanel?.type === 'messages' ? closeActivePanel() : openMessages()}
        messagesOpen={activePanel?.type === 'messages'}
        unreadMessages={unreadMessages}
        unreadNotifications={unreadNotifications}
      />

      <ProfileDrawer isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

      {isProductArea && (
        <MessagePanel
          key={profile.id}
          conversations={conversations}
          isOpen={activePanel?.type === 'messages'}
          targetBusinessKey={activePanel?.targetProfileId}
          targetDemandId={activePanel?.demandId}
          targetProposalId={activePanel?.proposalId}
          onOpen={() => openMessages()}
          onClose={closeActivePanel}
        />
      )}

      <Routes>
        <Route path="/" element={<PublicEntryRoute />} />
        <Route path="/entrar" element={<PublicEntryRoute />} />
        <Route path="/inicio" element={<ProtectedRoute><SocialHome /></ProtectedRoute>} />
        <Route path="/demandas" element={<ProtectedRoute><Demandas onOpenMessages={openMessages} /></ProtectedRoute>} />
        <Route path="/explorar" element={<ProtectedRoute><Explorar onOpenMessages={openMessages} /></ProtectedRoute>} />
        <Route path="/minha-rede" element={<ProtectedRoute><MinhaRede /></ProtectedRoute>} />
        <Route path="/buscar" element={<ProtectedRoute><Buscar /></ProtectedRoute>} />
        <Route path="/negociacoes" element={<ProtectedRoute><Negociacoes onOpenMessages={openMessages} /></ProtectedRoute>} />
        <Route path="/notificacoes" element={<ProtectedRoute><Notificacoes onOpenMessages={openMessages} /></ProtectedRoute>} />
        <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
        <Route path="/perfil/:id" element={<ProtectedRoute><Perfil onOpenMessages={openMessages} /></ProtectedRoute>} />
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
  if (isEmbeddedPreview) return appContent;
  return <>
    <div className="desktop-app-host" hidden={previewActive}>{appContent}</div>
    {previewEverOpen && <div>
      <MobilePreviewFrame active={previewActive} initialPath={`${location.pathname}${location.search}${location.hash}`}
        onExit={() => setMobilePreview(false)} iframeRef={previewFrameRef} />
    </div>}
  </>;
}

export default function App() {
  return (
    <ProfilesProvider>
      <WorkspaceProvider>
        <PreferencesProvider>
          <ThemeProvider>
            <NotificationsProvider>
              <NetworkProvider>
                <CommerceProvider>
                  <SocialProvider>
                    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                      <AppContent />
                    </BrowserRouter>
                  </SocialProvider>
                </CommerceProvider>
              </NetworkProvider>
            </NotificationsProvider>
          </ThemeProvider>
        </PreferencesProvider>
      </WorkspaceProvider>
    </ProfilesProvider>
  );
}
