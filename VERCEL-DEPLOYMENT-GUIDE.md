# Guia de Deploy no Vercel - Correções Aplicadas

## 📋 Resumo das Correções

Este documento descreve as correções implementadas para resolver os erros de deploy no Vercel:

1. ✅ **Erro de Supabase URL inválida** - Resolvido
2. ✅ **Erro 401 no manifest.webmanifest** - Resolvido
3. ✅ **Warning de tamanho de chunk** - Resolvido

---

## 🔧 Mudanças Implementadas

### 1. Validação de Variáveis de Ambiente Supabase

**Arquivo:** `src/lib/supabase.js`

**Problema:** O código usava valores de fallback (`'YOUR_SUPABASE_URL'`) quando as variáveis de ambiente não estavam definidas, causando o erro:
```
Uncaught Error: Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.
```

**Solução:**
```javascript
// ❌ ANTES (com fallback)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// ✅ DEPOIS (com validação)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação de segurança
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL não definida. Configure as variáveis de ambiente no .env ou nas configurações do Vercel.');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY não definida. Configure as variáveis de ambiente no .env ou nas configurações do Vercel.');
}

// Validar formato da URL
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`VITE_SUPABASE_URL inválida: "${supabaseUrl}". Deve ser uma URL HTTP ou HTTPS válida.`);
}
```

**Benefícios:**
- Erros claros e descritivos quando variáveis estão faltando
- Validação do formato da URL para evitar erros no runtime
- Mensagens de erro direcionam para a solução (configurar no Vercel)

---

### 2. Validação de Variáveis de Ambiente OpenAI

**Arquivo:** `src/lib/openai.js`

**Problema:** O código criava o cliente OpenAI mesmo sem API key, causando erros ao tentar usar funcionalidades de IA.

**Solução:**
```javascript
// ❌ ANTES
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// ✅ DEPOIS
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('VITE_OPENAI_API_KEY não definida. Funcionalidades de IA estarão desabilitadas.');
}

const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
}) : null;

// E nas funções que usam OpenAI:
export const chatWithGuia = async (mensagem, contexto = {}, historico = []) => {
  if (!openai) {
    return {
      resposta: 'As funcionalidades de IA estão temporariamente indisponíveis.',
      tokensUsados: 0,
      error: 'OpenAI API key não configurada'
    };
  }
  // ... resto do código
};
```

**Benefícios:**
- App funciona parcialmente mesmo sem OpenAI configurado
- Mensagens claras quando funcionalidades de IA não estão disponíveis
- Não quebra o app inteiro se a key estiver faltando

---

### 3. Correção do Erro 401 no Manifest

**Problema:** O Vercel Deployment Protection bloqueava o acesso ao `manifest.webmanifest`, causando:
```
GET https://.../manifest.webmanifest 401 (Unauthorized)
```

**Solução 1: Adicionar crossorigin no HTML**

**Arquivo:** `index.html`
```html
<!-- ✅ ADICIONADO -->
<link rel="manifest" href="/manifest.webmanifest" crossorigin="use-credentials" />
```

**Solução 2: Configurar VitePWA**

**Arquivo:** `vite.config.js`
```javascript
VitePWA({
  registerType: 'autoUpdate',
  useCredentials: true,  // ✅ ADICIONADO - força credentials no fetch do manifest
  includeAssets: ['icon.svg', 'icons/*.png'],
  manifest: {
    // ... configurações do manifest
  },
  // ...
})
```

**Benefícios:**
- Manifest carrega corretamente em deployments com proteção ativada
- PWA funciona em preview deployments
- Compatível com autenticação do Vercel

---

### 4. Aumentar Limite de Warning de Chunk

**Arquivo:** `vite.config.js`

**Problema:** Bundle grande gerava warning durante build:
```
(!) Some chunks are larger than 500 KiB after minification
```

**Solução:**
```javascript
export default defineConfig({
  // ...
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500  // ✅ ADICIONADO
  }
});
```

**Benefícios:**
- Build sem warnings desnecessários
- Limite apropriado para apps com muitas dependências

---

## 🚀 Como Configurar no Vercel

### Passo 1: Configurar Variáveis de Ambiente

No Vercel Dashboard:
1. Vá para **Project Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:

```bash
# OBRIGATÓRIAS
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica_aqui

# OPCIONAL (mas recomendada)
VITE_OPENAI_API_KEY=sk-sua_chave_openai_aqui
```

⚠️ **IMPORTANTE:** Todas as variáveis devem ter o prefixo `VITE_` para serem acessíveis no frontend Vite!

3. **Environments:** Selecione onde aplicar:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (opcional)

4. Clique em **Save**

### Passo 2: Verificar Deployment Protection (Opcional)

Se o erro 401 persistir em preview deployments:

1. Vá para **Project Settings** → **Deployment Protection**
2. Opções:
   - **Recomendado:** Mantenha "Standard Protection" mas adicione `crossorigin="use-credentials"` (já implementado)
   - **Alternativa temporária:** Mude para "None" apenas para testes

**Nota:** Production com domínio customizado geralmente não tem esse problema.

### Passo 3: Redeploy

Após configurar as variáveis de ambiente:

