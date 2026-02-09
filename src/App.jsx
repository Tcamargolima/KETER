import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Notifications from './pages/Notifications';
import Perfil from './pages/Perfil';
import Sabedoria from './pages/Sabedoria';
import { OfflineIndicator } from './components/features/OfflineIndicator';
import { useOffline } from './hooks/useOffline';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useSession } from './hooks/useAuth';
import { getUserIdFromSession } from './lib/utils';

/**
 * App Component - Root Application
 * Integrates PWA capabilities with offline support and real authentication
 */
function App() {
  const { session, loading: authLoading } = useSession();
  const userId = getUserIdFromSession(session);
  const { isOffline, isSyncing } = useOffline();
  const { showInstallPrompt, installApp, dismissPrompt } = usePWAInstall();

  useEffect(() => {
    // Register service worker update handler
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker updated, reloading...');
        window.location.reload();
      });
    }
  }, []);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Autenticação Necessária</h2>
          <p className="text-gray-600 mb-6">
            Por favor, faça login para acessar o KETER.
          </p>
          <p className="text-sm text-gray-500">
            Configure a autenticação do Supabase para continuar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-purple-50">
        {/* Offline Indicator */}
        <OfflineIndicator isOffline={isOffline} isSyncing={isSyncing} />

        {/* PWA Install Prompt */}
        {showInstallPrompt && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4">
            <span className="text-sm font-medium">Instale o KETER na sua tela inicial</span>
            <button
              onClick={installApp}
              className="bg-white text-purple-600 px-4 py-1 rounded-md text-sm font-semibold hover:bg-purple-50 transition-colors"
            >
              Instalar
            </button>
            <button
              onClick={dismissPrompt}
              className="text-white/80 hover:text-white text-sm"
            >
              Agora não
            </button>
          </div>
        )}

        {/* Routes */}
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                userId={userId}
                onStartPratica={(pratica) => console.log('Start pratica:', pratica)}
                onOpenLibrary={() => console.log('Open library')}
              />
            } 
          />
          <Route path="/notifications" element={<Notifications userId={userId} />} />
          <Route path="/perfil" element={<Perfil userId={userId} />} />
          <Route path="/sabedoria" element={<Sabedoria userId={userId} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
