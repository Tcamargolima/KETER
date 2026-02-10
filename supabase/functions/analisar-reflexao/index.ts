// ================================================
// SUPABASE EDGE FUNCTION: analisar-reflexao
// ================================================
// Analyzes night reflections with AI
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
    // Get OpenAI API key from environment
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Parse request
    const { textoReflexao, faseAtual } = await req.json()

    // Validate inputs
    if (!textoReflexao || !faseAtual) {
      throw new Error('Missing required fields: textoReflexao and faseAtual')
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Rate limiting: Check reflection count today
    const hoje = new Date().toISOString().split('T')[0]
    const { count, error: countError } = await supabase
      .from('reflexoes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', `${hoje}T00:00:00`)

    if (countError) {
      console.error('Rate limit check error:', countError)
    }

    // Allow up to 3 AI analyses per day
    if (count && count >= 3) {
      throw new Error('Daily AI analysis limit reached (3 per day). Try again tomorrow.')
    }

    // Build AI prompt
    const getFaseNome = (fase: number) => {
      const fases = { 1: 'DESPERTAR', 2: 'DISCIPLINA', 3: 'CONSCIÊNCIA', 4: 'SERVIÇO' }
      return fases[fase as keyof typeof fases] || 'DESPERTAR'
    }

    const prompt = `Analise esta reflexão noturna de um usuário na Fase ${getFaseNome(faseAtual)} do KETER (aplicativo de evolução pessoal):

"${textoReflexao}"

Forneça:
1. Um feedback empático e construtivo (2-3 parágrafos)
2. Um insight sobre o estado emocional atual
3. Uma sugestão prática para o próximo dia

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
            content: 'Você é um guia empático de evolução pessoal. Forneça feedback construtivo e encorajador para reflexões noturnas.'
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
    const tokensUsados = data.usage.total_tokens

    // Analyze sentiment (basic local analysis)
    const textoLower = textoReflexao.toLowerCase()
    const positivas = ['feliz', 'grato', 'bem', 'melhor', 'ótimo', 'bom', 'alegre', 'satisfeito']
    const negativas = ['triste', 'mal', 'difícil', 'ruim', 'frustrado', 'cansado', 'ansioso']
    
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

    // Extract keywords
    const todasPalavras = [...positivas, ...negativas]
    const palavrasChave = todasPalavras.filter(p => textoLower.includes(p)).slice(0, 5)

    // Log for monitoring
    console.log(`Reflection analysis completed for user ${user.id}, tokens: ${tokensUsados}`)

    // Return result
    return new Response(
      JSON.stringify({
        success: true,
        analise,
        palavrasChave,
        sentimento,
        tokensUsados,
        error: null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in analisar-reflexao:', error)
    return new Response(
      JSON.stringify({
        success: false,
        analise: null,
        sentimento: 'neutro',
        error: error.message.includes('limit') 
          ? error.message 
          : 'Erro ao analisar reflexão. Tente novamente.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message.includes('Unauthorized') ? 401 : 400
      }
    )
  }
})
