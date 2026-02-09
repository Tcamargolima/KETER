// ================================================
// COMPONENTE: EvolutionCharts
// ================================================
// Exibe 4 gráficos de evolução:
// 1. Streak Calendar - Dias ativos
// 2. Mood Evolution - Linha de humor
// 3. Progress by Category - Pizza por categoria
// 4. AI Patterns - Pizza de padrões IA

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Heart, Brain, Calendar } from 'lucide-react';
import { useEvolutionData } from '../../hooks/useEvolutionData';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ================================================
// Paleta de cores KETER
// ================================================
const KETER_COLORS = {
  purple: {
    main: '#9333ea',
    light: '#a855f7',
    dark: '#7e22ce',
    gradient: 'rgba(147, 51, 234, 0.8)'
  },
  pink: {
    main: '#ec4899',
    light: '#f472b6',
    dark: '#db2777',
    gradient: 'rgba(236, 72, 153, 0.8)'
  },
  amber: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    gradient: 'rgba(245, 158, 11, 0.8)'
  },
  slate: {
    main: '#64748b',
    light: '#94a3b8',
    dark: '#475569'
  }
};

// ================================================
// COMPONENTE PRINCIPAL
// ================================================
export const EvolutionCharts = ({ userId }) => {
  const {
    carregando,
    erro,
    streakCalendarData,
    moodEvolutionData,
    progressByCategoryData,
    aiPatternsData,
    statistics
  } = useEvolutionData(userId, 90);

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Carregando dados de evolução...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 text-red-200">
        <p className="font-semibold mb-2">Erro ao carregar dados</p>
        <p className="text-sm">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas gerais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Dias Ativos"
          value={statistics.diasAtivos}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          label="Sequência Atual"
          value={`${statistics.sequenciaAtual} dias`}
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          label="Humor Médio"
          value={`${statistics.mediaHumor}/10`}
          icon={Heart}
          color="pink"
        />
        <StatCard
          label="Total de Atos"
          value={statistics.totalMicroAtos}
          icon={Brain}
          color="purple"
        />
      </div>

      {/* Grid de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Streak Calendar */}
        <ChartCard
          title="Calendário de Atividades"
          subtitle="Últimos 30 dias - práticas, reflexões e micro-atos"
          icon={Calendar}
        >
          <StreakCalendar data={streakCalendarData} />
        </ChartCard>

        {/* 2. Mood Evolution */}
        <ChartCard
          title="Evolução do Humor"
          subtitle="Média diária do seu estado emocional"
          icon={TrendingUp}
        >
          <MoodEvolutionChart data={moodEvolutionData} />
        </ChartCard>

        {/* 3. Progress by Category */}
        <ChartCard
          title="Progresso por Categoria"
          subtitle="Distribuição de práticas completadas"
          icon={Heart}
        >
          <ProgressByCategory data={progressByCategoryData} />
        </ChartCard>

        {/* 4. AI Patterns */}
        <ChartCard
          title="Padrões Detectados pela IA"
          subtitle="Análise de agência vs vitimização"
          icon={Brain}
        >
          <AIPatternsChart data={aiPatternsData} />
        </ChartCard>
      </div>
    </div>
  );
};

// ================================================
// 1. STREAK CALENDAR (Bar Chart)
// ================================================
const StreakCalendar = ({ data }) => {
  if (!data.data || data.data.length === 0) {
    return <EmptyState message="Nenhuma atividade registrada ainda" />;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Atividades',
        data: data.data,
        backgroundColor: data.data.map(value => {
          if (value === 0) return 'rgba(100, 116, 139, 0.3)';
          if (value <= 1) return KETER_COLORS.purple.gradient;
          if (value <= 2) return KETER_COLORS.pink.gradient;
          return KETER_COLORS.amber.gradient;
        }),
        borderColor: data.data.map(value => {
          if (value === 0) return KETER_COLORS.slate.main;
          if (value <= 1) return KETER_COLORS.purple.main;
          if (value <= 2) return KETER_COLORS.pink.main;
          return KETER_COLORS.amber.main;
        }),
        borderWidth: 2,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            if (value === 0) return 'Nenhuma atividade';
            if (value === 1) return '1 atividade';
            return `${value} atividades`;
          }
        },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: KETER_COLORS.purple.main,
        borderWidth: 1,
        padding: 12,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94a3b8',
          stepSize: 1
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#94a3b8',
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

