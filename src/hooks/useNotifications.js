// ================================================
// HOOK: useNotifications
// ================================================
// Gerencia o sistema de notificações in-app com:
// - Fetch de notificações do usuário
// - Subscribe realtime para novas notificações
// - Marcar notificações como lidas
// - Contador de notificações não lidas
// - Criar notificações programáticas

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { isValidUUID } from '../lib/utils';

/**
 * Hook para gerenciar notificações do usuário
 * @param {string} userId - ID do usuário
 * @returns {Object} - Funções e estados das notificações
 */
export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================================================
  // 1. Fetch inicial das notificações
  // ================================================
  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Validar UUID antes de fazer query
    if (!isValidUUID(userId)) {
      console.error('UUID inválido em useNotifications:', userId);
      setError('ID de usuário inválido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      setNotifications(data || []);
      
      // Calcular unread count
      const unread = (data || []).filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Erro ao buscar notificações:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ================================================
  // 2. Setup - Fetch inicial
  // ================================================
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ================================================
  // 3. Subscribe realtime para novas notificações
  // ================================================
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          // Adicionar nova notificação ao topo da lista
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          // Atualizar notificação existente e recalcular unread count
          setNotifications(prev => {
            const updated = prev.map(n => n.id === payload.new.id ? payload.new : n);
            const unread = updated.filter(n => !n.read).length;
            setUnreadCount(unread);
            return updated;
          });
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // ================================================
  // 4. Marcar notificação como lida
  // ================================================
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Atualizar estado local
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      return { success: true };
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
      return { success: false, error: err.message };
    }
  }, [userId]);

  // ================================================
  // 5. Marcar todas como lidas
  // ================================================
  const markAllAsRead = useCallback(async () => {
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (updateError) throw updateError;

      // Atualizar estado local
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);

      return { success: true };
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err);
      return { success: false, error: err.message };
    }
  }, [userId]);

  // ================================================
  // 6. Criar nova notificação
  // ================================================
  const createNotification = useCallback(async (notification) => {
    try {
      const { data, error: insertError } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: userId,
            type: notification.type,
            title: notification.title,
            body: notification.body,
            data: notification.data || {}
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      return { success: true, data };
    } catch (err) {
      console.error('Erro ao criar notificação:', err);
      return { success: false, error: err.message };
    }
  }, [userId]);

  // ================================================
  // 7. Deletar notificação
  // ================================================
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Atualizar estado local
      setNotifications(prev => {
        const filtered = prev.filter(n => n.id !== notificationId);
        const unread = filtered.filter(n => !n.read).length;
        setUnreadCount(unread);
        return filtered;
      });

      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar notificação:', err);
      return { success: false, error: err.message };
    }
  }, [userId]);

  // ================================================
  // 8. Obter notificações por tipo
  // ================================================
  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // ================================================
  // 9. Obter notificações não lidas
  // ================================================
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  // ================================================
  // Retornar API do hook
  // ================================================
  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    createNotification,
    deleteNotification,
    getNotificationsByType,
    getUnreadNotifications,
    refetch: fetchNotifications
  };
};

export default useNotifications;
