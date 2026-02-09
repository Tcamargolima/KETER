import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';

// PWA Registration
import { registerSW } from 'virtual:pwa-register';

// Initialize Sentry for error monitoring
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% in production, 100% in dev
    // Session Replay
    replaysSessionSampleRate: 0.1, // Sample 10% of sessions
    replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
    
    // Environment
    environment: import.meta.env.MODE,
    
    // Release version (optional)
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    
    // Filter sensitive data
    beforeSend(event, hint) {
      // Don't send events from localhost in development
      if (import.meta.env.DEV && window.location.hostname === 'localhost') {
        return null;
      }
      return event;
    },
  });
  
  console.log('✅ Sentry initialized for error monitoring');
} else {
  console.log('ℹ️ Sentry DSN not configured - error monitoring disabled');
}

// Register Service Worker with auto-update
registerSW({
  onNeedRefresh() {
    console.log('Nova versão disponível, atualizando...');
  },
  onOfflineReady() {
    console.log('App pronto para funcionar offline');
  },
  onRegistered(registration) {
    console.log('Service Worker registrado:', registration);
  },
  onRegisterError(error) {
    console.error('Erro ao registrar Service Worker:', error);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
