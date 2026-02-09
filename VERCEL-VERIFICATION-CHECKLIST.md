# ✅ Verificação Rápida - Correções de Deploy Vercel

## 🎯 Checklist Pós-Deploy

Use este guia para verificar rapidamente se as correções estão funcionando.

---

## 1️⃣ Variáveis de Ambiente no Vercel

### Verificar Configuração

Vá para: **Vercel Dashboard** → **Seu Projeto** → **Settings** → **Environment Variables**

Deve conter:

```
✅ VITE_SUPABASE_URL
   Valor: https://[seu-projeto].supabase.co
   Environments: Production, Preview

✅ VITE_SUPABASE_ANON_KEY  
   Valor: eyJ... (chave pública longa)
   Environments: Production, Preview

✅ VITE_OPENAI_API_KEY (Opcional)
   Valor: sk-... (começa com sk-)
   Environments: Production, Preview
```

### ⚠️ Problemas Comuns

- ❌ **Variáveis sem prefixo VITE_** → Não funcionará com Vite
- ❌ **Apenas em Production** → Preview deployments falharão
- ❌ **URL com espaços ou aspas** → Copie sem formatação

---

## 2️⃣ Teste no Browser (DevTools)

### Abrir DevTools
- Chrome/Edge: `F12` ou `Ctrl+Shift+I`
- Firefox: `F12`
- Safari: `Cmd+Option+I`

### A. Console (Aba Console)

**O que NÃO deve aparecer:**
```
❌ Uncaught Error: Invalid supabaseUrl
❌ VITE_SUPABASE_URL não definida
❌ Must be a valid HTTP or HTTPS URL
```

**O que PODE aparecer (é OK):**
```
⚠️ VITE_OPENAI_API_KEY não definida (se você não configurou OpenAI)
```

### B. Network (Aba Network)

1. Recarregue a página (`Ctrl+R`)
2. Filtre por "manifest"
3. Verifique:

```
✅ manifest.webmanifest
   Status: 200 OK
   Type: application/manifest+json
   Size: ~0.5 KB
```

**Se ver 401:**
```
❌ Status: 401 (Unauthorized)
→ Solução: Verifique se crossorigin="use-credentials" está no HTML
→ Ou desabilite Deployment Protection temporariamente
```

### C. Application (Aba Application)

1. Expanda **Manifest** no menu lateral
2. Verifique:

```
✅ Nome: KETER - Evolução Pessoal
✅ Ícones: 3 ícones carregados
✅ Theme Color: #6B46C1
✅ Display: standalone
```

3. Expanda **Service Workers**
```
✅ Status: Activated and running
✅ Source: /sw.js
```

---

## 3️⃣ Teste Funcional Rápido

### Login/Cadastro
```
1. Acesse a página de login
2. Tente fazer login ou criar conta
3. ✅ Deve funcionar sem erros no console
```

### Dashboard
```
1. Após login, acesse o dashboard
2. ✅ Dados devem carregar (práticas, estatísticas)
3. ✅ Sem erros de "Invalid supabaseUrl" no console
```

### PWA Install
```
1. No Chrome: Ícone de instalação deve aparecer na barra de endereço
2. Ou: Menu → "Install KETER..."
3. ✅ Opção de instalação deve estar disponível
```

---

## 4️⃣ Verificação de Build

### Logs de Build do Vercel

No Vercel Dashboard → Deployments → Clique no último deploy → Building

**Deve conter:**
```
✅ npm install
✅ npm run build
✅ vite build
✅ ✓ built in ~6s
✅ Build Completed
```

**NÃO deve conter:**
```
❌ Error: Invalid supabaseUrl
❌ VITE_SUPABASE_URL is not defined
❌ Build failed
```

**Warnings OK (podem ser ignorados):**
```
⚠️ (!) Some chunks are larger than 1500 KiB
   → Normal para apps grandes com muitas dependências
```

---

## 5️⃣ Teste de Preview Deployment

### Quando fazer push para branch:

```bash
git push origin sua-branch
```

**Vercel automaticamente:**
1. Cria um preview deployment
2. URL: `https://keter-*.vercel.app`

**Verificar:**
```
✅ Preview deploy completa sem erros
✅ Manifest carrega (não dá 401)
✅ App funciona igual à produção
```

---

## 🔍 Testes Específicos por Erro

### Erro 1: "Invalid supabaseUrl"

**Onde testar:** Console do browser ao carregar a página

**✅ Corrigido quando:**
- Não aparece erro no console
- Supabase client inicializa normalmente
- Login/cadastro funcionam

