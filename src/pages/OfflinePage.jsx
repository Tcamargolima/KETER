import React from 'react';
import { WifiOff, Heart, Clock, BookOpen } from 'lucide-react';

/**
 * Página exibida quando o app está offline
 * Mostra conteúdo em cache e informa sobre sincronização
 */
export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Ícone de Offline */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="text-red-500" size={40} />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Sem conexão com a internet
        </h1>

        {/* Mensagem */}
        <p className="text-gray-600 mb-8">
          Suas práticas e reflexões foram salvas localmente e serão sincronizadas 
          automaticamente quando você voltar online.
        </p>

        {/* Features disponíveis offline */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-left bg-purple-50 p-4 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <BookOpen className="text-purple-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Práticas em Cache</h3>
              <p className="text-xs text-gray-600">Continue praticando com conteúdo salvo</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-left bg-amber-50 p-4 rounded-lg">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="text-amber-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Reflexões Locais</h3>
              <p className="text-xs text-gray-600">Suas reflexões estão seguras</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-left bg-green-50 p-4 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Sincronização Automática</h3>
              <p className="text-xs text-gray-600">Tudo será atualizado ao reconectar</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-sm text-gray-500">
          Aguardando conexão para sincronizar...
        </div>
      </div>
    </div>
  );
}
