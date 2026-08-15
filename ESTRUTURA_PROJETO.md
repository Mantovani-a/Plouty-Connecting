# Estrutura do projeto — Plouty Connecting

## Stack

- React 18 com Vite
- React Router 6
- Bootstrap 5 e Bootstrap Icons
- CSS global orientado por tokens semânticos
- Context API para tema e sessão demonstrativa de produtor ou instituição

## Pastas

| Pasta | Responsabilidade |
| --- | --- |
| `public/images/` | Marca e fotografia local otimizada. |
| `public/images/social/` | Fotografias locais opcionais para os posts demonstrativos e instruções de substituição. |
| `src/components/business/` | Timeline demonstrativa de propostas, contratos e entregas. |
| `src/components/common/` | Campos reutilizáveis de data, moeda, quantidade/unidade e sliders com ajuste preciso. |
| `src/components/explorar/` | Filtros e perfis comerciais de produtores. |
| `src/components/home/` | Oportunidades, publicação de demanda e lateral operacional. |
| `src/components/layout/` | Cabeçalhos, rodapé, navegação móvel, drawers e painel de mensagens. |
| `src/components/profile/` | Resumo de reputação e saída da demonstração. |
| `src/components/social/` | Compositor, mídia, comentários, ações e estados do feed profissional. |
| `src/context/` | Tema claro/escuro e sessão demonstrativa por perfil. |
| `src/data/` | Mocks estáveis de oportunidades, reputação, fluxos comerciais e conversas. |
| `src/hooks/` | Foco acessível de dialogs e observação de media queries. |
| `src/pages/` | Telas mapeadas no roteador. |
| `src/styles/` | Design system, componentes, responsividade e acessibilidade. |
| `src/utils/` | Conversão e validação de datas, moeda e quantidades no padrão brasileiro. |

## Rotas

| Rota | Tela |
| --- | --- |
| `/` | Entrada pública da demonstração, sem perfil selecionado por padrão. |
| `/inicio` | Feed social profissional protegido, comum a produtores e instituições. |
| `/operacao` | Painel operacional anterior, protegido e adaptado ao perfil escolhido. |
| `/oportunidades` | Busca protegida e comparação de demandas institucionais para o perfil produtor. |
| `/negocios` | Área protegida de propostas, negociações, contratos e timeline demonstrativa. |
| `/explorar` | Diretório comercial protegido de produtores e cooperativas para o perfil instituição. |
| `/sobre` | História, proposta de valor e ODS 2. |
| `/contato` | Formulário com validação local. |
| `/entrar` | Mesmo fluxo público de entrada, com seleção de perfil e sem autenticação no backend. |

## Dados e integrações

Os dados de oportunidades, produtores, reputação, mensagens, timelines, negócios e os três posts iniciais são mocks fixos marcados como demonstrativos. O perfil ativo usa `sessionStorage`, portanto permanece ao atualizar a mesma aba e é removido ao sair. Mensagens e propostas existem apenas na memória da tela; publicações criadas pelo usuário e a conclusão dos próximos passos usam `localStorage` demonstrativo. Imagens escolhidas no compositor não são enviadas a servidor. O projeto não contém API, autenticação real, banco de dados nem envio de e-mail.

## Comandos

```bash
npm run dev
npm run build
npm run preview
```

Não há lint ou testes automatizados configurados nesta versão.
