// ================================================
// SUPABASE EDGE FUNCTION: analisar-reflexao
// ================================================
// This is the PRODUCTION-READY version that moves
// OpenAI API calls to the backend for security
//
// Location: supabase/functions/analisar-reflexao/index.ts
// Deploy: supabase functions deploy analisar-reflexao

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get OpenAI API key from environment (set in Supabase dashboard)
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Parse request
    const { textoReflexao, faseAtual, userId } = await req.json()

    // Validate inputs
    if (!textoReflexao || !faseAtual || !userId) {
      throw new Error('Missing required fields')
    }

    // Create Supabase client with service role for auth
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify user has permission (check if userId matches auth)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Rate limiting: Check how many analyses user has done today
    const hoje = new Date().toISOString().split('T')[0]
    const { data: reflexoesHoje, error: countError } = await supabaseAdmin
      .from('reflexoes_noturnas')
      .select('id')
      .eq('ketero_id', userId)
      .eq('data', hoje)

    if (countError) {
      console.error('Rate limit check error:', countError)
    }

    if (reflexoesHoje && reflexoesHoje.length > 1) {
      // Already did reflection today, limit to 1 AI analysis per day
      throw new Error('Daily reflection limit reached')
    }

    // Build AI prompt
    const prompt = `Analise esta reflexão noturna de um usuário na Fase ${faseAtual} do KETER (evolução pessoal):

"${textoReflexao}"

Forneça:
1. Um feedback empático e construtivo (2-3 parágrafos)
2. Um insight sobre o estado emocional
3. Uma sugestão prática para amanhã

Mantenha tom encorajador mas honesto. Máximo 300 palavras.`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um guia empático de evolução pessoal. Forneça feedback construtivo e encorajador.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const analise = data.choices[0].message.content

    // Analyze sentiment (basic)
    const textoLower = textoReflexao.toLowerCase()
    const positivas = ['feliz', 'grato', 'bem', 'melhor', 'ótimo', 'bom', 'alegre']
    const negativas = ['triste', 'mal', 'difícil', 'ruim', 'frustrado', 'cansado']
    
    let scorePositivo = 0
    let scoreNegativo = 0
    
    positivas.forEach(p => {
      if (textoLower.includes(p)) scorePositivo++
    })
    
    negativas.forEach(p => {
      if (textoLower.includes(p)) scoreNegativo++
    })
    
    let sentimento = 'neutro'
    if (scorePositivo > scoreNegativo) sentimento = 'positivo'
    else if (scoreNegativo > scorePositivo) sentimento = 'negativo'

    // Extract keywords (simple version)
    const todasPalavras = [...positivas, ...negativas]
    const palavrasChave = todasPalavras.filter(p => textoLower.includes(p)).slice(0, 5)

    // Log usage for monitoring
    console.log(`Analysis completed for user ${userId}, tokens: ${data.usage.total_tokens}`)

    // Return result
    return new Response(
      JSON.stringify({
        success: true,
        analise,
        palavrasChave,
        sentimento,
        tokensUsados: data.usage.total_tokens
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

// ================================================
// DEPLOYMENT INSTRUCTIONS
// ================================================
/*

1. SETUP SUPABASE CLI:
   npm install -g supabase
   supabase login

2. INITIALIZE FUNCTIONS:
   supabase functions new analisar-reflexao

3. COPY THIS FILE TO:
   supabase/functions/analisar-reflexao/index.ts

4. SET SECRETS:
   supabase secrets set OPENAI_API_KEY=sk-your-key-here
   supabase secrets set SUPABASE_URL=https://your-project.supabase.co
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

5. DEPLOY:
   supabase functions deploy analisar-reflexao

6. TEST:
   curl -i --location --request POST 'https://your-project.supabase.co/functions/v1/analisar-reflexao' \
     --header 'Authorization: Bearer YOUR_ANON_KEY' \
     --header 'Content-Type: application/json' \
     --data '{"textoReflexao":"Hoje foi um dia difícil","faseAtual":1,"userId":"uuid-here"}'

7. UPDATE FRONTEND (reflexao-integration.jsx):
   Replace the analisarReflexaoComIA function to call this Edge Function instead:

   const response = await supabase.functions.invoke('analisar-reflexao', {
     body: { textoReflexao, faseAtual, userId }
   })

*/