// ================================================
// 2. MOOD EVOLUTION (Line Chart)
// ================================================
const MoodEvolutionChart = ({ data }) => {
  if (!data.data || data.data.length === 0) {
    return <EmptyState message="Nenhuma reflexão com humor registrado" />;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Humor',
        data: data.data,
        borderColor: KETER_COLORS.pink.main,
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: KETER_COLORS.pink.main,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `Humor: ${context.parsed.y.toFixed(1)}/10`
        },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: KETER_COLORS.pink.main,
        borderWidth: 1,
        padding: 12,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          color: '#94a3b8',
          stepSize: 2
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#94a3b8',
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

// ================================================
// 3. PROGRESS BY CATEGORY (Doughnut Chart)
// ================================================
const ProgressByCategory = ({ data }) => {
  if (!data.data || data.data.length === 0) {
    return <EmptyState message="Nenhuma prática completada ainda" />;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.data,
        backgroundColor: [
          KETER_COLORS.purple.gradient,
          KETER_COLORS.pink.gradient,
          KETER_COLORS.amber.gradient,
          'rgba(100, 116, 139, 0.6)',
          'rgba(147, 51, 234, 0.5)',
          'rgba(236, 72, 153, 0.5)'
        ],
        borderColor: [
          KETER_COLORS.purple.main,
          KETER_COLORS.pink.main,
          KETER_COLORS.amber.main,
          KETER_COLORS.slate.main,
          KETER_COLORS.purple.light,
          KETER_COLORS.pink.light
        ],
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: KETER_COLORS.purple.main,
        borderWidth: 1,
        padding: 12
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

// ================================================
// 4. AI PATTERNS (Pie Chart)
// ================================================
const AIPatternsChart = ({ data }) => {
  if (!data.data || data.data.length === 0 || (data.labels.length === 1 && data.labels[0] === 'Sem dados')) {
    return <EmptyState message="Nenhuma análise de IA disponível" />;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.data,
        backgroundColor: [
          KETER_COLORS.amber.gradient,   // Agência
          KETER_COLORS.purple.gradient,  // Vitimização
          KETER_COLORS.pink.gradient     // Neutro
        ],
        borderColor: [
          KETER_COLORS.amber.main,
          KETER_COLORS.purple.main,
          KETER_COLORS.pink.main
        ],
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}%`;
          }
        },
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: KETER_COLORS.purple.main,
        borderWidth: 1,
        padding: 12
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

// ================================================
// COMPONENTES AUXILIARES
// ================================================

const ChartCard = ({ title, subtitle, icon: Icon, children }) => {
  return (
    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-purple-900/30 rounded-lg">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    purple: 'from-purple-900/50 to-purple-800/50 border-purple-700 text-purple-400',
    amber: 'from-amber-900/50 to-amber-800/50 border-amber-700 text-amber-400',
    pink: 'from-pink-900/50 to-pink-800/50 border-pink-700 text-pink-400',
  };

  return (
    <div className={`bg-gradient-to-br rounded-xl p-4 border ${colorClasses[color]}`}>
      <Icon className="w-6 h-6 mb-2" />
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-300">{label}</div>
    </div>
  );
};

const EmptyState = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-64 text-slate-500">
      <div className="text-center">
        <p className="text-sm">{message}</p>
        <p className="text-xs mt-2">Continue sua jornada para ver seus gráficos de evolução</p>
      </div>
    </div>
  );
};

export default EvolutionCharts;
