import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { initialDemands } from '../data/demandsData';
import { initialProposals } from '../data/commerceData';
import { professionalProfiles } from '../data/profilesData';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { useNotifications } from './NotificationsContext';

const CommerceContext = createContext(null);
const KEY = 'plouty.demo.commerce.v1';
const LEGACY_DEMANDS_KEY = 'plouty.demo.demands.v1';
const profilesById = Object.fromEntries(professionalProfiles.map((profile) => [profile.id, profile]));
const isBuyer = (id) => profilesById[id]?.kind === 'buyer';
const isSupplier = (id) => ['producer', 'cooperative'].includes(profilesById[id]?.kind);
const pairKey = (a, b) => [a, b].sort().join('|');
const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function readCommerce() {
  const stored = getStorageItem(KEY, null);
  if (stored && Array.isArray(stored.demands) && Array.isArray(stored.proposals) && Array.isArray(stored.messages)) return stored;
  const legacy = getStorageItem(LEGACY_DEMANDS_KEY, []);
  return { demands: [...(Array.isArray(legacy) ? legacy : []), ...initialDemands].map((demand) => ({ ...demand,
      profileId: demand.profileId || professionalProfiles.find((profile) => profile.name === demand.org)?.id,
      status: 'open' })),
    proposals: initialProposals, messages: [], readAt: {} };
}

