# 📊 Monitoring Guide - KETER Production

Guia completo de monitoramento em produção para o app KETER.

## 🎯 Overview

O KETER utiliza uma stack de monitoramento multi-camada:

1. **Vercel Analytics** - Performance e tráfego
2. **Sentry** - Error tracking e performance
3. **Supabase Logs** - Database e API
4. **Browser Console** - Client-side debugging (dev)

---

## 📈 Vercel Analytics

### Speed Insights (Core Web Vitals)

**O que monitora:**
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- FCP (First Contentful Paint)
- TTFB (Time to First Byte)

**Targets:**
- LCP: < 2.5s (verde)
- FID: < 100ms (verde)
- CLS: < 0.1 (verde)

**Como acessar:**
1. Vercel Dashboard → Analytics → Speed Insights
2. Visualize por página, device, location

**Alertas:**
- Configure em Settings → Notifications
- Email quando métricas degradam

### Web Analytics (Tráfego)

**Métricas:**
- Total Page Views
- Unique Visitors
- Top Pages
- Traffic Sources
- Devices & Browsers
- Geographic Distribution

**Como usar:**
1. Identifique páginas mais visitadas
2. Otimize as top 5 páginas
3. Monitore bounce rate
4. Analise conversão signup

---

## 🐛 Sentry - Error Monitoring

### Setup Diário

**1. Revisar Errors (Manhã - 10 min)**

Dashboard → Issues → Filter: `is:unresolved`

Priorize:
- 🔴 **Critical:** App crash, auth failure
- 🟡 **High:** Feature não funciona, data loss
- 🟢 **Medium:** UI glitch, performance degradation
- ⚪ **Low:** Edge cases, minor bugs

**2. Assign & Track**

Para cada erro crítico/high:
1. Assign para desenvolvedor
2. Link para issue no GitHub
3. Set status: In Progress / Fixed
4. Add release tag quando corrigido

### Configurações Recomendadas

**Alerts:**
- Nova issue detectada (email/Slack imediato)
- Spike de errors (> 10 em 5 min)
- Regression (erro que voltou)

**Filtros úteis:**
```
# Errors de produção apenas
is:unresolved environment:production

# Errors que afetam muitos usuários
is:unresolved users:>10

# Errors recentes (últimas 24h)
is:unresolved age:-24h

# Errors em página específica
is:unresolved url:*/circulos*
```

### Performance Monitoring

**Transaction Metrics:**
- API calls duration
- Database queries
- Frontend page loads

**Alerts:**
- Transaction > 5s (slow)
- Database query > 2s (otimizar)

### Session Replay

**Quando usar:**
- Erro difícil de reproduzir
- Bug reportado por usuário
- UX issue

**Como usar:**
1. Encontre issue no Sentry
2. Aba "Replays"
3. Assista sessão do usuário antes do erro
4. Identifique steps para reproduzir

**⚠️ Privacy:**
- Textos são mascarados por padrão
- Não grava senhas/cartões
- GDPR compliant

---

## 🗄️ Supabase Monitoring

### Database Logs

**Acessar:**
Supabase Dashboard → Logs → Postgres Logs

**O que monitorar:**
- Slow queries (> 1s)
- Failed queries
- Connection errors
- Deadlocks

**Queries úteis:**

```sql
-- Top 10 queries mais lentas (última hora)
SELECT 
  query,
  mean_exec_time,
  calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Tabelas com mais lock waits
SELECT 
  schemaname,
  tablename,
  seq_scan,
  idx_scan
FROM pg_stat_user_tables
ORDER BY seq_scan DESC;
```

### API Logs

**Acessar:**
Supabase Dashboard → Logs → API Logs

**Filtros:**
- Status Code: 4xx, 5xx
- Path: /rest/v1/praticas
- Method: POST, PUT, DELETE

**Alerts:**
- 5xx errors > 1%
- Rate limit atingido
- Auth failures spike

### Realtime Logs

**Monitore:**
- Websocket connections
- Message delivery failures
- Broadcast errors

---

## 🔔 Alerting Strategy

### Níveis de Severidade

#### 🚨 P0 - Critical (Imediato)
**Resposta:** < 15 min  
**Notificação:** Phone call + Slack + Email

**Triggers:**
- App completamente down (> 1 min)
- Database down
- Auth system failure
- Data loss detectado
- Security breach

#### 🔴 P1 - High (< 1h)
**Resposta:** < 1 hora  
**Notificação:** Slack + Email

**Triggers:**
- Feature core não funciona
- Error rate > 5%
- Performance degradation > 50%
- Signup/Login failing

#### 🟡 P2 - Medium (< 1 dia)
**Resposta:** < 24 horas  
**Notificação:** Email

**Triggers:**
- Non-critical feature failing
- Error rate > 1%
- Performance degradation > 20%
- UI glitches

