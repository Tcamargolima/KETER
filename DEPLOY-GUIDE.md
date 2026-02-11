# 🚀 KETER - Guia de Deploy em Produção

## 🎯 Quick Start - Início Rápido

Se você quer começar rapidamente, siga estes passos:

### 1. Configurar Ambiente Local

```bash
# 1. Clone o repositório (se ainda não fez)
git clone https://github.com/Tcamargolima/KETER.git
cd KETER

# 2. Crie o arquivo .env.local
cp .env.local.template .env.local

# 3. Edite .env.local e configure suas credenciais:
# - VITE_SUPABASE_URL (da sua conta Supabase)
# - VITE_SUPABASE_ANON_KEY (da sua conta Supabase)
# - VITE_OPENAI_API_KEY (opcional, da sua conta OpenAI)

# 4. Instale as dependências
npm install

# 5. Execute em modo de desenvolvimento
npm run dev

# 6. Teste o build
npm run build
npm run preview
```

### 2. Deploy Rápido no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em "New Project" → Importe o repositório KETER
3. Configure as variáveis de ambiente (mesmas do .env.local)
4. Clique em "Deploy"
5. Aguarde 2-5 minutos
6. ✅ Seu app está no ar!

### 3. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Vá em SQL Editor
3. Execute o arquivo `database/schema.sql` (copie e cole todo o conteúdo)
4. Execute o arquivo `database/rls-policies-production.sql`
5. Execute o arquivo `database/seed-praticas.sql` (opcional, para dados iniciais)
6. Copie a URL e a chave ANON do projeto (Settings → API)

**Modo Offline:** O app funciona com práticas fallback mesmo sem Supabase configurado!

---

## 📋 Checklist Pré-Deploy

Antes de iniciar o deploy, certifique-se de que:

- [x] Código está completo e funcionando em desenvolvimento
- [x] Todas as correções anteriores (CORREÇÃO 01-06) foram aplicadas
- [x] Build local funciona sem erros (`npm run build`)
- [x] Lighthouse score > 90 em todas categorias
- [ ] Conta no Vercel criada
- [ ] Conta no Supabase (projeto de produção) criada
- [ ] Chave da OpenAI disponível
- [ ] Repositório GitHub atualizado

---

## 🗄️ PASSO 1: Configurar Banco de Dados de Produção

### 1.1. Criar Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Configurações recomendadas:
   - **Nome:** `keter-production`
   - **Senha:** Use uma senha forte (salve em local seguro!)
   - **Região:** South America (São Paulo) - `sa-east-1`
   - **Plano:** Free (para começar)

### 1.2. Executar Schema de Produção

1. Acesse o projeto no Supabase Dashboard
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**
4. Abra o arquivo `database/schema.sql` deste repositório
5. Copie TODO o conteúdo
6. Cole no editor SQL
7. Clique em **Run** (ou pressione Ctrl+Enter)
8. Aguarde confirmação de sucesso

✅ Verificar: Vá em **Database → Tables** e confirme que todas as tabelas foram criadas:
- keteros
- avaliacoes_iniciais
- praticas_diarias
- reflexoes_noturnas
- micro_atos
- evolucao_fases
- analises_ia
- conversas_guia
- conquistas
- keteros_conquistas
- circulos
- circulos_membros
- circulos_mensagens

### 1.3. Configurar Row Level Security (RLS)

1. No SQL Editor, clique em **New Query**
2. Abra o arquivo `database/rls-policies-production.sql`
3. Copie TODO o conteúdo
4. Cole no editor SQL
5. Clique em **Run**
6. Aguarde confirmação de sucesso

✅ Verificar RLS está habilitado:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

Todos devem ter `rowsecurity = true`

### 1.4. Dados Iniciais (Opcional)

Se quiser popular com dados iniciais:

**Práticas:**
```bash
# SQL Editor → New Query
# Copiar conteúdo de: database/seed-praticas.sql
# Run
```

**Conquistas:**
```bash
# Se existir seed de conquistas, executar também
```

### 1.5. Obter Credenciais

1. Vá em **Settings → API**
2. Copie e salve:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (começa com `eyJhbG...`)

⚠️ **IMPORTANTE:** Salve essas credenciais em local seguro. Vamos usá-las no Vercel.

---

## 🔐 PASSO 2: Preparar Variáveis de Ambiente

### 2.1. Revisar Template

