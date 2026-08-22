// Perfis demonstrativos usados para validar a experiência de descoberta e
// reputação. As métricas abaixo são simuladas e não vêm de um backend.
export const initialProducers = [
  {
    id: 1,
    isMock: true,
    name: 'João Carlos Silva',
    avatar: '/images/social/avatars/joao-carlos.png',
    role: 'Produtor • Verduras orgânicas',
    location: 'Sete Lagoas - MG',
    region: 'Sudeste',
    types: ['verduras-frutas', 'produtos-organicos'],
    reputation: 4.9,
    reviews: 67,
    completedDeliveries: 184,
    onTimeRate: 98,
    responseRate: 97,
    responseTime: 'Em até 2 horas',
    verified: true,
    verifications: ['Identidade verificada', 'CAF ativa', 'Propriedade validada'],
    documents: {
      status: 'Validados',
      items: ['CAF', 'Nota Fiscal de Produtor Rural', 'Certificação orgânica']
    },
    recentReview: {
      author: 'Nutrição Escolar de Sete Lagoas',
      rating: 5,
      date: '2026-08-07',
      timeAgo: 'há 6 dias',
      comment: 'Folhas bem selecionadas, entrega pontual e comunicação clara durante todo o pedido.'
    },
    availability: {
      status: 'available',
      label: 'Disponível para novos pedidos',
      summary: 'Até 320 unidades de folhosas por semana',
      products: ['Alface crespa', 'Alface americana', 'Rúcula'],
      nextHarvest: 'Colheitas às terças e sextas-feiras'
    },
    description: 'Alfaces hidropônicas colhidas no dia da entrega, com fornecimento regular para escolas e hospitais em um raio de 80 km.',
    tags: ['Alface', 'Orgânico', 'Hidroponia'],
    likes: 234,
    comments: 18,
    contacts: 12
  },
  {
    id: 2,
    isMock: true,
    name: 'Maria dos Santos',
    avatar: '/images/social/avatars/maria-dos-santos.png',
    role: 'Produtora • Frutas da estação',
    location: 'Presidente Prudente - SP',
    region: 'Sudeste',
    types: ['verduras-frutas'],
    reputation: 4.8,
    reviews: 42,
    completedDeliveries: 119,
    onTimeRate: 96,
    responseRate: 94,
    responseTime: 'Em até 4 horas',
    verified: true,
    verifications: ['Identidade verificada', 'CAF ativa', 'Dados bancários validados'],
    documents: {
      status: 'Validados',
      items: ['CAF', 'Nota Fiscal de Produtor Rural', 'Comprovante de propriedade']
    },
    recentReview: {
      author: 'Restaurante Popular Oeste',
      rating: 4.8,
      date: '2026-07-29',
      timeAgo: 'há 2 semanas',
      comment: 'As frutas chegaram maduras no ponto certo e bem acomodadas para o transporte.'
    },
    availability: {
      status: 'limited',
      label: 'Agenda limitada esta semana',
      summary: 'Até 900 kg de frutas por mês',
      products: ['Melancia', 'Melão-amarelo', 'Banana'],
      nextHarvest: 'Novo lote de melancia a partir de 20 de agosto'
    },
    description: 'Produção familiar de frutas sazonais com manejo responsável e seleção por maturação, voltada a refeitórios e compras institucionais.',
    tags: ['Melancia', 'Produção familiar', 'Sazonal'],
    likes: 156,
    comments: 22,
    contacts: 8
  },
  {
    id: 3,
    isMock: true,
    name: 'Cooperativa Verde',
    avatar: '/images/social/avatars/cooperativa-verde.png',
    role: 'Cooperativa • Hortifruti diversificado',
    location: 'Londrina - PR',
    region: 'Sul',
    types: ['verduras-frutas', 'produtos-organicos'],
    reputation: 4.7,
    reviews: 128,
    completedDeliveries: 436,
    onTimeRate: 97,
    responseRate: 99,
    responseTime: 'Em até 1 hora útil',
    verified: true,
    verifications: ['Cooperativa verificada', 'Documentação fiscal', 'Responsável técnico'],
    documents: {
      status: 'Validados',
      items: ['CNPJ', 'DCAF', 'Alvará sanitário', 'Responsabilidade técnica']
    },
    recentReview: {
      author: 'Secretaria Municipal de Educação',
      rating: 4.7,
      date: '2026-08-04',
      timeAgo: 'há 9 dias',
      comment: 'Boa capacidade de reposição e padrão consistente, inclusive nos pedidos de maior volume.'
    },
    availability: {
      status: 'available',
      label: 'Capacidade para contratos recorrentes',
      summary: 'Até 2,4 toneladas de hortifruti por semana',
      products: ['Folhosas', 'Legumes', 'Tubérculos', 'Frutas cítricas'],
      nextHarvest: 'Calendário semanal atualizado'
    },
    description: 'Rede de 38 famílias produtoras com separação, rastreabilidade e logística compartilhada para compras públicas e privadas.',
    tags: ['Cooperativa', 'Rastreabilidade', 'Grande volume'],
    likes: 423,
    comments: 45,
    contacts: 24
  },
  {
    id: 4,
    isMock: true,
    name: 'Pedro Ribeiro',
    role: 'Produtor • Grãos e cereais',
    location: 'Santa Maria - RS',
    region: 'Sul',
    types: ['graos-cereais'],
    reputation: 4.9,
    reviews: 83,
    completedDeliveries: 207,
    onTimeRate: 99,
    responseRate: 95,
    responseTime: 'No mesmo dia',
    verified: true,
    verifications: ['Identidade verificada', 'Armazém inspecionado', 'Laudos atualizados'],
    documents: {
      status: 'Validados',
      items: ['CAF', 'Laudo de classificação', 'Nota Fiscal de Produtor Rural']
    },
    recentReview: {
      author: 'Hospital Universitário de Santa Maria',
      rating: 5,
      date: '2026-08-01',
      timeAgo: 'há 12 dias',
      comment: 'Grãos uniformes, documentação organizada e entrega conforme o cronograma combinado.'
    },
    availability: {
      status: 'available',
      label: 'Estoque disponível',
      summary: '4,8 toneladas disponíveis para agosto',
      products: ['Arroz integral', 'Feijão-preto', 'Feijão-carioca'],
      nextHarvest: 'Próxima colheita prevista para novembro'
    },
    description: 'Arroz e feijão da colheita recente, armazenados com controle de umidade e disponíveis em embalagens adequadas a cozinhas institucionais.',
    tags: ['Arroz', 'Feijão', 'Laudo de qualidade'],
    likes: 298,
    comments: 32,
    contacts: 15
  },
  {
    id: 5,
    isMock: true,
    name: 'Marcos Mendes',
    role: 'Produtor • Frutas',
    location: 'Anápolis - GO',
    region: 'Centro-Oeste',
    types: ['verduras-frutas'],
    reputation: 4.4,
    reviews: 12,
    completedDeliveries: 26,
    onTimeRate: 92,
    responseRate: 91,
    responseTime: 'Em até 6 horas',
    verified: true,
    verifications: ['Identidade verificada', 'CAF ativa'],
    documents: {
      status: 'Validação parcial',
      items: ['CAF', 'Nota Fiscal de Produtor Rural']
    },
    recentReview: {
      author: 'Cantina Sabor do Cerrado',
      rating: 4.5,
      date: '2026-07-24',
      timeAgo: 'há 3 semanas',
      comment: 'Bom atendimento e produto fresco. O horário de chegada poderia ser confirmado com mais antecedência.'
    },
    availability: {
      status: 'available',
      label: 'Disponível para pedidos locais',
      summary: 'Até 450 kg por quinzena',
      products: ['Banana-prata', 'Mamão-formosa'],
      nextHarvest: 'Mamão disponível a partir de 17 de agosto'
    },
    description: 'Produção de banana e mamão para comércios e cozinhas da região, ampliando agora a capacidade de atender contratos recorrentes.',
    tags: ['Banana', 'Mamão', 'Produção local'],
    likes: 45,
    comments: 5,
    contacts: 2
  },
  {
    id: 6,
    isMock: true,
    name: 'Sítio Recanto Feliz',
    role: 'Agricultura familiar • Hortaliças',
    location: 'Feira de Santana - BA',
    region: 'Nordeste',
    types: ['verduras-frutas', 'produtos-organicos'],
    reputation: 4.3,
    reviews: 19,
    completedDeliveries: 41,
    onTimeRate: 89,
    responseRate: 88,
    responseTime: 'Em até 1 dia útil',
    verified: false,
    verifications: ['Identidade verificada', 'CAF ativa'],
    documents: {
      status: 'Em análise',
      items: ['CAF', 'Comprovante de propriedade']
    },
    recentReview: {
      author: 'Escola Comunitária Caminhos',
      rating: 4.2,
      date: '2026-07-18',
      timeAgo: 'há 4 semanas',
      comment: 'Hortaliças de boa qualidade. A família avisou com transparência sobre um atraso causado pela estrada.'
    },
    availability: {
      status: 'paused',
      label: 'Novos pedidos a partir de setembro',
      summary: 'Produção atual comprometida com contratos em andamento',
      products: ['Tomate', 'Cebola', 'Coentro'],
      nextHarvest: 'Nova disponibilidade prevista para 2 de setembro'
    },
    description: 'Hortaliças cultivadas pela família com manejo agroecológico. O sítio atende pequenos lotes e combina rotas com produtores vizinhos.',
    tags: ['Tomate', 'Cebola', 'Agroecologia'],
    likes: 12,
    comments: 3,
    contacts: 1
  }
];
