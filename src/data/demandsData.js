const demandSeeds = [
  {
    id: 'demanda-escola-caminhos', profileId: 'escola-caminhos',
    icon: 'bi-mortarboard-fill', timeAgo: 'há 1 hora', category: 'Recorrência Semanal', urgency: 'Média',
    description: 'A escola busca fornecimento semanal de folhosas frescas para o cardápio de 480 estudantes, com entregas planejadas e identificação dos lotes.',
    products: ['120 unidades de alface', '80 maços de couve', '40 maços de rúcula'],
    deadline: 'Propostas até sexta-feira; entregas semanais',
    odsGoal: 'ODS 2.1 - Alimentação escolar de qualidade'
  },
  {
    id: 'demanda-escola-sol-nascente', profileId: 'escola-sol-nascente',
    icon: 'bi-mortarboard-fill', timeAgo: 'há 2 horas',
    category: 'Demanda Emergencial', urgency: 'Alta',
    description: 'Solicitamos propostas para entrega de hortaliças e tubérculos frescos para a merenda escolar de 600 estudantes da rede básica.',
    products: ['60 kg de batata-doce', '25 maços de couve', '40 kg de cenoura'],
    deadline: 'Entrega até sexta-feira',
    odsGoal: 'ODS 2.1 - Acesso universal a alimentos seguros e nutritivos'
  },
  {
    id: 'demanda-hospital-regional', profileId: 'hospital-regional',
    icon: 'bi-hospital-fill', timeAgo: 'há 5 horas',
    category: 'Recorrência Semanal', urgency: 'Média',
    description: 'Buscamos fornecedores contínuos de frutas da época para a dieta hospitalar. É exigida emissão de Nota Fiscal do Produtor Rural e boas práticas de manejo.',
    products: ['150 kg de laranjas', '120 kg de bananas prata', '50 kg de maçãs'],
    deadline: 'Contrato trimestral com entregas às terças',
    odsGoal: 'ODS 2.4 - Sistemas sustentáveis de produção de alimentos'
  },
  {
    id: 'demanda-banco-alimentos', profileId: 'banco-alimentos',
    icon: 'bi-heart-pulse-fill', timeAgo: 'há 1 dia',
    category: 'Parceria Local', urgency: 'Alta',
    description: 'Captação de legumes e verduras de produtores da agricultura familiar para preparo de 400 marmitas diárias destinadas a famílias em situação de vulnerabilidade social.',
    products: ['80 kg de abóbora', '50 kg de mandioca', '30 maços de espinafre'],
    deadline: 'Recebimento contínuo semanal',
    odsGoal: 'ODS 2.2 - Erradicar todas as formas de desnutrição'
  },
  {
    id: 'demanda-restaurante-cidadao', profileId: 'restaurante-serra',
    icon: 'bi-shop-window', timeAgo: 'há 2 dias',
    category: 'Cotação Mensal', urgency: 'Normal',
    description: 'Abertura de cotação para aquisição direta de feijão carioca, arroz agroecológico e ovos caipiras certificados.',
    products: ['200 kg de feijão carioca', '300 kg de arroz', '60 dúzias de ovos'],
    deadline: 'Propostas até o final do mês',
    odsGoal: 'ODS 2.3 - Renda de pequenos produtores'
  }
];

export const initialDemands = demandSeeds.map((demand) => ({ ...demand, businessKey: demand.profileId }));
