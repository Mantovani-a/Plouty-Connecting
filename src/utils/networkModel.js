import { professionalProfiles } from '../data/profilesData.js';
import { initialConnectionPairs, initialConnectionRequests } from '../data/networkData.js';

const validIds = new Set(professionalProfiles.map((profile) => profile.id));
const validPair = (a, b) => validIds.has(a) && validIds.has(b) && a !== b;
const orderedPair = (a, b) => [a, b].sort();
const pairKey = (a, b) => orderedPair(a, b).join('|');

export function normalizeNetwork(raw) {
  const connections = [];
  const connectedKeys = new Set();
  for (const pair of Array.isArray(raw?.connections) ? raw.connections : []) {
    if (!Array.isArray(pair) || !validPair(pair[0], pair[1])) continue;
    const key = pairKey(pair[0], pair[1]);
    if (connectedKeys.has(key)) continue;
    connectedKeys.add(key);
    connections.push(orderedPair(pair[0], pair[1]));
  }

  const requests = [];
  const pendingKeys = new Set();
  for (const request of Array.isArray(raw?.requests) ? raw.requests : []) {
    if (!validPair(request?.fromId, request?.toId)) continue;
    const key = pairKey(request.fromId, request.toId);
    if (connectedKeys.has(key) || pendingKeys.has(key)) continue;
    pendingKeys.add(key);
    requests.push({
      fromId: request.fromId, toId: request.toId,
      createdAt: typeof request.createdAt === 'string' ? request.createdAt : ''
    });
  }
  return { connections, requests };
}

export function initialNetwork() {
  return normalizeNetwork({ connections: initialConnectionPairs, requests: initialConnectionRequests });
}

export function migrateLegacyConnections(legacy) {
  const initial = initialNetwork();
  if (!legacy || typeof legacy !== 'object' || Array.isArray(legacy)) return initial;
  const additions = Object.entries(legacy).flatMap(([fromId, ids]) =>
    Array.isArray(ids) ? ids.map((toId) => [fromId, toId]) : []
  );
  return normalizeNetwork({ connections: [...initial.connections, ...additions], requests: initial.requests });
}

export function connectionStatus(network, actorId, targetId) {
  if (!validPair(actorId, targetId)) return 'self';
  if (network.connections.some(([a, b]) => pairKey(a, b) === pairKey(actorId, targetId))) return 'connected';
  const request = network.requests.find((item) => pairKey(item.fromId, item.toId) === pairKey(actorId, targetId));
  if (!request) return 'none';
  return request.fromId === actorId ? 'outgoing' : 'incoming';
}

export function connectionIdsFor(network, profileId) {
  return network.connections.flatMap(([a, b]) => a === profileId ? [b] : b === profileId ? [a] : []);
}

export function requestsFor(network, profileId, direction) {
  return network.requests.filter((request) => direction === 'incoming'
    ? request.toId === profileId : request.fromId === profileId);
}

export function transitionNetwork(network, action, actorId, targetId, now = new Date().toISOString()) {
  const status = connectionStatus(network, actorId, targetId);
  if (action === 'send' && status === 'none') {
    return { ...network, requests: [...network.requests, { fromId: actorId, toId: targetId, createdAt: now }] };
  }
  if (action === 'cancel' && status === 'outgoing') {
    return { ...network, requests: network.requests.filter((item) => !(item.fromId === actorId && item.toId === targetId)) };
  }
  if (action === 'decline' && status === 'incoming') {
    return { ...network, requests: network.requests.filter((item) => !(item.fromId === targetId && item.toId === actorId)) };
  }
  if (action === 'accept' && status === 'incoming') {
    return {
      connections: [...network.connections, orderedPair(actorId, targetId)],
      requests: network.requests.filter((item) => !(item.fromId === targetId && item.toId === actorId))
    };
  }
  if (action === 'remove' && status === 'connected') {
    return { ...network, connections: network.connections.filter(([a, b]) => pairKey(a, b) !== pairKey(actorId, targetId)) };
  }
  return network;
}
