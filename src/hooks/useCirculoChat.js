/**
 * useCirculoChat Hook
 * 
 * Hook para gerenciar chat em tempo real de um círculo
 * - Carregar mensagens
 * - Enviar mensagem
 * - Subscribe para novas mensagens (realtime)
 * - Deletar mensagem (owner)
 * - Editar mensagem (próprio autor)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

export const useCirculoChat = (circuloId, userId) => {
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [membros, setMembros] = useState([]);
  const channelRef = useRef(null);

  /**
   * Carregar mensagens do círculo
   */
  const carregarMensagens = useCallback(async (limit = 100) => {
    if (!circuloId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('circulo_mensagens')
        .select(`
          *,
          keteros(id, nome, foto_url)
        `)
        .eq('circulo_id', circuloId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (fetchError) throw fetchError;

      setMensagens(data || []);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [circuloId]);

  /**
   * Carregar membros do círculo
   */
  const carregarMembros = useCallback(async () => {
    if (!circuloId) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('circulo_membros')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          keteros(id, nome, foto_url)
        `)
        .eq('circulo_id', circuloId);

      if (fetchError) throw fetchError;

      setMembros(data || []);
    } catch (err) {
      console.error('Erro ao carregar membros:', err);
    }
  }, [circuloId]);

  /**
   * Enviar mensagem
   */
  const enviarMensagem = useCallback(async (texto, anonimo = false) => {
    if (!circuloId || !userId || !texto.trim()) {
      return { success: false, error: 'Dados inválidos' };
    }

    try {
      setSending(true);
      setError(null);

      // Obter nome do usuário para cache
      const { data: userData } = await supabase
        .from('keteros')
        .select('nome')
        .eq('id', userId)
        .single();

      const { data, error: sendError } = await supabase
        .from('circulo_mensagens')
        .insert([
          {
            circulo_id: circuloId,
            user_id: userId,
            mensagem: texto.trim(),
            anonimo: anonimo,
            user_nome: userData?.nome || 'Usuário'
          }
        ])
        .select(`
          *,
          keteros(id, nome, foto_url)
        `)
        .single();

      if (sendError) throw sendError;

      // Adicionar mensagem à lista localmente (otimistic update)
      setMensagens(prev => [...prev, data]);

      return { success: true, data };
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSending(false);
    }
  }, [circuloId, userId]);

  /**
   * Deletar mensagem (soft delete)
   */
  const deletarMensagem = useCallback(async (mensagemId) => {
    if (!mensagemId) return { success: false };

    try {
      setError(null);

      // Soft delete - apenas marcar como deletada
      const { error: deleteError } = await supabase
        .from('circulo_mensagens')
        .update({ 
          deleted_at: new Date().toISOString(),
          mensagem: '[Mensagem deletada]'
        })
        .eq('id', mensagemId);

      if (deleteError) throw deleteError;

      // Remover da lista local
      setMensagens(prev => prev.filter(m => m.id !== mensagemId));

      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar mensagem:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Editar mensagem
   */
  const editarMensagem = useCallback(async (mensagemId, novoTexto) => {
    if (!mensagemId || !novoTexto.trim()) {
      return { success: false, error: 'Dados inválidos' };
    }

    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('circulo_mensagens')
        .update({
          mensagem: novoTexto.trim(),
          editada: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', mensagemId)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Atualizar na lista local
      setMensagens(prev =>
        prev.map(m => (m.id === mensagemId ? { ...m, ...data } : m))
      );

      return { success: true, data };
    } catch (err) {
      console.error('Erro ao editar mensagem:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [userId]);

  /**
   * Verificar se usuário pode deletar mensagem
   */
  const podeDeletarMensagem = useCallback((mensagem) => {
    if (!mensagem || !userId) return false;

    // Autor pode deletar sua própria mensagem
    if (mensagem.user_id === userId) return true;

    // Owner do círculo pode deletar qualquer mensagem
    const membroAtual = membros.find(m => m.user_id === userId);
    return membroAtual?.role === 'owner';
  }, [userId, membros]);

  /**
   * Verificar se usuário pode editar mensagem
   */
  const podeEditarMensagem = useCallback((mensagem) => {
    if (!mensagem || !userId) return false;
    return mensagem.user_id === userId;
  }, [userId]);

  /**
   * Obter cor do usuário para bubble
   */
  const getCorUsuario = useCallback((userIdMsg) => {
    const cores = [
      'bg-purple-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ];

    // Gerar índice baseado no ID do usuário
    const index = userIdMsg ? parseInt(userIdMsg.split('-')[0], 16) % cores.length : 0;
    return cores[index];
  }, []);

  // Carregar mensagens e membros ao montar
  useEffect(() => {
    if (circuloId) {
      carregarMensagens();
      carregarMembros();
    }
  }, [circuloId, carregarMensagens, carregarMembros]);

  // Subscribe para novas mensagens em tempo real
  useEffect(() => {
    if (!circuloId) return;

    // Criar canal para realtime
    const channel = supabase
      .channel(`circulo:${circuloId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'circulo_mensagens',
          filter: `circulo_id=eq.${circuloId}`
        },
        async (payload) => {
          // Buscar dados completos da mensagem com informações do usuário
          const { data: novaMensagem } = await supabase
            .from('circulo_mensagens')
            .select(`
              *,
              keteros(id, nome, foto_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (novaMensagem) {
            // Adicionar apenas se não existir (evitar duplicatas)
            setMensagens(prev => {
              const existe = prev.some(m => m.id === novaMensagem.id);
              if (existe) return prev;
              return [...prev, novaMensagem];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'circulo_mensagens',
          filter: `circulo_id=eq.${circuloId}`
        },
        (payload) => {
          // Atualizar mensagem editada ou deletada
          setMensagens(prev =>
            prev.map(m =>
              m.id === payload.new.id ? { ...m, ...payload.new } : m
            ).filter(m => !m.deleted_at) // Remover deletadas
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'circulo_mensagens',
          filter: `circulo_id=eq.${circuloId}`
        },
        (payload) => {
          // Remover mensagem deletada
          setMensagens(prev => prev.filter(m => m.id !== payload.old.id));
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Cleanup
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [circuloId]);

  // Subscribe para mudanças em membros
  useEffect(() => {
    if (!circuloId) return;

    const membrosChannel = supabase
      .channel(`circulo-membros:${circuloId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'circulo_membros',
          filter: `circulo_id=eq.${circuloId}`
        },
        () => {
          carregarMembros();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(membrosChannel);
    };
  }, [circuloId, carregarMembros]);

  return {
    mensagens,
    membros,
    loading,
    sending,
    error,
    enviarMensagem,
    deletarMensagem,
    editarMensagem,
    podeDeletarMensagem,
    podeEditarMensagem,
    getCorUsuario,
    recarregar: carregarMensagens
  };
};
