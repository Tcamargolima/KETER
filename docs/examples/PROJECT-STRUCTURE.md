# 📁 ESTRUTURA DO PROJETO KETER

Este documento explica a organização de arquivos e pastas do projeto.

---

## 🗂️ Estrutura Completa

```
keter/
│
├── 📂 src/                          # Código-fonte principal
│   ├── 📂 components/               # Componentes React
│   │   ├── 📂 ui/                   # Componentes base reutilizáveis
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Modal.jsx
│   │   │
│   │   ├── 📂 IA/                   # Componentes de IA
│   │   │   ├── AnaliseSemanal.jsx   # Widget de análise
│   │   │   ├── ChatInteligente.jsx  # Chat com IA
│   │   │   └── PadroesLinguisticos.jsx
│   │   │
│   │   ├── 📂 features/             # Features específicas
│   │   │   ├── Onboarding.jsx
│   │   │   ├── PraticaDiaria.jsx
│   │   │   ├── ReflexaoNoturna.jsx
│   │   │   ├── Conquistas.jsx
│   │   │   └── Circulos.jsx
│   │   │
│   │   └── 📂 layout/               # Layout components
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       ├── BottomNav.jsx
│   │       └── Sidebar.jsx
│   │
│   ├── 📂 hooks/                    # Custom React Hooks
│   │   ├── useAuth.js               # Autenticação
│   │   ├── useKetero.js             # Perfil do usuário
│   │   ├── usePraticas.js           # Práticas diárias
│   │   ├── useReflexoes.js          # Reflexões
│   │   ├── useConquistas.js         # Sistema de conquistas
│   │   ├── useGuia.js               # Chat com IA
│   │   ├── useIA.js                 # Hooks de IA
│   │   └── useTimer.js              # Timer de práticas
│   │
│   ├── 📂 lib/                      # Bibliotecas e utilitários
│   │   ├── supabase.js              # Cliente Supabase + helpers
│   │   ├── openai.js                # Cliente OpenAI + IA
│   │   ├── analytics.js             # Analytics (futuro)
│   │   └── utils.js                 # Funções utilitárias
│   │
│   ├── 📂 pages/                    # Páginas/Views principais
│   │   ├── Welcome.jsx              # Landing page
│   │   ├── Auth/                    # Autenticação
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── Onboarding.jsx           # Onboarding multi-step
│   │   ├── Home.jsx                 # Dashboard principal
│   │   ├── Pratica.jsx              # Tela de prática
│   │   ├── Guia.jsx                 # Chat com IA
│   │   ├── Circulos.jsx             # Comunidade
│   │   └── Perfil.jsx               # Perfil do usuário
│   │
│   ├── 📂 data/                     # Dados estáticos
│   │   ├── praticas.js              # Biblioteca de 30+ práticas
│   │   ├── fases.js                 # Configuração das 4 fases
│   │   ├── conquistas.js            # Catálogo de conquistas
│   │   └── microatos.js             # Micro-atos de bondade
│   │
│   ├── 📂 contexts/                 # React Contexts
│   │   ├── AuthContext.jsx          # Contexto de autenticação
│   │   ├── ThemeContext.jsx         # Tema (futuro)
│   │   └── NotificationContext.jsx  # Notificações
│   │
│   ├── 📂 styles/                   # Estilos globais
│   │   ├── globals.css              # CSS global
│   │   └── tailwind.css             # Tailwind base
│   │
│   ├── App.jsx                      # Componente raiz
│   ├── main.jsx                     # Entry point
│   └── routes.jsx                   # Configuração de rotas
│
├── 📂 database/                     # Arquivos de banco de dados
│   ├── schema.sql                   # Schema Supabase completo
│   ├── migrations/                  # Migrações (futuro)
│   └── seeds/                       # Dados de seed (futuro)
│
├── 📂 docs/                         # Documentação
│   ├── SETUP-SUPABASE.md            # Guia Supabase
│   ├── SETUP-OPENAI.md              # Guia OpenAI
│   ├── ARCHITECTURE.md              # Arquitetura do sistema
│   ├── API.md                       # Documentação da API
│   ├── DEPLOYMENT.md                # Guia de deploy
│   └── STYLE_GUIDE.md               # Guia de estilo de código
│
├── 📂 public/                       # Arquivos públicos
│   ├── favicon.ico
│   ├── logo.png
│   ├── manifest.json                # PWA manifest (futuro)
│   └── robots.txt
│
├── 📂 scripts/                      # Scripts utilitários
│   ├── seed-db.js                   # Popular banco com dados
│   ├── reset-db.js                  # Resetar banco
│   └── deploy.js                    # Script de deploy
│
├── 📂 tests/                        # Testes (futuro)
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── 📄 .env.example                  # Exemplo de variáveis de ambiente
├── 📄 .gitignore                    # Arquivos ignorados pelo Git
├── 📄 .eslintrc.json                # Configuração ESLint
├── 📄 .prettierrc                   # Configuração Prettier
├── 📄 tailwind.config.js            # Configuração Tailwind
├── 📄 vite.config.js                # Configuração Vite
├── 📄 package.json                  # Dependências do projeto
├── 📄 README.md                     # README principal
├── 📄 QUICKSTART.md                 # Guia de início rápido
├── 📄 CONTRIBUTING.md               # Guia de contribuição
├── 📄 LICENSE                       # Licença MIT
└── 📄 CHANGELOG.md                  # Histórico de mudanças

```

