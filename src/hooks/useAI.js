import { useState } from 'react'
import { openai, isAIAvailable, safeAICall } from '@/lib/openai'

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const chat = async (message, context = {}) => {
    if (!isAIAvailable()) {
      return {
        response: 'Desculpe, o serviço de IA está temporariamente indisponível.',
        error: 'IA não disponível'
      }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await safeAICall(async (ai) => {
        const completion = await ai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Você é um assistente compassivo e sábio do KETER, uma plataforma de evolução pessoal. 
                       Seu objetivo é apoiar o usuário em sua jornada de autoconhecimento.
                       Seja empático, encorajador e ofereça insights profundos quando apropriado.
                       Mantenha respostas concisas (max 3 parágrafos).`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })

        return completion.choices[0].message.content
      })

      setLoading(false)
      return { response, error: null }
    } catch (err) {
      setLoading(false)
      setError(err.message)
      return { response: null, error: err.message }
    }
  }

  const analyzeReflection = async (reflection) => {
    setLoading(true)
    setError(null)

    try {
      const response = await safeAICall(async (ai) => {
        // Using gpt-3.5-turbo for cost efficiency
        // Can be upgraded to gpt-4 if more sophisticated analysis is needed
        const completion = await ai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Você é um analista de evolução pessoal do KETER.
                       Analise a reflexão do usuário e forneça insights sobre:
                       1. Padrões emocionais identificados
                       2. Progresso em relação a objetivos
                       3. Sugestões de práticas adequadas
                       Seja específico e compassivo.`
            },
            {
              role: 'user',
              content: `Reflita sobre: ${reflection}`
            }
          ],
          temperature: 0.8,
          max_tokens: 800
        })

        return completion.choices[0].message.content
      })

      setLoading(false)
      return { analysis: response, error: null }
    } catch (err) {
      setLoading(false)
      setError(err.message)
      return { analysis: null, error: err.message }
    }
  }

  return {
    chat,
    analyzeReflection,
    loading,
    error,
    isAvailable: isAIAvailable()
  }
}
