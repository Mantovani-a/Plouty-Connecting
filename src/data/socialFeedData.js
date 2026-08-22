// Os nomes de arquivo abaixo são fixos em public/images/social/.
export const socialFeedPosts = [
  {
    id: 'escola-festa-milho',
    author: {
      initials: 'ES',
      name: 'Escola Estadual Sementes do Vale',
      role: 'Instituição de ensino',
      type: 'institution',
      avatar: '/images/social/avatars/escola-sementes-vale.png',
      verified: true
    },
    publishedAt: 'Hoje, às 10h20',
    text: 'Hoje celebramos a Festa do Milho da Escola Estadual Sementes do Vale. Agradecemos ao produtor João Carlos pela excelente colheita e pela parceria que tornou este momento possível para estudantes, famílias e toda a equipe escolar.',
    postImage: {
      src: '/images/social/posts/post-festa-milho.png',
      alt: 'Festa do Milho da Escola Estadual Sementes do Vale',
      label: 'Registro da Festa do Milho'
    },
    reactionCount: 48,
    commentCount: 6,
    repostCount: 3,
    comments: [
      { id: 'escola-milho-1', initials: 'JC', name: 'João Carlos', avatar: '/images/social/avatars/joao-carlos.png', text: 'Foi uma alegria participar. Obrigado pela confiança no nosso trabalho!', time: 'há 35 min' },
      { id: 'escola-milho-2', initials: 'MR', name: 'Marina Ribeiro', avatar: '/images/social/avatars/marina-ribeiro.png', text: 'As crianças voltaram para casa contando tudo sobre a origem dos alimentos.', time: 'há 18 min' }
    ]
  },
  {
    id: 'joao-entrega-hospital',
    author: {
      initials: 'JC',
      name: 'João Carlos',
      role: 'Produtor familiar',
      type: 'producer',
      avatar: '/images/social/avatars/joao-carlos.png',
      verified: true
    },
    publishedAt: 'Ontem, às 16h40',
    text: 'Concluímos mais uma entrega para o Hospital Regional: 180 kg de frutas colhidas nesta semana e organizadas para a rotina da cozinha. Planejamento de rota e diálogo próximo fizeram a diferença.',
    postImage: {
      src: '/images/social/posts/post-entrega-hospital.png',
      alt: 'Entrega de frutas organizada por João Carlos',
      label: 'Registro da entrega de frutas'
    },
    reactionCount: 31,
    commentCount: 3,
    repostCount: 1,
    comments: [
      { id: 'joao-entrega-1', initials: 'HR', name: 'Hospital Regional', avatar: '/images/social/avatars/hospital-regional-guarapari.png', text: 'Entrega recebida no horário e com ótima qualidade. Parabéns à equipe!', time: 'ontem' },
      { id: 'joao-entrega-2', initials: 'AS', name: 'Ana Souza', avatar: '/images/social/avatars/ana-souza.png', text: 'Muito bom ver produção local chegando às instituições da região.', time: 'ontem' }
    ]
  },
  {
    id: 'hospital-parceria-local',
    author: {
      initials: 'HR',
      name: 'Hospital Regional de Guarapari',
      role: 'Instituição de saúde',
      type: 'institution',
      avatar: '/images/social/avatars/hospital-regional-guarapari.png',
      verified: true
    },
    publishedAt: '12 ago, às 14h10',
    text: 'Nossa parceria com produtores locais completou três meses. Além da regularidade nas entregas, ganhamos mais proximidade para ajustar volumes e cardápios com responsabilidade.',
    postImage: {
      src: '/images/social/posts/post-parceria-local.png',
      alt: 'Equipe do Hospital Regional com produtores parceiros',
      label: 'Registro da parceria local'
    },
    reactionCount: 67,
    commentCount: 8,
    repostCount: 5,
    comments: [
      { id: 'hospital-parceria-1', initials: 'CR', name: 'Cooperativa Raízes', avatar: '/images/social/avatars/cooperativa-raizes.png', text: 'Parcerias assim dão previsibilidade para quem produz e qualidade para quem recebe.', time: 'há 2 dias' },
      { id: 'hospital-parceria-2', initials: 'LM', name: 'Lucas Martins', avatar: '/images/social/avatars/lucas-martins.png', text: 'Um resultado importante para toda a comunidade.', time: 'há 2 dias' }
    ]
  }
];
