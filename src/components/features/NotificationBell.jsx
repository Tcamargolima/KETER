// ================================================
// COMPONENT: NotificationBell
// ================================================
// Ícone de sino de notificações com badge de contagem
// Exibe o número de notificações não lidas
// Abre o popover quando clicado

import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Componente NotificationBell
 * @param {number} unreadCount - Número de notificações não lidas
 * @param {function} onClick - Callback quando o sino é clicado
 * @param {boolean} isOpen - Se o popover está aberto
 */
export const NotificationBell = ({ unreadCount = 0, onClick, isOpen = false }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-purple-50 transition-colors duration-200"
      aria-label="Notificações"
      type="button"
    >
      {/* Bell Icon */}
      <motion.div
        animate={unreadCount > 0 ? { rotate: [0, -10, 10, -10, 0] } : {}}
        transition={{ 
          duration: 0.5,
          repeat: unreadCount > 0 ? Infinity : 0,
          repeatDelay: 3 
        }}
      >
        <Bell 
          className={`w-6 h-6 ${isOpen ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
        />
      </motion.div>

      {/* Badge with unread count */}
      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs font-bold px-1.5 shadow-lg"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.div>
      )}
    </button>
  );
};

export default NotificationBell;
