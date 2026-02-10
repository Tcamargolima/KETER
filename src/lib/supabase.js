// ================================================
// SUPABASE CLIENT CONFIGURATION
// ================================================
// src/lib/supabase.js

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
// IMPORTANTE: Substitua essas variáveis pelas suas credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação de segurança para variáveis de ambiente
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL não definida. Configure as variáveis de ambiente no .env ou nas configurações do Vercel.');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY não definida. Configure as variáveis de ambiente no .env ou nas configurações do Vercel.');
}

// Validar formato da URL
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`VITE_SUPABASE_URL inválida: "${supabaseUrl}". Deve ser uma URL HTTP ou HTTPS válida.`);
}

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// ================================================
// AUTH HELPERS
// ================================================

/**
 * Criar nova conta
 */
export const signUp = async (email, password, nome) => {
  try {
    // Constantes para retry
    const MAX_RETRIES = 8;
    const RETRY_DELAY_MS = 2000;

    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: nome
        }
      }
    });

    if (authError) throw authError;

    // 2. Criar perfil do Ketero com retry para PGRST204 (schema cache stale)
    if (authData.user) {
      console.log('Tentando criar perfil para user:', authData.user.id);

      // Helper function: Retry insert para contornar problema de schema cache
      const insertProfileWithRetry = async (profileData, maxRetries = MAX_RETRIES) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          const { error } = await supabase
            .from('keteros')
            .insert([profileData]);

          if (!error) {
            console.log('✅ Perfil criado com sucesso na tentativa', attempt);
            return;
          }

          // Só fazer retry se for erro de schema cache (PGRST204)
          if (error.code !== 'PGRST204') {
            console.error('Erro ao criar perfil (não é PGRST204):', error);
            throw error;
          }

          // Se não é a última tentativa, aguardar e tentar novamente
          if (attempt < maxRetries) {
            console.warn(`⚠️ Tentativa ${attempt}/${maxRetries}: Schema cache stale (PGRST204). Tentando novamente em 2s...`);
            console.error('Detalhes do erro PGRST204:', error);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
          }
        }

        // Se chegou aqui, todas as tentativas falharam
        console.error('❌ Falha após', maxRetries, 'tentativas. Schema cache não atualizado.');
        console.error('💡 Solução: Vá ao Supabase Dashboard > Settings > Restart project, depois rode NOTIFY pgrst, \'reload schema\'; no SQL Editor');
        throw new Error('Cache do banco desatualizado. Vá ao Supabase Dashboard > Settings > Restart project, depois rode NOTIFY pgrst, \'reload schema\'; no SQL Editor.');
      };

      // Executar insert com retry
      await insertProfileWithRetry({
        user_id: authData.user.id,
        email: email,
        nome: nome,
        created_at: new Date().toISOString()
      });
    }

    return { data: authData, error: null };
  } catch (error) {
    console.error('Erro no signup:', error);
    return { data: null, error };
  }
};

/**
 * Login
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Erro no signin:', error);
    return { data: null, error };
  }
};

/**
 * Logout
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Erro no signout:', error);
    return { error };
  }
};

/**
 * Obter sessão atual
 */
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    return { session: null, error };
  }
};

/**
 * Obter usuário atual
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return { user: null, error };
  }
};

/**
 * Resetar senha
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    return { error };
  }
};

/**
 * Atualizar senha
 */
export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return { error };
  }
};

// ================================================
// DATABASE HELPERS
// ================================================

/**
 * Obter perfil do Ketero
 */
export const getKeteroProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('keteros')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    return { data: null, error };
  }
};

/**
 * Atualizar perfil do Ketero
 */
export const updateKeteroProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('keteros')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return { data: null, error };
  }
};

/**
 * Salvar avaliação inicial
 */
