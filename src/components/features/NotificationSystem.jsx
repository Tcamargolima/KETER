// ================================================
// COMPONENT: NotificationSystem
// ================================================
// Sistema completo de notificações que integra:
// - NotificationBell com badge
// - NotificationPopover com lista
// - useNotifications hook
// - Smart reminders

import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useSmartReminders } from '../../hooks/useSmartReminders';
import { NotificationBell } from './NotificationBell';
import { NotificationPopover } from './NotificationPopover';

/**
 * Sistema completo de notificações
 * @param {string} userId - ID do usuário
 * @param {Object} userProfile - Perfil do usuário
 * @param {Function} onNotificationClick - Callback quando notificação é clicada
 */
export const NotificationSystem = ({ 
  userId, 
  userProfile,
  onNotificationClick 
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Hook de notificações
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch
  } = useNotifications(userId);

  // Hook de lembretes inteligentes
  useSmartReminders(userId, userProfile, () => {
    // Callback quando nova notificação é criada
    refetch();
  });

  // Handler para clicar no sino
  const handleBellClick = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  // Handler para fechar popover
  const handleClosePopover = () => {
    setIsPopoverOpen(false);
  };

  // Handler para clicar em uma notificação
  const handleNotificationClick = (notification) => {
    // Marcar como lida
    markAsRead(notification.id);
    
    // Fechar popover
    setIsPopoverOpen(false);
    
    // Callback customizado
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  // Handler para marcar todas como lidas
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // Handler para deletar notificação
  const handleDeleteNotification = async (notificationId) => {
    await deleteNotification(notificationId);
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="relative">
        <div className="p-2 rounded-full bg-gray-100 animate-pulse">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <NotificationBell
        unreadCount={unreadCount}
        onClick={handleBellClick}
        isOpen={isPopoverOpen}
      />
      
      <NotificationPopover
        isOpen={isPopoverOpen}
        onClose={handleClosePopover}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDeleteNotification}
        onNotificationClick={handleNotificationClick}
      />
    </div>
  );
};

export default NotificationSystem;
