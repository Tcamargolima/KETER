// ================================================
// COMPONENT: NotificationPopover
// ================================================
// Popover/dropdown com lista de notificações
// Exibe notificações em ordem cronológica
// Permite marcar como lida e navegar

import React, { useRef, useEffect } from 'react';
import { X, Check, Trash2, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Ícones para cada tipo de notificação
 */
const NOTIFICATION_ICONS = {
  lembrete_pratica: '🧘',
  lembrete_reflexao: '📝',
  streak_perdido: '💔',
  conquista: '🏆',
  ia_feedback: '🤖'
};

/**
 * Cores para cada tipo de notificação
 */
const NOTIFICATION_COLORS = {
  lembrete_pratica: 'bg-purple-50 border-purple-200',
  lembrete_reflexao: 'bg-amber-50 border-amber-200',
  streak_perdido: 'bg-red-50 border-red-200',
  conquista: 'bg-green-50 border-green-200',
  ia_feedback: 'bg-blue-50 border-blue-200'
};

/**
 * Componente NotificationPopover
 */
export const NotificationPopover = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNotificationClick
}) => {
  const popoverRef = useRef(null);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Formatar tempo relativo
  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true,
        locale: ptBR 
      });
    } catch (error) {
      return 'agora';
    }
  };

  // Handler para clicar em notificação
  const handleNotificationClick = (notification) => {
    onMarkAsRead(notification.id);
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-semibold">Notificações</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <span className="text-sm text-gray-600">
                {notifications.filter(n => !n.read).length} não lidas
              </span>
              <button
                onClick={onMarkAllAsRead}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Marcar todas como lidas
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <BellOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Nenhuma notificação</p>
                <p className="text-sm text-gray-400 mt-1">
                  Você está em dia com tudo! ✨
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-purple-50/30' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                          NOTIFICATION_COLORS[notification.type] || 'bg-gray-100 border-gray-200'
                        } border-2`}>
                          {NOTIFICATION_ICONS[notification.type] || '📬'}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-semibold ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.body}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {formatTime(notification.created_at)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(notification.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Deletar notificação"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  // Aqui você pode adicionar navegação para página de notificações
                  onClose();
                }}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium w-full text-center"
              >
                Ver todas as notificações
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopover;