Abra o arquivo `.env.production.example` e verifique as variáveis necessárias:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_OPENAI_API_KEY=
VITE_APP_NAME=KETER
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_APP_URL=
```

### 2.2. Preparar Valores

Tenha em mãos:
- ✅ Supabase URL (do passo 1.5)
- ✅ Supabase Anon Key (do passo 1.5)
- ✅ OpenAI API Key (da sua conta OpenAI)

---

## 📦 PASSO 3: Testar Build Local

Antes de fazer deploy, teste se o build funciona:

```bash
# Limpar dependências antigas (opcional)
rm -rf node_modules package-lock.json dist

# Instalar dependências
npm install

# Build de produção
npm run build

# Verificar tamanho do bundle
ls -lh dist/

# Preview local
npm run preview
```

Acesse `http://localhost:4173` e teste:
- ✅ App carrega
- ✅ Login funciona (se já tiver dados)
- ✅ Navegação funciona
- ✅ Sem erros no console

Se tudo OK, pode prosseguir! ✅

---

## 🌐 PASSO 4: Deploy no Vercel

### Método 1: Via GitHub (Recomendado)

#### 4.1. Preparar Repositório

```bash
# Verificar status
git status

# Adicionar alterações (se houver)
git add .

# Commit
git commit -m "chore: prepare for production deploy"

# Push
git push origin main
```

#### 4.2. Conectar Vercel ao GitHub

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Sign Up** (ou **Login** se já tiver conta)
3. Escolha **Continue with GitHub**
4. Autorize o Vercel a acessar seus repositórios

#### 4.3. Importar Projeto

1. No Dashboard do Vercel, clique em **New Project**
2. Clique em **Import Git Repository**
3. Encontre e selecione: **Tcamargolima/KETER**
4. Clique em **Import**

#### 4.4. Configurar Build

O Vercel deve detectar automaticamente as configurações do `vercel.json`, mas verifique:

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x
```

#### 4.5. Adicionar Environment Variables

**MUITO IMPORTANTE!** Antes de fazer deploy:

1. Expanda **Environment Variables**
2. Adicione TODAS as variáveis:

| Name | Value | Environments |
|------|-------|--------------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbG...` | Production, Preview, Development |
| `VITE_OPENAI_API_KEY` | `sk-proj-...` | Production, Preview, Development |
| `VITE_APP_NAME` | `KETER` | Production, Preview, Development |
| `VITE_APP_VERSION` | `1.0.0` | Production, Preview, Development |
| `VITE_APP_ENV` | `production` | Production |
| `VITE_APP_URL` | *(deixe vazio por ora)* | Production |

⚠️ **ATENÇÃO:**
- Marque SEMPRE: ✅ Production ✅ Preview ✅ Development
- Valores sensíveis (OpenAI Key) não serão expostos publicamente
- Variáveis com `VITE_` são injetadas no build

#### 4.6. Deploy!

1. Clique em **Deploy**
2. Aguarde 2-5 minutos
3. Vercel mostrará:
   - ✅ Installing dependencies
   - ✅ Building application
   - ✅ Deploying
   - 🎉 **Success!**

Você receberá uma URL como:
```
https://keter-xxx.vercel.app
```

### Método 2: Via CLI (Alternativo)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Para produção
vercel --prod
```

---

## ✅ PASSO 5: Pós-Deploy

### 5.1. Testar em Produção

Acesse a URL fornecida pelo Vercel e teste:

- [ ] App carrega sem erros
- [ ] Pode fazer signup
- [ ] Pode fazer login
- [ ] Dashboard mostra interface
- [ ] Práticas são exibidas
- [ ] Timer funciona
- [ ] Chat IA responde (se implementado)
- [ ] PWA pode ser instalado (Chrome: ícone de instalação na barra de URL)
- [ ] Funciona offline (após primeira visita)

### 5.2. Atualizar VITE_APP_URL

Agora que temos a URL final:

1. Vercel Dashboard → Projeto KETER
2. **Settings → Environment Variables**
3. Encontre `VITE_APP_URL`
4. Edite e adicione: `https://keter-xxx.vercel.app` (sua URL real)
5. Clique em **Save**
6. Vá em **Deployments**
7. No último deployment, clique nos **3 pontos** → **Redeploy**
8. Aguarde novo deploy finalizar

### 5.3. Lighthouse Score

1. Abra o app em produção
2. DevTools → Lighthouse
3. Selecione: Performance, Accessibility, Best Practices, SEO, PWA
4. Clique em **Analyze page load**
5. Verifique scores > 90

### 5.4. Configurar Domínio Customizado (Opcional)

Se você tiver um domínio próprio (ex: `keter.center`):

