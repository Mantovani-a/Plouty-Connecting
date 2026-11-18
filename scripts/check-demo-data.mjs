import assert from 'node:assert/strict';
import { professionalProfiles, profilesById, supplierProfiles } from '../src/data/profilesData.js';
import { socialFeedPosts } from '../src/data/socialFeedData.js';
import { initialDemands } from '../src/data/demandsData.js';
import { initialProposals } from '../src/data/commerceData.js';
import { buyerConversations, producerConversations } from '../src/data/messagesData.js';

const unique = (items, label) => {
  const ids = items.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length, `IDs duplicados em ${label}`);
};
const knownProfile = (id, context) => {
  assert.ok(profilesById[id], `Perfil ${id} inexistente em ${context}`);
};

assert.ok(professionalProfiles.length >= 12, 'Menos de 12 perfis demonstrativos');
assert.ok(supplierProfiles.some(({ kind }) => kind === 'cooperative'), 'Falta cooperativa');
assert.ok(professionalProfiles.some(({ kind }) => kind === 'buyer'), 'Falta comprador institucional');
unique(professionalProfiles, 'perfis');
unique(socialFeedPosts, 'publicações');
unique(initialDemands, 'demandas');
unique(initialProposals, 'propostas');
unique([...producerConversations, ...buyerConversations], 'conversas');

for (const profile of professionalProfiles) {
  for (const id of profile.connectionIds) knownProfile(id, `conexões de ${profile.id}`);
  assert.equal(profile.avatar, null, `Avatar artificial em ${profile.id}`);
  assert.ok(!profile.coverImage, `Capa artificial em ${profile.id}`);
}
for (const post of socialFeedPosts) {
  knownProfile(post.authorId, `publicação ${post.id}`);
  for (const comment of post.comments) knownProfile(comment.authorId, `comentário ${comment.id}`);
  assert.ok(!post.postImage && !post.image, `Imagem artificial na publicação ${post.id}`);
  if (post.mediaPlaceholder) {
    assert.ok(post.mediaPlaceholder.label, `Placeholder sem descrição em ${post.id}`);
    assert.ok(!post.mediaPlaceholder.src, `Placeholder com arquivo em ${post.id}`);
  }
}
assert.deepEqual(socialFeedPosts.filter(({ mediaPlaceholder }) => mediaPlaceholder).map(({ id }) => id),
  ['colheita-planejada', 'abastecimento-hospital', 'atividade-milho'],
  'Espaços de imagem devem aparecer apenas nas três publicações demonstrativas previstas');
for (const demand of initialDemands) knownProfile(demand.profileId, `demanda ${demand.id}`);
for (const proposal of initialProposals) {
  const demand = initialDemands.find((item) => item.id === proposal.demandId);
  assert.ok(demand, `Demanda inexistente na proposta ${proposal.id}`);
  knownProfile(proposal.buyerId, `comprador da proposta ${proposal.id}`);
  knownProfile(proposal.producerId, `fornecedor da proposta ${proposal.id}`);
  assert.equal(proposal.buyerId, demand.profileId, `Comprador incorreto na proposta ${proposal.id}`);
  assert.equal(profilesById[proposal.buyerId].kind, 'buyer');
  assert.ok(['producer', 'cooperative'].includes(profilesById[proposal.producerId].kind));
  assert.ok(proposal.price > 0 && proposal.quantity && proposal.deadline);
}
for (const conversation of [...producerConversations, ...buyerConversations]) {
  knownProfile(conversation.profileId, `conversa ${conversation.id}`);
}

console.log(`Dados válidos: ${professionalProfiles.length} perfis, ${socialFeedPosts.length} publicações, ${initialDemands.length} demandas, ${initialProposals.length} propostas e ${producerConversations.length + buyerConversations.length} conversas.`);