---

## 📝 Descrição dos Diretórios Principais

### `/src/components/`
Componentes React organizados por categoria:
- **ui/**: Componentes base (Button, Input, Modal)
- **IA/**: Componentes específicos de IA
- **features/**: Features completas (Onboarding, Práticas)
- **layout/**: Componentes de layout (Header, Nav)

### `/src/hooks/`
Custom hooks que encapsulam lógica de negócio:
- Hooks de dados (Supabase)
- Hooks de IA (OpenAI)
- Hooks de utilitários (Timer, etc)

### `/src/lib/`
Bibliotecas e configurações:
- Clientes de APIs (Supabase, OpenAI)
- Funções utilitárias
- Configurações de serviços

### `/src/pages/`
Páginas completas da aplicação:
- Cada página é uma rota
- Compostas por múltiplos components

### `/src/data/`
Dados estáticos e configurações:
- Práticas, fases, conquistas
- Não muda frequentemente
- Pode ser movido para DB depois

### `/database/`
Tudo relacionado ao banco de dados:
- Schema SQL
- Migrações futuras
- Scripts de seed

### `/docs/`
Documentação técnica:
- Guias de setup
- Arquitetura
- APIs

---

## 🎯 Convenções de Nomenclatura

### Arquivos
- Componentes: `PascalCase.jsx` (ex: `ChatInteligente.jsx`)
- Hooks: `camelCase.js` (ex: `useAuth.js`)
- Utilitários: `camelCase.js` (ex: `supabase.js`)
- Constantes: `UPPER_SNAKE_CASE.js` (ex: `API_KEYS.js`)

### Pastas
- `kebab-case` ou `camelCase`
- Singular para utilitários (`lib/`, `data/`)
- Plural para coleções (`components/`, `hooks/`)

### Componentes
```jsx
// ✅ Bom
export const ChatInteligente = () => { ... }

// ❌ Evite
export default function chatInteligente() { ... }
```

### Hooks
```javascript
// ✅ Bom
export const useAuth = () => { ... }

// ❌ Evite
export const AuthHook = () => { ... }
```

---

## 🔄 Fluxo de Dados

```
User Action (UI)
    ↓
Component
    ↓
Custom Hook
    ↓
API Client (Supabase/OpenAI)
    ↓
Database/API
    ↓
Hook updates state
    ↓
Component re-renders
    ↓
UI updates
```

---

## 📦 Adicionando Novos Arquivos

### Novo Componente
```bash
# Criar arquivo
touch src/components/features/NovoComponente.jsx

# Importar onde necessário
import { NovoComponente } from './components/features/NovoComponente';
```

### Novo Hook
```bash
# Criar arquivo
touch src/hooks/useNovoHook.js

# Usar no componente
import { useNovoHook } from '../hooks/useNovoHook';
```

### Nova Prática
```javascript
// Em src/data/praticas.js
export const praticas = [
  ...praticas,
  {
    id: 31,
    titulo: "Nova Prática",
    duracao: 300,
    categoria: "meditacao",
    instrucoes: [...]
  }
];
```

---

## 🧹 Manutenção

### Limpar node_modules
```bash
rm -rf node_modules
npm install
```

### Limpar cache do Vite
```bash
rm -rf node_modules/.vite
npm run dev
```

### Rebuild completo
```bash
rm -rf node_modules dist .vite
npm install
npm run build
```

---

## 📊 Tamanho dos Arquivos

**Limites recomendados:**
- Componente: < 300 linhas
- Hook: < 200 linhas
- Utilitário: < 150 linhas

Se passar, considere dividir em arquivos menores.

---

## 🔍 Encontrando Arquivos

**Principais arquivos que você vai editar:**

**Desenvolvimento diário:**
- `src/App.jsx` - App principal
- `src/pages/Home.jsx` - Dashboard
- `src/components/IA/ChatInteligente.jsx` - Chat

**Configuração:**
- `.env` - Variáveis de ambiente
- `tailwind.config.js` - Cores e tema
- `vite.config.js` - Build config

**Dados:**
- `src/data/praticas.js` - Adicionar práticas
- `database/schema.sql` - Schema do banco

---

**Dúvidas sobre a estrutura? Abra uma issue!** 🙋‍♂️
