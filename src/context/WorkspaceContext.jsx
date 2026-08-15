import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { workspaceProfiles } from '../data/dashboardData';

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

  const startDemoSession = useCallback((nextRole) => {
    if (!VALID_ROLES.has(nextRole)) {
      throw new Error('Perfil demonstrativo inválido.');
    }

    const nextSession = {
      role: nextRole,
      startedAt: new Date().toISOString()
    };

    try {
      window.sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(nextSession));
    } catch {
      // O estado em memória ainda permite usar a demonstração nesta renderização.
    }
    setSession(nextSession);
    return nextSession;
  }, []);

  const endDemoSession = useCallback(() => {
    try {
      window.sessionStorage.removeItem(DEMO_SESSION_KEY);
    } catch {
      // Não impede a saída visual quando o armazenamento está indisponível.
    }
    setSession(null);
  }, []);

  const role = session?.role ?? null;
  const value = useMemo(() => ({
    session,
    hasSession: Boolean(session),
    role,
    isProducer: role === 'producer',
    profile: role ? workspaceProfiles[role] : null,
    startDemoSession,
    endDemoSession
  }), [endDemoSession, role, session, startDemoSession]);
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return context;
}
