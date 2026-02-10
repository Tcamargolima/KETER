// ================================================
// EXEMPLO DE INTEGRAÇÃO - Micro-atos de Bondade
// ================================================
// Demonstra como integrar os componentes de micro-atos
// nas páginas Home e Perfil

import React from 'react';
import MicroAtosCard from './src/components/features/MicroAtosCard';
import MicroAtosStatistics from './src/components/features/MicroAtosStatistics';

// ================================================
// 1. INTEGRAÇÃO NA HOME PAGE
// ================================================

// src/pages/Home/index.jsx
export const HomeComMicroAtos = ({ userId }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Seção de boas-vindas */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo de volta! ✨
        </h1>
        <p className="text-gray-600">
          Continue sua jornada de evolução pessoal
        </p>
      </div>

      {/* Grid com Prática Diária e Micro-ato */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prática Diária (já existente) */}
        <div>
          {/* Seu componente de prática diária aqui */}
        </div>

        {/* Micro-ato do Dia */}
        <div>
          <MicroAtosCard 
            userId={userId}
            onComplete={() => {
              // Callback quando o micro-ato é completado
              console.log('Micro-ato completado!');
              // Pode mostrar uma notificação, atualizar estatísticas, etc.
            }}
          />
        </div>
      </div>

      {/* Outras seções da home... */}
    </div>
  );
};

// ================================================
// 2. INTEGRAÇÃO NO PERFIL
// ================================================

// src/pages/Perfil/index.jsx
export const PerfilComMicroAtos = ({ userId }) => {
  const [abaAtiva, setAbaAtiva] = React.useState('praticas');

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header do Perfil */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        {/* Informações do usuário */}
      </div>

      {/* Abas */}
      <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
        <button
          onClick={() => setAbaAtiva('praticas')}
          className={`px-6 py-3 font-semibold transition-colors ${
            abaAtiva === 'praticas'
              ? 'text-purple-600 border-b-2 border-purple-600 -mb-0.5'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Práticas
        </button>
        
        <button
          onClick={() => setAbaAtiva('micro-atos')}
          className={`px-6 py-3 font-semibold transition-colors ${
            abaAtiva === 'micro-atos'
              ? 'text-purple-600 border-b-2 border-purple-600 -mb-0.5'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          💝 Micro-atos
        </button>

        <button
          onClick={() => setAbaAtiva('reflexoes')}
          className={`px-6 py-3 font-semibold transition-colors ${
            abaAtiva === 'reflexoes'
              ? 'text-purple-600 border-b-2 border-purple-600 -mb-0.5'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Reflexões
        </button>
      </div>

      {/* Conteúdo das Abas */}
      <div>
        {abaAtiva === 'praticas' && (
          <div>
            {/* Conteúdo de práticas */}
          </div>
        )}

        {abaAtiva === 'micro-atos' && (
          <MicroAtosStatistics userId={userId} />
        )}

        {abaAtiva === 'reflexoes' && (
          <div>
            {/* Conteúdo de reflexões */}
          </div>
        )}
      </div>
    </div>
  );
};

// ================================================
// 3. INTEGRAÇÃO COM NOTIFICAÇÃO
// ================================================

export const NotificacaoMicroAto = ({ userId }) => {
  const [mostrar, setMostrar] = React.useState(false);

  React.useEffect(() => {
    // Verificar se já fez o micro-ato hoje
    const verificarMicroAto = async () => {
      const hoje = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('micro_atos')
        .select('*')
        .eq('ketero_id', userId)
        .eq('data', hoje)
        .eq('executado', true)
        .maybeSingle();

      // Mostrar notificação às 14h se não fez ainda
      const hora = new Date().getHours();
      if (!data && hora >= 14) {
        setMostrar(true);
      }
    };

    verificarMicroAto();
  }, [userId]);

  if (!mostrar) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6 rounded-2xl shadow-2xl max-w-sm z-50 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="text-3xl">💝</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Micro-ato do Dia</h3>
          <p className="text-sm opacity-90 mb-3">
            Que tal fazer um pequeno ato de bondade hoje?
          </p>
          <button
            onClick={() => setMostrar(false)}
            className="bg-white text-pink-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-pink-50 transition-colors"
          >
            Ver agora
          </button>
        </div>
        <button
          onClick={() => setMostrar(false)}
          className="text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// ================================================
// 4. WIDGET COMPACTO PARA DASHBOARD
// ================================================

export const MicroAtosWidget = ({ userId }) => {
  const { microAtoAtual, jaRealizouHoje, carregando } = useMicroAtos(userId);

  if (carregando) return <div>Carregando...</div>;

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border-2 border-pink-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">💝 Micro-ato Hoje</h3>
        {jaRealizouHoje && (
          <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
            ✓ Feito
          </span>
        )}
      </div>
      
      {!jaRealizouHoje && microAtoAtual && (
        <p className="text-sm text-gray-700 mb-4">
          {microAtoAtual.descricao}
        </p>
      )}
      
      {jaRealizouHoje && (
        <p className="text-sm text-gray-600 italic">
          Parabéns! Você já realizou seu micro-ato hoje! 🎉
        </p>
      )}
    </div>
  );
};

// ================================================
// 5. HOOK PERSONALIZADO PARA GAMIFICAÇÃO
// ================================================

export const useMicroAtosGamification = (userId) => {
  const { obterEstatisticas } = useMicroAtos(userId);
  const stats = obterEstatisticas();

  // Calcular nível baseado no total de micro-atos
  const calcularNivel = (total) => {
    if (total >= 100) return { nivel: 5, titulo: 'Agente de Luz', proximo: null };
    if (total >= 50) return { nivel: 4, titulo: 'Coração Radiante', proximo: 100 };
    if (total >= 20) return { nivel: 3, titulo: 'Alma Generosa', proximo: 50 };
    if (total >= 7) return { nivel: 2, titulo: 'Bondade Iniciante', proximo: 20 };
    return { nivel: 1, titulo: 'Primeiro Passo', proximo: 7 };
  };

  const nivelAtual = calcularNivel(stats.total);
  const progresso = nivelAtual.proximo 
    ? (stats.total / nivelAtual.proximo) * 100 
    : 100;

  return {
    nivel: nivelAtual.nivel,
    titulo: nivelAtual.titulo,
    totalAtos: stats.total,
    proximoMilestone: nivelAtual.proximo,
    progresso,
    stats
  };
};

// ================================================
// 6. ANIMAÇÃO DE CELEBRAÇÃO
// ================================================

export const CelebracaoMicroAto = ({ onClose }) => {
  React.useEffect(() => {
    // Confetti animation
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-12 max-w-md text-center animate-scale-up">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Incrível!
        </h2>
        <p className="text-gray-600 text-lg">
          Você acabou de fazer o mundo um pouquinho melhor! 💝
        </p>
      </div>
    </div>
  );
};

// ================================================
// 7. CSS NECESSÁRIO (adicionar ao tailwind.config.js ou CSS global)
// ================================================

/*
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-up {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-scale-up {
  animation: scale-up 0.5s ease-out;
}
*/
