export const workspaceProfiles = {
  producer: {
    initials: 'JC',
    name: 'João Carlos',
    shortName: 'João',
    role: 'Produtor familiar',
    location: 'Guarapari, ES',
    organization: 'Sítio Boa Esperança',
    description: 'Produção familiar de hortaliças e raízes para escolas, hospitais e restaurantes da região.',
    avatar: '/images/social/avatars/joao-carlos.jpg',
    coverImage: '/images/social/covers/joao-carlos-capa.jpg',
    verified: true,
    verification: 'Identidade e CAF validados',
    reputation: '4,8',
    reviews: 38,
    completedDeals: 24,
    responseRate: '96%'
  },
  buyer: {
    initials: 'EC',
    name: 'Escola Caminhos do Saber',
    shortName: 'Equipe Caminhos',
    role: 'Comprador institucional',
    location: 'Manhuaçu, MG',
    organization: 'Escola Caminhos do Saber',
    description: 'Equipe de alimentação escolar comprometida com compras locais e relações duradouras com produtores.',
    avatar: '/images/social/avatars/equipe-caminhos.jpg',
    coverImage: '/images/social/covers/equipe-caminhos-capa.jpg',
    verified: true,
    verification: 'CNPJ e responsável validados',
    reputation: '4,9',
    reviews: 21,
    completedDeals: 31,
    responseRate: '98%'
  }
};

export const producerSummary = [
  {
    label: 'Propostas em análise',
    value: '2',
    detail: '1 atualizada hoje',
    icon: 'bi-send-check',
    tone: 'action'
  },
  {
    label: 'Próxima entrega',
    value: '18 ago',
    detail: 'Escola Sol Nascente',
    icon: 'bi-truck',
    tone: 'earth'
  },
  {
    label: 'Produção disponível',
    value: '4 itens',
    detail: 'até 320 kg esta semana',
    icon: 'bi-basket2',
    tone: 'positive'
  }
];

export const buyerSummary = [
  {
    label: 'Demandas abertas',
    value: '4',
    detail: '2 encerram nesta semana',
    icon: 'bi-clipboard2-data',
    tone: 'action'
  },
  {
    label: 'Propostas recebidas',
    value: '7',
    detail: '3 novas desde ontem',
    icon: 'bi-inboxes',
    tone: 'earth'
  },
  {
    label: 'Contratos ativos',
    value: '3',
    detail: 'próxima entrega em 18 ago',
    icon: 'bi-file-earmark-check',
    tone: 'positive'
  }
];

export const operationalAlerts = [
  {
    id: 1,
    icon: 'bi-hourglass-split',
    tone: 'warning',
    title: 'Prazo de proposta',
    text: 'Batata-doce e couve encerra amanhã, às 18h.',
    action: 'Ver oportunidade',
    to: '/explorar?search=batata'
  },
  {
    id: 2,
    icon: 'bi-chat-left-text',
    tone: 'info',
    title: 'Nova mensagem',
    text: 'Hospital Regional perguntou sobre sua rota de entrega.',
    action: 'Ler mensagem'
  },
  {
    id: 3,
    icon: 'bi-truck',
    tone: 'positive',
    title: 'Entrega confirmada',
    text: 'Restaurante Sabor da Serra confirmou recebimento para 18 ago.',
    action: 'Abrir mensagens'
  }
];

export const impactSummary = {
  label: 'Impacto da sua rede',
  value: '1,8 t',
  detail: 'de alimentos negociados sem intermediários neste semestre',
  footnote: 'Indicador demonstrativo do protótipo acadêmico — ODS 2'
};
