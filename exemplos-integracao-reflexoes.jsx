// ================================================
// EXEMPLO DE INTEGRAÇÃO - Sistema de Reflexões
// ================================================
// Este arquivo mostra como integrar o sistema de reflexões
// no seu app KETER existente

import React, { useState, useEffect } from 'react';
import { useReflexoes } from './src/hooks/useReflexoes';
import { NotificacaoReflexao } from './src/components/features/NotificacaoReflexao';
import { ReflexaoIntegration } from './src/components/features/ReflexaoIntegration';

// ================================================
// EXEMPLO 1: Integração Básica
// ================================================

export function AppComReflexoes() {
  const [user, setUser] = useState(null);
  
  // Hook de reflexões
  const reflexoesHook = useReflexoes(user?.id);

  return (
    <div className="app">
      {/* Seu conteúdo existente */}
      <main>
        {/* ... */}
      </main>

      {/* Sistema de Reflexões */}
      <NotificacaoReflexao
        mostrar={reflexoesHook.mostrarNotificacao}
        onAbrir={() => reflexoesHook.setMostrarModal(true)}
        onFechar={() => reflexoesHook.setMostrarNotificacao(false)}
      />

      {reflexoesHook.mostrarModal && (
        <ReflexaoIntegration
          userId={user?.id}
          onComplete={() => {
            reflexoesHook.setMostrarModal(false);
            console.log('Reflexão completa!');
          }}
        />
      )}
    </div>
  );
}

// ================================================
// EXEMPLO 2: Card na Home
// ================================================

export function HomeComCardReflexao({ user }) {
  const { jaFezReflexaoHoje, setMostrarModal } = useReflexoes(user?.id);

  return (
    <div className="home">
      <h1>Bem-vindo, {user?.nome}!</h1>

      {/* Cards do dia */}
      <div className="grid gap-4">
        {/* Outros cards... */}

        {/* Card de Reflexão */}
        {!jaFezReflexaoHoje ? (
          <div 
            onClick={() => setMostrarModal(true)}
            className="bg-gradient-to-br from-purple-900 to-amber-900 rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform border border-purple-500/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🌙</div>
              <h3 className="text-xl font-bold text-white">Reflexão Noturna</h3>
            </div>
            <p className="text-purple-200 text-sm mb-2">
              Ainda não fez sua reflexão de hoje
            </p>
            <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
              Fazer Agora
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 border border-green-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">✨</div>
              <h3 className="text-xl font-bold text-white">Reflexão Completa!</h3>
            </div>
            <p className="text-green-200 text-sm">
              Você já refletiu sobre seu dia. Volte amanhã!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ================================================
// EXEMPLO 3: Botão no Menu
// ================================================

export function MenuComReflexao({ user }) {
  const { setMostrarModal, jaFezReflexaoHoje } = useReflexoes(user?.id);

  return (
    <nav className="menu">
      <button onClick={() => setMostrarModal(true)}>
        🌙 Reflexão
        {!jaFezReflexaoHoje && (
          <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
            Pendente
          </span>
        )}
      </button>
    </nav>
  );
}

// ================================================
// EXEMPLO 4: Com React Router
// ================================================

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Perfil from './src/pages/Perfil';

export function AppComRotas() {
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({});

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/perfil">Perfil</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route 
          path="/perfil" 
          element={<Perfil user={user} userStats={userStats} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

// ================================================
// EXEMPLO 5: Trigger Manual (sem notificação automática)
// ================================================

export function ReflexaoManual({ user }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const { salvarReflexao } = useReflexoes(user?.id);

  const handleComplete = () => {
    setMostrarModal(false);
    alert('Reflexão salva com sucesso!');
  };

  return (
    <div>
      <button 
        onClick={() => setMostrarModal(true)}
        className="btn-primary"
      >
        Abrir Reflexão
      </button>

      {mostrarModal && (
        <ReflexaoIntegration
          userId={user?.id}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}

// ================================================
// EXEMPLO 6: Com Toast de Sucesso
// ================================================

export function ReflexaoComToast({ user }) {
  const reflexoesHook = useReflexoes(user?.id);
  const [toast, setToast] = useState(null);

  const handleComplete = () => {
    reflexoesHook.setMostrarModal(false);
    
    // Mostrar toast de sucesso
    setToast('Reflexão salva! Continue sua jornada amanhã 🌟');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      {/* Sistema de Reflexões */}
      <NotificacaoReflexao
        mostrar={reflexoesHook.mostrarNotificacao}
        onAbrir={() => reflexoesHook.setMostrarModal(true)}
        onFechar={() => reflexoesHook.setMostrarNotificacao(false)}
      />

      {reflexoesHook.mostrarModal && (
        <ReflexaoIntegration
          userId={user?.id}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}

// ================================================
// EXEMPLO 7: Verificar Conquistas Desbloqueadas
// ================================================

export function VerificarConquistas({ user }) {
  const [conquistasRecentes, setConquistasRecentes] = useState([]);

  useEffect(() => {
    const verificar = async () => {
      const { supabase } = await import('./src/lib/supabase');
      
      const { data } = await supabase
        .from('keteros_conquistas')
        .select(`
          *,
          conquistas (nome, descricao, icone)
        `)
        .eq('ketero_id', user?.id)
        .eq('visualizada', false);

      if (data && data.length > 0) {
        setConquistasRecentes(data);
      }
    };

    if (user?.id) {
      verificar();
    }
  }, [user?.id]);

  if (conquistasRecentes.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-2xl p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          🏆 Nova Conquista!
        </h2>
        {conquistasRecentes.map((c) => (
          <div key={c.id} className="mb-4">
            <div className="text-5xl mb-2">{c.conquistas.icone}</div>
            <h3 className="text-xl font-bold text-white">
              {c.conquistas.nome}
            </h3>
            <p className="text-slate-400">{c.conquistas.descricao}</p>
          </div>
        ))}
        <button 
          onClick={() => {
            // Marcar como visualizada
            setConquistasRecentes([]);
          }}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

// ================================================
// EXPORTAÇÕES
// ================================================

export default {
  AppComReflexoes,
  HomeComCardReflexao,
  MenuComReflexao,
  AppComRotas,
  ReflexaoManual,
  ReflexaoComToast,
  VerificarConquistas
};
