# KETER - Evolução Pessoal

App de autoconhecimento e disciplina.

## Setup de Produção

### 1. Requisitos
- Node.js 18+
- Supabase Project

### 2. Variáveis de Ambiente (.env.local)

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_OPENAI_API_KEY removida - Usar Edge Functions
```

### 3. Supabase Setup
1. Rodar migrações:
   Acesse o SQL Editor do Supabase e cole o conteúdo de `supabase/migrations/20240101000000_initial_schema.sql`.

2. Deploy Edge Functions:
   ```bash
   npx supabase functions deploy ai-chat
   npx supabase functions deploy ai-recommendation
   ```
   Configure `OPENAI_API_KEY` nos segredos das funções do Supabase.

### 4. PWA
O App é instalável. Certifique-se de servir via HTTPS em produção.

### 5. Comandos
```bash
# Rodar local
pnpm dev

# Testes E2E
npx playwright test

# Build
pnpm build
```

## Arquitetura
- **Frontend**: Vite + React
- **Backend**: Supabase (Auth, DB, Realtime, Edge Functions)
- **AI**: OpenAI via Supabase Edge Functions (Seguro)
