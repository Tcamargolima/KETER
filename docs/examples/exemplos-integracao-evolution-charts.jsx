// ================================================
// EXEMPLO DE USO: Evolution Charts
// ================================================
// Este arquivo demonstra como usar os componentes
// de gráficos de evolução em diferentes cenários

import React from 'react';
import { EvolutionCharts } from './components/features/EvolutionCharts';
import { useEvolutionData } from './hooks/useEvolutionData';

// ================================================
// EXEMPLO 1: Uso Básico (Já integrado no Perfil)
// ================================================
export const ExemploBasico = ({ userId }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">
        Minha Evolução
      </h1>
      <EvolutionCharts userId={userId} />
    </div>
  );
};

// ================================================
// EXEMPLO 2: Período Customizado
// ================================================
export const ExemploPeriodoCustomizado = ({ userId }) => {
  const [periodo, setPeriodo] = React.useState(30);
  
  const {
    statistics,
    carregando
  } = useEvolutionData(userId, periodo);

  return (
    <div className="p-6">
      {/* Seletor de Período */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setPeriodo(7)}
          className={`px-4 py-2 rounded ${periodo === 7 ? 'bg-purple-600' : 'bg-slate-700'}`}
        >
          7 dias
        </button>
        <button
          onClick={() => setPeriodo(30)}
          className={`px-4 py-2 rounded ${periodo === 30 ? 'bg-purple-600' : 'bg-slate-700'}`}
        >
          30 dias
        </button>
        <button
          onClick={() => setPeriodo(90)}
          className={`px-4 py-2 rounded ${periodo === 90 ? 'bg-purple-600' : 'bg-slate-700'}`}
        >
          90 dias
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      {!carregando && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-purple-900/30 p-4 rounded">
            <div className="text-sm text-purple-300">Dias Ativos</div>
            <div className="text-2xl font-bold text-white">
              {statistics.diasAtivos}
            </div>
          </div>
          <div className="bg-pink-900/30 p-4 rounded">
            <div className="text-sm text-pink-300">Humor Médio</div>
            <div className="text-2xl font-bold text-white">
              {statistics.mediaHumor}/10
            </div>
          </div>
          <div className="bg-amber-900/30 p-4 rounded">
            <div className="text-sm text-amber-300">Sequência</div>
            <div className="text-2xl font-bold text-white">
              {statistics.sequenciaAtual} dias
            </div>
          </div>
        </div>
      )}

      <EvolutionCharts userId={userId} />
    </div>
  );
};

// ================================================
// EXEMPLO 3: Gráfico Individual
// ================================================
export const ExemploGraficoIndividual = ({ userId }) => {
  const { moodEvolutionData, carregando } = useEvolutionData(userId, 30);

  if (carregando) return <div>Carregando...</div>;

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Seu Humor nos Últimos 30 Dias
      </h2>
      
      {moodEvolutionData.data.length > 0 ? (
        <>
          <div className="mb-4">
            <span className="text-slate-400">Média: </span>
            <span className="text-2xl font-bold text-pink-400">
              {moodEvolutionData.media}/10
            </span>
          </div>
          
          {/* Aqui você pode renderizar apenas o gráfico de humor */}
          <div className="text-slate-500 text-sm">
            💡 Dados: {moodEvolutionData.data.length} reflexões registradas
          </div>
        </>
      ) : (
        <div className="text-slate-500 text-center py-8">
          Nenhuma reflexão com humor registrado
        </div>
      )}
    </div>
  );
};

// ================================================
// EXEMPLO 4: Dashboard Resumido
// ================================================
export const ExemploDashboardResumido = ({ userId }) => {
  const {
    statistics,
    streakCalendarData,
    aiPatternsData,
    carregando,
    erro
  } = useEvolutionData(userId, 90);

  if (carregando) {
    return <div className="text-white">Carregando...</div>;
  }

  if (erro) {
    return <div className="text-red-400">Erro: {erro}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header com Resumo */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-white mb-4">
          Seu Progresso KETER
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-purple-200 text-sm">Total Reflexões</div>
            <div className="text-3xl font-bold text-white">
              {statistics.totalReflexoes}
            </div>
          </div>
          <div>
            <div className="text-purple-200 text-sm">Total Práticas</div>
            <div className="text-3xl font-bold text-white">
              {statistics.totalPraticas}
            </div>
          </div>
          <div>
            <div className="text-purple-200 text-sm">Atos de Bondade</div>
            <div className="text-3xl font-bold text-white">
              {statistics.totalMicroAtos}
            </div>
          </div>
          <div>
            <div className="text-purple-200 text-sm">Sequência Atual</div>
            <div className="text-3xl font-bold text-white">
              {statistics.sequenciaAtual} 🔥
            </div>
          </div>
        </div>
      </div>

      {/* Insights Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-white font-bold mb-2">📅 Atividade Recente</h3>
          <p className="text-slate-400 text-sm">
            Você esteve ativo em {statistics.diasAtivos} dos últimos 90 dias.
            Continue assim! 💪
          </p>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-white font-bold mb-2">🧠 Padrões IA</h3>
          <p className="text-slate-400 text-sm">
            {aiPatternsData.agencia > 50 
              ? '🎯 Você está demonstrando forte senso de agência!'
              : aiPatternsData.vitimizacao > 30
              ? '💭 Tente focar em sua capacidade de ação.'
              : '⚖️ Você mantém um equilíbrio saudável.'
            }
          </p>
        </div>
      </div>

      {/* Gráficos Completos */}
      <EvolutionCharts userId={userId} />
    </div>
  );
};

