# KETER v1.0 - Deployment Guide for Edge Functions

## Overview

This guide covers deploying the Supabase Edge Functions that handle AI operations securely on the backend.

## Prerequisites

1. **Supabase Account & Project**
   - Create a project at [supabase.com](https://supabase.com)
   - Note your project reference ID

2. **Supabase CLI**
   ```bash
   npm install -g supabase
   ```

3. **OpenAI API Key**
   - Get your API key from [platform.openai.com](https://platform.openai.com/api-keys)

---

## Step 1: Install Supabase CLI

```bash
# Install globally
npm install -g supabase

# Verify installation
supabase --version
```

---

## Step 2: Login to Supabase

```bash
# Login via browser
supabase login

# This will open a browser window for authentication
```

---

## Step 3: Link to Your Project

```bash
# Link to your Supabase project
supabase link --project-ref [your-project-ref]

# Find project-ref in: Supabase Dashboard → Settings → General → Reference ID
```

---

## Step 4: Set Environment Secrets

Configure the required secrets for Edge Functions:

```bash
# Set OpenAI API key (CRITICAL - keep this secure!)
supabase secrets set OPENAI_API_KEY=sk-proj-your-key-here

# Set Supabase URL
supabase secrets set SUPABASE_URL=https://your-project.supabase.co

# Set Supabase Anon Key (for client authentication)
supabase secrets set SUPABASE_ANON_KEY=your-anon-key-here
```

**Alternative: Set via Dashboard**
1. Go to: Supabase Dashboard → Project Settings → Edge Functions
2. Click "Manage secrets"
3. Add each key-value pair

---

## Step 5: Deploy Edge Functions

Deploy both AI functions:

```bash
# From project root
cd /path/to/KETER

# Deploy chat-ia function
supabase functions deploy chat-ia

# Deploy analisar-reflexao function
supabase functions deploy analisar-reflexao
```

**Expected Output:**
```
✓ Deployed Function chat-ia
  URL: https://[project-ref].supabase.co/functions/v1/chat-ia
  
✓ Deployed Function analisar-reflexao
  URL: https://[project-ref].supabase.co/functions/v1/analisar-reflexao
```

---

## Step 6: Run Database Migrations

Apply the performance indexes and AI quota tracking:

```bash
# Connect to your database via Supabase SQL Editor or psql

# Run migrations in this order:
# 1. Performance indexes
cat database/migrations/add-performance-indexes.sql | supabase db execute

# 2. AI quota tracking
cat database/migrations/add-ia-quota-tracking.sql | supabase db execute
```

**Alternative: Manual via Dashboard**
1. Go to: Supabase Dashboard → SQL Editor
2. Copy content from each migration file
3. Execute in order

---

## Step 7: Update Frontend Environment Variables

Update your `.env.production` file (DO NOT commit this file):

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# DO NOT add OpenAI key here - it's in backend now!
```

---

## Step 8: Test Edge Functions

Test the deployed functions:

### Test chat-ia:
```bash
curl -i --location --request POST \
  'https://[project-ref].supabase.co/functions/v1/chat-ia' \
  --header 'Authorization: Bearer [your-anon-key]' \
  --header 'Content-Type: application/json' \
  --data '{
    "mensagem": "Olá, como está?",
    "contexto": {
      "nome": "Teste",
      "faseAtual": 1,
      "diaTotal": 1
    }
  }'
```

### Test analisar-reflexao:
```bash
curl -i --location --request POST \
  'https://[project-ref].supabase.co/functions/v1/analisar-reflexao' \
  --header 'Authorization: Bearer [your-anon-key]' \
  --header 'Content-Type: application/json' \
  --data '{
    "textoReflexao": "Hoje foi um dia de aprendizado",
    "faseAtual": 1
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "resposta": "AI response here...",
  "tokensUsados": 150
}
```

---

## Step 9: Deploy Frontend to Vercel

1. **Push code to GitHub**
   ```bash
   git push origin feature/v1.0-critical-fixes
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - DO NOT add `VITE_OPENAI_API_KEY`

