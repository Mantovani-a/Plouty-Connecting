import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useProfiles } from './ProfilesContext';

const WorkspaceContext = createContext(null);
const DEMO_SESSION_KEY = 'plouty.demo-session.v1';
const VALID_ROLES = new Set(['producer', 'buyer']);

function readStoredSession() {
  if (typeof window === 'undefined') return null;

  try {
    const storedValue = window.sessionStorage.getItem(DEMO_SESSION_KEY);
    if (!storedValue) return null;

    const storedSession = JSON.parse(storedValue);
    if (!VALID_ROLES.has(storedSession?.role)) {
      window.sessionStorage.removeItem(DEMO_SESSION_KEY);
      return null;
    }

    return storedSession;
  } catch {
    try {
      window.sessionStorage.removeItem(DEMO_SESSION_KEY);
    } catch {
      // A demonstração continua disponível em memória se o navegador bloquear storage.
    }
    return null;
  }
}

export function WorkspaceProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const { getProfileById } = useProfiles();

  useEffect(() => {
    const sync = (event) => { if (event.key === DEMO_SESSION_KEY) setSession(readStoredSession()); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const startDemoSession = useCallback((nextRole, nextProfileId) => {
    if (!VALID_ROLES.has(nextRole)) {
      throw new Error('Perfil demonstrativo inválido.');
    }
    const selectedId = nextProfileId || (nextRole === 'producer' ? 'joao-carlos' : 'escola-caminhos');
    const selectedProfile = getProfileById(selectedId);
    if (!selectedProfile || (nextRole === 'buyer' ? selectedProfile.kind !== 'buyer' : selectedProfile.kind === 'buyer')) {
      throw new Error('Usuário demonstrativo incompatível com o tipo de acesso.');
    }

    const nextSession = {
      role: nextRole,
      profileId: selectedId,
      startedAt: new Date().toISOString()
    };

    try {
      window.sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(nextSession));
    } catch {
      // O estado em memória ainda permite usar a demonstração nesta renderização.
    }
    setSession(nextSession);
    return nextSession;
  }, [getProfileById]);

  const endDemoSession = useCallback(() => {
    try {
      window.sessionStorage.removeItem(DEMO_SESSION_KEY);
    } catch {
      // Não impede a saída visual quando o armazenamento está indisponível.
    }
    setSession(null);
  }, []);

  const role = session?.role ?? null;
  const baseProfile = role ? getProfileById(session.profileId || (role === 'producer' ? 'joao-carlos' : 'escola-caminhos')) : null;
  const validProfile = baseProfile && (role === 'buyer' ? baseProfile.kind === 'buyer' : baseProfile.kind !== 'buyer') ? baseProfile : null;
  const value = useMemo(() => ({
    session,
    hasSession: Boolean(session && validProfile),
    role,
    isProducer: role === 'producer',
    profile: validProfile ? {
      ...validProfile,
      reputation: validProfile.reputation.toFixed(1).replace('.', ','),
      responseRate: `${validProfile.responseRate}%`
    } : null,
    startDemoSession,
    endDemoSession
  }), [endDemoSession, role, session, startDemoSession, validProfile]);
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return context;
}
