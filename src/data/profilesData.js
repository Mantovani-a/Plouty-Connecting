import { initialProducers } from './producersData.js';

const supplierIds = [
  'joao-carlos', 'maria-santos', 'cooperativa-verde',
  'pedro-ribeiro', 'marcos-mendes', 'sitio-recanto-feliz'
];

const supplierExtras = {
  'joao-carlos': {
    shortName: 'João', organization: 'Sítio Boa Esperança',
    verification: 'Identidade e CAF validados',
    about: 'Sou produtor familiar de hortaliças em Sete Lagoas. Planejo colheitas para que escolas, hospitais e restaurantes recebam folhas frescas, com documentação e entregas regulares.'
  },
  'maria-santos': {
    shortName: 'Maria', organization: 'Frutas da Maria',
    verification: 'Identidade e CAF validados',
    about: 'Minha família cultiva frutas da estação no oeste paulista. Selecionamos cada lote pelo ponto de maturação e organizamos entregas para cozinhas que precisam de qualidade constante.'
  },
  'cooperativa-verde': {
    shortName: 'Cooperativa Verde', organization: 'Cooperativa Verde',
    verification: 'Cooperativa e documentação fiscal verificadas',
    about: 'Reunimos 38 famílias produtoras em Londrina. Com logística compartilhada e rastreabilidade por lote, atendemos compras públicas e privadas de hortifruti.'
  },
  'pedro-ribeiro': {
    shortName: 'Pedro', organization: 'Grãos Ribeiro',
    verification: 'Identidade e documentação fiscal validadas',
    about: 'Trabalho com arroz e feijão da agricultura familiar no Rio Grande do Sul. Meu foco é manter classificação, armazenamento e entrega previsíveis para cozinhas institucionais.'
  },
  'marcos-mendes': {
    shortName: 'Marcos', organization: 'Fruticultura Mendes',
    verification: 'Identidade verificada; documentos em análise',
    about: 'Cultivo banana e mamão em Anápolis e estou ampliando as rotas para contratos recorrentes com comércios, restaurantes e instituições da região.'
  },
  'sitio-recanto-feliz': {
    shortName: 'Recanto Feliz', organization: 'Sítio Recanto Feliz',
    verification: 'Documentação em análise',
    about: 'Nossa família cultiva hortaliças com manejo agroecológico em Feira de Santana. Combinamos rotas com vizinhos para entregar pequenos lotes de forma responsável.'
  }
};

