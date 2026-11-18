// Conteúdo fictício. Autores e comentaristas são relacionados por IDs de profilesData.
function post(id, authorId, publishedAt, text, reactionCount, repostCount, comments, placeholderLabel) {
  return {
    id, authorId, publishedAt, text, reactionCount, repostCount,
    comments: comments.map(([authorId, commentText], index) => ({
      id: `${id}-comment-${index + 1}`, authorId,
      text: commentText, time: 'novembro de 2026'
    })),
    ...(placeholderLabel ? { mediaPlaceholder: { label: placeholderLabel } } : {})
  };
}

export const socialFeedPosts = [
  post('colheita-planejada', 'joao-carlos', '2026-11-16T08:20:00-03:00',
    'A colheita de hoje foi planejada junto com as cozinhas que atendemos. Separamos alface, couve e cenoura por destino para reduzir manuseio e entregar tudo ainda fresco nesta semana.',
    48, 4, [
      ['hospital-regional', 'A organização por lote facilita muito o recebimento. Obrigado pela parceria!'],
      ['cooperativa-raizes', 'Planejar antes da colheita faz diferença para toda a cadeia.']
    ], 'Registro da colheita e entrega'),
  post('merenda-local', 'escola-sol-nascente', '2026-11-15T10:35:00-03:00',
    'Nesta semana, as frutas e hortaliças da merenda vieram de produtores da região. A equipe conferiu qualidade, volumes e procedência antes de preparar as refeições dos estudantes.',
    61, 6, [
      ['joao-carlos', 'É uma alegria ver a produção local chegando à escola.'],
      ['maria-santos', 'Parabéns à equipe pelo cuidado com os alimentos.']
    ]),
  post('rota-cooperada', 'cooperativa-verde', '2026-11-14T07:50:00-03:00',
    'Consolidamos os lotes de 12 famílias para a rota desta semana. Cada caixa saiu identificada por produtor, produto e destino. A logística coletiva permite atender volumes maiores sem apagar a origem de ninguém.',
    74, 8, [
      ['escola-caminhos', 'A identificação dos lotes ajuda nosso planejamento de compras.'],
      ['cooperativa-serra-mar', 'Compartilhar logística abre portas para mais famílias.']
    ]),
  post('abastecimento-hospital', 'hospital-regional', '2026-11-13T14:10:00-03:00',
    'Recebemos hoje frutas e folhosas de fornecedores regionais. O calendário combinado com antecedência ajudou a cozinha a ajustar o cardápio sem desperdício e com produtos em boa condição.',
    57, 5, [
      ['joao-carlos', 'Obrigado pela confirmação de recebimento e pelo diálogo constante.'],
      ['cooperativa-verde', 'Boa comunicação torna as entregas mais previsíveis.']
    ], 'Registro da parceria com produtores locais'),
  post('frutas-da-estacao', 'maria-santos', '2026-11-12T09:05:00-03:00',
    'A seleção de frutas desta semana está pronta. Colhemos em diferentes pontos de maturação para que escolas e cozinhas comunitárias recebam lotes adequados ao dia de uso.',
    39, 2, [
      ['banco-alimentos', 'Esse cuidado ajuda a aproveitar melhor cada entrega.']
    ]),
  post('cozinha-solidaria', 'banco-alimentos', '2026-11-11T16:25:00-03:00',
    'Hoje preparamos 400 refeições com abóbora, mandioca e verduras adquiridas de famílias da Grande Vitória. O planejamento conjunto com a cooperativa reduziu sobras e manteve o cardápio variado.',
    83, 9, [
      ['cooperativa-raizes', 'Seguimos juntos na programação das próximas entregas.'],
      ['escola-sementes-vale', 'Um trabalho essencial para a comunidade.']
    ]),
  post('safra-graos', 'pedro-ribeiro', '2026-11-10T11:40:00-03:00',
    'Finalizamos a classificação do lote de arroz integral e feijão desta safra. Já temos amostras e previsão de entrega para instituições que precisam planejar o abastecimento de dezembro.',
    26, 1, [
      ['restaurante-serra', 'Vamos conversar sobre volumes para a próxima quinzena.']
    ]),
  post('cardapio-sazonal', 'restaurante-serra', '2026-11-09T13:15:00-03:00',
    'Nosso cardápio da próxima semana terá produtos das montanhas capixabas. Ajustar as receitas à safra local tem aproximado a cozinha dos agricultores e dado mais previsibilidade às compras.',
    44, 3, [
      ['cooperativa-serra-mar', 'Estamos preparando os lotes para a entrega de terça.']
    ]),
  post('entrega-compartilhada', 'cooperativa-raizes', '2026-11-08T08:30:00-03:00',
    'A rota compartilhada de hoje reuniu mandioca, abóbora e folhosas de oito famílias. Chegamos a três cozinhas com menos deslocamentos e todos os lotes identificados.',
    52, 4, [
      ['banco-alimentos', 'Recebimento conferido. Produtos em ótimo estado!']
    ]),
  post('atividade-milho', 'escola-sementes-vale', '2026-11-07T15:10:00-03:00',
    'A turma acompanhou o caminho do milho, da produção ao prato. A atividade terminou na cozinha, com conversa sobre agricultura familiar e o trabalho de quem abastece a cidade.',
    68, 7, [
      ['joao-carlos', 'Foi muito bom conversar com os estudantes sobre a colheita.']
    ], 'Registro da Festa do Milho'),
  post('safra-montanha', 'cooperativa-serra-mar', '2026-11-06T09:45:00-03:00',
    'A safra de tomate e folhosas das montanhas está em andamento. Estamos fechando o calendário de duas entregas semanais para restaurantes e instituições da Grande Vitória.',
    34, 2, [
      ['restaurante-serra', 'Nosso pedido da próxima semana já está em planejamento.']
    ]),
  post('planejamento-2027', 'escola-caminhos', '2026-11-05T10:00:00-03:00',
    'Começamos a conversar com fornecedores regionais sobre o cardápio do próximo período letivo. Antecipar volumes e sazonalidade ajuda a escola e também quem produz.',
    31, 2, [
      ['maria-santos', 'Podemos compartilhar nossa previsão de frutas da estação.']
    ])
];
