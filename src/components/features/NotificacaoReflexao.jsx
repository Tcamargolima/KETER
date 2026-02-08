// ================================================
// NOTIFICAÇÃO REFLEXÃO - Aviso para fazer reflexão noturna
// ================================================

import React from 'react';
import { Moon, X, Bell } from 'lucide-react';

export const NotificacaoReflexao = ({ onAbrir, onFechar, mostrar }) => {
  if (!mostrar) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-purple-900 to-amber-900 border-2 border-purple-500 rounded-2xl p-4 shadow-2xl max-w-sm backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-purple-300 animate-bounce" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-purple-200 mb-1 flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Hora da Reflexão Noturna
            </h3>
            <p className="text-sm text-slate-300 mb-3">
              Reserve 5 minutos para refletir sobre seu dia
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={onAbrir}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-amber-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Iniciar Reflexão
              </button>
              <button
                onClick={onFechar}
                className="px-3 py-2 bg-slate-800/50 text-slate-400 rounded-lg hover:bg-slate-700 transition-all"
                aria-label="Fechar notificação"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotificacaoReflexao;
