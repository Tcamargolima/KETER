import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Funções de sincronização específicas (fora do componente)
const syncReflexao = async (data) => {
  const { error } = await supabase
    .from('reflexoes')
    .insert(data);
  
  if (error) throw error;
};

const syncPratica = async (data) => {
  const { error } = await supabase
    .from('praticas_realizadas')
    .insert(data);
  
  if (error) throw error;
};

const syncMicroAto = async (data) => {
  const { error } = await supabase
    .from('micro_atos')
    .insert(data);
  
  if (error) throw error;
};

/**
 * Hook para gerenciar estado offline e sincronização
 * Detecta quando o app está offline e gerencia sync de dados pendentes
 */
export function useOffline() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingOperations, setPendingOperations] = useState([]);

  // Detectar mudanças no status online/offline
  useEffect(() => {
    const handleOnline = () => {
      console.log('App voltou online');
      setIsOffline(false);
    };

    const handleOffline = () => {
      console.log('App está offline');
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sincronizar quando voltar online
  useEffect(() => {
    if (!isOffline && pendingOperations.length > 0) {
      syncPendingOperations();
    }
  }, [isOffline, pendingOperations.length]);

  // Carregar operações pendentes do localStorage
  useEffect(() => {
    const loadPendingOperations = () => {
      try {
        const stored = localStorage.getItem('keter_pending_operations');
        if (stored) {
          setPendingOperations(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Erro ao carregar operações pendentes:', error);
      }
    };

    loadPendingOperations();
  }, []);

  // Salvar operações pendentes no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('keter_pending_operations', JSON.stringify(pendingOperations));
    } catch (error) {
      console.error('Erro ao salvar operações pendentes:', error);
    }
  }, [pendingOperations]);

  // Adicionar operação pendente
  const addPendingOperation = useCallback((operation) => {
    setPendingOperations(prev => [...prev, {
      ...operation,
      id: Date.now(),
      timestamp: new Date().toISOString()
    }]);
  }, []);

  // Sincronizar operações pendentes quando voltar online
  const syncPendingOperations = useCallback(async () => {
    if (pendingOperations.length === 0 || isOffline) return;

    setIsSyncing(true);
    const successful = [];
    const failed = [];

    for (const operation of pendingOperations) {
      try {
        switch (operation.type) {
          case 'reflexao':
            await syncReflexao(operation.data);
            successful.push(operation.id);
            break;
          case 'pratica':
            await syncPratica(operation.data);
            successful.push(operation.id);
            break;
          case 'microato':
            await syncMicroAto(operation.data);
            successful.push(operation.id);
            break;
          default:
            console.warn('Tipo de operação desconhecido:', operation.type);
            failed.push(operation.id);
        }
      } catch (error) {
        console.error(`Erro ao sincronizar ${operation.type}:`, error);
        failed.push(operation.id);
      }
    }

    // Remover operações bem-sucedidas
    setPendingOperations(prev => 
      prev.filter(op => !successful.includes(op.id))
    );

    setIsSyncing(false);

    if (successful.length > 0) {
      console.log(`${successful.length} operações sincronizadas com sucesso`);
    }
    if (failed.length > 0) {
      console.error(`${failed.length} operações falharam`);
    }
  }, [pendingOperations, isOffline]);

  return {
    isOffline,
    isSyncing,
    pendingOperations,
    addPendingOperation,
    syncPendingOperations
  };
}
