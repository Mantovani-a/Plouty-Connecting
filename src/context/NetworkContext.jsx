import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { useNotifications } from './NotificationsContext';
import {
  connectionIdsFor, connectionStatus, initialNetwork, migrateLegacyConnections,
  normalizeNetwork, requestsFor, transitionNetwork
} from '../utils/networkModel';

const NetworkContext = createContext(null);
const NETWORK_KEY = 'plouty.demo.network.v1';
const LEGACY_CONNECTIONS_KEY = 'plouty.demo.profile-connections.v2';

function readNetwork() {
  const stored = getStorageItem(NETWORK_KEY, null);
  if (stored && typeof stored === 'object' && Array.isArray(stored.connections) && Array.isArray(stored.requests)) {
    return normalizeNetwork(stored);
  }
  const legacy = getStorageItem(LEGACY_CONNECTIONS_KEY, null);
  return legacy ? migrateLegacyConnections(legacy) : initialNetwork();
}

export function NetworkProvider({ children }) {
  const [network, setNetwork] = useState(readNetwork);
  const currentRef = useRef(network);
  const { notify } = useNotifications();

  useEffect(() => {
    const sync = (event) => {
      if (event.key !== NETWORK_KEY) return;
      const next = readNetwork();
      currentRef.current = next;
      setNetwork(next);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const act = useCallback((action, actorId, targetId) => {
    const next = transitionNetwork(currentRef.current, action, actorId, targetId);
    if (next === currentRef.current) return { changed: false, saved: true };
    currentRef.current = next;
    setNetwork(next);
    const saved = setStorageItem(NETWORK_KEY, next);
    if (action === 'send') notify(targetId, 'connection_request', { actorId });
    if (action === 'accept') notify(targetId, 'connection_accepted', { actorId });
    return { changed: true, saved };
  }, [notify]);

  const value = {
    network,
    status: (actorId, targetId) => connectionStatus(network, actorId, targetId),
    connectionsFor: (profileId) => connectionIdsFor(network, profileId),
    incomingFor: (profileId) => requestsFor(network, profileId, 'incoming'),
    outgoingFor: (profileId) => requestsFor(network, profileId, 'outgoing'),
    act
  };
  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) throw new Error('useNetwork must be used within NetworkProvider');
  return context;
}