export const saveAvaliacaoInicial = async (userId, avaliacao) => {
  try {
    const { data, error } = await supabase
      .from('avaliacoes_iniciais')
      .insert([
        {
          ketero_id: userId,
          ...avaliacao
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
    return { data: null, error };
  }
};

/**
 * Completar prática diária
 */
export const completarPratica = async (userId, pratica) => {
  try {
    // 1. Salvar prática
    const { error: praticaError } = await supabase
      .from('praticas_diarias')
      .upsert([
        {
          ketero_id: userId,
          data: new Date().toISOString().split('T')[0],
          pratica_id: pratica.id,
          titulo: pratica.titulo,
          categoria: pratica.categoria,
          duracao_minutos: Math.floor(pratica.duracao / 60),
          completada: true,
          completed_at: new Date().toISOString(),
          ...pratica.feedback
        }
      ], {
        onConflict: 'ketero_id,data'
      });

    if (praticaError) {
      if (praticaError.code === 'PGRST116' || praticaError.message?.includes('relation') || praticaError.message?.includes('does not exist')) {
        console.error('❌ Tabela não encontrada: praticas_diarias. Erro:', praticaError.code, praticaError.message);
        console.error('💡 Crie a tabela "praticas_diarias" no Supabase usando o arquivo supabase-schema.sql');
      }
      throw praticaError;
    }

    // 2. Atualizar estatísticas do ketero
    const { data: ketero } = await getKeteroProfile(userId);
    
    if (ketero) {
      const { error: updateError } = await supabase
        .from('keteros')
        .update({
          total_praticas: ketero.total_praticas + 1,
          sequencia_atual: ketero.sequencia_atual + 1,
          sequencia_maxima: Math.max(ketero.sequencia_maxima, ketero.sequencia_atual + 1),
          tempo_total_minutos: ketero.tempo_total_minutos + Math.floor(pratica.duracao / 60),
          dia_total_app: ketero.dia_total_app + 1,
          ultimo_acesso: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;
    }

    return { error: null };
  } catch (error) {
    console.error('Erro ao completar prática:', error);
    return { error };
  }
};

/**
 * Salvar reflexão noturna
 */
export const salvarReflexao = async (userId, reflexao) => {
  try {
    const { data, error } = await supabase
      .from('reflexoes')
      .upsert([
        {
          ketero_id: userId,
          data: new Date().toISOString().split('T')[0],
          ...reflexao
        }
      ], {
        onConflict: 'ketero_id,data'
      })
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('❌ Tabela não encontrada: reflexoes. Erro:', error.code, error.message);
        console.error('💡 Crie a tabela "reflexoes" no Supabase usando o arquivo database/schema-reflexoes-enhanced.sql');
      }
      throw error;
    }

    // Atualizar contador
    await supabase.rpc('increment_reflexoes', { p_user_id: userId });

    return { data, error: null };
  } catch (error) {
    console.error('Erro ao salvar reflexão:', error);
    return { data: null, error };
  }
};

/**
 * Obter práticas do mês
 */
export const getPraticasMes = async (userId, mes, ano) => {
  try {
    const startDate = `${ano}-${String(mes).padStart(2, '0')}-01`;
    const endDate = `${ano}-${String(mes).padStart(2, '0')}-31`;

    const { data, error } = await supabase
      .from('praticas_diarias')
      .select('*')
      .eq('ketero_id', userId)
      .gte('data', startDate)
      .lte('data', endDate)
      .order('data', { ascending: false });

    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('❌ Tabela não encontrada: praticas_diarias. Erro:', error.code, error.message);
        console.error('💡 Crie a tabela "praticas_diarias" no Supabase usando o arquivo supabase-schema.sql');
      }
      throw error;
    }
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Erro ao obter práticas do mês:', error);
    return { data: [], error };
  }
};

/**
 * Obter reflexões recentes
 */
export const getReflexoesRecentes = async (userId, limite = 10) => {
  try {
    const { data, error } = await supabase
      .from('reflexoes')
      .select('*')
      .eq('ketero_id', userId)
      .order('data', { ascending: false })
      .limit(limite);

    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('❌ Tabela não encontrada: reflexoes. Erro:', error.code, error.message);
        console.error('💡 Crie a tabela "reflexoes" no Supabase usando o arquivo database/schema-reflexoes-enhanced.sql');
      }
      throw error;
    }
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Erro ao obter reflexões recentes:', error);
    return { data: [], error };
  }
};

/**
 * Obter conquistas do usuário
 */
export const getConquistas = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('keteros_conquistas')
      .select(`
        *,
        conquistas (*)
      `)
      .eq('ketero_id', userId)
      .order('desbloqueada_em', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao obter conquistas:', error);
    return { data: null, error };
  }
};