**❌ Ainda tem problema se:**
- Erro aparece no console
- Página fica em branco após carregar
- Erro: "VITE_SUPABASE_URL não definida"

**Solução:**
1. Verifique variáveis de ambiente no Vercel
2. Confirme que tem prefixo `VITE_`
3. Redeploy do projeto

---

### Erro 2: "401 Unauthorized" no manifest

**Onde testar:** DevTools → Network → manifest.webmanifest

**✅ Corrigido quando:**
- Status: 200 OK
- Manifest carrega normalmente
- PWA instalável

**❌ Ainda tem problema se:**
- Status: 401 (Unauthorized)
- Manifest não aparece na aba Application
- Ícone de instalação PWA não aparece

**Solução:**
1. Verifique que `index.html` tem: `<link rel="manifest" href="/manifest.webmanifest" crossorigin="use-credentials">`
2. Verifique que `vite.config.js` tem: `useCredentials: true` no VitePWA
3. Se persistir: Settings → Deployment Protection → "None"
4. Redeploy do projeto

---

### Erro 3: OpenAI funcionalidades não funcionam

**Onde testar:** Qualquer feature de IA (chat, análise, transição de fase)

**✅ Funciona quando:**
- Chat com Guia responde normalmente
- Análises de reflexão são geradas
- Mensagens de transição de fase aparecem

**⚠️ Degradado graciosamente quando:**
- Console mostra: "VITE_OPENAI_API_KEY não definida"
- Chat mostra: "Funcionalidades de IA temporariamente indisponíveis"
- Resto do app continua funcionando

**❌ Problema se:**
- Erro quebra o app inteiro
- Página fica em branco
- Erro não é tratado

**Solução:**
1. Adicione `VITE_OPENAI_API_KEY` no Vercel
2. Obtenha chave em: https://platform.openai.com/api-keys
3. Redeploy do projeto

---

## 🚨 Resolução de Problemas

### Build Falha no Vercel

**Erro comum:**
```
npm ERR! Failed at the keter@1.0.0 build script
```

**Verificar:**
1. Logs completos do build
2. Se é erro de variáveis de ambiente → Adicione no Vercel
3. Se é erro de dependências → Verifique package.json

**Solução:**
```
Settings → General → Node.js Version
Confirme: Node 18.x ou superior
```

---

### Redeploy não Aplica Mudanças

**Motivo:** Cache do Vercel

**Solução:**
1. Deployments → Seu deploy → Menu (...)
2. "Redeploy" SEM marcar "Use existing Build Cache"
3. Aguarde novo build completo

---

### Variáveis Aplicadas mas Ainda Não Funcionam

**Causa:** Env vars só aplicam em NOVOS deploys

**Solução:**
1. Faça qualquer commit (pode ser dummy)
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```
2. Ou: Redeploy manual no Vercel Dashboard

---

## ✨ Sucesso - Tudo Funcionando!

Quando você vir:

```
✅ Console limpo (sem erros)
✅ Manifest: 200 OK
✅ Service Worker: Running
✅ Login: Funcionando
✅ Dashboard: Carregando dados
✅ PWA: Instalável
✅ Build: Completo sem erros
```

**🎉 Deploy está 100% funcional!**

---

## 📋 Checklist Completo

Marque conforme testa:

### Configuração
- [ ] VITE_SUPABASE_URL configurada no Vercel
- [ ] VITE_SUPABASE_ANON_KEY configurada no Vercel
- [ ] VITE_OPENAI_API_KEY configurada (ou OK sem ela)
- [ ] Environments: Production + Preview selecionados

### Build
- [ ] Build completa sem erros
- [ ] Logs mostram: "Build Completed"
- [ ] Sem erros de variáveis de ambiente

### Runtime
- [ ] Console limpo (sem erros)
- [ ] Manifest carrega (200 OK)
- [ ] Service Worker ativo
- [ ] Login/Cadastro funciona
- [ ] Dashboard carrega dados
- [ ] PWA instalável

### Funcionalidades
- [ ] Supabase: Leitura de dados funciona
- [ ] Supabase: Escrita de dados funciona
- [ ] OpenAI: Funciona OU falha graciosamente
- [ ] Autenticação: Login/Logout funcionam
- [ ] Offline: Service Worker cacheia recursos

---

## 🔗 Links Rápidos

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://app.supabase.com/)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [Guia Completo de Deploy](./VERCEL-DEPLOYMENT-GUIDE.md)

---

**Dica Final:** Sempre teste em modo anônimo/incógnito para evitar cache do browser!

**Última atualização:** 2024-02-09
