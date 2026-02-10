// ================================================
// CUSTOM REACT HOOKS FOR SUPABASE
// ================================================
// src/hooks/useAuth.js

import { useState, useEffect, createContext, useContext } from 'react';
import {
  supabase,
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  getKeteroProfile,
  resetPassword
} from '../lib/supabase';

// ================================================
// AUTH CONTEXT
// ================================================
const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ================================================
// AUTH PROVIDER
// ================================================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Inicializar sessão
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar sessão existente
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Carregar perfil
          const { data: profileData } = await getKeteroProfile(session.user.id);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Erro ao inicializar auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Carregar perfil
          const { data: profileData } = await getKeteroProfile(session.user.id);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Métodos de autenticação
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await signIn(email, password);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, nome) => {
    try {
      setLoading(true);
      const { data, error } = await signUp(email, password, nome);
      
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await signOut();
      
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const { data } = await getKeteroProfile(user.id);
      setProfile(data);
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    requestPasswordReset,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ================================================
// USE KETERO (Profile Hook)
// ================================================
export const useKetero = () => {
  const { profile, refreshProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateStats = async () => {
    setLoading(true);
    await refreshProfile();
    setLoading(false);
  };

  useEffect(() => {
    if (profile) {
      setStats({
        faseAtual: profile.fase_atual,
        diaAtual: profile.dia_total_app,
        diaFase: profile.dia_na_fase,
        sequencia: profile.sequencia_atual,
        totalPraticas: profile.total_praticas,
        totalReflexoes: profile.total_reflexoes,
        totalMicroAtos: profile.total_micro_atos,
        tempoTotal: profile.tempo_total_minutos
      });
    }
  }, [profile]);

  return {
    profile,
    stats,
    loading,
    updateStats
  };
};

// ================================================
// USE PRATICAS
// ================================================
import { getPraticasMes, completarPratica as completarPraticaDB } from '../lib/supabase';

export const usePraticas = () => {
  const { user } = useAuth();
  const [praticas, setPraticas] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregarPraticas = async (mes, ano) => {
    if (!user) return;
    
    setLoading(true);
    const { data } = await getPraticasMes(user.id, mes, ano);
    setPraticas(data || []);
    setLoading(false);
  };

  const completarPratica = async (pratica, feedback = {}) => {
    if (!user) return { success: false };
    
    const { error } = await completarPraticaDB(user.id, {
      ...pratica,
      feedback
    });
    
    if (!error) {
      await carregarPraticas(new Date().getMonth() + 1, new Date().getFullYear());
    }
    
    return { success: !error, error };
  };

  useEffect(() => {
    if (user) {
      const now = new Date();
      carregarPraticas(now.getMonth() + 1, now.getFullYear());
    }
  }, [user]);

  return {
    praticas,
    loading,
    carregarPraticas,
    completarPratica
  };
};

// ================================================
// USE REFLEXOES
// ================================================
import { getReflexoesRecentes, salvarReflexao as salvarReflexaoDB } from '../lib/supabase';

export const useReflexoes = () => {
  const { user } = useAuth();
  const [reflexoes, setReflexoes] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregarReflexoes = async (limite = 30) => {
    if (!user) return;
    
    setLoading(true);
    const { data } = await getReflexoesRecentes(user.id, limite);
    setReflexoes(data || []);
    setLoading(false);
  };

  const salvarReflexao = async (reflexao) => {
    if (!user) return { success: false };
    
    const { data, error } = await salvarReflexaoDB(user.id, reflexao);
    
    if (!error) {
      await carregarReflexoes();
    }
    
    return { success: !error, error, data };
  };

  useEffect(() => {
    if (user) {
      carregarReflexoes();
    }
  }, [user]);

  return {
    reflexoes,
    loading,
    carregarReflexoes,
    salvarReflexao
  };
};

// ================================================
// USE CONQUISTAS
// ================================================
import { 
  getConquistas, 
  verificarConquistasNaoVistas,
  marcarConquistaVista,
  subscribeToConquistas 
} from '../lib/supabase';

export const useConquistas = () => {
  const { user } = useAuth();
  const [conquistas, setConquistas] = useState([]);
  const [novasConquistas, setNovasConquistas] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregarConquistas = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data } = await getConquistas(user.id);
    setConquistas(data || []);
    setLoading(false);
  };

  const verificarNovas = async () => {
    if (!user) return;
    
    const { data } = await verificarConquistasNaoVistas(user.id);
    setNovasConquistas(data || []);
    
    return data || [];
  };

  const marcarVista = async (conquistaId) => {
    await marcarConquistaVista(conquistaId);
    await verificarNovas();
  };

  useEffect(() => {
    if (user) {
      carregarConquistas();
      verificarNovas();

      // Subscribe para novas conquistas
      const subscription = subscribeToConquistas(user.id, (payload) => {
        console.log('Nova conquista desbloqueada!', payload);
        carregarConquistas();
        verificarNovas();
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  return {
    conquistas,
    novasConquistas,
    loading,
    carregarConquistas,
    verificarNovas,
    marcarVista
  };
};

// ================================================
// USE GUIA (Chat IA)
// ================================================
import { 
  getHistoricoConversas,
  salvarConversaGuia
} from '../lib/supabase';

export const useGuia = () => {
  const { user, profile } = useAuth();
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregarHistorico = async (limite = 50) => {
    if (!user) return;
    
    setLoading(true);
    const { data } = await getHistoricoConversas(user.id, limite);
    
    if (data && data.length > 0) {
      const msgs = [];
      data.forEach(conv => {
        msgs.push({ role: 'user', content: conv.mensagem_ketero });
        msgs.push({ role: 'assistant', content: conv.resposta_ia });
      });
      setMensagens(msgs);
    } else {
      // Mensagem inicial se não houver histórico
      setMensagens([{
        role: 'assistant',
        content: 'Olá! Sou o Guia Keter, sua IA de evolução pessoal. Como posso ajudar você hoje?\n\nPosso:\n• Analisar sua evolução\n• Responder dúvidas sobre práticas\n• Sugerir próximos passos\n• Ajudar com desafios'
      }]);
    }
    
    setLoading(false);
  };

  const enviarMensagem = async (mensagem, respostaIA) => {
    if (!user) return { success: false };
    
    const contexto = {
      fase: profile?.fase_atual,
      dia: profile?.dia_total_app,
      totalPraticas: profile?.total_praticas,
      sequencia: profile?.sequencia_atual
    };
    
    const { error } = await salvarConversaGuia(user.id, mensagem, respostaIA, contexto);
    
    return { success: !error, error };
  };

  useEffect(() => {
    if (user) {
      carregarHistorico();
    }
  }, [user]);

  return {
    mensagens,
    loading,
    setMensagens,
    enviarMensagem,
    carregarHistorico
  };
};

// ================================================
// USE REALTIME PROFILE
// ================================================
import { subscribeToProfile } from '../lib/supabase';

export const useRealtimeProfile = () => {
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    if (!user) return;

    const subscription = subscribeToProfile(user.id, (payload) => {
      console.log('Profile updated:', payload);
      refreshProfile();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
};