3. **Deploy**
   - Vercel will auto-deploy on push
   - Or click "Deploy" button in dashboard

---

## Step 10: Verify Production

1. **Check Function Logs**
   ```bash
   # View chat-ia logs
   supabase functions logs chat-ia
   
   # View reflection analysis logs
   supabase functions logs analisar-reflexao
   ```

2. **Monitor Usage**
   - Check AI quota usage in database:
   ```sql
   SELECT * FROM daily_ai_usage_summary
   WHERE date >= CURRENT_DATE - 7;
   ```

3. **Test in Production**
   - Open your deployed app
   - Try sending a chat message
   - Verify AI response works
   - Check reflection analysis

---

## Troubleshooting

### Functions not working
```bash
# Check function status
supabase functions list

# View recent errors
supabase functions logs chat-ia --tail

# Redeploy if needed
supabase functions deploy chat-ia --no-verify-jwt
```

### Rate limit errors
```sql
-- Check user's quota
SELECT * FROM get_ai_quota_remaining('user-id-here');

-- Reset quota manually (admin only)
UPDATE ai_usage_quotas
SET chat_messages_today = 0, reflections_analyzed_today = 0
WHERE user_id = 'user-id-here';
```

### OpenAI API errors
- Verify API key is set correctly
- Check OpenAI account has credits
- Review function logs for detailed errors

### CORS issues
- Functions include CORS headers by default
- Verify Authorization header is sent
- Check browser console for specific errors

---

## Cost Monitoring

### Check Daily Costs
```sql
SELECT 
    date,
    total_chat_messages,
    total_reflections,
    total_tokens,
    total_cost
FROM daily_ai_usage_summary
ORDER BY date DESC
LIMIT 30;
```

### High-Usage Users
```sql
SELECT 
    k.nome,
    k.email,
    q.chat_messages_today,
    q.estimated_cost_today
FROM ai_usage_quotas q
JOIN keteros k ON k.id = q.user_id
WHERE q.quota_reset_date = CURRENT_DATE
ORDER BY q.estimated_cost_today DESC
LIMIT 10;
```

---

## Security Checklist

- [x] OpenAI API key stored only in Supabase secrets (not frontend)
- [x] Rate limiting enabled (50 chat/day, 3 reflections/day)
- [x] RLS policies enabled on ai_usage_quotas table
- [x] User authentication required for all function calls
- [x] CORS configured properly
- [x] No sensitive data in logs
- [x] Frontend `.env` files in `.gitignore`

---

## Rollback Plan

If something goes wrong:

1. **Revert to direct OpenAI calls** (temporary):
   - Add `VITE_OPENAI_API_KEY` back to frontend env
   - Code will fallback to direct calls

2. **Rollback database migrations**:
   ```sql
   DROP TABLE IF EXISTS ai_usage_quotas CASCADE;
   -- Then re-run old schema
   ```

3. **Undeploy functions**:
   ```bash
   supabase functions delete chat-ia
   supabase functions delete analisar-reflexao
   ```

---

## Next Steps

After deployment:

1. Monitor function logs for 24-48 hours
2. Check cost metrics daily for first week
3. Adjust rate limits if needed
4. Set up alerts for high costs
5. Optimize token usage based on actual patterns

---

## Support

- Supabase Docs: https://supabase.com/docs/guides/functions
- OpenAI Docs: https://platform.openai.com/docs
- KETER Issues: https://github.com/Tcamargolima/KETER/issues

---

**Deployment Checklist:**

- [ ] Supabase CLI installed
- [ ] Logged in to Supabase
- [ ] Project linked
- [ ] Secrets configured
- [ ] Functions deployed
- [ ] Migrations run
- [ ] Frontend env updated
- [ ] Functions tested
- [ ] Production deployed
- [ ] Monitoring active

🚀 **You're ready for production!**