#### 🟢 P3 - Low (< 1 semana)
**Resposta:** Next sprint  
**Notificação:** Backlog

**Triggers:**
- Edge case errors
- Minor performance issues
- Cosmetic bugs

### On-Call Rotation

**Período:** 24/7 coverage  
**Turnos:** 1 semana por pessoa  
**Handoff:** Segundas 9h

**On-call deve:**
- Responder P0 em 15 min
- Revisar Sentry 2x/dia
- Atualizar status page se necessário

---

## 📊 Dashboards Recomendados

### Daily Health Dashboard

Crie um dashboard com:

**Performance:**
- Lighthouse scores (últimas 24h)
- Core Web Vitals
- API response times

**Errors:**
- Total errors (últimas 24h)
- Error rate %
- Top 5 errors

**Usage:**
- Daily Active Users (DAU)
- New signups
- Practices completed

**Infrastructure:**
- Vercel bandwidth used
- Supabase DB size
- OpenAI API calls

### Tools:

- **Grafana** - Open source (se quiser)
- **Datadog** - Paid (overkill para MVP)
- **Google Sheets** - Manual mas funcional
- **Notion** - Boa para dashboard visual

---

## 🔍 Debugging Production Issues

### Fluxo recomendado:

1. **Identifique o problema**
   - Sentry alert
   - User report
   - Analytics anomaly

2. **Gather context**
   - Sentry error details
   - User session replay
   - Supabase logs (timestamp)
   - Vercel deployment logs

3. **Reproduza localmente**
   - Use dados reais (anonimizados)
   - Simule condições de produção
   - Check browser/device específico

4. **Fix & Deploy**
   - Create hotfix branch
   - Test locally
   - Deploy to preview
   - Merge to main
   - Monitor rollout

5. **Verify & Close**
   - Confirm fix em produção
   - Check Sentry issue resolved
   - Update user if necessário
   - Post-mortem se P0/P1

---

## 📝 Post-Mortem Template

Para incidentes P0/P1, documente:

```markdown
# Post-Mortem: [Título do Incidente]

**Data:** YYYY-MM-DD
**Severidade:** P0 / P1
**Duração:** X minutos/horas
**Impacto:** X usuários afetados

## Timeline
- HH:MM - Incidente detectado
- HH:MM - Investigação iniciada
- HH:MM - Root cause identificado
- HH:MM - Fix deployed
- HH:MM - Resolvido

## Root Cause
[Explicação técnica do que causou]

## Resolution
[Como foi resolvido]

## Action Items
- [ ] Implementar alerta preventivo
- [ ] Adicionar teste para cobrir caso
- [ ] Atualizar documentação
- [ ] Revisar processo que falhou

## Lessons Learned
[O que aprendemos]
```

---

## 🎯 Key Metrics to Track

### Daily
- [ ] Error rate
- [ ] Performance scores
- [ ] Active users
- [ ] Critical alerts

### Weekly
- [ ] Trend analysis (errors, performance)
- [ ] Cost analysis (Vercel, Supabase, OpenAI)
- [ ] User growth
- [ ] Feature adoption

### Monthly
- [ ] Infrastructure capacity
- [ ] Technical debt
- [ ] Security audit
- [ ] Compliance check

---

## 🔧 Tools & Access

**Produção:**
- Vercel: [vercel.com/dashboard](https://vercel.com/dashboard)
- Sentry: [sentry.io](https://sentry.io)
- Supabase: [app.supabase.com](https://app.supabase.com)

**Documentação:**
- [Vercel Docs](https://vercel.com/docs)
- [Sentry Docs](https://docs.sentry.io)
- [Supabase Docs](https://supabase.com/docs)

**Status Pages:**
- Vercel: [status.vercel.com](https://status.vercel.com)
- Supabase: [status.supabase.com](https://status.supabase.com)
- OpenAI: [status.openai.com](https://status.openai.com)

---

## ✅ Monitoring Checklist

### Setup (Once)
- [ ] Vercel Analytics enabled
- [ ] Sentry project created
- [ ] Sentry DSN configured
- [ ] Alerts configured
- [ ] On-call rotation defined
- [ ] Runbooks created

### Daily
- [ ] Check Sentry for new errors (9h, 15h)
- [ ] Review Vercel Analytics
- [ ] Check Supabase logs
- [ ] Verify no degradation in performance

### Weekly
- [ ] Review error trends
- [ ] Optimize slow queries
- [ ] Check infrastructure costs
- [ ] Update stakeholders

### Monthly
- [ ] Full security audit
- [ ] Performance optimization
- [ ] Cost optimization
- [ ] Capacity planning

---

**Monitoring is not just about catching errors, it's about preventing them.**

🎯 Goal: 99.9% uptime, < 1% error rate, happy users!
