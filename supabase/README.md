# Supabase Edge Functions

This directory contains Supabase Edge Functions for the KETER application. These functions handle AI operations securely on the backend.

## Functions

### 1. chat-ia
**Purpose:** Handles AI chat interactions with the Guia Keter (AI guide)

**Endpoint:** `https://[your-project].supabase.co/functions/v1/chat-ia`

**Request:**
```json
{
  "mensagem": "Como posso melhorar minha prática?",
  "contexto": {
    "nome": "João",
    "faseAtual": 1,
    "diaTotal": 5,
    "sequencia": 3,
    "totalPraticas": 10,
    "ultimaReflexao": "Hoje foi desafiador..."
  },
  "historico": [
    { "role": "user", "content": "Olá" },
    { "role": "assistant", "content": "Olá! Como posso ajudar?" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "resposta": "AI response here...",
  "tokensUsados": 250,
  "error": null
}
```

**Rate Limit:** 50 messages per user per day

---

### 2. analisar-reflexao
**Purpose:** Analyzes night reflections with AI feedback

**Endpoint:** `https://[your-project].supabase.co/functions/v1/analisar-reflexao`

**Request:**
```json
{
  "textoReflexao": "Hoje foi um dia difícil mas aprendi muito...",
  "faseAtual": 1
}
```

**Response:**
```json
{
  "success": true,
  "analise": "AI analysis here...",
  "palavrasChave": ["difícil", "aprendi"],
  "sentimento": "positivo",
  "tokensUsados": 180,
  "error": null
}
```

**Rate Limit:** 3 analyses per user per day

---

## Setup & Deployment

### Prerequisites
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link to your project:
   ```bash
   supabase link --project-ref [your-project-ref]
   ```

### Environment Variables
Set these secrets in your Supabase project:

```bash
supabase secrets set OPENAI_API_KEY=sk-proj-your-key-here
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
```

Or set them in Supabase Dashboard:
- Go to: Project Settings → Edge Functions → Secrets
- Add each secret key-value pair

### Deploy Functions

Deploy both functions:
```bash
supabase functions deploy chat-ia
supabase functions deploy analisar-reflexao
```

Or deploy a specific function:
```bash
supabase functions deploy chat-ia
```

### Testing

Test locally:
```bash
supabase functions serve chat-ia
```

Test with curl:
```bash
curl -i --location --request POST 'https://[your-project].supabase.co/functions/v1/chat-ia' \
  --header 'Authorization: Bearer [your-anon-key]' \
  --header 'Content-Type: application/json' \
  --data '{"mensagem":"Olá, como está?","contexto":{}}'
```

---

## Security Features

### Rate Limiting
- **chat-ia**: 50 messages per user per day
- **analisar-reflexao**: 3 analyses per user per day

### Authentication
All requests require:
- Valid Supabase auth token in `Authorization` header
- User must be authenticated via Supabase Auth

### API Key Protection
- OpenAI API key is stored server-side only
- Never exposed to frontend/client
- Accessible only to Edge Functions

---

## Monitoring

Check function logs:
```bash
supabase functions logs chat-ia
supabase functions logs analisar-reflexao
```

View in Dashboard:
- Project → Edge Functions → [function-name] → Logs

---

## Cost Optimization

### Response Caching
- Similar messages may be cached (implement if needed)
- Reduces OpenAI API calls

### Token Limits
- chat-ia: max 1000 tokens per response
- analisar-reflexao: max 500 tokens per response

### Model Selection
- Using `gpt-3.5-turbo` for cost efficiency
- Upgrade to `gpt-4` only if needed

---

## Troubleshooting

### Function not found
```bash
supabase functions deploy [function-name]
```

### Secrets not set
```bash
supabase secrets list
supabase secrets set KEY=value
```

### CORS errors
- Functions already include CORS headers
- Check if request includes proper Authorization header

### Rate limit errors
- User has exceeded daily limit
- Wait 24 hours or increase limit in code

---

## Migration from Frontend

**Before:** OpenAI called directly from React components
```javascript
const response = await openai.chat.completions.create({...})
```

**After:** Call via Supabase Edge Function
```javascript
const { data } = await supabase.functions.invoke('chat-ia', {
  body: { mensagem, contexto }
})
```

---

## Next Steps

1. ✅ Deploy functions to Supabase
2. ✅ Set environment variables/secrets
3. ✅ Update frontend to call Edge Functions
4. ✅ Test in staging environment
5. ⏳ Monitor usage and costs
6. ⏳ Implement additional caching if needed
7. ⏳ Add analytics/metrics tracking
