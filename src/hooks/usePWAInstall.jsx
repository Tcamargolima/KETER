import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar prompt de instalação PWA
 * Mostra prompt quando o app pode ser instalado
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true;

    if (isInstalled) {
      console.log('App já está instalado');
      return;
    }

    // Verificar se o usuário já dispensou o prompt
    const dismissed = localStorage.getItem('keter_install_dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Mostrar novamente após 7 dias
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Capturar evento beforeinstallprompt
    const handler = (e) => {
      console.log('beforeinstallprompt capturado');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detectar quando o app foi instalado
    window.addEventListener('appinstalled', () => {
      console.log('App instalado com sucesso!');
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      localStorage.removeItem('keter_install_dismissed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Função para instalar o app
  const installApp = async () => {
    if (!deferredPrompt) {
      console.log('Prompt de instalação não disponível');
      return;
    }

    // Mostrar prompt de instalação
    deferredPrompt.prompt();

    // Aguardar escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Escolha do usuário: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('Usuário aceitou instalar o app');
    } else {
      console.log('Usuário recusou instalar o app');
    }

    // Limpar prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  // Função para dispensar o prompt
  const dismissPrompt = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('keter_install_dismissed', new Date().toISOString());
  };

  return {
    showInstallPrompt,
    installApp,
    dismissPrompt,
    canInstall: !!deferredPrompt
  };
}