// ================================================
// EXEMPLO 5: Export de Dados
// ================================================
export const ExemploExportDados = ({ userId }) => {
  const data = useEvolutionData(userId, 90);

  const exportarCSV = () => {
    if (!data.reflexoes.length) return;

    const csv = [
      ['Data', 'Humor', 'Práticas', 'Micro-Atos'],
      ...data.reflexoes.map(r => [
        r.data,
        r.humor_dia || 'N/A',
        data.praticas.filter(p => p.completed_at?.startsWith(r.data)).length,
        data.microAtos.filter(m => m.data === r.data).length
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keter-evolucao-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6">
      <button
        onClick={exportarCSV}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg mb-6"
        disabled={data.carregando || !data.reflexoes.length}
      >
        📥 Exportar Dados CSV
      </button>
      
      <EvolutionCharts userId={userId} />
    </div>
  );
};

// ================================================
// EXEMPLO 6: Com Filtros Avançados
// ================================================
export const ExemploComFiltros = ({ userId }) => {
  const [filtros, setFiltros] = React.useState({
    periodo: 30,
    mostrarHumor: true,
    mostrarStreak: true,
    mostrarCategorias: true,
    mostrarIA: true
  });

  const data = useEvolutionData(userId, filtros.periodo);

  return (
    <div className="p-6">
      {/* Painel de Filtros */}
      <div className="bg-slate-800 rounded-xl p-4 mb-6">
        <h3 className="text-white font-bold mb-3">Filtros</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={filtros.mostrarHumor}
              onChange={(e) => setFiltros({...filtros, mostrarHumor: e.target.checked})}
            />
            Humor
          </label>
          
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={filtros.mostrarStreak}
              onChange={(e) => setFiltros({...filtros, mostrarStreak: e.target.checked})}
            />
            Streak
          </label>
          
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={filtros.mostrarCategorias}
              onChange={(e) => setFiltros({...filtros, mostrarCategorias: e.target.checked})}
            />
            Categorias
          </label>
          
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={filtros.mostrarIA}
              onChange={(e) => setFiltros({...filtros, mostrarIA: e.target.checked})}
            />
            Padrões IA
          </label>
        </div>
      </div>

      {/* Gráficos (com filtros você pode mostrar/ocultar seções) */}
      <div className="text-slate-400 text-sm mb-4">
        💡 Use os filtros acima para personalizar sua visualização
      </div>
      
      <EvolutionCharts userId={userId} />
    </div>
  );
};

// ================================================
// EXEMPLO 7: Integração Completa (como está no Perfil)
// ================================================
export const ExemploIntegracaoCompleta = ({ user, userStats }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header do Perfil */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 mb-6 border border-slate-700">
          <h1 className="text-3xl font-bold text-white mb-4">
            {user?.nome || 'Ketero'}
          </h1>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">
                {userStats?.dia_total_app || 0}
              </span>
              <span className="text-slate-400 text-sm">dias no KETER</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">
                {userStats?.total_reflexoes || 0}
              </span>
              <span className="text-slate-400 text-sm">reflexões</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">
                {userStats?.total_micro_atos || 0}
              </span>
              <span className="text-slate-400 text-sm">atos de bondade</span>
            </div>
          </div>
        </div>

        {/* Aba Evolução */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Gráficos de Evolução
            </h2>
            <p className="text-slate-400">
              Visualize seu progresso através de dados e análises
            </p>
          </div>

          <EvolutionCharts userId={user?.id} />
        </div>
      </div>
    </div>
  );
};

export default {
  ExemploBasico,
  ExemploPeriodoCustomizado,
  ExemploGraficoIndividual,
  ExemploDashboardResumido,
  ExemploExportDados,
  ExemploComFiltros,
  ExemploIntegracaoCompleta
};
