import React from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Componente OfflineIndicator
 * Mostra status de conexão e sincronização
 */
export function OfflineIndicator({ isOffline, isSyncing }) {
  return (
    <AnimatePresence>
      {(isOffline || isSyncing) && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
        >
          <div className="flex justify-center pt-4">
            <div className={`
              px-4 py-2 rounded-full shadow-lg flex items-center gap-2
              ${isOffline 
                ? 'bg-red-500 text-white' 
                : 'bg-blue-500 text-white'
              }
            `}>
              {isOffline ? (
                <>
                  <WifiOff size={16} />
                  <span className="text-sm font-medium">Sem conexão</span>
                </>
              ) : isSyncing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span className="text-sm font-medium">Sincronizando...</span>
                </>
              ) : (
                <>
                  <Wifi size={16} />
                  <span className="text-sm font-medium">Conectado</span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
