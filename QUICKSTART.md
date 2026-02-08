# 🚀 INÍCIO RÁPIDO - KETER

Este guia vai te colocar rodando o KETER em **15 minutos**.

---

## ⚡ Setup em 5 Passos

### 1️⃣ Clone e Instale (2 min)

```bash
git clone https://github.com/seu-usuario/keter.git
cd keter
npm install
```

### 2️⃣ Configure Supabase (5 min)

1. Crie conta em [supabase.com](https://supabase.com)
2. Crie novo projeto (escolha São Paulo como região)
3. Aguarde ~2 minutos
4. Vá em **SQL Editor** → **New query**
5. Copie e cole TODO o conteúdo de `database/schema.sql`
6. Clique em **Run**
7. Vá em **Settings** → **API**
8. Copie `Project URL` e `anon public` key

### 3️⃣ Configure OpenAI (3 min)

1. Acesse [platform.openai.com](https://platform.openai.com)
2. Vá em **API Keys**
3. Clique em **Create new secret key**
4. Nomeie como "KETER Dev"
5. Copie a chave (começa com `sk-`)
6. Vá em **Billing** e adicione método de pagamento
7. Configure limite de $10/mês (segurança)

### 4️⃣ Configure Variáveis (2 min)

```bash
cp .env.example .env
```

Edite `.env` e cole suas credenciais:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_OPENAI_API_KEY=sk-...
```

### 5️⃣ Rode o Projeto (1 min)

```bash
npm run dev
```

Acesse http://localhost:5173 🎉

---

## ✅ Verificação

Faça este checklist para garantir que tudo está funcionando:

### Frontend
- [ ] App carrega sem erros no console
- [ ] Tela de welcome aparece
- [ ] Consegue clicar em "Começar minha jornada"

### Backend (Supabase)
- [ ] Vá em Supabase → **Table Editor**
- [ ] Deve ver 13 tabelas criadas
- [ ] Tabela `keteros` existe

### Autenticação
- [ ] Tente criar uma conta
- [ ] Deve redirecionar para onboarding
- [ ] Veja em Supabase → **Authentication** → **Users**
- [ ] Seu email deve aparecer lá

### IA
- [ ] Complete onboarding
- [ ] Vá para a tela de Guia
- [ ] Envie uma mensagem: "Olá!"
- [ ] IA deve responder em ~2-5 segundos

Se TODOS os checks passaram: **Parabéns! 🎊**

---

## 🐛 Problemas Comuns

### "Invalid API key" (Supabase)
- Verifique se copiou a chave `anon public` (não a `service_role`)
- Certifique-se que o `.env` está na raiz do projeto
- Reinicie o servidor: `Ctrl+C` e `npm run dev` novamente

### "Incorrect API key" (OpenAI)
- Verifique se a chave começa com `sk-`
- Certifique-se que adicionou método de pagamento
- Teste a chave em https://platform.openai.com/playground

### Tabelas não aparecem no Supabase
- Execute o `schema.sql` novamente
- Verifique se não teve erro no console SQL
- Cada tabela leva ~2s para criar

### App não carrega
- Verifique se está na porta correta (5173)
- Limpe cache: `npm run build` e `npm run dev`
- Veja o console do navegador (F12)

---

## 📚 Próximos Passos

Agora que está rodando:

1. **Explore o App**
   - Crie uma conta de teste
   - Complete o onboarding
   - Faça sua primeira prática
   - Escreva uma reflexão
   - Chat com a IA

2. **Entenda o Código**
   - Leia `docs/ARCHITECTURE.md`
   - Veja estrutura em `src/`
   - Explore componentes em `src/components/`

3. **Contribua**
   - Veja `CONTRIBUTING.md`
   - Pegue uma issue "good first issue"
   - Faça seu primeiro PR

4. **Customize**
   - Mude cores em `tailwind.config.js`
   - Adicione novas práticas em `src/data/praticas.js`
   - Crie novos componentes

---

## 💡 Dicas

### Desenvolvimento
- Use React DevTools (extensão Chrome)
- Abra sempre o console (F12)
- Supabase tem logs em tempo real
- OpenAI mostra uso em https://platform.openai.com/usage

### Dados de Teste
```javascript
// Use este comando no console do navegador para limpar dados:
localStorage.clear()
// Depois, recarregue a página
```

### Performance
- O app é rápido! Se estiver lento:
  - Verifique sua internet
  - Veja se não tem muitas abas abertas
  - IA pode demorar 2-5s (é normal)

---

## 🆘 Precisa de Ajuda?

- **Discord:** [Entrar na comunidade](#)
- **Issues:** [Abrir issue](https://github.com/seu-usuario/keter/issues)
- **Email:** dev@keter.center

---

## 🎓 Recursos de Aprendizado

### Para aprender React
- [React Docs](https://react.dev)
- [React Tutorial](https://react.dev/learn)

### Para aprender Supabase
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Tutorial](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)

### Para aprender OpenAI
- [OpenAI Docs](https://platform.openai.com/docs)
- [OpenAI Cookbook](https://cookbook.openai.com)

---

**Pronto! Você está no caminho certo! 🚀**

Se chegou até aqui e tudo funcionou, você já é parte do KETER! ❤️
