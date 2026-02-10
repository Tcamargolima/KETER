// ================================================
// SUPABASE EDGE FUNCTION: chat-ia
// ================================================
// Moves OpenAI chat functionality to backend for security
// Deploy: supabase functions deploy chat-ia

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple in-memory rate limiter (per user)
const rateLimiter = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string, maxRequests = 50): boolean {
  const now = Date.now();
  const dayStart = new Date().setHours(0, 0, 0, 0);
  
  const userLimit = rateLimiter.get(userId);
  
  // Reset if new day
  if (!userLimit || userLimit.resetAt < dayStart) {
    rateLimiter.set(userId, { count: 1, resetAt: dayStart + 24 * 60 * 60 * 1000 });
    return true;
  }
  
  // Check limit
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  // Increment
  userLimit.count++;
  return true;
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
    const { mensagem, contexto = {}, historico = [] } = await req.json()

    // Validate inputs
    if (!mensagem || typeof mensagem !== 'string') {
      throw new Error('Invalid message')
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

    // Rate limiting: 50 messages per day per user
    if (!checkRateLimit(user.id)) {
      throw new Error('Daily message limit reached (50 messages/day). Try again tomorrow.')
    }

    // Check cache for similar messages (simple approach)
    const cacheKey = `chat_${user.id}_${mensagem.substring(0, 50)}`
    
    // Build system message with context
    const getFaseNome = (fase: number) => {
      const fases = { 1: 'DESPERTAR', 2: 'DISCIPLINA', 3: 'CONSCIÊNCIA', 4: 'SERVIÇO' }
      return fases[fase as keyof typeof fases] || 'DESPERTAR'
    }

    const systemPrompt = `Você é o Guia Keter, um mentor de IA especializado em evolução pessoal e autoconhecimento.

SOBRE O KETER:
O KETER é um aplicativo de evolução pessoal baseado em 4 fases:
1. DESPERTAR (14 dias): Autoconhecimento inicial
2. DISCIPLINA (16 dias): Formação de hábitos sustentáveis
3. CONSCIÊNCIA (30 dias): Percepção de transformação
4. SERVIÇO (ilimitado): Impacto no mundo

SUAS DIRETRIZES:
1. TOM: Empático mas direto, encorajador sem ser superficial
2. RESPOSTAS: Breves (máximo 3 parágrafos)
3. BASE-SE EM DADOS: Use o contexto do usuário para personalizar
4. SEJA HONESTO: Não prometa milagres, admita quando não souber
5. SEGURANÇA: Se detectar crise (suicídio, depressão grave), sugira ajuda profissional

CONTEXTO DO USUÁRIO:
- Nome: ${contexto.nome || 'Ketero'}
- Fase: ${contexto.faseAtual || 1} (${getFaseNome(contexto.faseAtual)})
- Dia no app: ${contexto.diaTotal || 1}
- Sequência: ${contexto.sequencia || 0} dias
- Total práticas: ${contexto.totalPraticas || 0}
${contexto.ultimaReflexao ? `- Última reflexão: "${contexto.ultimaReflexao.substring(0, 200)}..."` : ''}
${contexto.padraoDetectado ? `- Padrão observado: ${contexto.padraoDetectado}` : ''}`

    // Build messages array (limit history to last 10)
    const messages = [
      { role: 'system', content: systemPrompt },
      ...historico.slice(-10),
      { role: 'user', content: mensagem }
    ]

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.3
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const resposta = data.choices[0].message.content
    const tokensUsados = data.usage.total_tokens

    // Log for monitoring
    console.log(`Chat completed for user ${user.id}, tokens: ${tokensUsados}`)

    // Save conversation to database (optional - for history)
    try {
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        message: mensagem,
        response: resposta,
        tokens_used: tokensUsados,
        context: contexto
      })
    } catch (dbError) {
      console.error('Failed to save chat history:', dbError)
      // Don't fail the request if db save fails
    }

    // Return response
    return new Response(
      JSON.stringify({
        success: true,
        resposta,
        tokensUsados,
        error: null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in chat-ia:', error)
    return new Response(
      JSON.stringify({
        success: false,
        resposta: error.message.includes('limit') 
          ? error.message 
          : 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente.',
        tokensUsados: 0,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message.includes('Unauthorized') ? 401 : 400
      }
    )
  }
})
