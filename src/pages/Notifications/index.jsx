// ================================================
// PAGE: Notifications
// ================================================
// Página dedicada para visualizar todas as notificações
// Histórico completo com filtros e opções de gerenciamento

import React, { useState, useMemo } from 'react';
import { Bell, BellOff, Trash2, CheckCircle, Filter, X } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

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
  lembrete_pratica: 'bg-purple-100 border-purple-300',
  lembrete_reflexao: 'bg-amber-100 border-amber-300',
  streak_perdido: 'bg-red-100 border-red-300',
  conquista: 'bg-green-100 border-green-300',
  ia_feedback: 'bg-blue-100 border-blue-300'
};

/**
 * Tipos de notificação com labels amigáveis
 */
const NOTIFICATION_TYPES = [
  { value: 'all', label: 'Todas' },
  { value: 'lembrete_pratica', label: 'Lembretes de Prática' },
  { value: 'lembrete_reflexao', label: 'Lembretes de Reflexão' },
  { value: 'streak_perdido', label: 'Streak Perdido' },
  { value: 'conquista', label: 'Conquistas' },
  { value: 'ia_feedback', label: 'Feedback da IA' }
];

/**
 * Componente NotificationsPage
 */
export const NotificationsPage = ({ userId, onNotificationClick }) => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications(userId);

  const [filterType, setFilterType] = useState('all');
  const [showReadFilter, setShowReadFilter] = useState('all');

  // Filtrar notificações
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    if (filterType !== 'all') {
      filtered = filtered.filter(n => n.type === filterType);
    }

    if (showReadFilter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (showReadFilter === 'read') {
      filtered = filtered.filter(n => n.read);
    }

    return filtered;
  }, [notifications, filterType, showReadFilter]);

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

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Bell className="w-8 h-8 text-purple-600" />
              Notificações
            </h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? (
                <span>Você tem <strong>{unreadCount}</strong> notificação{unreadCount !== 1 ? 'ões' : ''} não lida{unreadCount !== 1 ? 's' : ''}</span>
              ) : (
                <span>Você está em dia com todas as notificações! ✨</span>
              )}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Marcar todas como lidas
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {NOTIFICATION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setShowReadFilter('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showReadFilter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setShowReadFilter('unread')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showReadFilter === 'unread'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Não lidas
              </button>
              <button
                onClick={() => setShowReadFilter('read')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showReadFilter === 'read'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Lidas
              </button>
            </div>

            {(filterType !== 'all' || showReadFilter !== 'all') && (
              <button
                onClick={() => {
                  setFilterType('all');
                  setShowReadFilter('all');
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <BellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma notificação
            </h3>
            <p className="text-gray-500">
              {filterType !== 'all' || showReadFilter !== 'all'
                ? 'Nenhuma notificação corresponde aos filtros selecionados.'
                : 'Você está em dia com tudo! Continue assim. ✨'
              }
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                  !notification.read ? 'ring-2 ring-purple-200' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 ${
                        NOTIFICATION_COLORS[notification.type] || 'bg-gray-100 border-gray-300'
                      }`}>
                        {NOTIFICATION_ICONS[notification.type] || '📬'}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className={`text-lg font-semibold ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                          )}
                        </div>
                        <span className="text-sm text-gray-400 whitespace-nowrap">
                          {formatTime(notification.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        {notification.body}
                      </p>

                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Marcar como lida
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
