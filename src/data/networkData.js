import { professionalProfiles } from './profilesData.js';

// Relações fictícias entre os perfis da demonstração. Cada par representa uma conexão mútua.
export const initialConnectionPairs = Array.from(new Map(
  professionalProfiles.flatMap((profile) => profile.connectionIds.map((otherId) => {
    const pair = [profile.id, otherId].sort();
    return [pair.join('|'), pair];
  }))
).values());

// A relação entre os dois perfis operáveis começa livre para testar a solicitação nos dois sentidos.
export const initialConnectionRequests = [
  { fromId: 'banco-alimentos', toId: 'joao-carlos', createdAt: '2026-11-16T09:20:00-03:00' },
  { fromId: 'joao-carlos', toId: 'maria-santos', createdAt: '2026-11-15T11:45:00-03:00' },
  { fromId: 'cooperativa-serra-mar', toId: 'escola-caminhos', createdAt: '2026-11-16T14:05:00-03:00' },
  { fromId: 'escola-caminhos', toId: 'hospital-regional', createdAt: '2026-11-14T08:10:00-03:00' }
];
