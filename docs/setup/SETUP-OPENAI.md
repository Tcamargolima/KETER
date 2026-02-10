# ================================================
# KETER - GUIA DE SETUP OPENAI
# ================================================

## 🎯 VISÃO GERAL

A integração com OpenAI transforma o KETER em uma plataforma verdadeiramente inteligente:
- Chat contextual baseado nos dados do usuário
- Análise semanal automática de evolução
- Detecção de padrões linguísticos
- Recomendações personalizadas de práticas
- Detecção de crises e suporte adequado

---

## 📋 PASSO A PASSO

### 1. Criar Conta na OpenAI

1. Acesse https://platform.openai.com
2. Crie uma conta (ou faça login)
3. Vá em "API Keys" (https://platform.openai.com/api-keys)
4. Clique em "Create new secret key"
5. Dê um nome: "KETER Production"
6. Copie a chave (começa com `sk-...`)
7. ⚠️ **GUARDE COM SEGURANÇA** - você não verá novamente!

### 2. Configurar Billing

1. Vá em "Settings" > "Billing"
2. Adicione um método de pagamento
3. Configure limite de gastos mensal (recomendado: $10-20 para começar)
4. Ative notificações de uso

### 3. Configurar Variáveis de Ambiente

#### Para Lovable/Vite:
Adicione no arquivo `.env`:

```env
VITE_OPENAI_API_KEY=sk-...sua-chave-aqui...
```

#### Para Next.js:
Adicione no arquivo `.env.local`:

```env
OPENAI_API_KEY=sk-...sua-chave-aqui...
```

⚠️ **SEGURANÇA CRÍTICA:**
- NUNCA commite a API key no Git
- Adicione `.env` no `.gitignore`
- Em produção, use variáveis de ambiente do servidor

### 4. Instalar Dependências

```bash
npm install openai
```

### 5. Estrutura de Arquivos

Organize assim:

```
/src
  /lib
    openai.js           # Cliente OpenAI e funções principais
  /hooks
    useIA.js            # Hooks React para IA
  /components
    /IA
      AnaliseSemanal.jsx
      ChatInteligente.jsx
      PadroesLinguisticos.jsx
```

---

## 🔧 CONFIGURAÇÃO AVANÇADA

### Modelos Disponíveis

```javascript
const MODELS = {
  // GPT-4 Turbo - Melhor qualidade, mais caro
  CHAT: 'gpt-4-turbo-preview',
  
  // GPT-3.5 Turbo - Rápido e barato
  FAST_CHAT: 'gpt-3.5-turbo',
  
  // Embeddings - Para busca semântica
  EMBEDDINGS: 'text-embedding-3-small'
};
```

**Quando usar cada um:**
- **GPT-4**: Análise semanal, decisões complexas
- **GPT-3.5**: Chat diário, respostas rápidas
- **Embeddings**: Busca em histórico de reflexões (futuro)

### Limites de Tokens

```javascript
const MAX_TOKENS = {
  CHAT: 1000,        // ~750 palavras
  ANALYSIS: 1500,    // ~1125 palavras
  FEEDBACK: 800      // ~600 palavras
};
```

Ajuste conforme necessário, mas lembre-se:
- Mais tokens = mais caro
- Respostas curtas são melhores para UX mobile

### Temperature & Parameters

```javascript
{
  temperature: 0.7,        // Criatividade (0 = robótico, 1 = criativo)
  presence_penalty: 0.6,   // Evita repetição de tópicos
  frequency_penalty: 0.3   // Evita repetição de palavras
}
```

---

## 💰 CUSTOS E OTIMIZAÇÃO

### Preços (fevereiro 2024)

| Modelo | Input (1K tokens) | Output (1K tokens) |
|--------|-------------------|-------------------|
| GPT-4 Turbo | $0.01 | $0.03 |
| GPT-3.5 Turbo | $0.0005 | $0.0015 |

### Estimativa de Custo por Usuário

**Usuário Médio (1 mês):**
- Chat: 20 mensagens × 500 tokens = 10.000 tokens → $0.02
- Análise semanal: 4 análises × 2000 tokens = 8.000 tokens → $0.16
- **Total: ~$0.18/mês por usuário ativo**

**1.000 usuários ativos = ~$180/mês**

### Estratégias de Otimização

1. **Cache de Respostas**
   ```javascript
   // Já implementado no código
   const cached = getCached(cacheKey);
   if (cached) return cached;
   ```

2. **Usar GPT-3.5 quando possível**
   - Chat diário: GPT-3.5
   - Análise profunda: GPT-4

3. **Limitar Histórico**
   ```javascript
   const historico = mensagens.slice(-10); // Últimas 10 apenas
   ```

4. **Batch Processing**
   - Gerar análises semanais em lote (noite de domingo)
   - Reduz custos em ~30%

5. **Rate Limiting**
   ```javascript
   // Implementar no backend
   const limite = 50; // mensagens por dia por usuário
   ```

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### 1. Chat Inteligente

**O que faz:**
- Responde perguntas contextualizadas
- Usa dados reais do usuário (fase, sequência, etc.)
- Mantém histórico de conversa
- Detecta crises automaticamente

**Como usar:**
```jsx
import { useGuiaInteligente } from './hooks/useIA';

const { mensagens, enviarMensagem, isTyping } = useGuiaInteligente();

// Em qualquer lugar
enviarMensagem("Como estou evoluindo?");
```

### 2. Análise Semanal

**O que faz:**
- Analisa padrões nas reflexões
- Compara com semana anterior
- Identifica mudanças de linguagem
- Sugere próximos passos

**Como usar:**
```jsx
import { useAnaliseSemanal } from './hooks/useIA';

const { analise, gerarAnalise } = useAnaliseSemanal();

// Auto-gera a cada 7 dias, ou manualmente:
gerarAnalise();
```

### 3. Análise de Padrões Linguísticos

**O que faz:**
- Detecta palavras de vitimização vs agência
- Mede positividade emocional
- Avalia profundidade das reflexões
- Gera insights automáticos

**Como usar:**
```jsx
import { usePadroesLinguisticos } from './hooks/useIA';

const { padroes, evolucao } = usePadroesLinguisticos(7);

// padroes.scoreAgencia → 0-100
// padroes.insights → array de strings
```

### 4. Detecção de Crise

**O que faz:**
- Identifica sinais de depressão, ansiedade, pensamentos suicidas
- Retorna nível de gravidade
- Sugere buscar ajuda profissional
- Age de forma preventiva

**Como usar:**
```javascript
import { detectarCrise } from './lib/openai';

const resultado = await detectarCrise(mensagem);

if (resultado.crise_detectada && resultado.nivel === 'critico') {
  // Mostrar mensagem de apoio
  // Sugerir ajuda profissional
}
```

### 5. Recomendação de Práticas

**O que faz:**
- Analisa perfil do usuário
- Considera fase atual e progresso
- Recomenda prática mais adequada
- Personaliza baseado em hábitos desejados

**Como usar:**
```jsx
import { useRecomendacaoPratica } from './hooks/useIA';

const { praticaRecomendada } = useRecomendacaoPratica(praticasDisponiveis);

// Retorna objeto da prática recomendada
```

---

## 🧪 TESTES

### Testar Conexão

```javascript
import { chatWithGuia } from './lib/openai';

const resultado = await chatWithGuia(
  "Olá!",
  { nome: "Teste", faseAtual: 1 },
  []
);

console.log(resultado.resposta);
// Deve retornar uma resposta da IA
```

### Testar Análise

```javascript
import { analisarPadroesLinguisticos } from './lib/openai';

const reflexoes = [
  { sentimentos_dia: "Não consigo fazer nada certo" },
  { sentimentos_dia: "Hoje foi difícil mas aprendi" }
];

const padroes = analisarPadroesLinguisticos(reflexoes);
console.log(padroes.scoreAgencia); // Deve retornar um número
```

---

## 🔒 SEGURANÇA E PRIVACIDADE

### Boas Práticas

1. **API Key no Backend (Produção)**
   ```javascript
   // ❌ NUNCA faça isso em produção:
   const openai = new OpenAI({ apiKey: 'sk-...', dangerouslyAllowBrowser: true });
   
   // ✅ Em produção, use Edge Functions:
   // Chame uma função serverless que tenha a key
   ```

2. **Sanitização de Dados**
   ```javascript
   // Remover dados sensíveis antes de enviar para IA
   const contexto = {
     nome: perfil.nome, // OK
     email: perfil.email, // ❌ Remover
     cpf: perfil.cpf // ❌ NUNCA enviar
   };
   ```

3. **Rate Limiting**
   - Implemente limites por usuário
   - Previne abuso e custos inesperados

4. **Logs e Auditoria**
   - Registre todas as chamadas à API
   - Monitore custos diários
   - Alerte se passar do budget

### LGPD e Dados

- OpenAI NÃO treina modelos com dados da API
- Dados são retidos por 30 dias (compliance)
- Habilite Zero Data Retention (Enterprise)
- Leia: https://openai.com/policies/privacy-policy

---

## 📊 MONITORAMENTO

### Dashboard da OpenAI

1. Acesse https://platform.openai.com/usage
2. Veja uso em tempo real
3. Configure alertas de budget
4. Analise quais endpoints mais usam tokens

### Métricas para Acompanhar

- **Tokens/dia**: Quanto está gastando
- **Custo/usuário**: Viabilidade do modelo
- **Latência**: Tempo de resposta da IA
- **Taxa de erro**: Falhas na API

### Alertas Recomendados

- Gasto > $50/dia
- Erro rate > 5%
- Latência > 10s
- Tokens/usuário > 20k/mês

---

## 🐛 TROUBLESHOOTING

### Erro: "Incorrect API key"
✅ Verifique se a chave está correta no `.env`
✅ Certifique-se que começa com `sk-`
✅ Reinicie o servidor após mudar `.env`

### Erro: "You exceeded your current quota"
✅ Adicione método de pagamento na OpenAI
✅ Ou aguarde o reset mensal do free tier
✅ Verifique se o billing está ativo

### Erro: "Rate limit exceeded"
✅ Você está fazendo muitas requests
✅ Implemente cache
✅ Adicione delay entre chamadas
✅ Upgrade para tier superior

### Respostas muito lentas
✅ Use GPT-3.5 em vez de GPT-4
✅ Reduza max_tokens
✅ Otimize o prompt (menos contexto)
✅ Implemente streaming (resposta progressiva)

### IA dá respostas genéricas
✅ Melhore o contexto enviado
✅ Seja mais específico nos prompts
✅ Ajuste a temperature (tente 0.7-0.9)
✅ Use GPT-4 para casos complexos

---

## 🚀 PRÓXIMOS PASSOS

Depois de configurar a OpenAI:

1. ✅ Testar chat básico
2. ✅ Gerar primeira análise semanal
3. ✅ Integrar componentes no app
4. ⏳ Mover API key para backend (produção)
5. ⏳ Implementar streaming para chat
6. ⏳ Adicionar embeddings para busca
7. ⏳ Fine-tuning com dados específicos (opcional)

---

## 💡 DICAS AVANÇADAS

### Streaming de Respostas

```javascript
const stream = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: messages,
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  // Atualizar UI progressivamente
}
```

### Embeddings para Busca

```javascript
// Gerar embedding de uma reflexão
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: reflexao.sentimentos_dia
});

// Salvar no banco com pgvector
// Permite busca semântica: "Mostre quando me senti ansioso"
```

### Function Calling

```javascript
const functions = [
  {
    name: 'buscar_pratica',
    description: 'Busca uma prática específica',
    parameters: {
      type: 'object',
      properties: {
        categoria: { type: 'string', enum: ['respiracao', 'meditacao', 'reflexao'] }
      }
    }
  }
];

// IA pode chamar funções do app!
```

---

## 📚 RECURSOS

- **Documentação OpenAI**: https://platform.openai.com/docs
- **Cookbook**: https://cookbook.openai.com
- **Community**: https://community.openai.com
- **Status Page**: https://status.openai.com

---

## ✅ CHECKLIST FINAL

- [ ] Conta OpenAI criada
- [ ] API Key gerada
- [ ] Billing configurado
- [ ] Variável de ambiente configurada
- [ ] Dependência instalada
- [ ] Chat testado e funcionando
- [ ] Análise semanal testada
- [ ] Custos monitorados
- [ ] Rate limiting implementado
- [ ] Segurança revisada

**Parabéns! Seu KETER agora tem IA de verdade! 🎉**