export function CommerceProvider({ children }) {
  const [data, setData] = useState(readCommerce);
  const currentRef = useRef(data);
  const { notify } = useNotifications();
  useEffect(() => {
    const sync = (event) => {
      if (event.key !== KEY) return;
      const next = readCommerce();
      currentRef.current = next;
      setData(next);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const update = (transform) => {
    const next = transform(currentRef.current);
    if (next === currentRef.current) return { changed: false, saved: true };
    currentRef.current = next;
    setData(next);
    return { changed: true, saved: setStorageItem(KEY, next) };
  };
  const addMessage = (current, senderId, recipientId, body, context = {}) => ({ ...current,
    messages: [...current.messages, { id: uid('msg'), senderId, recipientId, body, createdAt: new Date().toISOString(),
      demandId: context.demandId || null, proposalId: context.proposalId || null }] });

  const createDemand = (actorId, values) => update((current) => {
    if (!isBuyer(actorId) || !values.description?.trim() || !values.products?.length || !values.deadline?.trim()) return current;
    return { ...current, demands: [{ ...values, id: uid('demanda-local'), profileId: actorId, status: 'open',
      timeAgo: 'Agora mesmo', isLocal: true }, ...current.demands] };
  });
  const editDemand = (actorId, demandId, values) => update((current) => {
    const demand = current.demands.find((item) => item.id === demandId);
    if (!demand || demand.profileId !== actorId || demand.status !== 'open' || !values.description?.trim() || !values.products?.length || !values.deadline?.trim()) return current;
    return { ...current, demands: current.demands.map((item) => item.id === demandId ? { ...item,
      description: values.description.trim(), products: values.products, category: values.category,
      urgency: values.urgency, deadline: values.deadline.trim(), location: values.location.trim() } : item) };
  });
  const closeDemand = (actorId, demandId) => update((current) => {
    const demand = current.demands.find((item) => item.id === demandId);
    if (!demand || demand.profileId !== actorId || demand.status !== 'open') return current;
    return { ...current, demands: current.demands.map((item) => item.id === demandId ? { ...item, status: 'closed' } : item),
      proposals: current.proposals.map((item) => item.demandId === demandId && item.status === 'pending' ? { ...item, status: 'closed' } : item) };
  });
  const sendProposal = (actorId, demandId, values) => {
    let sent = null;
    const result = update((current) => {
    const demand = current.demands.find((item) => item.id === demandId);
    if (!isSupplier(actorId) || !demand || demand.status !== 'open' || !isBuyer(demand.profileId)
      || current.proposals.some((item) => item.demandId === demandId && item.producerId === actorId)
      || !Number.isFinite(Number(values.price)) || !(Number(values.price) > 0)
      || !values.quantity?.trim() || !values.deadline?.trim()) return current;
    const proposal = { id: uid('proposta'), demandId, producerId: actorId, buyerId: demand.profileId,
      price: Number(values.price), quantity: values.quantity.trim(), deadline: values.deadline.trim(),
      notes: values.notes?.trim() || '', status: 'pending', createdAt: new Date().toISOString() };
    sent = proposal;
    return addMessage({ ...current, proposals: [proposal, ...current.proposals] }, actorId, demand.profileId,
      `Enviei uma proposta para a demanda: ${proposal.quantity}, ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.price)}.`, { demandId, proposalId: proposal.id });
    });
    if (result.changed && sent) notify(sent.buyerId, 'proposal_received',
      { actorId, demandId, proposalId: sent.id });
    return result;
  };
  const decideProposal = (actorId, proposalId, decision) => {
    let decided = null;
    const result = update((current) => {
    const proposal = current.proposals.find((item) => item.id === proposalId);
    const demand = current.demands.find((item) => item.id === proposal?.demandId);
    if (!proposal || !demand || demand.status !== 'open' || proposal.buyerId !== actorId || proposal.status !== 'pending'
      || !['accepted', 'declined'].includes(decision)) return current;
    decided = proposal;
    const next = { ...current, proposals: current.proposals.map((item) => item.id === proposalId ? { ...item, status: decision } : item) };
    return addMessage(next, actorId, proposal.producerId,
      decision === 'accepted' ? 'Sua proposta foi aceita. Vamos alinhar os detalhes da entrega.' : 'Sua proposta foi recusada nesta demanda.',
      { demandId: proposal.demandId, proposalId });
    });
    if (result.changed && decided) notify(decided.producerId, decision === 'accepted' ? 'proposal_accepted' : 'proposal_declined',
      { actorId, demandId: decided.demandId, proposalId });
    return result;
  };
  const sendMessage = (senderId, recipientId, body, context = {}) => {
    const result = update((current) => {
    if (!profilesById[senderId] || !profilesById[recipientId] || senderId === recipientId || !body?.trim()) return current;
    const linkedDemand = context.demandId && current.demands.find((item) => item.id === context.demandId);
    const linkedProposal = context.proposalId && current.proposals.find((item) => item.id === context.proposalId);
    if (context.demandId && (!linkedDemand || ![senderId, recipientId].includes(linkedDemand.profileId))) return current;
    if (context.proposalId && (!linkedProposal || linkedProposal.demandId !== context.demandId
      || ![senderId, recipientId].includes(linkedProposal.buyerId)
      || ![senderId, recipientId].includes(linkedProposal.producerId))) return current;
    return addMessage(current, senderId, recipientId, body.trim(), context);
    });
    if (result.changed) notify(recipientId, 'message', { actorId: senderId,
      demandId: context.demandId, proposalId: context.proposalId, preview: body.trim().slice(0, 120) });
    return result;
  };
  const markRead = (actorId, otherId) => update((current) => {
    if (!profilesById[actorId] || !profilesById[otherId]) return current;
    return { ...current, readAt: { ...current.readAt, [`${actorId}|${otherId}`]: new Date().toISOString() } };
  });
  const messagesFor = (actorId, otherId) => data.messages.filter((message) => pairKey(message.senderId, message.recipientId) === pairKey(actorId, otherId));
  const contactsFor = (actorId) => [...new Set(data.messages.flatMap((message) =>
    message.senderId === actorId ? [message.recipientId] : message.recipientId === actorId ? [message.senderId] : []))];

  return <CommerceContext.Provider value={{ demands: data.demands, proposals: data.proposals, messages: data.messages,
    readAt: data.readAt || {}, createDemand, editDemand, closeDemand, sendProposal, decideProposal, sendMessage, markRead, messagesFor, contactsFor }}>
    {children}
  </CommerceContext.Provider>;
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) throw new Error('useCommerce must be used within CommerceProvider');
  return context;
}
