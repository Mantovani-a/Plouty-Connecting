# 📖 Guia de Estrutura - Plouty Connecting

Guia rápido e direto para desenvolvedores entenderem a organização do projeto.

---

## 🛠️ Stack Rápida
- **React 18** (SPA com Vite) + **React Router v6**
- **Bootstrap 5.3** + **Bootstrap Icons** + **CSS Variables** (Dark/Light Mode)
- **Context API** (`ThemeContext`)

---

## 🌳 O que fica em cada pasta?

| Pasta | O que contém |
| :--- | :--- |
| **`public/`** | Arquivos estáticos e imagens gerais servidos diretamente (`favicon.png`, `images/`). |
| **`src/components/`** | Componentes reutilizáveis em PascalCase divididos por domínio. |
| **`src/context/`** | Contextos globais da aplicação (`ThemeContext.jsx` para tema claro/escuro). |
| **`src/data/`** | Mocks de dados e constantes (`demandsData`, `producersData`, `aboutData`, `navigationData`). |
| **`src/hooks/`** | Custom hooks em camelCase com regras de negócio e validação (`useContactForm.js`). |
| **`src/pages/`** | As 5 telas principais da aplicação em PascalCase. |
| **`src/styles/`** | Estilos globais mundiais, tokens de cores e resets (`globals.css`). |

---

## 🧩 Componentes (`src/components/`)

- **`auth/`**: `AuthModal.jsx` → Modal de login/cadastro com troca de perfil (Produtor/Instituição).
- **`common/`**: `FormField.jsx` → Input, textarea e select com validação e erros integrados.
- **`profile/`**: `ProfileSummary.jsx` → Card unificado de perfil (avatar, métricas e links), usado na Sidebar e no Drawer.
- **`layout/`**: `Navbar.jsx`, `Footer.jsx`, `MobileBottomNav.jsx`, `ProfileDrawer.jsx` → Casca e navegação global.
- **`home/`**: `DemandCreator.jsx`, `DemandCard.jsx`, `SidebarProfile.jsx`, `ImpactSidebar.jsx` → Feed e painéis da página inicial.
- **`explorar/`**: `ProducerCard.jsx`, `ProducerFilters.jsx` → Catálogo e barra lateral de filtros.
- **`sobre/`**: `ProblemCard.jsx`, `SolutionCard.jsx` → Cards modulares da página Sobre.

---

## 📄 Páginas & Rotas (`src/pages/` mapeadas em `App.jsx`)

| Rota | Página | Descrição |
| :--- | :--- | :--- |
| `/` | `Home.jsx` | Feed de demandas institucionais, publicação de pedidos e métricas ODS 2. |
| `/explorar` | `Explorar.jsx` | Busca de produtores rurais com filtros multi-critério (região, tipo, estrelas). |
| `/sobre` | `Sobre.jsx` | Proposta de valor, problema da intermediação e impacto social com animação. |
| `/contato` | `Contato.jsx` | Formulário de suporte validado em tempo real com contador de caracteres. |
| `/entrar` | `Entrar.jsx` | Apresentação para Produtores/Instituições e acesso ao modal de autenticação. |

---

## ⚡ Guia Rápido: Como Adicionar Novas Funcionalidades

1. **Nova Página:** Crie em `src/pages/MinhaPagina.jsx`, adicione a rota no [src/App.jsx](file:///c:/Users/User/Faculdade-Projs/Plouty-Connecting/src/App.jsx) e inclua em `src/data/navigationData.js` se for um item de menu.
2. **Novo Componente:** Crie dentro da subpasta correspondente em `src/components/`. Evite blocos gigantes de HTML dentro das páginas.
3. **Novos Dados/Mocks:** Adicione o array/objeto estruturado em `src/data/` e renderize no JSX via `.map()`.
4. **Usar Tema Dark/Light:** Importe `import { useTheme } from '../context/ThemeContext'` e acesse `{ theme, toggleTheme }`.

---

## 💻 Comandos
```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera a build de produção (validação)
```
