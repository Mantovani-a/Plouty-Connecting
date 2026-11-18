import { professionalProfiles } from '../data/profilesData.js';

export const normalizeSearch = (value) => String(value || '').normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();

export function readAllDemands(demands, getProfileById) {
  return demands.map((demand) => {
    const legacyId = professionalProfiles.find((profile) => profile.name === demand.org)?.id;
    const owner = getProfileById(demand.profileId || legacyId);
    return { ...demand, profileId: owner?.id || demand.profileId, org: owner?.name || demand.org || 'Instituição',
      location: demand.isLocal ? demand.location : owner?.location || demand.location || '' };
  });
}
