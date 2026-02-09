import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// PWA Registration
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker with auto-update
const updateSW = registerSW({
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
    <App />
  </React.StrictMode>
);