/**
 * Verificar novas conquistas
 */
export const verificarConquistasNaoVistas = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('keteros_conquistas')
      .select(`
        *,
        conquistas (*)
      `)
      .eq('ketero_id', userId)
      .eq('visualizada', false)
      .order('desbloqueada_em', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao verificar conquistas:', error);
    return { data: null, error };
  }
};

/**
 * Marcar conquista como visualizada
 */
export const marcarConquistaVista = async (conquistaId) => {
  try {
    const { error } = await supabase
      .from('keteros_conquistas')
      .update({ visualizada: true })
      .eq('id', conquistaId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Erro ao marcar conquista:', error);
    return { error };
  }
};

/**
 * Salvar mensagem no chat com IA
 */
export const salvarConversaGuia = async (userId, mensagem, resposta, contexto = {}) => {
  try {
    const { data, error } = await supabase
      .from('conversas_guia')
      .insert([
        {
          ketero_id: userId,
          mensagem_ketero: mensagem,
          resposta_ia: resposta,
          contexto: contexto
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao salvar conversa:', error);
    return { data: null, error };
  }
};

/**
 * Obter histórico de conversas
 */
export const getHistoricoConversas = async (userId, limite = 50) => {
  try {
    const { data, error } = await supabase
      .from('conversas_guia')
      .select('*')
      .eq('ketero_id', userId)
      .order('created_at', { ascending: true })
      .limit(limite);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao obter histórico:', error);
    return { data: null, error };
  }
};

// ================================================
// PRÁTICAS HELPERS
// ================================================

/**
 * Obter todas as práticas
 */
export const getPraticas = async (filtros = {}) => {
  try {
    let query = supabase
      .from('praticas')
      .select('*')
      .order('fase', { ascending: true })
      .order('ordem', { ascending: true });

    // Aplicar filtros opcionais
    if (filtros.fase) {
      query = query.eq('fase', filtros.fase);
    }
    if (filtros.categoria) {
      query = query.eq('categoria', filtros.categoria);
    }

    const { data, error } = await query;
    
    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('❌ Tabela não encontrada: praticas. Erro:', error.code, error.message);
        console.error('💡 Crie a tabela "praticas" no Supabase usando o arquivo database/migration-praticas-table.sql');
      }
      throw error;
    }
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Erro ao obter práticas:', error);
    return { data: [], error };
  }
};

/**
 * Obter prática por ID
 */
export const getPraticaById = async (praticaId) => {
  try {
    const { data, error } = await supabase
      .from('praticas')
      .select('*')
      .eq('id', praticaId)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('❌ Tabela não encontrada: praticas. Erro:', error.code, error.message);
        console.error('💡 Crie a tabela "praticas" no Supabase usando o arquivo database/migration-praticas-table.sql');
      }
      throw error;
    }
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao obter prática por ID:', error);
    return { data: null, error };
  }
};

/**
 * Obter práticas de uma fase específica
 */
export const getPraticasByFase = async (fase) => {
  try {
    const { data, error } = await supabase
      .from('praticas')
      .select('*')
      .eq('fase', fase)
      .order('ordem', { ascending: true });

    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('❌ Tabela não encontrada: praticas. Erro:', error.code, error.message);
        console.error('💡 Crie a tabela "praticas" no Supabase usando o arquivo database/migration-praticas-table.sql');
      }
      throw error;
    }
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Erro ao obter práticas da fase:', error);
    return { data: [], error };
  }
};

/**
 * Obter histórico de práticas completadas pelo usuário
 */
export const getHistoricoPraticas = async (userId, limite = 30) => {
  try {
    const { data, error } = await supabase
      .from('praticas_diarias')
      .select('*')
      .eq('ketero_id', userId)
      .eq('completada', true)
      .order('completed_at', { ascending: false })
      .limit(limite);

    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('❌ Tabela não encontrada: praticas_diarias. Erro:', error.code, error.message);
        console.error('💡 Crie a tabela "praticas_diarias" no Supabase usando o arquivo supabase-schema.sql');
      }
      throw error;
    }
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Erro ao obter histórico de práticas:', error);
    return { data: [], error };
  }
};

// ================================================
// REALTIME SUBSCRIPTIONS
// ================================================

/**
 * Subscribe para mudanças no perfil
 */
