# Plouty — negócios que alimentam

Projeto acadêmico relacionado à **ODS 2 — Fome Zero e Agricultura Sustentável**.

A Plouty conecta pequenos produtores rurais a compradores institucionais. O protótipo demonstra uma rede social profissional agrícola com feed de publicações, catálogo e busca de produtores/cooperativas com filtros, painel de conversas e negociações em tempo real, alternância de perfis (produtor vs. comprador) e páginas institucionais — tudo com dados locais, sem backend.

## Tecnologias

- React 18 e Vite 5
- React Router 6
- Bootstrap 5 e Bootstrap Icons
- CSS customizado com tokens para temas claro e escuro
- Context API para tema e sessão demonstrativa local

## Executar o projeto

```bash
npm install
npm run dev
```

O servidor abre em `http://localhost:3000`.

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

No Windows, se o PowerShell bloquear `npm`, use `npm.cmd` nos mesmos comandos.

## Estrutura de Páginas

- `/inicio`: Feed Social da rede com publicações, interações e barra lateral de perfil.
- `/explorar`: Catálogo de produtores e cooperativas com filtros por raio, avaliação e produtos.
- `/sobre`: Página institucional sobre a proposta de valor e impacto socioambiental (ODS 2).
- `/contato`: Canal de atendimento e contato.
- `/entrar`: Tela de login e alternador de perfil demonstrativo (Produtor vs. Instituição).

## Importante

Este repositório é um protótipo de interface. Autenticação, mensagens e formulário de contato utilizam estado em memória e `sessionStorage` para a sessão demonstrativa atual. Publicações sociais criadas pelo usuário utilizam persistência em `localStorage` para enriquecer a experiência interativa.
