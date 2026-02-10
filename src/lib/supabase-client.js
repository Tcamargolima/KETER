// ================================================
// SUPABASE CLIENT CONFIGURATION
// ================================================
// src/lib/supabase.js

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug obrigatório para deploy
console.log('[Supabase Debug] VITE_SUPABASE_URL:', supabaseUrl);
console.log('[Supabase Debug] VITE_SUPABASE_ANON_KEY presente?', !!supabaseAnonKey);

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.error('[Supabase Error] URL inválida ou não carregada. Valor atual:', supabaseUrl);
  // Não throw ainda, para não crashar o app inteiro, mas logar
}

if (!supabaseAnonKey) {
  console.error('[Supabase Error] Anon key ausente!');
}

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

    // 2. Criar perfil do Ketero
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('keteros')
        .insert([
          {
            id: authData.user.id,
            email: email,
            nome: nome,
            created_at: new Date().toISOString()
          }
        ]);

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        throw profileError;
      }
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
      .single();

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
      .single();

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
      .single();

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

    if (praticaError) throw praticaError;

    // 2. Atualizar estatísticas do ketero
    const { data: ketero } = await getKeteroProfile(userId);
    
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
      .from('reflexoes_noturnas')
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
      .single();

    if (error) throw error;

    // Atualizar contador
    await supabase.rpc('increment_reflexoes', { user_id: userId });

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

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao obter práticas:', error);
    return { data: null, error };
  }
};

/**
 * Obter reflexões recentes
 */
export const getReflexoesRecentes = async (userId, limite = 10) => {
  try {
    const { data, error } = await supabase
      .from('reflexoes_noturnas')
      .select('*')
      .eq('ketero_id', userId)
      .order('data', { ascending: false })
      .limit(limite);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao obter reflexões:', error);
    return { data: null, error };
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
      .single();

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
// EXPORT DEFAULT
// ================================================
export default supabase;
