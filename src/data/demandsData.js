// Dados demonstrativos de demandas institucionais alinhadas à ODS 2 (Fome Zero e Agricultura Sustentável)
export const initialDemands = [
  {
    id: 'demanda-escola-sol-nascente',
    org: 'Escola Municipal Sol Nascente',
    businessKey: 'escola-sementes-vale',
    institutionType: 'Escola Pública (PNAE)',
    icon: 'bi-mortarboard-fill',
    location: 'Guarapari - ES',
    timeAgo: 'há 2 horas',
    category: 'Demanda Emergencial',
    urgency: 'Alta',
    description: 'Solicitamos propostas para entrega imediata de hortaliças e tubérculos frescos para a merenda escolar de 600 estudantes da rede básica.',
    products: ['60kg de Batata-Doce', '25 maços de Couve Orgânica', '40kg de Cenoura'],
    deadline: 'Entrega até sexta-feira',
    odsGoal: 'ODS 2.1 — Acesso universal a alimentos seguros e nutritivos'
  },
  {
    id: 'demanda-hospital-regional',
    org: 'Hospital Regional de Guarapari',
    businessKey: 'hospital-regional-guarapari',
    institutionType: 'Saúde Pública',
    icon: 'bi-hospital-fill',
    location: 'Guarapari - ES',
    timeAgo: 'há 5 horas',
    category: 'Recorrência Semanal',
    urgency: 'Média',
    description: 'Buscamos fornecedores contínuos de frutas da época para a dieta hospitalar. É exigida emissão de Nota Fiscal do Produtor Rural e boas práticas de manejo.',
    products: ['150kg de Laranjas', '120kg de Bananas Prata', '50kg de Maçãs'],
    deadline: 'Contrato trimestral com entregas às terças',
    odsGoal: 'ODS 2.4 — Sistemas sustentáveis de produção de alimentos'
  },
  {
    id: 'demanda-banco-alimentos',
    org: 'Banco de Alimentos & Cozinha Solidária',
    businessKey: 'cooperativa-raizes',
    institutionType: 'Iniciativa Comunitária',
    icon: 'bi-heart-pulse-fill',
    location: 'Vila Velha - ES',
    timeAgo: 'há 1 dia',
    category: 'Parceria Local',
    urgency: 'Alta',
    description: 'Captação de legumes e verduras de produtores da agricultura familiar para preparo de 400 marmitas diárias destinadas a famílias em situação de vulnerabilidade social.',
    products: ['80kg de Abóbora Japonesa', '50kg de Mandioca Descascada', '30 maços de Espinafre'],
    deadline: 'Recebimento contínuo semanal',
    odsGoal: 'ODS 2.2 — Erradicar todas as formas de desnutrição'
  },
  {
    id: 'demanda-restaurante-cidadao',
    org: 'Restaurante Comunitário Prato Justo',
    businessKey: 'joao-carlos',
    institutionType: 'Restaurante Popular',
    icon: 'bi-shop-window',
    location: 'Vitória - ES',
    timeAgo: 'há 2 dias',
    category: 'Cotação Mensal',
    urgency: 'Normal',
    description: 'Abertura de cotação para aquisição direta de feijão carioca, arroz agroecológico e ovos caipiras certificados.',
    products: ['200kg de Feijão Carioca', '300kg de Arroz', '60 dúzias de Ovos Caipiras'],
    deadline: 'Propostas até o final do mês',
    odsGoal: 'ODS 2.3 — Dobrar a produtividade agrícola e a renda de pequenos produtores'
  }
];
