import { supabase } from '@/lib/supabase'

export const practicesService = {
  // Buscar prática do dia
  async getDailyPractice(userId) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('fase_atual, dia_atual')
        .eq('id', userId)
        .single()

      const { data, error } = await supabase
        .from('praticas')
        .select('*')
        .eq('fase', profile.fase_atual)
        .eq('dia', profile.dia_atual)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Buscar todas as práticas
  async getAllPractices() {
    try {
      const { data, error } = await supabase
        .from('praticas')
        .select('*')
        .order('fase', { ascending: true })
        .order('dia', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Buscar prática específica
  async getPracticeById(id) {
    try {
      const { data, error } = await supabase
        .from('praticas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Completar prática
  async completePractice(userId, practiceId, duration, notes = '') {
    try {
      const { data, error } = await supabase
        .from('praticas_completadas')
        .insert({
          user_id: userId,
          pratica_id: practiceId,
          duracao_segundos: duration,
          notas: notes,
          completado_em: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Atualizar streak e estatísticas
      await this.updateUserStats(userId)

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Atualizar estatísticas do usuário
  async updateUserStats(userId) {
    try {
      // Calcular streak
      const { data: completions } = await supabase
        .from('praticas_completadas')
        .select('completado_em')
        .eq('user_id', userId)
        .order('completado_em', { ascending: false })
        .limit(30)

      const streak = this.calculateStreak(completions)

      // Atualizar perfil
      await supabase
        .from('profiles')
        .update({
          streak_atual: streak,
          total_praticas: completions.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      return { success: true }
    } catch (error) {
      console.error('Error updating stats:', error)
      return { success: false, error }
    }
  },

  // Calcular streak
  calculateStreak(completions) {
    if (!completions || completions.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < completions.length; i++) {
      const completionDate = new Date(completions[i].completado_em)
      completionDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor((today - completionDate) / (1000 * 60 * 60 * 24))

      if (diffDays === i) {
        streak++
      } else {
        break
      }
    }

    return streak
  }
}