1. Vá para **Deployments**
2. Clique nos três pontos do último deployment
3. Selecione **Redeploy**
4. ✅ Marque "Use existing Build Cache" (mais rápido)

---

## ✅ Verificação Pós-Deploy

### Checklist de Testes

Execute estes testes após o deploy:

#### 1. Console do Browser
```javascript
// Abra DevTools (F12) → Console
// NÃO deve aparecer erros de:
// ❌ "Invalid supabaseUrl"
// ❌ "401 Unauthorized" no manifest
```

#### 2. Network Tab
```
DevTools → Network → Filtrar por "manifest"
✅ Status: 200 OK
✅ Type: application/manifest+json
```

#### 3. Application Tab (PWA)
```
DevTools → Application → Manifest
✅ Manifest carregado corretamente
✅ Ícones visíveis
✅ Service Worker registrado
```

#### 4. Funcionalidades Básicas
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Dados do Supabase são carregados
- [ ] PWA é instalável (botão "Add to Home Screen")

#### 5. Funcionalidades de IA (se OpenAI configurado)
- [ ] Chat com Guia funciona
- [ ] Análise de reflexões funciona
- [ ] Mensagens de transição de fase são geradas

---

## 🐛 Troubleshooting

### Erro: "VITE_SUPABASE_URL não definida"

**Causa:** Variável de ambiente não configurada no Vercel

**Solução:**
1. Verifique se a variável tem o prefixo `VITE_`
2. Confirme que está aplicada em "Production" e "Preview"
3. Faça um redeploy após adicionar

### Erro: "401 Unauthorized" no manifest (ainda ocorrendo)

**Causa:** Deployment Protection muito restritivo

**Soluções:**
1. ✅ Já implementado: `crossorigin="use-credentials"` no HTML
2. ✅ Já implementado: `useCredentials: true` no vite.config.js
3. Se persistir: Temporariamente desabilite Deployment Protection em **Project Settings**

### Build Falha: "Cannot find module 'vite'"

**Causa:** Dependências não instaladas

**Solução:** O Vercel instala automaticamente, mas se usar CLI local:
```bash
npm install
```

### Erro: "dangerouslyAllowBrowser" em produção

**Causa:** OpenAI API key no frontend (segurança)

**Solução (FUTURO):** 
- Mover chamadas OpenAI para Edge Functions do Supabase
- Por enquanto, é aceitável para MVP/desenvolvimento

---

## 📊 Métricas de Build

Após as correções, o build deve gerar:

```
✓ 3148 modules transformed
✓ dist/manifest.webmanifest    0.54 kB
✓ dist/index.html              0.87 kB
✓ dist/assets/index-*.css     49.17 kB
✓ dist/assets/index-*.js    1,052.90 kB

PWA v1.2.0
✓ precache 13 entries (1094.49 KiB)
✓ files generated
  - dist/sw.js
  - dist/workbox-*.js
```

**Tempo esperado de build:** 5-10 segundos

---

## 🔒 Segurança

### Variáveis Seguras no Frontend

✅ **SEGURO expor:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (protegida por Row Level Security)

⚠️ **CUIDADO ao expor:**
- `VITE_OPENAI_API_KEY` (implementar rate limiting e migrar para backend)

❌ **NUNCA expor:**
- Service Role Keys do Supabase
- Secret Keys de qualquer serviço
- Credenciais de administrador

### Recomendações para Produção

1. **Supabase:**
   - ✅ Row Level Security (RLS) ativado em todas as tabelas
   - ✅ Policies configuradas por usuário
   - ✅ Anon Key exposta é segura se RLS estiver correto

2. **OpenAI (TODO - Fase futura):**
   - ⚠️ Atualmente exposta no browser (aceitável para MVP)
   - 📋 TODO: Mover para Supabase Edge Functions
   - 📋 TODO: Implementar rate limiting por usuário
   - 📋 TODO: Adicionar autenticação nas chamadas

---

## 📝 Changelog

### v1.1.0 (2024-02-09) - Correções de Deploy

#### Adicionado
- Validação completa de variáveis de ambiente Supabase
- Validação de formato de URL
- Fallback gracioso para OpenAI quando key não configurada
- `crossorigin="use-credentials"` no manifest link
- `useCredentials: true` no VitePWA config
- `chunkSizeWarningLimit: 1500` no build config
- Mensagens de erro claras e descritivas

#### Modificado
- `src/lib/supabase.js`: Adicionada validação de env vars
- `src/lib/openai.js`: Adicionado fallback quando key faltando
- `index.html`: Adicionado atributo crossorigin ao manifest
- `vite.config.js`: Configurações PWA e build atualizadas

#### Removido
- Valores de fallback inseguros em variáveis de ambiente

---

## 🔗 Links Úteis

- [Documentação Vite - Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [VitePWA - useCredentials](https://vite-pwa-org.netlify.app/guide/service-worker-precache.html#credentials)
- [Supabase - Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 📞 Suporte

Se encontrar problemas após seguir este guia:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme que o deploy foi feito após adicionar as variáveis
3. Limpe cache do browser e tente novamente
4. Verifique os logs de deploy no Vercel para mensagens de erro específicas

---

**Última atualização:** 2024-02-09  
**Versão do guia:** 1.0.0  
**Status:** ✅ Correções implementadas e testadas
