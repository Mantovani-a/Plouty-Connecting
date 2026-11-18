// Conversas fictícias. O perfil do contato é resolvido pelo mesmo ID usado no restante da aplicação.
const conversationSeeds = {
  producer: [
    {
      id: 'producer-hospital', profileId: 'hospital-regional', time: '10:42', unread: 1,
      messages: [
        { sender: 'contact', body: 'Olá! Recebemos sua proposta para o fornecimento semanal de folhosas.', time: '10:18' },
        { sender: 'me', body: 'Consigo manter o volume e emitir a Nota Fiscal de Produtor Rural.', time: '10:27' },
        { sender: 'contact', body: 'Ótimo. Você consegue entregar às terças pela manhã?', time: '10:42' }
      ]
    },
    {
      id: 'producer-restaurante', profileId: 'restaurante-serra', time: 'Ontem', unread: 0,
      messages: [
        { sender: 'me', body: 'A cesta está separada e as folhosas serão colhidas na véspera.', time: 'Ontem, 15:54' },
        { sender: 'contact', body: 'Perfeito. A equipe estará no recebimento a partir das 7h.', time: 'Ontem, 16:08' },
        { sender: 'contact', body: 'Entrega de terça confirmada. Obrigado!', time: 'Ontem, 16:18' }
      ]
    },
    {
      id: 'producer-escola', profileId: 'escola-sol-nascente', time: 'Ter', unread: 0,
      messages: [
        { sender: 'me', body: 'Enviei a proposta para o lote completo e disponibilidade para o dia 18.', time: 'Ter, 14:35' },
        { sender: 'contact', body: 'Sua proposta está em análise pela equipe de alimentação.', time: 'Ter, 15:02' }
      ]
    }
  ],
  buyer: [
    {
      id: 'buyer-cooperativa', profileId: 'cooperativa-verde', time: '10:36', unread: 1,
      messages: [
        { sender: 'me', body: 'Bom dia! Temos interesse no fornecimento de hortifruti para a escola.', time: '10:12' },
        { sender: 'contact', body: 'Podemos dividir o volume em duas entregas?', time: '10:36' }
      ]
    },
    {
      id: 'buyer-maria', profileId: 'maria-santos', time: 'Ontem', unread: 0,
      messages: [
        { sender: 'contact', body: 'Tenho melancia e banana disponíveis para a próxima semana.', time: 'Ontem, 11:20' },
        { sender: 'me', body: 'Obrigada! Vamos revisar o cardápio e confirmar os volumes.', time: 'Ontem, 11:45' }
      ]
    },
    {
      id: 'buyer-joao', profileId: 'joao-carlos', time: 'Ontem', unread: 0,
      messages: [
        { sender: 'me', body: 'Está tudo certo para a entrega do dia 18?', time: 'Ontem, 16:42' },
        { sender: 'contact', body: 'A colheita está confirmada para segunda-feira à tarde.', time: 'Ontem, 17:05' }
      ]
    }
  ]
};

function buildConversations(seeds) {
  return seeds.map((seed) => ({
    ...seed,
    businessKey: seed.profileId,
    lastMessage: seed.messages.at(-1).body,
    messages: seed.messages.map((message, index) => ({ ...message, id: `${seed.id}-${index + 1}` }))
  }));
}

export const producerConversations = buildConversations(conversationSeeds.producer);
export const buyerConversations = buildConversations(conversationSeeds.buyer);

export function getUnreadConversationCount(conversations = []) {
  return conversations.reduce((total, conversation) => total + (conversation.unread ? 1 : 0), 0);
}