function initialsFor(name) {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

const suppliers = initialProducers.map((producer, index) => {
  const id = supplierIds[index];
  return {
    ...producer,
    ...supplierExtras[id],
    id,
    profileId: id,
    kind: producer.name.startsWith('Cooperativa') ? 'cooperative' : 'producer',
    initials: initialsFor(producer.name),
    avatar: null,
    products: producer.availability.products,
    completedDeals: producer.completedDeliveries,
    description: producer.description,
    responseRate: producer.responseRate,
    tags: producer.tags
  };
});

const extraCooperatives = [
  {
    id: 'cooperativa-raizes', kind: 'cooperative', name: 'Cooperativa Raízes do Campo',
    shortName: 'Raízes do Campo', initials: 'RC', role: 'Cooperativa de agricultura familiar',
    organization: 'Cooperativa Raízes do Campo', location: 'Vila Velha - ES', region: 'Sudeste',
    types: ['verduras-frutas', 'produtos-organicos'], verified: true,
    verification: 'Cooperativa e produção verificadas', reputation: 4.8, reviews: 56,
    completedDeliveries: 172, completedDeals: 172, onTimeRate: 97, responseRate: 96,
    responseTime: 'Em até 3 horas', avatar: null,
    description: 'Agricultores familiares organizados para fornecer raízes, legumes e folhosas com rotas compartilhadas na Grande Vitória.',
    about: 'Somos 24 famílias da Grande Vitória. Compartilhamos planejamento de safra e transporte para que pequenos produtores possam atender juntos demandas contínuas.',
    products: ['Mandioca', 'Abóbora', 'Couve', 'Espinafre'],
    tags: ['Cooperativa', 'Raízes', 'Entrega compartilhada'],
    verifications: ['Cooperativa verificada', 'CAF ativa', 'Documentação fiscal'],
    availability: { status: 'available', label: 'Pedidos abertos', summary: 'Até 1,2 tonelada por semana' },
    recentReview: { author: 'Banco de Alimentos Comunitário', timeAgo: 'outubro de 2026', comment: 'A separação dos lotes facilitou o recebimento e reduziu perdas na cozinha.' }
  },
  {
    id: 'cooperativa-serra-mar', kind: 'cooperative', name: 'Cooperativa Serra e Mar',
    shortName: 'Serra e Mar', initials: 'SM', role: 'Cooperativa de frutas e hortaliças',
    organization: 'Cooperativa Serra e Mar', location: 'Domingos Martins - ES', region: 'Sudeste',
    types: ['verduras-frutas'], verified: true,
    verification: 'Cooperativa e responsável técnico verificados', reputation: 4.7, reviews: 44,
    completedDeliveries: 133, completedDeals: 133, onTimeRate: 95, responseRate: 97,
    responseTime: 'Em até 2 horas', avatar: null,
    description: 'Rede de produtores de montanha com frutas da estação, hortaliças e planejamento de entregas para a região metropolitana.',
    about: 'Conectamos famílias das montanhas capixabas a escolas e restaurantes. Organizamos calendário de colheita e volume conjunto para oferecer variedade sem perder a origem de cada produto.',
    products: ['Morango', 'Tomate', 'Alface', 'Banana'],
    tags: ['Cooperativa', 'Montanhas capixabas', 'Frutas'],
    verifications: ['Cooperativa verificada', 'Documentação fiscal'],
    availability: { status: 'available', label: 'Agenda aberta', summary: 'Entregas duas vezes por semana' },
    recentReview: { author: 'Restaurante Sabor da Serra', timeAgo: 'outubro de 2026', comment: 'A variedade chegou bem identificada e dentro do horário combinado.' }
  }
].map((profile) => ({ ...profile, profileId: profile.id }));

const buyers = [
  {
    id: 'escola-caminhos', name: 'Escola Caminhos do Saber', shortName: 'Equipe Caminhos', initials: 'EC',
    role: 'Comprador institucional - educação', organization: 'Escola Caminhos do Saber',
    location: 'Manhuaçu - MG', region: 'Sudeste', verified: true,
    verification: 'CNPJ e responsável validados', reputation: 4.9, reviews: 21,
    completedDeals: 31, responseRate: 98,
    description: 'Equipe de alimentação escolar comprometida com compras locais e relações duradouras com produtores.',
    about: 'Atendemos 480 estudantes e buscamos fornecedores regionais para cardápios variados. Priorizamos planejamento de volumes, diálogo com quem produz e entregas regulares.',
    products: ['Hortaliças', 'Frutas da estação', 'Raízes']
  },
  {
    id: 'escola-sol-nascente', name: 'Escola Municipal Sol Nascente', shortName: 'Sol Nascente', initials: 'ES',
    role: 'Comprador institucional - educação pública', organization: 'Escola Municipal Sol Nascente',
    location: 'Guarapari - ES', region: 'Sudeste', verified: true,
    verification: 'Instituição demonstrativa verificada', reputation: 4.8, reviews: 32,
    completedDeals: 47, responseRate: 95,
    description: 'Compras de alimentos da agricultura familiar para a merenda de 600 estudantes.',
    about: 'Nossa equipe de alimentação escolar planeja compras de hortifruti fresco com produtores próximos. Transparência no volume e no calendário ajuda a servir refeições melhores.',
    products: ['Batata-doce', 'Couve', 'Cenoura', 'Milho']
  },
  {
    id: 'hospital-regional', name: 'Hospital Regional de Guarapari', shortName: 'Hospital Regional', initials: 'HR',
    role: 'Comprador institucional - saúde', organization: 'Hospital Regional de Guarapari',
    location: 'Guarapari - ES', region: 'Sudeste', verified: true,
    verification: 'Instituição demonstrativa verificada', reputation: 4.9, reviews: 46,
    completedDeals: 64, responseRate: 97,
    description: 'Abastecimento contínuo de frutas e hortaliças para a cozinha hospitalar.',
    about: 'Organizamos compras recorrentes para dietas hospitalares. Valorizamos procedência, nota fiscal e comunicação rápida sobre safra, substituições e horário de entrega.',
    products: ['Laranja', 'Banana', 'Maçã', 'Folhosas']
  },
  {
    id: 'restaurante-serra', name: 'Restaurante Sabor da Serra', shortName: 'Sabor da Serra', initials: 'RS',
    role: 'Comprador institucional - alimentação', organization: 'Restaurante Sabor da Serra',
    location: 'Domingos Martins - ES', region: 'Sudeste', verified: true,
    verification: 'Estabelecimento demonstrativo verificado', reputation: 4.7, reviews: 29,
    completedDeals: 38, responseRate: 94,
    description: 'Restaurante regional que compra ingredientes sazonais diretamente de agricultores familiares.',
    about: 'Nossa cozinha muda o cardápio com a estação. Trabalhamos com produtores próximos para receber ingredientes frescos e combinar volumes de forma antecipada.',
    products: ['Folhosas', 'Tomate', 'Banana', 'Raízes']
  },
  {
    id: 'banco-alimentos', name: 'Banco de Alimentos e Cozinha Solidária', shortName: 'Cozinha Solidária', initials: 'BA',
    role: 'Comprador institucional - iniciativa comunitária', organization: 'Banco de Alimentos e Cozinha Solidária',
    location: 'Vila Velha - ES', region: 'Sudeste', verified: true,
    verification: 'Organização demonstrativa verificada', reputation: 4.9, reviews: 18,
    completedDeals: 52, responseRate: 96,
    description: 'Iniciativa comunitária que prepara refeições e reduz perdas de alimentos.',
    about: 'Preparamos cerca de 400 refeições por dia para famílias da região. Compras planejadas e parcerias com cooperativas ajudam a manter variedade e evitar desperdício.',
    products: ['Abóbora', 'Mandioca', 'Espinafre', 'Legumes']
  },
  {
    id: 'escola-sementes-vale', name: 'Escola Estadual Sementes do Vale', shortName: 'Sementes do Vale', initials: 'SV',
    role: 'Comprador institucional - educação', organization: 'Escola Estadual Sementes do Vale',
    location: 'Vitória - ES', region: 'Sudeste', verified: true,
    verification: 'Instituição demonstrativa verificada', reputation: 4.8, reviews: 27,
    completedDeals: 35, responseRate: 95,
    description: 'Escola que aproxima estudantes da origem dos alimentos e da agricultura familiar.',
    about: 'Unimos educação alimentar e compras locais. Visitas, atividades de cozinha e conversas com produtores ajudam os estudantes a conhecer o caminho dos alimentos.',
    products: ['Milho', 'Frutas', 'Hortaliças']
  }
].map((profile) => ({
  ...profile, profileId: profile.id, kind: 'buyer', avatar: null,
  tags: profile.products, completedDeliveries: profile.completedDeals,
  onTimeRate: null, responseTime: 'Em horário comercial'
}));

const connectionMap = {
  'joao-carlos': ['hospital-regional', 'escola-sol-nascente', 'cooperativa-raizes'],
  'maria-santos': ['banco-alimentos', 'escola-caminhos', 'cooperativa-verde'],
  'cooperativa-verde': ['escola-caminhos', 'hospital-regional', 'maria-santos'],
  'pedro-ribeiro': ['banco-alimentos', 'restaurante-serra', 'cooperativa-serra-mar'],
  'marcos-mendes': ['escola-caminhos', 'cooperativa-verde', 'hospital-regional'],
  'sitio-recanto-feliz': ['escola-sol-nascente', 'cooperativa-raizes', 'banco-alimentos'],
  'cooperativa-raizes': ['banco-alimentos', 'joao-carlos', 'escola-sol-nascente'],
  'cooperativa-serra-mar': ['restaurante-serra', 'hospital-regional', 'pedro-ribeiro'],
  'escola-caminhos': ['maria-santos', 'cooperativa-verde', 'marcos-mendes'],
  'escola-sol-nascente': ['joao-carlos', 'sitio-recanto-feliz', 'cooperativa-raizes'],
  'hospital-regional': ['joao-carlos', 'cooperativa-verde', 'cooperativa-serra-mar'],
  'restaurante-serra': ['cooperativa-serra-mar', 'pedro-ribeiro', 'joao-carlos'],
  'banco-alimentos': ['cooperativa-raizes', 'maria-santos', 'sitio-recanto-feliz'],
  'escola-sementes-vale': ['joao-carlos', 'cooperativa-raizes', 'maria-santos']
};

export const professionalProfiles = [...suppliers, ...extraCooperatives, ...buyers]
  .map((profile) => ({ ...profile, connectionIds: connectionMap[profile.id] || [] }));

export const profilesById = Object.fromEntries(professionalProfiles.map((profile) => [profile.id, profile]));
export const supplierProfiles = professionalProfiles.filter((profile) => profile.kind !== 'buyer');
export const getProfileById = (id) => Object.hasOwn(profilesById, id) ? profilesById[id] : null;
