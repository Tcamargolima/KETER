# 🚀 Guia Rápido - Círculos (Fase 11)

## Setup Rápido (5 minutos)

### 1. Executar Migration
```sql
-- No Supabase SQL Editor, copie e execute todo o conteúdo de:
database/migrations/add-circles-phase-11.sql
```

### 2. Verificar Instalação
```bash
npm install
npm run build
npm run dev
```

### 3. Acessar
```
http://localhost:5173/circulos
```

## ✨ Features Prontas para Usar

### 📱 Interface
- ✅ Lista de círculos (públicos + meus)
- ✅ Criar novo círculo (limite: 3 por usuário)
- ✅ Chat em tempo real
- ✅ Modo anônimo
- ✅ Editar/Deletar mensagens
- ✅ Lista de membros

### 🔒 Segurança
- ✅ RLS (Row Level Security) completo
- ✅ Apenas membros podem ler/escrever
- ✅ Owners podem moderar
- ✅ Soft delete de mensagens

### ⚡ Real-time
- ✅ Supabase Realtime integrado
- ✅ Mensagens aparecem instantaneamente
- ✅ Atualização automática de membros
- ✅ Subscribe/unsubscribe automático

## 🎯 Como Usar

### Como Usuário

**1. Explorar Círculos**
```
Home → Card "Círculos 🌟" → Explorar
ou
Acesse diretamente: /circulos
```

**2. Entrar em um Círculo**
```
Lista de Círculos → Card do círculo → Botão "Entrar"
```

**3. Enviar Mensagem**
```
Círculo → Digite mensagem → Toggle "Anônimo" (opcional) → Enviar
```

**4. Criar Círculo**
```
Lista de Círculos → Botão "Criar Círculo" → Preencher formulário → Criar
```

### Como Desenvolvedor

**1. Usar o Hook de Círculos**
```javascript
import { useCirculos } from '../hooks/useCirculos';

function MyComponent({ userId }) {
  const {
    circulos,
    meusCirculos,
    loading,
    criarCirculo,
    entrarCirculo,
    sairCirculo
  } = useCirculos(userId);

  // Usar dados...
}
```

**2. Usar o Hook de Chat**
```javascript
import { useCirculoChat } from '../hooks/useCirculoChat';

function ChatComponent({ circuloId, userId }) {
  const {
    mensagens,
    membros,
    enviarMensagem,
    deletarMensagem,
    editarMensagem
  } = useCirculoChat(circuloId, userId);

  // Implementar chat...
}
```

**3. Helpers Supabase**
```javascript
import {
  getCirculos,
  createCirculo,
  joinCirculo,
  leaveCirculo,
  getCirculoMensagens,
  sendCirculoMensagem,
  subscribeToCirculoMensagens
} from '../lib/supabase';

// Usar helpers...
```

## 🧪 Teste Rápido

### Teste 1: Real-time (2 tabs)
1. Abra http://localhost:5173/circulos em 2 tabs
2. Entre no mesmo círculo em ambas
3. Envie mensagem em uma → deve aparecer na outra instantaneamente ✨

### Teste 2: Modo Anônimo
1. Entre em um círculo
2. Toggle "Anônimo" → ON
3. Envie mensagem → deve aparecer como "Anônimo" 🎭

### Teste 3: Criar Círculo
1. Clique em "Criar Círculo"
2. Preencha: Nome = "Teste", Fase = 1, Cor = Purple
3. Criar → deve aparecer em "Meus Círculos" ✅

## 🎨 Círculos Pré-configurados

Após executar a migration, você terá 6 círculos de exemplo:

1. **Primeiros Passos 🌱** - Fase 1 (verde)
2. **Reflexões Diárias ☀️** - Fase 1 (âmbar)
3. **Práticas em Grupo 🧘** - Fase 2 (roxo)
4. **Micro Atos de Bondade 💚** - Fase 3 (esmeralda)
5. **Evolução Contínua 📈** - Fase 4 (azul)
6. **Comunidade Geral 🌟** - Todas as fases (violeta)

## 🔧 Customização Rápida

### Alterar Limite de Círculos por Usuário
```javascript
// src/hooks/useCirculos.js, linha ~78
if (count >= 3) { // Altere 3 para o número desejado
```

### Alterar Limite de Membros por Círculo
```sql
-- database/migrations/add-circles-phase-11.sql, linha ~19
max_membros INTEGER DEFAULT 50 -- Altere 50 para o número desejado
```

### Adicionar Nova Cor de Tema
```javascript
// src/components/features/CreateCirculoModal.jsx, linha ~16
const cores = [
  // ... cores existentes
  { value: 'red', label: 'Vermelho', class: 'bg-red-500' }
];
```

### Adicionar Nova Fase
```javascript
// src/components/features/CreateCirculoModal.jsx, linha ~27
const fases = [
  // ... fases existentes
  { value: '5', label: 'Fase 5 - Sua Fase' }
];
```

## 🐛 Problemas Comuns

### ❌ "Círculo não encontrado"
**Causa:** Migration não executada  
**Solução:** Execute `database/migrations/add-circles-phase-11.sql`

### ❌ "Não consigo entrar no círculo"
**Causa:** RLS bloqueando ou círculo cheio  
**Solução:** Verifique RLS policies e limite de membros

### ❌ "Mensagens não aparecem em tempo real"
**Causa:** Supabase Realtime não configurado  
**Solução:** Habilite Realtime no Supabase Dashboard

### ❌ "Erro ao criar círculo"
**Causa:** Limite de 3 círculos atingido  
**Solução:** Delete um círculo existente ou aumente o limite

## 📊 Estrutura de Arquivos

```
KETER/
├── database/
│   └── migrations/
│       └── add-circles-phase-11.sql     # Migration completa
├── src/
│   ├── components/features/
│   │   ├── ChatRoom.jsx                 # Interface de chat
│   │   ├── CirculosList.jsx             # Lista de círculos
│   │   ├── MessageBubble.jsx            # Componente de mensagem
│   │   └── CreateCirculoModal.jsx       # Modal de criação
│   ├── hooks/
│   │   ├── useCirculos.js               # Hook de círculos
│   │   └── useCirculoChat.js            # Hook de chat
│   ├── lib/
│   │   └── supabase.js                  # Helpers Supabase (atualizado)
│   └── pages/
│       └── Circulos/
│           └── index.jsx                # Página principal
└── CIRCULOS-FASE-11-DOCS.md             # Documentação completa
```

## 🎯 Checklist de Implementação

- [x] Migration do banco de dados
- [x] RLS policies configuradas
- [x] Hooks customizados criados
- [x] Componentes React implementados
- [x] Rotas adicionadas ao App.jsx
- [x] Navegação na Home
- [x] Real-time configurado
- [x] Modo anônimo funcionando
- [x] Sistema de permissões
- [x] Build funcionando
- [x] Documentação completa

## 🎉 Pronto!

Agora você tem um sistema completo de comunidades em tempo real! 🚀

Para mais detalhes, veja: `CIRCULOS-FASE-11-DOCS.md`

---

**Dúvidas?** Abra uma issue no GitHub!
