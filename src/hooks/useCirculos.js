/**
 * useCirculos Hook
 * 
 * Hook para gerenciar círculos (communities/chat groups)
 * - Listar círculos disponíveis
 * - Criar novo círculo
 * - Entrar/sair de círculo
 * - Obter círculos do usuário
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { isValidUUID } from '../lib/utils';

export const useCirculos = (userId) => {
  const [circulos, setCirculos] = useState([]);
  const [meusCirculos, setMeusCirculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carregar todos os círculos públicos + círculos que o usuário é membro
   */
  const carregarCirculos = useCallback(async () => {
    if (!userId) return;

    // Validar UUID antes de fazer query
    if (!isValidUUID(userId)) {
      console.error('UUID inválido em useCirculos:', userId);
      setError('ID de usuário inválido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Buscar círculos públicos
      const { data: publicCircles, error: publicError } = await supabase
        .from('circulos')
        .select(`
          *,
          circulo_membros!inner(id, user_id, role, joined_at)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (publicError) throw publicError;

      // Buscar círculos onde o usuário é membro
      const { data: memberCircles, error: memberError } = await supabase
        .from('circulo_membros')
        .select(`
          circulo_id,
          role,
          joined_at,
          circulos (*)
        `)
        .eq('user_id', userId);

      if (memberError) throw memberError;

      // Processar dados
      const allCircles = publicCircles || [];
      const myCircles = (memberCircles || []).map(mc => ({
        ...mc.circulos,
        role: mc.role,
        joined_at: mc.joined_at
      }));

      // Adicionar contagem de membros e status de membro
      const enrichedCircles = await Promise.all(
        allCircles.map(async (circle) => {
          // Contar membros
          const { count } = await supabase
            .from('circulo_membros')
            .select('*', { count: 'exact', head: true })
            .eq('circulo_id', circle.id);

          // Verificar se usuário é membro
          const isMember = myCircles.some(mc => mc.id === circle.id);
          const memberData = myCircles.find(mc => mc.id === circle.id);

          return {
            ...circle,
            total_membros: count || 0,
            is_member: isMember,
            user_role: memberData?.role || null
          };
        })
      );

      setCirculos(enrichedCircles);
      setMeusCirculos(myCircles);
    } catch (err) {
      console.error('Erro ao carregar círculos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Criar novo círculo
   */
  const criarCirculo = useCallback(async (dados) => {
    if (!userId) {
      setError('Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      setError(null);

      // Verificar limite de círculos criados pelo usuário
      const { count } = await supabase
        .from('circulos')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId);

      if (count >= 3) {
        throw new Error('Você atingiu o limite de 3 círculos criados. Delete um círculo existente para criar outro.');
      }

      // Criar círculo
      const { data: novoCirculo, error: createError } = await supabase
        .from('circulos')
        .insert([
          {
            nome: dados.nome,
            descricao: dados.descricao || '',
            fase_relacionada: dados.fase_relacionada || null,
            is_public: dados.is_public !== false, // default true
            created_by: userId,
            cor_tema: dados.cor_tema || 'purple',
            max_membros: dados.max_membros || 50
          }
        ])
        .select()
        .single();

      if (createError) throw createError;

      // Recarregar lista de círculos
      await carregarCirculos();

      return { success: true, data: novoCirculo };
    } catch (err) {
      console.error('Erro ao criar círculo:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [userId, carregarCirculos]);

  /**
   * Entrar em um círculo
   */
  const entrarCirculo = useCallback(async (circuloId) => {
    if (!userId) {
      setError('Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      setError(null);

      // Verificar se círculo existe e é público
      const { data: circulo, error: circleError } = await supabase
        .from('circulos')
        .select('*, circulo_membros(count)')
        .eq('id', circuloId)
        .single();

      if (circleError) throw circleError;
      if (!circulo) throw new Error('Círculo não encontrado');

      // Verificar limite de membros
      const { count: membrosCount } = await supabase
        .from('circulo_membros')
        .select('*', { count: 'exact', head: true })
        .eq('circulo_id', circuloId);

      if (membrosCount >= circulo.max_membros) {
        throw new Error('Este círculo está cheio');
      }

      // Adicionar usuário como membro
      const { error: joinError } = await supabase
        .from('circulo_membros')
        .insert([
          {
            circulo_id: circuloId,
            user_id: userId,
            role: 'member'
          }
        ]);

      if (joinError) {
        // Se já for membro, ignorar erro
        if (joinError.code === '23505') { // unique violation
          return { success: true, message: 'Você já é membro deste círculo' };
        }
        throw joinError;
      }

      // Recarregar lista
      await carregarCirculos();

      return { success: true };
    } catch (err) {
      console.error('Erro ao entrar no círculo:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [userId, carregarCirculos]);

  /**
   * Sair de um círculo
   */
  const sairCirculo = useCallback(async (circuloId) => {
    if (!userId) {
      setError('Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      setError(null);

      // Verificar se é owner
      const { data: membership } = await supabase
        .from('circulo_membros')
        .select('role')
        .eq('circulo_id', circuloId)
        .eq('user_id', userId)
        .single();

      if (membership?.role === 'owner') {
        throw new Error('Você não pode sair de um círculo que criou. Delete o círculo se quiser removê-lo.');
      }

      // Remover membro
      const { error: leaveError } = await supabase
        .from('circulo_membros')
        .delete()
        .eq('circulo_id', circuloId)
        .eq('user_id', userId);

      if (leaveError) throw leaveError;

      // Recarregar lista
      await carregarCirculos();

      return { success: true };
    } catch (err) {
      console.error('Erro ao sair do círculo:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [userId, carregarCirculos]);

  /**
   * Deletar círculo (apenas owner)
   */
  const deletarCirculo = useCallback(async (circuloId) => {
    if (!userId) {
      setError('Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      setError(null);

      // Deletar círculo (RLS vai garantir que só owner pode deletar)
      const { error: deleteError } = await supabase
        .from('circulos')
        .delete()
        .eq('id', circuloId)
        .eq('created_by', userId);

      if (deleteError) throw deleteError;

      // Recarregar lista
      await carregarCirculos();

      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar círculo:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [userId, carregarCirculos]);

  /**
   * Obter detalhes de um círculo específico
   */
  const obterCirculo = useCallback(async (circuloId) => {
    try {
      const { data, error } = await supabase
        .from('circulos')
        .select(`
          *,
          circulo_membros(
            id,
            user_id,
            role,
            joined_at,
            keteros(id, nome, foto_url)
          )
        `)
        .eq('id', circuloId)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (err) {
      console.error('Erro ao obter círculo:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Carregar círculos ao montar
  useEffect(() => {
    carregarCirculos();
  }, [carregarCirculos]);

  // Subscribe para mudanças em tempo real
  useEffect(() => {
    if (!userId) return;

    // Subscribe para novos círculos
    const circulosChannel = supabase
      .channel('circulos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'circulos'
        },
        () => {
          carregarCirculos();
        }
      )
      .subscribe();

    // Subscribe para mudanças em membros
    const membrosChannel = supabase
      .channel('membros-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'circulo_membros',
          filter: `user_id=eq.${userId}`
        },
        () => {
          carregarCirculos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(circulosChannel);
      supabase.removeChannel(membrosChannel);
    };
  }, [userId, carregarCirculos]);

  return {
    circulos,
    meusCirculos,
    loading,
    error,
    criarCirculo,
    entrarCirculo,
    sairCirculo,
    deletarCirculo,
    obterCirculo,
    recarregar: carregarCirculos
  };
};
