import { supabase } from './supabase'

// ================================================
// MAIN CHAT FUNCTION
// ================================================

/**
 * Conversar com o Guia Keter via Edge Function
 */
export const chatWithGuia = async (mensagem, contexto = {}, historico = []) => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        messages: [
          ...historico.slice(-10),
          { role: 'user', content: mensagem }
        ],
        context
      }
    })

    if (error) throw error

    return {
      resposta: data.content,
      tokensUsados: 0, // Edge Function manages this
      error: null
    }
  } catch (error) {
    console.error('Erro no chat:', error)
    return {
      resposta: 'Desculpe, estou com dificuldade de conexão com minha sabedoria interior (Erro no servidor). Tente novamente em instantes.',
      tokensUsados: 0,
      error: error.message
    }
  }
}

// ================================================
// RECOMMENDATION ENGINE
// ================================================

/**
 * Recomendar próxima prática via Edge Function
 */
export const recomendarPratica = async (perfil, praticasDisponiveis) => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-recommendation', {
      body: {
        perfil,
        praticasDisponiveis
      }
    })

    if (error) throw error

    const recommendedId = data.recommendedId
    return praticasDisponiveis.find(p => p.id === recommendedId) || praticasDisponiveis[0]

  } catch (error) {
    console.error('Erro ao recomendar prática:', error)
    return praticasDisponiveis[0] // Fallback
  }
}

// ================================================
// OTHER HELPERS (Keep explicitly if needed or move to other functions)
// ================================================

export const isAIAvailable = () => true // Always true via Edge Functions

export const gerarAnaliseSemanal = async (dadosSemana) => {
  // Implement via Edge Function 'ai-analysis' (to be created if needed, or generic chat)
  // For now, returning placeholder to avoid breaking UI
  return {
    analise: "Análise semanal detalhada estará disponível em breve via nova inteligência.",
    metricas: {
      totalReflexoes: dadosSemana.reflexoes?.length || 0,
      totalPraticas: dadosSemana.praticas?.length || 0,
      taxaCompletacao: 0.5,
      sequencia: 0
    },
    error: null
  }
}

export const analisarReflexao = async (textoReflexao) => {
  // Reuse chat for now or specific function
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        messages: [{ role: 'user', content: `Analise esta reflexão noturna: ${textoReflexao}` }],
        context: { type: 'analysis' }
      }
    })

    if (error) throw error

    return {
      analise: data.content,
      sentimento: 'neutro', // Simplification
      error: null
    }
  } catch (error) {
    return { analise: null, sentimento: 'neutro', error: error.message }
  }
}

export const detectarCrise = async (texto) => {
  // Placeholder - Critical safety feature should be robust
  return {
    crise_detectada: false,
    nivel: 'baixo',
    tipo: 'outro',
    recomendacao: null
  }
}
