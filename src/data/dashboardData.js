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

export const productionAvailability = [
  { id: 1, product: 'Batata-doce rosada', quantity: '180 kg', quantityValue: '180', quantityUnit: 'kg', period: 'Disponível agora' },
  { id: 2, product: 'Couve-manteiga', quantity: '90 maços', quantityValue: '90', quantityUnit: 'maço', period: 'Colheita em 2 dias' },
  { id: 3, product: 'Alface crespa', quantity: '120 un.', quantityValue: '120', quantityUnit: 'un', period: 'Disponível até 20 ago' },
  { id: 4, product: 'Cebolinha', quantity: '60 maços', quantityValue: '60', quantityUnit: 'maço', period: 'Colheita semanal' }
];

export const businessPipeline = [
  {
    id: 1,
    title: 'Hortaliças para merenda escolar',
    counterpart: 'Escola Municipal Sol Nascente',
    stage: 'Proposta enviada',
    stageKey: 'proposal',
    value: 'R$ 2.480',
    nextStep: 'Retorno previsto até 16 ago',
    progress: 45
  },
  {
    id: 2,
    title: 'Fornecimento semanal de folhosas',
    counterpart: 'Hospital Regional de Guarapari',
    stage: 'Em negociação',
    stageKey: 'negotiation',
    value: 'R$ 3.200/mês',
    nextStep: 'Ajustar janela de entrega',
    progress: 68
  },
  {
    id: 3,
    title: 'Cesta de produtos da estação',
    counterpart: 'Restaurante Sabor da Serra',
    stage: 'Contrato ativo',
    stageKey: 'active',
    value: 'R$ 1.860',
    nextStep: 'Entrega em 18 ago, às 7h',
    progress: 88
  }
];

export const buyerBusinessPipeline = [
  {
    id: 1,
    title: 'Hortaliças para merenda escolar',
    counterpart: 'Cooperativa Verde',
    stage: 'Propostas recebidas',
    stageKey: 'proposal',
    value: '4 propostas',
    nextStep: 'Comparar preço e logística até 16 ago',
    progress: 40
  },
  {
    id: 2,
    title: 'Fornecimento semanal de frutas',
    counterpart: 'Maria dos Santos',
    stage: 'Em negociação',
    stageKey: 'negotiation',
    value: 'R$ 1.180/entrega',
    nextStep: 'Confirmar frequência e janela de entrega',
    progress: 66
  },
  {
    id: 3,
    title: 'Cesta de produtos da estação',
    counterpart: 'João Carlos Silva',
    stage: 'Contrato ativo',
    stageKey: 'active',
    value: 'R$ 1.860',
    nextStep: 'Recebimento em 18 ago, às 7h',
    progress: 88
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
    to: '/oportunidades?search=batata'
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
    action: 'Ver negócio',
    to: '/negocios'
  }
];

export const notificationItems = [
  { id: 1, title: 'Proposta visualizada', text: 'A Escola Sol Nascente abriu sua proposta.', time: 'há 20 min' },
  { id: 2, title: 'Nova oportunidade próxima', text: 'Demanda de hortaliças a 18 km da sua propriedade.', time: 'há 1 h' }
];

export const buyerNotificationItems = [
  { id: 1, title: 'Nova proposta recebida', text: 'A Cooperativa Verde enviou uma proposta para a demanda de hortaliças.', time: 'há 15 min' },
  { id: 2, title: 'Documento validado', text: 'O CAF de João Carlos foi validado para análise comercial.', time: 'há 2 h' }
];

export const impactSummary = {
  label: 'Impacto da sua rede',
  value: '1,8 t',
  detail: 'de alimentos negociados sem intermediários neste semestre',
  footnote: 'Indicador demonstrativo do protótipo acadêmico — ODS 2'
};