1. Vercel Dashboard → Settings → **Domains**
2. Clique em **Add**
3. Digite seu domínio: `keter.center`
4. Siga instruções de DNS
5. Adicione registros no seu provedor de DNS:
   - **Tipo A:** `@` → `76.76.21.21`
   - **Tipo CNAME:** `www` → `cname.vercel-dns.com`
6. Aguarde propagação (pode levar até 48h)

Vercel automaticamente:
- ✅ Redireciona HTTP → HTTPS
- ✅ Provisiona certificado SSL
- ✅ Redireciona vercel.app → seu domínio

---

## 📊 PASSO 6: Monitoramento (Opcional)

### 6.1. Vercel Analytics (Built-in)

Já está ativo automaticamente! Veja em:
- Dashboard → Projeto → **Analytics**

Métricas disponíveis:
- Page views
- Unique visitors
- Performance (Web Vitals)
- Geographic distribution

### 6.2. Sentry (Error Tracking)

Para rastreamento de erros:

1. Crie conta em [sentry.io](https://sentry.io)
2. Crie projeto React
3. Copie o DSN
4. Adicione em Environment Variables no Vercel:
   - `VITE_SENTRY_DSN` = seu DSN
5. Redeploy

O código já está preparado para usar Sentry (dependência instalada).

### 6.3. Google Analytics (Opcional)

1. Crie conta em [analytics.google.com](https://analytics.google.com)
2. Obtenha tracking ID (formato: `G-XXXXXXXXXX`)
3. Adicione script no `index.html` ou configure via env var

---

## 🔄 PASSO 7: Atualizações Futuras

### Processo de Update

```bash
# 1. Fazer alterações localmente
# 2. Testar em dev
npm run dev

# 3. Testar build
npm run build
npm run preview

# 4. Commit e push
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# 5. Vercel auto-deploya automaticamente!
# 6. Verificar em produção
```

### Rollback (se algo der errado)

1. Vercel Dashboard → **Deployments**
2. Encontre deployment anterior estável
3. Clique nos **3 pontos** → **Promote to Production**

---

## 🐛 Troubleshooting

### Problema: Build falha no Vercel

**Sintomas:** Erro durante build, página de erro

**Soluções:**
```bash
# Verificar:
1. Todas dependências em package.json
2. Build local funciona (npm run build)
3. Node version no package.json (engines)
4. Logs do Vercel (Deployments → Failed → View Logs)
```

### Problema: App carrega mas não funciona

**Sintomas:** Página carrega, mas login/funcionalidades falham

**Soluções:**
```bash
# Verificar env vars:
1. Settings → Environment Variables
2. Todas começam com VITE_?
3. Valores corretos?
4. Todas marcadas para Production?
5. Após alterar → Redeploy
```

### Problema: PWA não instala

**Sintomas:** Botão de instalação não aparece

**Soluções:**
```bash
1. Verificar HTTPS (Vercel dá automaticamente)
2. DevTools → Application → Manifest
3. DevTools → Application → Service Workers
4. Lighthouse → PWA score
```

### Problema: Performance ruim

**Sintomas:** App lento, Lighthouse score < 90

**Soluções:**
```bash
1. Verificar bundle size (dist/)
2. Code splitting ativado?
3. Imagens otimizadas?
4. Cache configurado?
5. Revisar vite.config.js
```

---

## 📋 Checklist Final

### Antes do Deploy
- [x] Fases 1-6 completas
- [x] Build local funciona
- [x] Lighthouse > 90
- [x] Variáveis de ambiente preparadas
- [x] Banco de produção configurado
- [x] RLS habilitado

### Durante Deploy
- [ ] Projeto criado no Vercel
- [ ] Repositório conectado
- [ ] Environment variables configuradas
- [ ] Build executado com sucesso

### Após Deploy
- [ ] App carrega
- [ ] Login/Signup funciona
- [ ] Funcionalidades operacionais
- [ ] PWA instala
- [ ] Performance OK
- [ ] Domínio configurado (se aplicável)

---

## 🎉 Conclusão

Se todos os passos foram seguidos, seu KETER está:

✅ **Em produção** → URL pública  
✅ **Seguro** → RLS + HTTPS  
✅ **Performático** → PWA + Otimizações  
✅ **Escalável** → Vercel + Supabase  

### Links Importantes

- **App em Produção:** (preencher após deploy)
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **Repositório:** https://github.com/Tcamargolima/KETER

---

**Deploy realizado em:** ___/___/2026  
**URL de produção:** https://_____.vercel.app  
**Versão:** 1.0.0  

🚀 **KETER está no ar!** 🎉
