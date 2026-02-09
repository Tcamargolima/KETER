// ================================================
// HOOK: useConteudoEducacional
// ================================================
// Hook para gerenciar conteúdo educacional (biblioteca)

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { isValidUUID } from '../lib/utils';

/**
 * Hook para gerenciar conteúdo educacional
 * @param {string} userId - ID do usuário
 * @param {object} filtros - Filtros opcionais (fase, tipo, categoria, tags)
 */
export const useConteudoEducacional = (userId, filtros = {}) => {
  const [conteudos, setConteudos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // ================================================
  // FETCH: Buscar conteúdos
  // ================================================
  const buscarConteudos = async (filtrosCustom = {}) => {
    try {
      setCarregando(true);
      setErro(null);

      const filtrosFinais = { ...filtros, ...filtrosCustom };

      let query = supabase
        .from('conteudo_educacional')
        .select('*')
        .eq('publicado', true)
        .order('ordem', { ascending: true })
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filtrosFinais.fase) {
        // Incluir conteúdo universal (fase = null) + conteúdo da fase específica
        query = query.or(`fase.eq.${filtrosFinais.fase},fase.is.null`);
      }

      if (filtrosFinais.tipo) {
        query = query.eq('tipo', filtrosFinais.tipo);
      }

      if (filtrosFinais.categoria) {
        query = query.eq('categoria', filtrosFinais.categoria);
      }

      if (filtrosFinais.destaque) {
        query = query.eq('destaque', true);
      }

      // Filtro por tags (JSONB array contains)
      if (filtrosFinais.tags && filtrosFinais.tags.length > 0) {
        query = query.contains('tags', filtrosFinais.tags);
      }

      const { data, error } = await query;

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.error('❌ Tabela não encontrada: conteudo_educacional. Erro:', error.code, error.message);
          console.error('💡 Crie a tabela "conteudo_educacional" no Supabase usando o arquivo database/migrations/add-conteudo-educacional.sql');
        }
        throw error;
      }

      setConteudos(data || []);
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar conteúdos:', error);
      setErro(error.message);
      return { data: null, error };
    } finally {
      setCarregando(false);
    }
  };

  // ================================================
  // FETCH: Buscar favoritos do usuário
  // ================================================
  const buscarFavoritos = async () => {
    if (!userId) return { data: [], error: null };

    // Validar UUID antes de fazer query
    if (!isValidUUID(userId)) {
      console.error('UUID inválido em buscarFavoritos:', userId);
      return { data: [], error: 'ID de usuário inválido' };
    }

    try {
      const { data, error } = await supabase
        .from('conteudo_favoritos')
        .select(`
          *,
          conteudo_educacional (*)
        `)
        .eq('ketero_id', userId)
        .order('adicionado_em', { ascending: false });

      if (error) throw error;

      setFavoritos(data || []);
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      return { data: null, error };
    }
  };

  // ================================================
  // ACTION: Adicionar/Remover favorito
  // ================================================
  const toggleFavorito = async (conteudoId) => {
    if (!userId) {
      setErro('Usuário não autenticado');
      return { error: 'Usuário não autenticado' };
    }

    // Validar UUID antes de fazer query
    if (!isValidUUID(userId)) {
      console.error('UUID inválido em toggleFavorito:', userId);
      setErro('ID de usuário inválido');
      return { error: 'ID de usuário inválido' };
    }

    try {
      // Verificar se já é favorito
      const { data: existe } = await supabase
        .from('conteudo_favoritos')
        .select('id')
        .eq('ketero_id', userId)
        .eq('conteudo_id', conteudoId)
        .single();

      if (existe) {
        // Remover favorito
        const { error } = await supabase
          .from('conteudo_favoritos')
          .delete()
          .eq('ketero_id', userId)
          .eq('conteudo_id', conteudoId);

        if (error) throw error;

        // Atualizar estado local
        setFavoritos(prev => prev.filter(f => f.conteudo_id !== conteudoId));
        return { adicionado: false, error: null };
      } else {
        // Adicionar favorito
        const { error } = await supabase
          .from('conteudo_favoritos')
          .insert({
            ketero_id: userId,
            conteudo_id: conteudoId
          });

        if (error) throw error;

        // Atualizar estado local
        await buscarFavoritos();
        return { adicionado: true, error: null };
      }
    } catch (error) {
      console.error('Erro ao toggle favorito:', error);
      setErro(error.message);
      return { error };
    }
  };

  // ================================================
  // ACTION: Registrar visualização
  // ================================================
  const registrarVisualizacao = async (conteudoId, tempoAssistidoMin = 0, completou = false) => {
    if (!userId) return { error: 'Usuário não autenticado' };

    try {
      const { error } = await supabase
        .from('conteudo_visualizacoes')
        .insert({
          ketero_id: userId,
          conteudo_id: conteudoId,
          tempo_assistido_min: tempoAssistidoMin,
          completou
        });

      if (error) throw error;

      // Atualizar última visualização em favoritos se existir
      await supabase
        .from('conteudo_favoritos')
        .update({ ultima_visualizacao: new Date().toISOString() })
        .eq('ketero_id', userId)
        .eq('conteudo_id', conteudoId);

      return { error: null };
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
      return { error };
    }
  };

  // ================================================
  // ACTION: Atualizar progresso (para cursos)
  // ================================================
  const atualizarProgresso = async (conteudoId, progresso) => {
    if (!userId) return { error: 'Usuário não autenticado' };

    try {
      // Verificar se já tem favorito, senão criar
      const { data: existe } = await supabase
        .from('conteudo_favoritos')
        .select('id')
        .eq('ketero_id', userId)
        .eq('conteudo_id', conteudoId)
        .single();

      if (existe) {
        // Atualizar progresso
        const { error } = await supabase
          .from('conteudo_favoritos')
          .update({
            progresso,
            completado: progresso >= 100,
            ultima_visualizacao: new Date().toISOString()
          })
          .eq('ketero_id', userId)
          .eq('conteudo_id', conteudoId);

        if (error) throw error;
      } else {
        // Criar favorito com progresso
        const { error } = await supabase
          .from('conteudo_favoritos')
          .insert({
            ketero_id: userId,
            conteudo_id: conteudoId,
            progresso,
            completado: progresso >= 100
          });

        if (error) throw error;
      }

      // Atualizar estado local
      await buscarFavoritos();
      return { error: null };
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      return { error };
    }
  };

  // ================================================
  // ACTION: Marcar para download offline
  // ================================================
  const marcarOffline = async (conteudoId, baixado = true) => {
    if (!userId) return { error: 'Usuário não autenticado' };

    try {
      // Verificar se já tem favorito, senão criar
      const { data: existe } = await supabase
        .from('conteudo_favoritos')
        .select('id')
        .eq('ketero_id', userId)
        .eq('conteudo_id', conteudoId)
        .single();

      if (existe) {
        const { error } = await supabase
          .from('conteudo_favoritos')
          .update({ baixado_offline: baixado })
          .eq('ketero_id', userId)
          .eq('conteudo_id', conteudoId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('conteudo_favoritos')
          .insert({
            ketero_id: userId,
            conteudo_id: conteudoId,
            baixado_offline: baixado
          });

        if (error) throw error;
      }

      await buscarFavoritos();
      return { error: null };
    } catch (error) {
      console.error('Erro ao marcar offline:', error);
      return { error };
    }
  };

  // ================================================
  // HELPER: Verificar se é favorito
  // ================================================
  const isFavorito = (conteudoId) => {
    return favoritos.some(f => f.conteudo_id === conteudoId);
  };

  // ================================================
  // HELPER: Obter progresso de um conteúdo
  // ================================================
  const getProgresso = (conteudoId) => {
    const fav = favoritos.find(f => f.conteudo_id === conteudoId);
    return fav?.progresso || 0;
  };

  // ================================================
  // HELPER: Buscar por texto (client-side)
  // ================================================
  const buscarPorTexto = (texto) => {
    if (!texto) return conteudos;

    const termoLower = texto.toLowerCase();
    return conteudos.filter(c => 
      c.titulo.toLowerCase().includes(termoLower) ||
      c.subtitulo?.toLowerCase().includes(termoLower) ||
      c.categoria?.toLowerCase().includes(termoLower)
    );
  };

  // ================================================
  // EFFECT: Carregar dados ao montar
  // ================================================
  useEffect(() => {
    buscarConteudos();
    if (userId) {
      buscarFavoritos();
    }
  }, [userId, JSON.stringify(filtros)]);

  return {
    // Estado
    conteudos,
    favoritos,
    carregando,
    erro,

    // Ações
    buscarConteudos,
    buscarFavoritos,
    toggleFavorito,
    registrarVisualizacao,
    atualizarProgresso,
    marcarOffline,

    // Helpers
    isFavorito,
    getProgresso,
    buscarPorTexto
  };
};

export default useConteudoEducacional;