export const subscribeToProfile = (userId, callback) => {
  return supabase
    .channel(`profile:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'keteros',
        filter: `id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};

/**
 * Subscribe para novas conquistas
 */
export const subscribeToConquistas = (userId, callback) => {
  return supabase
    .channel(`conquistas:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'keteros_conquistas',
        filter: `ketero_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};

// ================================================
// NOTIFICATIONS HELPERS
// ================================================

/**
 * Criar notificação
 */
export const createNotification = async (userId, { type, title, body, data = {} }) => {
  try {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          type,
          title,
          body,
          data
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data: notification, error: null };
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    return { data: null, error };
  }
};

/**
 * Obter notificações do usuário
 */
export const getNotifications = async (userId, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao obter notificações:', error);
    return { data: null, error };
  }
};

/**
 * Marcar notificação como lida
 */
export const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Erro ao marcar notificação:', error);
    return { error };
  }
};

/**
 * Marcar todas notificações como lidas
 */
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Erro ao marcar todas notificações:', error);
    return { error };
  }
};

/**
 * Subscribe para notificações em tempo real
 */
export const subscribeToNotifications = (userId, callback) => {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};

// ================================================
// STORAGE HELPERS (para fotos de perfil futuras)
// ================================================

/**
 * Upload de foto de perfil
 */
export const uploadProfilePhoto = async (userId, file) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    // Atualizar perfil
    await updateKeteroProfile(userId, { foto_url: publicUrl });

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return { url: null, error };
  }
};

// ================================================
// CIRCLES (CÍRCULOS) HELPERS - PHASE 11
// ================================================

/**
 * Obter círculos públicos e círculos que o usuário é membro
 */
export const getCirculos = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('circulos')
      .select('*')
      .or(`is_public.eq.true,created_by.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao obter círculos:', error);
    return { data: null, error };
  }
};

/**
 * Criar novo círculo
 */
export const createCirculo = async (userId, circuloData) => {
  try {
    const { data, error } = await supabase
      .from('circulos')
      .insert([
        {
          ...circuloData,
          created_by: userId
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao criar círculo:', error);
    return { data: null, error };
  }
};

/**
 * Entrar em um círculo
 */
export const joinCirculo = async (userId, circuloId) => {
  try {
    const { data, error } = await supabase
      .from('circulo_membros')
      .insert([
        {
          circulo_id: circuloId,
          user_id: userId,
          role: 'member'
        }
      ])
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao entrar no círculo:', error);
    return { data: null, error };
  }
};

/**
 * Sair de um círculo
 */
export const leaveCirculo = async (userId, circuloId) => {
  try {
    const { error } = await supabase
      .from('circulo_membros')
      .delete()
      .eq('circulo_id', circuloId)
      .eq('user_id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Erro ao sair do círculo:', error);
    return { error };
  }
};

/**
 * Obter mensagens de um círculo
 */
export const getCirculoMensagens = async (circuloId, limit = 100) => {
  try {
    const { data, error } = await supabase
      .from('circulo_mensagens')
      .select(`
        *,
        keteros(id, nome, foto_url)
      `)
      .eq('circulo_id', circuloId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao obter mensagens:', error);
    return { data: null, error };
  }
};

/**
 * Enviar mensagem em um círculo
 */
export const sendCirculoMensagem = async (userId, circuloId, mensagem, anonimo = false) => {
  try {
    // Obter nome do usuário
    const { data: userData } = await getKeteroProfile(userId);

    const { data, error } = await supabase
      .from('circulo_mensagens')
      .insert([
        {
          circulo_id: circuloId,
          user_id: userId,
          mensagem: mensagem,
          anonimo: anonimo,
          user_nome: userData?.nome || 'Usuário'
        }
      ])
      .select(`
        *,
        keteros(id, nome, foto_url)
      `)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return { data: null, error };
  }
};

/**
 * Subscribe para mensagens de um círculo em tempo real
 */
export const subscribeToCirculoMensagens = (circuloId, callback) => {
  return supabase
    .channel(`circulo:${circuloId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'circulo_mensagens',
        filter: `circulo_id=eq.${circuloId}`
      },
      callback
    )
    .subscribe();
};

// ================================================
// EXPORT DEFAULT
// ================================================
export default supabase;
