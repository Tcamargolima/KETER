# ================================================
# KETER - GUIA DE SETUP DO SUPABASE
# ================================================

## 📋 PASSO A PASSO

### 1. Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Clique em "Start your project"
3. Crie uma conta (ou faça login)
4. Clique em "New Project"
5. Preencha:
   - Nome: "KETER"
   - Database Password: (escolha uma senha forte)
   - Region: South America (São Paulo)
6. Aguarde ~2 minutos (criação do projeto)

### 2. Executar o Schema SQL

1. No dashboard do Supabase, vá em "SQL Editor" (menu lateral)
2. Clique em "New query"
3. Copie TODO o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor
5. Clique em "Run" (ou Ctrl+Enter)
6. Aguarde mensagem de sucesso
7. Verifique se todas as tabelas foram criadas:
   - Vá em "Table Editor"
   - Deve ver 13 tabelas criadas

### 3. Obter Credenciais

1. No dashboard, vá em "Settings" > "API"
2. Copie as seguintes credenciais:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon public** key (a chave pública)

### 4. Configurar Variáveis de Ambiente

#### Para Lovable/Vite:
Crie arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

#### Para Next.js:
Crie arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

⚠️ **IMPORTANTE:**
- Nunca commite o arquivo `.env` no Git
- Adicione `.env` no `.gitignore`
- A chave `anon` é segura para uso no frontend

### 5. Instalar Dependências

```bash
npm install @supabase/supabase-js
```

### 6. Estrutura de Arquivos

Organize os arquivos assim:

```
/src
  /lib
    supabase.js          # Cliente e helpers
  /hooks
    useAuth.js           # Hooks de autenticação
    useKetero.js         # Hook do perfil
    usePraticas.js       # Hook de práticas
    useReflexoes.js      # Hook de reflexões
    useConquistas.js     # Hook de conquistas
    useGuia.js           # Hook do chat IA
  /contexts
    AuthContext.js       # Contexto global
```

### 7. Configurar Storage (Opcional - para fotos)

1. No Supabase, vá em "Storage"
2. Clique em "Create bucket"
3. Nome: "profiles"
4. Public: ✅ (habilitado)
5. Clique em "Create bucket"

### 8. Testar Conexão

No console do navegador, teste:

```javascript
import { supabase } from './lib/supabase';

// Testar conexão
const { data, error } = await supabase.from('keteros').select('count');
console.log('Conexão OK:', data);
```

## 🔐 SEGURANÇA

### Row Level Security (RLS)

O schema já vem com políticas de segurança:
- Usuários só veem seus próprios dados
- Autenticação obrigatória para a maioria das operações
- Proteção automática contra SQL injection

### Autenticação

Email/senha é configurado automaticamente.

Para adicionar outros provedores:
1. Vá em "Authentication" > "Providers"
2. Habilite Google, GitHub, etc.
3. Configure as credenciais OAuth

## 📊 MONITORAMENTO

### Database
- "Database" > "Tables" - Ver dados
- "Database" > "Logs" - Logs de queries
- "Database" > "Roles" - Gerenciar permissões

### Authentication
- "Authentication" > "Users" - Ver usuários registrados
- "Authentication" > "Policies" - Ver políticas RLS

### API
- "Settings" > "API" - Documentação auto-gerada
- Toda tabela tem endpoint REST automático

## 🚀 PRÓXIMOS PASSOS

Depois de configurar o Supabase:

1. ✅ Atualizar app React para usar hooks do Supabase
2. ✅ Testar fluxo de signup/login
3. ✅ Testar salvamento de práticas
4. ✅ Integrar IA (Fase 2)
5. ✅ Deploy do app

## 🐛 TROUBLESHOOTING

### Erro: "Invalid API Key"
- Verifique se copiou a chave `anon public` correta
- Certifique-se que está usando VITE_SUPABASE_ANON_KEY (não a service_role)

### Erro: "row-level security policy"
- Certifique-se que executou todo o schema SQL
- Verifique se o usuário está autenticado

### Erro: "relation does not exist"
- Execute o schema SQL novamente
- Verifique se está no projeto correto do Supabase

### Dados não aparecem
- Abra o Network tab do DevTools
- Veja se as requests estão indo para o Supabase
- Verifique os logs no Supabase Dashboard

## 📞 SUPORTE

- Documentação: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues

## ⚡ DICAS DE PERFORMANCE

1. **Índices**: O schema já inclui índices nas colunas mais consultadas
2. **Realtime**: Use com moderação (só para dados que mudam frequentemente)
3. **Cache**: Considere usar React Query para cache de dados
4. **Paginação**: Para listas grandes, use `.range(0, 9)` do Supabase

## 💰 CUSTOS

**Free Tier (suficiente para MVP):**
- 500 MB de database
- 1 GB de file storage
- 50.000 usuários autenticados
- 2 GB de bandwidth

**Quando escalar:**
- Pro Plan: $25/mês
- Upgrade conforme necessidade

## ✅ CHECKLIST FINAL

- [ ] Projeto Supabase criado
- [ ] Schema SQL executado (13 tabelas)
- [ ] Credenciais copiadas
- [ ] Arquivo .env criado
- [ ] Dependência instalada
- [ ] Conexão testada
- [ ] Signup/Login testado
- [ ] Primeira prática salva
- [ ] RLS funcionando

**Parabéns! Seu backend está pronto! 🎉**
