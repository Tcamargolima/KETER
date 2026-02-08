// ================================================
// ANÁLISE IA MODAL - Exibe análise da IA após reflexão
// ================================================

import React from 'react';
import { Sparkles, X } from 'lucide-react';

export const AnaliseIAModal = ({ analise, onFechar, mostrar }) => {
  if (!mostrar || !analise) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 max-w-2xl w-full border border-purple-500/30 shadow-2xl animate-scale-in">
        {/* Close button */}
        <button
          onClick={onFechar}
          className="absolute top-4 right-4 text-purple-200 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Análise da sua Reflexão</h2>
          <p className="text-slate-300 text-sm">Insights gerados pela IA GuiaKETER</p>
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-700">
          <p className="text-slate-200 leading-relaxed whitespace-pre-line">
            {analise}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-4">
          <button
            onClick={onFechar}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Continuar
          </button>
        </div>

        {/* Quote */}
        <div className="mt-6 text-center">
          <p className="text-purple-200 text-sm italic">
            "A reflexão é o começo da transformação."
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// ================================================
// LOADING MODAL - Enquanto a IA analisa
// ================================================

export const AnaliseLoadingModal = ({ mostrar }) => {
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-60">
      <div className="bg-slate-900 rounded-2xl p-8 text-center max-w-md">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h3 className="text-purple-200 font-semibold text-lg mb-2">Analisando sua reflexão...</h3>
        <p className="text-slate-400 text-sm">A IA está processando seus insights</p>
        <div className="mt-4 flex justify-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AnaliseIAModal;
