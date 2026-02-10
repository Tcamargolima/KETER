import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

/**
 * Hook para gerenciar autenticação do usuário
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password, maxRetries = 3) => {
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (!error) {
          return { data, error: null };
        }
        
        // Handle specific error types
        if (error.name === 'AuthApiError' && error.status === 400) {
          // Invalid credentials or unconfirmed account - don't retry
          return { 
            data: null, 
            error: {
              ...error,
              message: 'Email/senha incorretos ou conta não confirmada. Verifique sua caixa de entrada para confirmação.',
              friendlyMessage: 'Email/senha incorretos ou conta não confirmada. Verifique sua caixa de entrada para confirmação.'
            }
          };
        }
        
        // For other errors, store and potentially retry
        lastError = error;
        
        // If temporary error and not last attempt, wait before retry
        if (attempt < maxRetries) {
          console.warn(`⚠️ Tentativa ${attempt}/${maxRetries} de login falhou. Tentando novamente...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
        
      } catch (err) {
        lastError = err;
        if (attempt === maxRetries) {
          break;
        }
      }
    }
    
    // All retries failed
    return { 
      data: null, 
      error: lastError || new Error('Falha ao fazer login após várias tentativas')
    };
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}

export function AuthProvider({ children }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

/**
 * Hook simples para acessar apenas a sessão do usuário
 * Pode ser usado em qualquer lugar sem necessitar de AuthProvider
 * 
 * @returns {{session: Object|null, loading: boolean}} Objeto com a sessão atual e estado de carregamento
 * @example
 * const { session, loading } = useSession();
 * const userId = session?.user?.id;
 * 
 * Use este hook quando você só precisa da sessão (para pegar user.id, email, etc)
 * e não precisa das funções de signIn/signUp/signOut do hook completo useAuth()
 */
export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obter sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
}
