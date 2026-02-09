# 📋 Vercel Deployment Guide - Manual Steps

Este documento detalha os passos manuais necessários no Vercel Dashboard após o deploy automático.

## 🚀 Deploy Inicial

### 1. Conectar Repositório ao Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Faça login com GitHub
3. Clique em "Import Git Repository"
4. Selecione `Tcamargolima/KETER`
5. Clique em "Import"

### 2. Configurar Build Settings

**Framework Preset:** Vite  
**Root Directory:** `./` (deixe vazio)  
**Build Command:** `npm run build` (auto-detectado)  
**Output Directory:** `dist` (auto-detectado)  
**Install Command:** `npm install` (auto-detectado)  

✅ Clique em "Deploy" (primeira vez levará 2-3 minutos)

---

## 🔐 Configurar Environment Variables

Após o primeiro deploy, configure as variáveis de ambiente:

### No Vercel Dashboard:

1. Vá em **Settings** → **Environment Variables**
2. Adicione cada variável abaixo:

#### Variáveis Obrigatórias

| Nome da Variável | Valor | Onde Obter |
|------------------|-------|------------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | [Supabase Dashboard](https://app.supabase.com) → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` | Supabase Dashboard → Settings → API → Project API Keys → `anon` `public` |
| `VITE_OPENAI_API_KEY` | `sk-proj-...` | [OpenAI Platform](https://platform.openai.com/api-keys) → Create new key |

#### Variáveis Opcionais

| Nome da Variável | Valor | Onde Obter |
|------------------|-------|------------|
| `VITE_SENTRY_DSN` | `https://xxx@xxx.ingest.sentry.io/xxx` | [Sentry.io](https://sentry.io) → Create Project → Settings → Client Keys (DSN) |
| `VITE_APP_VERSION` | `1.0.0` | Versão atual do app |
| `VITE_APP_URL` | `https://keter.vercel.app` | URL final do app |

### ⚠️ Importante:

- Configure para **todos os ambientes**: Production, Preview, Development
- Use o checkbox "All Environments" ao adicionar cada variável
- Após adicionar todas as variáveis, clique em **"Redeploy"** para aplicar

---

## 🌍 Configurar Domínio Customizado (Opcional)

Se você possui um domínio (ex: `keter.center`):

### No Vercel Dashboard:

1. Vá em **Settings** → **Domains**
2. Clique em "Add"
3. Digite seu domínio: `keter.center`
4. Configure também `www.keter.center` (recomendado)

### No seu provedor de DNS:

Adicione os registros DNS conforme instruído pelo Vercel:

**Opção 1: Usar Nameservers do Vercel (Recomendado)**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Opção 2: Adicionar registros A/CNAME**
```
A Record:    @ → 76.76.21.21
CNAME Record: www → cname.vercel-dns.com
```

⏱️ Propagação DNS leva até 24-48 horas

---

## 📊 Ativar Vercel Analytics

### Speed Insights (Core Web Vitals)

1. Vercel Dashboard → **Analytics** → **Speed Insights**
2. Clique em **"Enable Speed Insights"**
3. ✅ Automático - sem código adicional necessário

### Web Analytics (Visitors & Traffic)

1. Vercel Dashboard → **Analytics** → **Web Analytics**
2. Clique em **"Enable Web Analytics"**
3. ✅ Automático - já configurado via Vite

**Métricas disponíveis:**
- Page Views
- Unique Visitors
- Top Pages
- Top Referrers
- Devices & Browsers
- Real User Monitoring (RUM)

---

## 🐛 Configurar Sentry (Error Monitoring)

### 1. Criar Conta Sentry

1. Acesse [sentry.io](https://sentry.io/signup/)
2. Faça signup (grátis para 5K errors/mês)
3. Confirme email

### 2. Criar Projeto

1. Clique em **"Create Project"**
2. Selecione **React** como plataforma
3. Nome do projeto: `keter-production`
4. Time/Organization: Use o padrão ou crie um
5. Clique em **"Create Project"**

### 3. Obter DSN

1. Após criar projeto, você verá o **DSN**
2. Copie a URL completa:
   ```
   https://abc123def456@o123456.ingest.sentry.io/7654321
   ```
3. Adicione no Vercel como `VITE_SENTRY_DSN`

### 4. Configurar Alertas (Opcional)

1. Sentry Dashboard → **Settings** → **Alerts**
2. Crie regra: "Alert on every new issue"
3. Configure notificações (email, Slack, Discord)

### 5. Testar Sentry

Após redeploy, force um erro para testar:

```javascript
// No console do navegador em produção
throw new Error("Teste Sentry - erro proposital");
```

Verifique se aparece no Sentry Dashboard em ~30 segundos.

---

## 🔔 Configurar Supabase Webhooks (Opcional)

Para receber alertas de erros críticos do banco:

### 1. No Supabase Dashboard:

1. Vá em **Database** → **Webhooks**
2. Clique em **"Create a new webhook"**
3. Configure:
   - **Name:** `error-alerts`
   - **Table:** `reflexoes` ou `praticas`
   - **Events:** INSERT, UPDATE (conforme necessidade)
   - **Type:** HTTP Request
   - **URL:** Endpoint de webhook (Discord, Slack, ou custom)

### 2. Exemplos de Endpoints:

**Discord:**
```
https://discord.com/api/webhooks/YOUR_WEBHOOK_URL
```

**Slack:**
```
https://hooks.slack.com/services/YOUR_WEBHOOK_URL
```

**Custom (Vercel Serverless Function):**
Crie em `/api/webhooks/supabase.js` se necessário

---

## 🔒 Verificar Segurança (Row Level Security)

### Checklist de Segurança:

1. **No Supabase Dashboard:**
   - Vá em **Authentication** → **Policies**
   - ✅ Verifique que **RLS está ENABLED** em todas as tabelas
   - ✅ Policies existem para cada tabela

2. **Tabelas que DEVEM ter RLS:**
   - ✅ `praticas`
   - ✅ `reflexoes`
   - ✅ `usuarios`
   - ✅ `micro_atos`
   - ✅ `circulos`
   - ✅ `circulos_membros`
   - ✅ `circulos_mensagens`
   - ✅ `notifications`
   - ✅ E todas as outras tabelas

3. **Testar RLS:**
   ```sql
   -- No SQL Editor do Supabase, teste:
   SELECT * FROM praticas;
   -- Deve retornar apenas dados que o usuário atual pode ver
   ```

---

## ✅ Post-Deploy Testing Checklist

Após deploy, teste manualmente:

### Funcionalidades Core

- [ ] Página inicial carrega (`https://keter.vercel.app`)
- [ ] Signup funciona
- [ ] Login funciona
- [ ] Práticas são listadas
- [ ] Timer de prática funciona
- [ ] Reflexão noturna funciona
- [ ] Chat com IA funciona
- [ ] Perfil carrega dados

### PWA

- [ ] PWA pode ser instalado (mobile)
- [ ] Service Worker registra (check DevTools)
- [ ] App funciona offline (básico)
- [ ] Notificações funcionam

### Performance

- [ ] Lighthouse Score > 90 (Performance)
- [ ] Lighthouse Score > 90 (Accessibility)
- [ ] Lighthouse Score > 90 (Best Practices)
- [ ] Lighthouse Score = 100 (SEO)

### Monitoramento

- [ ] Vercel Analytics está trackando
- [ ] Sentry captura erros (force um erro de teste)
- [ ] Logs aparecem no Vercel Dashboard

---

## 🔄 Continuous Deployment

### Auto-Deploy Configurado

✅ Já está configurado! Toda vez que você fizer push para `main`:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

**Vercel automaticamente:**
1. Detecta o push
2. Roda `npm install`
3. Roda `npm run build`
4. Faz deploy
5. Notifica via email/Slack

### Preview Deployments

Toda Pull Request gera um deploy de preview:

1. Crie uma PR no GitHub
2. Vercel comenta na PR com URL de preview
3. Teste antes de mergear
4. Após merge, vai para produção automaticamente

---

## 🆘 Troubleshooting

### Build Falha

**Erro:** `Module not found`
- **Solução:** Verifique que todas as dependências estão no `package.json`
- Rode localmente: `npm install && npm run build`

**Erro:** `Environment variable not defined`
- **Solução:** Configure a env var no Vercel e **Redeploy**

### App carrega mas features não funcionam

**Supabase não conecta:**
- Verifique `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- Certifique-se que começam com `VITE_`
- Redeploy após alterar

**OpenAI não responde:**
- Verifique `VITE_OPENAI_API_KEY`
- Confirme créditos na conta OpenAI
- Verifique rate limits

### Sentry não captura erros

- Verifique `VITE_SENTRY_DSN` configurado
- Redeploy após adicionar
- Force um erro de teste no console

---

## 📈 Monitorando Erros Iniciais

### Primeiros 7 dias:

1. **Vercel Dashboard:**
   - Cheque **Deployments** diariamente
   - Verifique **Analytics** para tráfego

2. **Sentry:**
   - Configure alertas para **todos** os novos erros
   - Revise diariamente
   - Priorize erros que afetam funcionalidades core

3. **Supabase:**
   - Vá em **Logs** → **Error Logs**
   - Monitore queries lentas
   - Verifique conexões

### Métricas de Sucesso:

- **Error Rate:** < 1% das sessões
- **Crash-Free Rate:** > 99.5%
- **API Success Rate:** > 99%
- **Core Web Vitals:** All Green

---

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Convide beta testers
2. 📊 Monitore métricas 24/7 (primeira semana)
3. 🐛 Corrija bugs críticos imediatamente
4. 📱 Teste em diferentes dispositivos
5. 🌍 Configure CDN/Edge se necessário
6. 💰 Monitore custos (Vercel, Supabase, OpenAI)

---

## 📞 Suporte

**Vercel Support:**
- [Documentação](https://vercel.com/docs)
- [Discord](https://vercel.com/discord)

**Supabase Support:**
- [Documentação](https://supabase.com/docs)
- [Discord](https://discord.supabase.com)

**Sentry Support:**
- [Documentação](https://docs.sentry.io)
- [Forum](https://forum.sentry.io)

---

**Desenvolvido com ❤️ para transformar vidas**
