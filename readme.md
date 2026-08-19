# Plouty — negócios que alimentam

Projeto acadêmico relacionado à **ODS 2 — Fome Zero e Agricultura Sustentável**.

A Plouty conecta pequenos produtores rurais a compradores institucionais. O protótipo demonstra uma rede profissional agrícola, descoberta de oportunidades, publicação de demandas, propostas, reputação comercial, acompanhamento de negócios e conversas — tudo com dados locais, sem backend.

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

## Importante

Este repositório é um protótipo de interface. Autenticação, mensagens, contratos, documentos, propostas e formulário de contato ainda não possuem persistência ou integração com servidor. A entrada cria uma sessão demonstrativa apenas na aba atual; mensagens e propostas adicionadas pela interface não são enviadas a um servidor. Publicações sociais criadas pelo usuário e a conclusão de “Próximos passos” usam armazenamento local somente para demonstrar o comportamento.

O novo feed social fica em `/inicio`. O painel operacional anterior foi preservado em `/operacao`, com o nome “Minha operação”.
