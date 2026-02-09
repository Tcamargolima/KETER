// ================================================
// HOOK: useSmartReminders
// ================================================
// Gerencia lembretes inteligentes baseados em:
// - Horários (manhã 07:00-09:00, noite 20:00-22:00)
// - Streak perdido
// - Análise de humor/reflexão pela IA
// - Comportamento do usuário

import { useEffect, useCallback, useRef } from 'react';
import { supabase, createNotification } from '../lib/supabase';
import { isValidUUID } from '../lib/utils';

/**
 * Hook para gerenciar lembretes inteligentes
 * @param {string} userId - ID do usuário
 * @param {Object} userProfile - Perfil do usuário com estatísticas
 * @param {Function} onNotificationCreated - Callback quando notificação é criada
 */
export const useSmartReminders = (userId, userProfile, onNotificationCreated) => {
  const lastReminderCheck = useRef({
    morning: null,
    evening: null,
    streak: null
  });

  // ================================================
  // 1. Verificar se deve enviar lembrete matinal
  // ================================================
  const checkMorningReminder = useCallback(async () => {
    if (!userId || !userProfile) return;

    // Validar UUID antes de fazer query
    if (!isValidUUID(userId)) {
      console.error('UUID inválido em useSmartReminders:', userId);
      return;
    }

    const now = new Date();
    const hour = now.getHours();
    
    // Verificar se está entre 07:00 e 09:00
    if (hour >= 7 && hour < 9) {
      // Verificar se já enviou hoje
      const today = now.toISOString().split('T')[0];
      
      if (lastReminderCheck.current.morning === today) {
        return; // Já enviou hoje
      }

      // Verificar se já praticou hoje
      const { data: praticaHoje, error: praticaError } = await supabase
        .from('praticas_diarias')
        .select('id')
        .eq('ketero_id', userId)
        .eq('data', today)
        .eq('completada', true)
        .single();

      if (praticaError && praticaError.code === 'PGRST116') {
        console.error('❌ Tabela não encontrada: praticas_diarias. Erro:', praticaError.code);
        console.error('💡 Crie a tabela "praticas_diarias" no Supabase usando o arquivo supabase-schema.sql');
        return;
      }

      if (praticaHoje) {
        return; // Já praticou hoje
      }

      // Criar notificação de lembrete matinal
      await createNotification(userId, {
        type: 'lembrete_pratica',
        title: '🌅 Hora da prática matinal!',
        body: 'Comece seu dia com clareza. Uma prática rápida pode transformar todo o seu dia. A IA recomenda agora!',
        data: {
          hora: now.toISOString(),
          tipo_lembrete: 'matinal'
        }
      });

      lastReminderCheck.current.morning = today;
      onNotificationCreated?.();
    }
  }, [userId, userProfile, onNotificationCreated]);

  // ================================================
  // 2. Verificar se deve enviar lembrete noturno
  // ================================================
  const checkEveningReminder = useCallback(async () => {
    if (!userId || !userProfile) return;

    const now = new Date();
    const hour = now.getHours();
    
    // Verificar se está entre 20:00 e 22:00
    if (hour >= 20 && hour < 22) {
      // Verificar se já enviou hoje
      const today = now.toISOString().split('T')[0];
      
      if (lastReminderCheck.current.evening === today) {
        return; // Já enviou hoje
      }

      // Verificar se já refletiu hoje
      const { data: reflexaoHoje, error: reflexaoError } = await supabase
        .from('reflexoes')
        .select('id')
        .eq('ketero_id', userId)
        .eq('data', today)
        .single();

      if (reflexaoError && reflexaoError.code === 'PGRST116') {
        console.error('❌ Tabela não encontrada: reflexoes. Erro:', reflexaoError.code);
        console.error('💡 Crie a tabela "reflexoes" no Supabase usando o arquivo database/schema-reflexoes-enhanced.sql');
        return;
      }

      if (reflexaoHoje) {
        return; // Já refletiu hoje
      }

      // Criar notificação de lembrete noturno
      await createNotification(userId, {
        type: 'lembrete_reflexao',
        title: '🌙 Vamos refletir sobre o dia?',
        body: 'Reserve alguns minutos para registrar seus sentimentos e aprendizados de hoje. É um momento só seu.',
        data: {
          hora: now.toISOString(),
          tipo_lembrete: 'noturno'
        }
      });

      lastReminderCheck.current.evening = today;
      onNotificationCreated?.();
    }
  }, [userId, userProfile, onNotificationCreated]);

  // ================================================
  // 3. Verificar streak perdido
  // ================================================
  const checkStreakLost = useCallback(async () => {
    if (!userId || !userProfile) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Verificar se já enviou aviso de streak hoje
    if (lastReminderCheck.current.streak === today) {
      return;
    }

    // Se tinha um streak e agora está zerado, avisar
    if (userProfile.sequencia_maxima > 7 && userProfile.sequencia_atual === 0) {
      // Verificar se praticou hoje
      const { data: praticaHoje, error: praticaError } = await supabase
        .from('praticas_diarias')
        .select('id')
        .eq('ketero_id', userId)
        .eq('data', today)
        .eq('completada', true)
        .single();

      if (praticaError && praticaError.code === 'PGRST116') {
        console.error('❌ Tabela não encontrada: praticas_diarias. Erro:', praticaError.code);
        console.error('💡 Crie a tabela "praticas_diarias" no Supabase usando o arquivo supabase-schema.sql');
        return;
      }

      if (!praticaHoje) {
        // Criar notificação de streak perdido
        await createNotification(userId, {
          type: 'streak_perdido',
          title: '💔 Seu streak foi interrompido...',
          body: `Você tinha ${userProfile.sequencia_maxima} dias seguidos! Mas não se preocupe, vamos reconectar? Um novo começo está a um passo de distância.`,
          data: {
            streak_perdido: userProfile.sequencia_maxima,
            data: today
          }
        });

        lastReminderCheck.current.streak = today;
        onNotificationCreated?.();
      }
    }
  }, [userId, userProfile, onNotificationCreated]);

  // ================================================
  // 4. Verificar e enviar feedback da IA baseado em reflexões
  // ================================================
  const checkIAFeedback = useCallback(async () => {
    if (!userId || !userProfile) return;

    // Buscar última reflexão
    const { data: ultimaReflexao, error: reflexaoError } = await supabase
      .from('reflexoes')
      .select('*')
      .eq('ketero_id', userId)
      .order('data', { ascending: false })
      .limit(1)
      .single();

    if (reflexaoError) {
      if (reflexaoError.code === 'PGRST116' || reflexaoError.message?.includes('relation') || reflexaoError.message?.includes('does not exist')) {
        console.error('❌ Tabela não encontrada: reflexoes. Erro:', reflexaoError.code);
        console.error('💡 Crie a tabela "reflexoes" no Supabase usando o arquivo database/schema-reflexoes-enhanced.sql');
      }
      return;
    }

    if (!ultimaReflexao) return;

    // Verificar se a reflexão foi feita há menos de 24h
    const reflexaoDate = new Date(ultimaReflexao.created_at);
    const now = new Date();
    const hoursSince = (now - reflexaoDate) / (1000 * 60 * 60);

    if (hoursSince > 24) return;

    // Se detectou sentimento baixo (você pode ajustar essa lógica)
    if (ultimaReflexao.sentimento_detectado === 'triste' || 
        ultimaReflexao.sentimento_detectado === 'ansioso') {
      
      // Verificar se já enviou feedback para esta reflexão
      const { data: notifExistente } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .eq('type', 'ia_feedback')
        .contains('data', { reflexao_id: ultimaReflexao.id })
        .single();

      if (notifExistente) return;

      // Criar notificação de feedback da IA
      await createNotification(userId, {
        type: 'ia_feedback',
        title: '💫 A IA percebeu algo...',
        body: 'Notei uma energia mais baixa na sua última reflexão. Que tal uma prática de gratidão ou respiração? Estou aqui para apoiar você.',
        data: {
          reflexao_id: ultimaReflexao.id,
          sentimento: ultimaReflexao.sentimento_detectado,
          sugestao: 'pratica_gratidao'
        }
      });

      onNotificationCreated?.();
    }
  }, [userId, userProfile, onNotificationCreated]);

  // ================================================
  // 5. Loop de verificação periódica
  // ================================================
  useEffect(() => {
    if (!userId || !userProfile) return;

    // Verificar imediatamente
    checkMorningReminder();
    checkEveningReminder();
    checkStreakLost();
    checkIAFeedback();

    // Verificar a cada 15 minutos
    const interval = setInterval(() => {
      checkMorningReminder();
      checkEveningReminder();
      checkStreakLost();
      checkIAFeedback();
    }, 15 * 60 * 1000); // 15 minutos

    return () => clearInterval(interval);
  }, [
    userId, 
    userProfile, 
    checkMorningReminder, 
    checkEveningReminder, 
    checkStreakLost,
    checkIAFeedback
  ]);

  // ================================================
  // 6. Retornar API do hook
  // ================================================
  return {
    checkMorningReminder,
    checkEveningReminder,
    checkStreakLost,
    checkIAFeedback
  };
};

export default useSmartReminders;
