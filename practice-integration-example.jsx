import React, { useState, useEffect } from 'react';
import { supabase } from './src/lib/supabase';
import Home from './src/pages/Home';
import PracticeLibrary from './src/components/features/PracticeLibrary';
import PracticeTimer from './src/components/features/PracticeTimer';

/**
 * EXEMPLO DE INTEGRAÇÃO - Biblioteca de Práticas KETER
 * 
 * Este componente demonstra como integrar:
 * - Home com recomendação IA
 * - Biblioteca de práticas com filtros
 * - Timer circular dinâmico
 * 
 * USO:
 * import PracticeApp from './practice-integration-example';
 * <PracticeApp />
 */

const PracticeApp = () => {
  const [currentView, setCurrentView] = useState('home'); // home | library | timer
  const [userId, setUserId] = useState(null);
  const [selectedPraticaId, setSelectedPraticaId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================================
  // 1. Obter usuário logado
  // ================================================
  useEffect(() => {
    const initUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
      } catch (err) {
        console.error('Erro ao obter usuário:', err);
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, []);

  // ================================================
  // 2. Handlers de Navegação
  // ================================================
  
  const handleStartPratica = (pratica) => {
    setSelectedPraticaId(pratica.id);
    setCurrentView('timer');
  };

  const handleOpenLibrary = () => {
    setCurrentView('library');
  };

  const handleBackToHome = () => {
    setSelectedPraticaId(null);
    setCurrentView('home');
  };

  const handlePraticaComplete = (pratica) => {
    console.log('Prática completada:', pratica);
    // Aqui você pode:
    // - Mostrar modal de conquista
    // - Atualizar estatísticas
    // - Desbloquear conquistas
    // - Navegar para próxima tela
    
    handleBackToHome();
  };

  // ================================================
  // 3. Loading State
  // ================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // ================================================
  // 4. Renderização Condicional das Views
  // ================================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* HOME - Dashboard com recomendação */}
      {currentView === 'home' && (
        <Home
          userId={userId}
          onStartPratica={handleStartPratica}
          onOpenLibrary={handleOpenLibrary}
        />
      )}

      {/* LIBRARY - Biblioteca completa de práticas */}
      {currentView === 'library' && (
        <div>
          <PracticeLibrary
            userId={userId}
            onSelectPratica={handleStartPratica}
          />
          
          {/* Botão de voltar */}
          <div className="max-w-7xl mx-auto p-6">
            <button
              onClick={handleBackToHome}
              className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
            >
              ← Voltar para Home
            </button>
          </div>
        </div>
      )}

      {/* TIMER - Prática em andamento */}
      {currentView === 'timer' && selectedPraticaId && (
        <PracticeTimer
          praticaId={selectedPraticaId}
          userId={userId}
          onComplete={handlePraticaComplete}
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
};

export default PracticeApp;

// ================================================
// EXEMPLO DE USO NO APP PRINCIPAL (keter-app.jsx)
// ================================================

/**
 * No seu arquivo principal, você pode integrar assim:
 * 
 * import PracticeApp from './practice-integration-example';
 * 
 * // Dentro do seu switch/case de views:
 * case 'praticas':
 *   return <PracticeApp />;
 * 
 * // Ou como rota no React Router:
 * <Route path="/praticas" element={<PracticeApp />} />
 */

// ================================================
// INTEGRAÇÃO COM SISTEMA DE NAVEGAÇÃO EXISTENTE
// ================================================

/**
 * Se você já tem um sistema de navegação (como no keter-app.jsx),
 * você pode integrar os componentes diretamente:
 * 
 * const [currentView, setCurrentView] = useState('home');
 * const [selectedPraticaId, setSelectedPraticaId] = useState(null);
 * 
 * // Na sua função de render/switch:
 * switch(currentView) {
 *   case 'home':
 *     return (
 *       <Home 
 *         userId={user?.id}
 *         onStartPratica={(pratica) => {
 *           setSelectedPraticaId(pratica.id);
 *           setCurrentView('practice-timer');
 *         }}
 *         onOpenLibrary={() => setCurrentView('practice-library')}
 *       />
 *     );
 *   
 *   case 'practice-library':
 *     return (
 *       <PracticeLibrary
 *         userId={user?.id}
 *         onSelectPratica={(pratica) => {
 *           setSelectedPraticaId(pratica.id);
 *           setCurrentView('practice-timer');
 *         }}
 *       />
 *     );
 *   
 *   case 'practice-timer':
 *     return (
 *       <PracticeTimer
 *         praticaId={selectedPraticaId}
 *         userId={user?.id}
 *         onComplete={(pratica) => {
 *           // Lógica de conclusão
 *           setCurrentView('home');
 *         }}
 *         onBack={() => setCurrentView('home')}
 *       />
 *     );
 * }
 */

// ================================================
// INTEGRAÇÃO COM REACT ROUTER
// ================================================

/**
 * Se usar React Router:
 * 
 * import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
 * 
 * function PracticeRoutes() {
 *   const navigate = useNavigate();
 *   const [user, setUser] = useState(null);
 * 
 *   return (
 *     <Routes>
 *       <Route 
 *         path="/" 
 *         element={
 *           <Home 
 *             userId={user?.id}
 *             onStartPratica={(p) => navigate(`/practice/${p.id}`)}
 *             onOpenLibrary={() => navigate('/library')}
 *           />
 *         } 
 *       />
 *       
 *       <Route 
 *         path="/library" 
 *         element={
 *           <PracticeLibrary
 *             userId={user?.id}
 *             onSelectPratica={(p) => navigate(`/practice/${p.id}`)}
 *           />
 *         } 
 *       />
 *       
 *       <Route 
 *         path="/practice/:id" 
 *         element={<PracticeTimerRoute userId={user?.id} />} 
 *       />
 *     </Routes>
 *   );
 * }
 * 
 * function PracticeTimerRoute({ userId }) {
 *   const { id } = useParams();
 *   const navigate = useNavigate();
 *   
 *   return (
 *     <PracticeTimer
 *       praticaId={id}
 *       userId={userId}
 *       onComplete={() => navigate('/')}
 *       onBack={() => navigate(-1)}
 *     />
 *   );
 * }
 */
