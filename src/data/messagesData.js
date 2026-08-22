// Conversas demonstrativas do protótipo. O histórico é fixo, local e não
// representa troca de mensagens ou confirmação de leitura em um backend.
export const producerConversations = [
  {
    id: 'producer-hospital-regional',
    businessKey: 'producer-2',
    name: 'Hospital Regional de Guarapari',
    initials: 'HR',
    avatar: '/images/social/avatars/hospital-regional-guarapari.png',
    role: 'Comprador institucional',
    verified: true,
    lastMessage: 'Você consegue entregar às terças pela manhã?',
    time: '10:42',
    unread: 1,
    messages: [
      {
        id: 'producer-hospital-1',
        sender: 'contact',
        body: 'Olá, João. Recebemos sua proposta para o fornecimento semanal de folhosas.',
        time: '10:18'
      },
      {
        id: 'producer-hospital-2',
        sender: 'me',
        body: 'Olá! Consigo manter o volume informado e emitir a Nota Fiscal de Produtor Rural.',
        time: '10:27'
      },
      {
        id: 'producer-hospital-3',
        sender: 'contact',
        body: 'Ótimo. Você consegue entregar às terças pela manhã?',
        time: '10:42'
      }
    ]
  },
  {
    id: 'producer-restaurante-serra',
    businessKey: 'producer-3',
    name: 'Restaurante Sabor da Serra',
    initials: 'RS',
    avatar: '/images/social/avatars/restaurante-sabor-serra.png',
    role: 'Comprador institucional',
    verified: true,
    lastMessage: 'Entrega de terça confirmada. Obrigado!',
    time: 'Ontem',
    unread: 0,
    messages: [
      {
        id: 'producer-restaurante-1',
        sender: 'me',
        body: 'A cesta está separada e a colheita das folhosas será feita na véspera.',
        time: 'Ontem, 15:54'
      },
      {
        id: 'producer-restaurante-2',
        sender: 'contact',
        body: 'Perfeito. A equipe estará no recebimento a partir das 7h.',
        time: 'Ontem, 16:08'
      },
      {
        id: 'producer-restaurante-3',
        sender: 'contact',
        body: 'Entrega de terça confirmada. Obrigado!',
        time: 'Ontem, 16:18'
      }
    ]
  },
  {
    id: 'producer-escola-sol-nascente',
    businessKey: 'producer-1',
    name: 'Escola Municipal Sol Nascente',
    initials: 'ES',
    avatar: '/images/social/avatars/escola-sol-nascente.png',
    role: 'Comprador institucional',
    verified: true,
    lastMessage: 'Sua proposta está em análise pela equipe de alimentação.',
    time: 'Ter',
    unread: 0,
    messages: [
      {
        id: 'producer-escola-1',
        sender: 'me',
        body: 'Enviei a proposta com opção para o lote completo e disponibilidade para o dia 18.',
        time: 'Ter, 14:35'
      },
      {
        id: 'producer-escola-2',
        sender: 'contact',
        body: 'Recebemos os valores e os documentos. Sua proposta está em análise pela equipe de alimentação.',
        time: 'Ter, 15:02'
      }
    ]
  }
];

export const buyerConversations = [
  {
    id: 'buyer-cooperativa-verde',
    businessKey: 'buyer-1',
    name: 'Cooperativa Verde',
    initials: 'CV',
    avatar: '/images/social/avatars/cooperativa-verde.png',
    role: 'Cooperativa de produtores',
    verified: true,
    lastMessage: 'Podemos dividir o volume em duas entregas?',
    time: '10:36',
    unread: 1,
    messages: [
      {
        id: 'buyer-cooperativa-1',
        sender: 'contact',
        body: 'Bom dia. A cooperativa consegue atender todo o volume de hortaliças solicitado.',
        time: '10:12'
      },
      {
        id: 'buyer-cooperativa-2',
        sender: 'me',
        body: 'Bom dia! Precisamos receber os produtos até quinta-feira, às 9h.',
        time: '10:24'
      },
      {
        id: 'buyer-cooperativa-3',
        sender: 'contact',
        body: 'Podemos dividir o volume em duas entregas?',
        time: '10:36'
      }
    ]
  },
  {
    id: 'buyer-maria-santos',
    businessKey: 'buyer-2',
    name: 'Maria dos Santos',
    initials: 'MS',
    avatar: '/images/social/avatars/maria-dos-santos.png',
    role: 'Produtora de frutas',
    verified: true,
    lastMessage: 'Consigo reservar 180 kg por semana para a instituição.',
    time: '09:48',
    unread: 0,
    messages: [
      {
        id: 'buyer-maria-1',
        sender: 'me',
        body: 'Maria, precisamos confirmar se o volume pode ser mantido durante três meses.',
        time: '09:31'
      },
      {
        id: 'buyer-maria-2',
        sender: 'contact',
        body: 'Sim. Consigo reservar 180 kg por semana para a instituição.',
        time: '09:48'
      }
    ]
  },
  {
    id: 'buyer-joao-carlos',
    businessKey: 'buyer-3',
    name: 'João Carlos Silva',
    initials: 'JC',
    avatar: '/images/social/avatars/joao-carlos.png',
    role: 'Produtor familiar',
    verified: true,
    lastMessage: 'A colheita está confirmada para segunda-feira à tarde.',
    time: 'Ontem',
    unread: 0,
    messages: [
      {
        id: 'buyer-joao-1',
        sender: 'me',
        body: 'Olá, João. Está tudo certo para a entrega do dia 18?',
        time: 'Ontem, 16:42'
      },
      {
        id: 'buyer-joao-2',
        sender: 'contact',
        body: 'Sim. A colheita está confirmada para segunda-feira à tarde.',
        time: 'Ontem, 17:05'
      }
    ]
  }
];

export function getUnreadConversationCount(conversations = []) {
  return conversations.reduce((total, conversation) => total + (conversation.unread ? 1 : 0), 0);
}
