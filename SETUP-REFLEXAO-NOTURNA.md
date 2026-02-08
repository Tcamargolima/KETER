# 🚀 Guia de Setup - Reflexão Noturna

## Passo 1: Atualizar Schema do Supabase

### 1.1. Acessar Supabase Dashboard
1. Vá para [https://supabase.com](https://supabase.com)
2. Faça login no seu projeto
3. Clique em **SQL Editor** no menu lateral

### 1.2. Executar Migration
1. Abra o arquivo `supabase-schema-update-reflexoes.sql`
2. Copie todo o conteúdo
3. Cole no SQL Editor
4. Clique em **Run** (ou pressione Ctrl+Enter)
5. Aguarde confirmação: "Success. No rows returned"

### 1.3. Verificar Tabelas
```sql
-- Execute este query para verificar as novas colunas:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reflexoes_noturnas';
```

Você deve ver as novas colunas:
- `micro_ato_executado`
- `desafio_disciplina`
- `gratidao_dia`
- `observacao_mudanca`
- `momento_consciencia`
- `padrao_observado`
- `impacto_outros`

## Passo 2: Configurar Variáveis de Ambiente

### 2.1. Criar arquivo .env
Na raiz do projeto, crie ou edite o arquivo `.env`:

```bash
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui

# OpenAI
VITE_OPENAI_API_KEY=sk-sua_openai_key_aqui
```

### 2.2. Obter Credenciais Supabase
1. No Supabase Dashboard, vá em **Settings** > **API**
2. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 2.3. Obter API Key OpenAI
1. Vá para [https://platform.openai.com](https://platform.openai.com)
2. Clique em **API Keys**
3. Crie uma nova chave: **Create new secret key**
4. Copie e cole em `VITE_OPENAI_API_KEY`

⚠️ **IMPORTANTE:** Nunca commite o arquivo `.env` no Git!

## Passo 3: Instalar Dependências

```bash
npm install
```

Ou se preferir yarn:

```bash
yarn install
```

## Passo 4: Testar Localmente

### 4.1. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

### 4.2. Abrir no Navegador
- Acesse: `http://localhost:5173` (ou a porta que aparecer)
- Faça login ou crie uma conta
- Navegue até a Home

### 4.3. Testar Sistema de Reflexão

**Opção 1: Testar notificação às 20h**
- Aguarde até 20h (8pm)
- Notificação aparecerá automaticamente

**Opção 2: Testar imediatamente (hack)**
No console do navegador (F12):
```javascript
// Simular horário 20h
const originalGetHours = Date.prototype.getHours;
Date.prototype.getHours = function() { return 20; };
// Recarregue a página
location.reload();
```

**Opção 3: Clicar no card na Home**
- Se ainda não fez reflexão hoje, verá card "Reflexão Noturna"
- Clique em "Fazer Agora"

### 4.4. Testar Fluxo Completo
1. ✅ Abra o modal de reflexão
2. ✅ Responda todas as perguntas obrigatórias
3. ✅ Clique em "Salvar Reflexão"
4. ✅ Aguarde análise IA (spinner aparece)
5. ✅ Leia os insights gerados
6. ✅ Clique em "Continuar"
7. ✅ Verifique que o card mudou para "Reflexão Completa! ✨"

## Passo 5: Verificar Dados no Supabase

### 5.1. Ir para Table Editor
No Supabase Dashboard:
1. Clique em **Table Editor**
2. Selecione tabela `reflexoes_noturnas`
3. Você deve ver sua reflexão salva

### 5.2. Verificar Campos
- `sentimentos_dia` - texto da sua reflexão
- `analise_ia` - análise gerada pela IA
- `palavras_chave` - array JSON com palavras detectadas
- `sentimento_detectado` - positivo/neutro/negativo

### 5.3. Verificar Contador
Na tabela `keteros`:
- `total_reflexoes` deve ter incrementado em 1
- `ultimo_acesso` deve ter atualizado

## Passo 6: Troubleshooting

### Problema: Modal não abre
**Solução:**
1. Verifique console (F12) por erros JavaScript
2. Confirme que o arquivo `reflexao-integration.jsx` está presente
3. Confirme que o import em `keter-app.jsx` está correto

### Problema: Análise IA não funciona
**Possíveis causas:**
1. **API Key inválida:** Verifique `.env`
2. **Sem créditos OpenAI:** Vá em [platform.openai.com/usage](https://platform.openai.com/usage)
3. **Rate limit:** Aguarde 1 minuto e tente novamente
4. **CORS:** Se estiver em produção, mova IA para backend

**Fallback:**
- Sistema salva reflexão mesmo se IA falhar
- Apenas não mostra análise

### Problema: Dados não salvam no Supabase
**Verificações:**
1. **RLS ativo?** Execute no SQL Editor:
```sql
SELECT * FROM reflexoes_noturnas 
WHERE ketero_id = 'SEU_USER_ID_AQUI';
```

2. **Função existe?** Execute:
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'increment_reflexoes';
```

3. **Permissões corretas?**
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'reflexoes_noturnas';
```

### Problema: Notificação não aparece
**Diagnóstico:**
```javascript
// Console do navegador
const agora = new Date();
console.log('Hora atual:', agora.getHours());
console.log('Deve aparecer:', agora.getHours() >= 20 && agora.getHours() <= 23);
```

**Solução temporária:**
- Use o card "Reflexão Noturna" na Home
- Notificação voltará a funcionar após 20h

## Passo 7: Deploy em Produção

### 7.1. Mover IA para Backend (Recomendado)

**Por quê?**
- API keys expostas no browser são inseguras
- Rate limits mais controlados
- Custos monitorados

**Como?**
Criar Edge Function no Supabase:

```javascript
// supabase/functions/analisar-reflexao/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { texto, faseAtual } = await req.json()
  
  const openaiKey = Deno.env.get('OPENAI_API_KEY')
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Você é um guia empático...' },
        { role: 'user', content: `Analise: ${texto}` }
      ]
    })
  })
  
  const data = await response.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

Deploy:
```bash
supabase functions deploy analisar-reflexao
```

Atualizar frontend para chamar a Edge Function.

### 7.2. Build para Produção
```bash
npm run build
```

### 7.3. Deploy (Vercel exemplo)
```bash
npm install -g vercel
vercel deploy
```

Configurar variáveis de ambiente no Vercel Dashboard.

## ✅ Checklist Final

Antes de considerar completo:

- [ ] Schema atualizado no Supabase
- [ ] Arquivo `.env` configurado
- [ ] Dependências instaladas
- [ ] App roda localmente sem erros
- [ ] Modal abre e fecha corretamente
- [ ] Perguntas renderizam por fase
- [ ] Análise IA funciona (ou fallback ativo)
- [ ] Dados salvam no Supabase
- [ ] Contador incrementa
- [ ] Notificação aparece às 20h
- [ ] Card na Home atualiza estado
- [ ] Console sem erros críticos

## 🎉 Parabéns!

Seu sistema de Reflexão Noturna está funcionando!

Próximos passos:
1. Testar com usuários reais
2. Coletar feedback
3. Iterar no conteúdo das perguntas
4. Adicionar gráficos de evolução
5. Implementar insights semanais

## 📞 Suporte

Problemas? Abra uma issue no GitHub ou consulte:
- `REFLEXAO-NOTURNA-DOCS.md` - Documentação técnica completa
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- OpenAI Forum: [community.openai.com](https://community.openai.com)

---

**Versão:** 1.0.0  
**Última atualização:** Fevereiro 2025
