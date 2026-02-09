# 🚀 Guia Rápido: PWA KETER

## Início Rápido em 3 Passos

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Desenvolvimento

```bash
npm run dev
```

Abra: http://localhost:5173

> **⚠️ Nota:** PWA features como Service Workers requerem HTTPS em produção. No desenvolvimento, localhost funciona normalmente.

### 3️⃣ Build & Preview

```bash
npm run build
npm run preview
```

---

## 📱 Testar PWA

### No Chrome Desktop

1. Abra http://localhost:5173
2. DevTools (F12) > Application > Service Workers
3. Verifique se SW está registrado ✅
4. Clique no ícone "Instalar" na barra de endereços
5. Teste modo offline:
   - DevTools > Network > Throttling > Offline
   - Recarregue a página
   - App deve funcionar! 🎉

### No Mobile (Chrome)

1. Acesse o app via ngrok ou deploy
2. Menu > "Adicionar à tela inicial"
3. Abra o app instalado
4. Teste offline:
   - Ative modo avião
   - App deve continuar funcionando

---

## 🔧 Variáveis de Ambiente

Crie `.env` na raiz:

```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_key_supabase
VITE_OPENAI_API_KEY=sua_key_openai
```

---

## 🎨 Features PWA

### ✅ O que funciona offline:

- 📖 Visualizar práticas (em cache)
- 💭 Criar reflexões (salvas localmente)
- 🌟 Registrar micro-atos (sync depois)
- 📊 Ver estatísticas (dados cached)

### 🔄 O que sincroniza:

Quando você volta online, tudo é sincronizado automaticamente:
- Reflexões pendentes
- Práticas registradas
- Micro-atos salvos

---

## 🐛 Troubleshooting

### Service Worker não registra

```bash
# Limpar cache
rm -rf dist
npm run build
npm run preview
```

### Mudanças não aparecem

O SW faz cache agressivo. Para forçar update:

1. DevTools > Application > Service Workers
2. Clique "Unregister"
3. Recarregue (Ctrl+Shift+R)

### Build falha

```bash
# Reinstalar deps
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Audit com Lighthouse

```bash
npm run build
npm run preview
```

Depois:
1. Abra Chrome DevTools
2. Tab "Lighthouse"
3. Marque "Progressive Web App"
4. Click "Generate report"

**Meta:** Score 100/100 ✅

---

## 🎯 Next Steps

1. ✅ Configurar variáveis de ambiente
2. ✅ Testar offline no Chrome
3. ✅ Rodar Lighthouse audit
4. ✅ Deploy para produção
5. ✅ Testar instalação no mobile

---

**Dúvidas?** Veja [FASE-9-PWA-OFFLINE.md](./FASE-9-PWA-OFFLINE.md) para documentação completa.
