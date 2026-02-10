# 📋 KETER Deployment Checklist

Use esta checklist antes e após cada deploy para produção.

## 🔍 Pre-Deploy Checklist

### Código

- [ ] Todos os testes passam (`npm test`)
- [ ] Build local funciona (`npm run build`)
- [ ] ESLint sem erros (`npm run lint`)
- [ ] Code review concluído
- [ ] Branch atualizada com `main`

### Configuração

- [ ] `.env` não está commitado (só `.env.example`)
- [ ] Todas as env vars estão em `.env.example`
- [ ] `vercel.json` configurado corretamente
- [ ] `package.json` sem dependências quebradas

### Database (Supabase)

- [ ] Migrations prontas para rodar
- [ ] Seed scripts testados
- [ ] RLS policies revisadas
- [ ] Backup do banco criado (se já em produção)

### Segurança

- [ ] Nenhum secret hardcoded
- [ ] API keys não expostas no frontend
- [ ] CORS configurado corretamente
- [ ] RLS enabled em todas as tabelas

---

## 🚀 Deploy Steps

### 1. Preparação

- [ ] Versão atualizada em `package.json`
- [ ] CHANGELOG.md atualizado
- [ ] Commit message descritivo

### 2. Vercel

- [ ] Push para `main` (auto-deploy) ou merge de PR
- [ ] Aguardar build completar (2-3 min)
- [ ] Verificar logs de build sem erros

### 3. Env Vars (se necessário)

- [ ] Adicionar/atualizar no Vercel Dashboard
- [ ] Configurar para todos os ambientes
- [ ] Redeploy após mudanças

### 4. Database

- [ ] Rodar migrations no Supabase
- [ ] Rodar seed se for primeiro deploy (`npm run db:seed-prod`)
- [ ] Verificar RLS policies

---

## ✅ Post-Deploy Checklist

### Verificação Imediata (5 min)

- [ ] Site carrega em produção
- [ ] Sem erros no console do browser
- [ ] Vercel Deployment Status: Success
- [ ] Build logs sem warnings críticos

### Teste Funcional (15 min)

#### Auth
- [ ] Signup funciona
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Password reset funciona

#### Core Features
- [ ] Home page carrega práticas
- [ ] Prática pode ser iniciada
- [ ] Timer funciona corretamente
- [ ] Reflexão pode ser salva
- [ ] IA responde no chat
- [ ] Perfil carrega estatísticas

#### PWA
- [ ] Service Worker registra
- [ ] Manifest.json acessível
- [ ] PWA pode ser instalado (mobile)
- [ ] Offline mode básico funciona

#### Performance
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] Lighthouse Best Practices > 90
- [ ] Lighthouse SEO = 100
- [ ] Core Web Vitals: Verde

### Mobile Testing (10 min)

- [ ] Responsivo em mobile (iOS)
- [ ] Responsivo em mobile (Android)
- [ ] Touch gestures funcionam
- [ ] Install prompt aparece
- [ ] PWA instala corretamente

### Monitoramento (5 min)

- [ ] Vercel Analytics ativo
- [ ] Sentry capturando erros (force um teste)
- [ ] Logs aparecem no Supabase
- [ ] Alertas configurados

---

## 🔄 Monitoring (Primeiras 24h)

### Hora 1
- [ ] Checar Vercel Analytics - Tráfego inicial
- [ ] Sentry - Nenhum erro crítico
- [ ] Supabase - Queries executando

### Hora 6
- [ ] Error rate < 1%
- [ ] Performance estável
- [ ] Sem degradação de API

### Hora 24
- [ ] Review de todos os erros no Sentry
- [ ] Performance metrics normalizados
- [ ] Feedback de usuários iniciais coletado

---

## 🐛 Rollback Plan

Se algo der muito errado:

1. **Vercel Dashboard** → **Deployments**
2. Encontre deploy anterior estável
3. **"..."** → **"Promote to Production"**
4. Notifique equipe/usuários se necessário

**OU** (via CLI):

```bash
# Listar deployments
vercel ls

# Promote deploy específico
vercel promote <deployment-url>
```

---

## 📊 Success Metrics

Após deploy, monitore:

| Métrica | Target | Ferramenta |
|---------|--------|-----------|
| Uptime | > 99.9% | Vercel Dashboard |
| Error Rate | < 1% | Sentry |
| Performance Score | > 90 | Lighthouse |
| API Success Rate | > 99% | Supabase Logs |
| Page Load Time | < 3s | Vercel Analytics |
| Crash-Free Sessions | > 99.5% | Sentry |

---

## 🆘 Emergency Contacts

**Critical Issues:**
- Vercel Down: [status.vercel.com](https://status.vercel.com)
- Supabase Down: [status.supabase.com](https://status.supabase.com)
- OpenAI Down: [status.openai.com](https://status.openai.com)

**Support:**
- Vercel: [vercel.com/support](https://vercel.com/support)
- Supabase: Discord [discord.supabase.com](https://discord.supabase.com)
- Sentry: [forum.sentry.io](https://forum.sentry.io)

---

## 📝 Notes

Adicione notas específicas do deploy aqui:

**Deploy [Data]:**
- Versão:
- Features:
- Breaking changes:
- Issues conhecidos:

---

✅ **Checklist completa!** Deploy concluído com sucesso.
