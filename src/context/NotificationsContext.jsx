import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { professionalProfiles } from '../data/profilesData';
import { initialConnectionRequests } from '../data/networkData';
import { initialProposals } from '../data/commerceData';
import { usePreferences } from './PreferencesContext';
import { getStorageItem, setStorageItem } from '../utils/storage';

const NotificationsContext = createContext(null);
const KEY = 'plouty.demo.notifications.v1';
const profileIds = new Set(professionalProfiles.map((profile) => profile.id));
const categoryFor = {
  connection_request: 'connections', connection_accepted: 'connections',
  like: 'likes', comment: 'comments',
  proposal_received: 'proposals', proposal_accepted: 'proposals', proposal_declined: 'proposals',
  message: 'messages'
};

function readNotifications() {
  const stored = getStorageItem(KEY, null);
  if (stored && typeof stored === 'object' && !Array.isArray(stored)) return stored;
  const preferences = getStorageItem('plouty.demo.preferences.v1', {});
  const allowed = (id, category) => preferences?.[id]?.notifications?.[category] !== false;
  const network = getStorageItem('plouty.demo.network.v1', null);
  const commerce = getStorageItem('plouty.demo.commerce.v1', null);
  const requests = Array.isArray(network?.requests) ? network.requests : initialConnectionRequests;
  const proposals = Array.isArray(commerce?.proposals) ? commerce.proposals : initialProposals;
  const seeded = {};
  const add = (recipientId, item) => {
    if (!profileIds.has(recipientId)) return;
    seeded[recipientId] = [...(seeded[recipientId] || []), { recipientId, readAt: null,
      postId: null, demandId: null, proposalId: null, preview: '', ...item }];
  };
  requests.forEach((request) => {
    if (allowed(request.toId, 'connections')) add(request.toId, {
      id: `seed-request-${request.fromId}-${request.toId}`, type: 'connection_request',
      actorId: request.fromId, createdAt: request.createdAt || new Date().toISOString()
    });
  });
  proposals.forEach((proposal) => {
    const recipientId = proposal.status === 'pending' ? proposal.buyerId : proposal.producerId;
    if (!allowed(recipientId, 'proposals') || !['pending', 'accepted', 'declined'].includes(proposal.status)) return;
    add(recipientId, { id: `seed-proposal-${proposal.id}`, actorId: proposal.status === 'pending' ? proposal.producerId : proposal.buyerId,
      type: proposal.status === 'pending' ? 'proposal_received' : proposal.status === 'accepted' ? 'proposal_accepted' : 'proposal_declined',
      demandId: proposal.demandId, proposalId: proposal.id, createdAt: proposal.createdAt });
  });
  return Object.fromEntries(Object.entries(seeded).map(([id, items]) => [id,
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))]));
}

export function NotificationsProvider({ children }) {
  const [byUser, setByUser] = useState(readNotifications);
  const currentRef = useRef(byUser);
  const { preferencesFor } = usePreferences();

  useEffect(() => {
    const sync = (event) => {
      if (event.key !== KEY) return;
      const next = readNotifications();
      currentRef.current = next;
      setByUser(next);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const update = useCallback((transform) => {
    const next = transform(currentRef.current);
    if (next === currentRef.current) return false;
    currentRef.current = next;
    setByUser(next);
    setStorageItem(KEY, next);
    return true;
  }, []);

  const notify = useCallback((recipientId, type, details = {}) => {
    if (!profileIds.has(recipientId) || !categoryFor[type] || recipientId === details.actorId
      || !preferencesFor(recipientId).notifications[categoryFor[type]]) return false;
    const item = {
      id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      recipientId, type, actorId: details.actorId || null,
      postId: details.postId || null, demandId: details.demandId || null,
      proposalId: details.proposalId || null,
      preview: details.preview || '', createdAt: new Date().toISOString(), readAt: null
    };
    return update((current) => ({ ...current,
      [recipientId]: [item, ...(Array.isArray(current[recipientId]) ? current[recipientId] : [])].slice(0, 100) }));
  }, [preferencesFor, update]);

  const notificationsFor = (profileId) => Array.isArray(byUser[profileId]) ? byUser[profileId] : [];
  const markRead = (profileId, notificationId) => update((current) => {
    const items = current[profileId];
    if (!Array.isArray(items) || !items.some((item) => item.id === notificationId && !item.readAt)) return current;
    return { ...current, [profileId]: items.map((item) => item.id === notificationId
      ? { ...item, readAt: new Date().toISOString() } : item) };
  });
  const markAllRead = (profileId) => update((current) => {
    const items = current[profileId];
    if (!Array.isArray(items) || !items.some((item) => !item.readAt)) return current;
    const now = new Date().toISOString();
    return { ...current, [profileId]: items.map((item) => item.readAt ? item : { ...item, readAt: now }) };
  });

  return <NotificationsContext.Provider value={{ notify, notificationsFor, markRead, markAllRead }}>
    {children}
  </NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error('useNotifications must be used within NotificationsProvider');
  return context;
}
