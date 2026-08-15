// Fixtures estáveis do protótipo acadêmico. As datas e etapas são
// demonstrativas e não representam eventos persistidos em um backend.
export const businessFlowFixtures = {
  'producer-1': {
    key: 'producer-1',
    businessId: 1,
    role: 'producer',
    label: 'Jornada comercial prevista',
    recentUpdate: {
      title: 'Proposta aberta pela instituição',
      description: 'A Escola Municipal Sol Nascente iniciou a análise comercial da sua proposta.',
      occurredAt: '2026-08-14T09:20:00-03:00'
    },
    steps: [
      {
        id: 'producer-1-proposal-sent',
        title: 'Proposta enviada',
        description: 'Preço, volume disponível e condições de entrega foram compartilhados com a escola.',
        occurredAt: '2026-08-12T14:35:00-03:00',
        state: 'complete'
      },
      {
        id: 'producer-1-proposal-review',
        title: 'Proposta em análise',
        description: 'A equipe de compras está comparando preço, documentação e capacidade de fornecimento.',
        occurredAt: '2026-08-14T09:20:00-03:00',
        state: 'current'
      },
      {
        id: 'producer-1-proposal-accepted',
        title: 'Proposta aceita',
        description: 'Previsão demonstrativa para a decisão da instituição.',
        occurredAt: '2026-08-16T18:00:00-03:00',
        state: 'upcoming'
      },
      {
        id: 'producer-1-contract-signature',
        title: 'Assinatura do contrato',
        description: 'As partes revisam os termos comerciais e confirmam o acordo.',
        occurredAt: '2026-08-18T15:00:00-03:00',
        state: 'upcoming'
      },
      {
        id: 'producer-1-contract-active',
        title: 'Contrato ativo',
        description: 'O fornecimento passa a integrar a agenda comercial do produtor.',
        occurredAt: '2026-08-19T09:00:00-03:00',
        state: 'upcoming'
      },
      {
        id: 'producer-1-delivery-scheduled',
        title: 'Entrega agendada',
        description: 'A janela de recebimento será confirmada com a escola.',
        occurredAt: '2026-08-22T07:30:00-03:00',
        state: 'upcoming'
      },
      {
        id: 'producer-1-delivery-completed',
        title: 'Entrega concluída',
        description: 'O recebimento e a qualidade dos produtos serão registrados pela instituição.',
        occurredAt: '2026-08-22T10:00:00-03:00',
        state: 'upcoming'
      }
    ]
  },
  'producer-2': {
    key: 'producer-2',
    businessId: 2,
    role: 'producer',
    label: 'Jornada comercial prevista',
    recentUpdate: {
      title: 'Janela de entrega em ajuste',
      description: 'O Hospital Regional sugeriu entregas às terças-feiras pela manhã.',
      occurredAt: '2026-08-14T10:42:00-03:00'
    },
    steps: [
      {
        id: 'producer-2-proposal-sent',
        title: 'Proposta enviada',
        description: 'A proposta incluiu o preço por entrega e a capacidade de fornecimento semanal.',
        occurredAt: '2026-08-08T11:10:00-03:00',
        state: 'complete'
      },
      {
        id: 'producer-2-proposal-review',
        title: 'Proposta analisada',
        description: 'O hospital validou volume, documentação fiscal e padrão dos produtos.',
        occurredAt: '2026-08-11T16:25:00-03:00',
        state: 'complete'
      },
      {
        id: 'producer-2-proposal-accepted',
        title: 'Proposta aceita',
        description: 'As condições comerciais foram aprovadas para avançar à formalização.',
        occurredAt: '2026-08-13T14:00:00-03:00',
        state: 'complete'
      },
      {
        id: 'producer-2-contract-signature',
        title: 'Assinatura do contrato',
        description: 'A frequência e a janela de entrega estão sendo ajustadas antes da assinatura.',
        occurredAt: '2026-08-15T16:00:00-03:00',
        state: 'current'
      },
      {
        id: 'producer-2-contract-active',
        title: 'Contrato ativo',
        description: 'O contrato entra em vigor após a assinatura das duas partes.',
        occurredAt: '2026-08-18T08:00:00-03:00',
        state: 'upcoming'
      },
      {
        id: 'producer-2-delivery-scheduled',
        title: 'Entrega agendada',
        description: 'Primeira entrega prevista para o setor de nutrição do hospital.',
        occurredAt: '2026-08-25T08:00:00-03:00',
        state: 'upcoming'
      },
      {
        id: 'producer-2-delivery-completed',
        title: 'Entrega concluída',
        description: 'O hospital confirma quantidade, integridade e horário de recebimento.',
        occurredAt: '2026-08-25T10:30:00-03:00',
        state: 'upcoming'
      }
    ]
  },
  'producer-3': {
    key: 'producer-3',
    businessId: 3,
    role: 'producer',
    label: 'Jornada comercial prevista',
    recentUpdate: {
      title: 'Entrega confirmada',
      description: 'O Restaurante Sabor da Serra confirmou o recebimento para terça-feira, às 7h.',
      occurredAt: '2026-08-13T16:18:00-03:00'
    },
    steps: [
      {
        id: 'producer-3-proposal-sent',
        title: 'Proposta enviada',
        description: 'A cesta, os valores e a frequência de fornecimento foram apresentados ao restaurante.',
        occurredAt: '2026-07-28T10:05:00-03:00',
        state: 'complete'
      },
      {
        id: 'producer-3-proposal-review',
        title: 'Proposta analisada',
        description: 'A instituição avaliou o mix de produtos e a rota logística.',
        occurredAt: '2026-07-30T15:40:00-03:00',
        state: 'complete'
      },
      {
        id: 'producer-3-proposal-accepted',
        title: 'Proposta aceita',
        description: 'O restaurante aprovou o fornecimento da cesta de produtos da estação.',
        occurredAt: '2026-08-01T09:12:00-03:00',
        state: 'complete'
      },
      {
        id: 'producer-3-contract-signature',
        title: 'Contrato assinado',
        description: 'Termos de pagamento, frequência e substituição de produtos foram formalizados.',
        occurredAt: '2026-08-04T13:30:00-03:00',
        state: 'complete'
      },
      {
        id: 'producer-3-contract-active',
        title: 'Contrato ativo',
        description: 'O fornecimento recorrente está ativo e disponível para acompanhamento.',
        occurredAt: '2026-08-05T08:00:00-03:00',
        state: 'complete'
      },
      {
        id: 'producer-3-delivery-scheduled',
        title: 'Entrega agendada',
        description: 'Recebimento confirmado para 18 de agosto, às 7h.',
        occurredAt: '2026-08-18T07:00:00-03:00',
        state: 'current'
      },
      {
        id: 'producer-3-delivery-completed',
        title: 'Entrega concluída',
        description: 'O restaurante registrará o recebimento após conferir o pedido.',
        occurredAt: '2026-08-18T09:00:00-03:00',
        state: 'upcoming'
      }
    ]
  },
  'buyer-1': {
    key: 'buyer-1',
    businessId: 1,
    role: 'buyer',
    label: 'Jornada comercial prevista',
    recentUpdate: {
      title: 'Quarta proposta recebida',
      description: 'A Cooperativa Verde enviou condições para o fornecimento de hortaliças.',
      occurredAt: '2026-08-14T10:36:00-03:00'
    },
    steps: [
      {
        id: 'buyer-1-proposal-sent',
        title: 'Propostas recebidas',
        description: 'Quatro fornecedores enviaram preço, disponibilidade e condições logísticas.',
        occurredAt: '2026-08-14T10:36:00-03:00',
        state: 'complete'
      },
      {
        id: 'buyer-1-proposal-review',
        title: 'Propostas em análise',
        description: 'A equipe compara preço, distância, documentação e capacidade de entrega.',
        occurredAt: '2026-08-14T11:00:00-03:00',
        state: 'current'
      },
      {
        id: 'buyer-1-proposal-accepted',
        title: 'Proposta aceita',
        description: 'A decisão demonstrativa está prevista após a comparação comercial.',
        occurredAt: '2026-08-16T17:00:00-03:00',
        state: 'upcoming'
      },
      {
        id: 'buyer-1-contract-signature',
        title: 'Assinatura do contrato',
        description: 'Instituição e fornecedor revisam os termos finais do fornecimento.',
        occurredAt: '2026-08-18T14:00:00-03:00',
        state: 'upcoming'
      },
      {
        id: 'buyer-1-contract-active',
        title: 'Contrato ativo',
        description: 'O acordo fica disponível para acompanhamento operacional.',
        occurredAt: '2026-08-19T08:00:00-03:00',
        state: 'upcoming'
      },
      {
        id: 'buyer-1-delivery-scheduled',
        title: 'Entrega agendada',
        description: 'A equipe informa a janela e o ponto de recebimento ao fornecedor.',
        occurredAt: '2026-08-24T07:00:00-03:00',
        state: 'upcoming'
      },
      {
        id: 'buyer-1-delivery-completed',
        title: 'Entrega concluída',
        description: 'Quantidade, qualidade e horário serão conferidos no recebimento.',
        occurredAt: '2026-08-24T10:00:00-03:00',
        state: 'upcoming'
      }
    ]
  },
  'buyer-2': {
    key: 'buyer-2',
    businessId: 2,
    role: 'buyer',
    label: 'Jornada comercial prevista',
    recentUpdate: {
      title: 'Frequência em confirmação',
      description: 'Maria dos Santos confirmou capacidade para entregas semanais de frutas.',
      occurredAt: '2026-08-14T09:48:00-03:00'
    },
    steps: [
      {
        id: 'buyer-2-proposal-sent',
        title: 'Proposta recebida',
        description: 'A produtora informou preço por entrega, volume e produtos disponíveis.',
        occurredAt: '2026-08-09T13:25:00-03:00',
        state: 'complete'
      },
      {
        id: 'buyer-2-proposal-review',
        title: 'Proposta analisada',
        description: 'A equipe validou preço, documentação e regularidade de fornecimento.',
        occurredAt: '2026-08-11T10:10:00-03:00',
        state: 'complete'
      },
      {
        id: 'buyer-2-proposal-accepted',
        title: 'Proposta aceita',
        description: 'A proposta foi selecionada e os detalhes operacionais estão em confirmação.',
        occurredAt: '2026-08-13T15:20:00-03:00',
        state: 'current'
      },
      {
        id: 'buyer-2-contract-signature',
        title: 'Assinatura do contrato',
        description: 'A frequência e a janela de entrega serão formalizadas no contrato.',
        occurredAt: '2026-08-17T14:00:00-03:00',
        state: 'upcoming'
      },
      {
        id: 'buyer-2-contract-active',
        title: 'Contrato ativo',
        description: 'O contrato entra em vigor após a assinatura das partes.',
        occurredAt: '2026-08-18T08:00:00-03:00',
        state: 'upcoming'
      },
      {
        id: 'buyer-2-delivery-scheduled',
        title: 'Entrega agendada',
        description: 'Primeira entrega prevista para a semana seguinte à formalização.',
        occurredAt: '2026-08-25T08:30:00-03:00',
        state: 'upcoming'
      },
      {
        id: 'buyer-2-delivery-completed',
        title: 'Entrega concluída',
        description: 'O setor responsável registra a conferência e o aceite do pedido.',
        occurredAt: '2026-08-25T11:00:00-03:00',
        state: 'upcoming'
      }
    ]
  },
  'buyer-3': {
    key: 'buyer-3',
    businessId: 3,
    role: 'buyer',
    label: 'Jornada comercial prevista',
    recentUpdate: {
      title: 'Colheita confirmada',
      description: 'João Carlos confirmou a colheita e o preparo do pedido para a próxima entrega.',
      occurredAt: '2026-08-13T17:05:00-03:00'
    },
    steps: [
      {
        id: 'buyer-3-proposal-sent',
        title: 'Proposta recebida',
        description: 'O produtor enviou disponibilidade, preço e condições para a cesta da estação.',
        occurredAt: '2026-07-27T09:40:00-03:00',
        state: 'complete'
      },
      {
        id: 'buyer-3-proposal-review',
        title: 'Proposta analisada',
        description: 'Produtos, documentação e referências comerciais foram conferidos.',
        occurredAt: '2026-07-29T14:30:00-03:00',
        state: 'complete'
      },
      {
        id: 'buyer-3-proposal-accepted',
        title: 'Proposta aceita',
        description: 'A instituição aprovou a proposta para fornecimento recorrente.',
        occurredAt: '2026-07-31T11:15:00-03:00',
        state: 'complete'
      },
      {
        id: 'buyer-3-contract-signature',
        title: 'Contrato assinado',
        description: 'As partes formalizaram frequência, pagamento e padrão de qualidade.',
        occurredAt: '2026-08-03T16:00:00-03:00',
        state: 'complete'
      },
      {
        id: 'buyer-3-contract-active',
        title: 'Contrato ativo',
        description: 'O fornecimento está ativo e pronto para acompanhamento das entregas.',
        occurredAt: '2026-08-04T08:00:00-03:00',
        state: 'complete'
      },
      {
        id: 'buyer-3-delivery-scheduled',
        title: 'Entrega agendada',
        description: 'Recebimento programado para 18 de agosto, às 7h.',
        occurredAt: '2026-08-18T07:00:00-03:00',
        state: 'current'
      },
      {
        id: 'buyer-3-delivery-completed',
        title: 'Entrega concluída',
        description: 'A equipe registrará o aceite após conferir os produtos recebidos.',
        occurredAt: '2026-08-18T09:30:00-03:00',
        state: 'upcoming'
      }
    ]
  }
};

export const emptyBusinessFlow = {
  key: 'empty',
  businessId: null,
  role: null,
  label: 'Jornada comercial prevista',
  recentUpdate: null,
  steps: []
};

export function getBusinessFlowFixture(role, businessId) {
  return businessFlowFixtures[`${role}-${businessId}`] ?? emptyBusinessFlow;
}
