// ================================================
// PERFIL PAGE - Página de perfil do usuário
// ================================================
// Inclui aba "Reflexões" com timeline

import React, { useState, useEffect } from 'react';
import { User, Heart, Trophy, Moon, TrendingUp, Calendar, Settings } from 'lucide-react';
import { ReflexoesTimeline } from '../../components/features/ReflexoesTimeline';
import { MicroAtosStatistics } from '../../components/features/MicroAtosStatistics';
import { KindnessTree } from '../../components/features/KindnessTree';
import { useReflexoes } from '../../hooks/useReflexoes';
import { usePhaseProgress } from '../../hooks/usePhaseProgress';
import { PhaseTransitionModal } from '../../components/features/PhaseTransitionModal';

export const Perfil = ({ user, userStats }) => {
  const [abaAtiva, setAbaAtiva] = useState('visao-geral');
  const { historicoReflexoes } = useReflexoes(user?.id);
  
  const {
    transicaoPendente,
    mensagemIA,
    conquistasDesbloqueadas,
    marcarTransicaoVista
  } = usePhaseProgress();

  const [showTransitionModal, setShowTransitionModal] = useState(false);

  const abas = [
    { id: 'visao-geral', label: 'Visão Geral', icon: User },
    { id: 'micro-atos', label: 'Micro-atos', icon: Heart },
    { id: 'reflexoes', label: 'Reflexões', icon: Moon },
    { id: 'conquistas', label: 'Conquistas', icon: Trophy },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  // Verificar transição pendente ao carregar
  useEffect(() => {
    if (transicaoPendente && !showTransitionModal) {
      setShowTransitionModal(true);
    }
  }, [transicaoPendente]);

  // Handler para fechar modal de transição
  const handleCloseTransitionModal = async () => {
    if (transicaoPendente) {
      await marcarTransicaoVista(transicaoPendente.id);
    }
    setShowTransitionModal(false);
  };

  return (
    <>
      {/* Modal de Transição de Fase */}
      <PhaseTransitionModal
        isOpen={showTransitionModal}
        onClose={handleCloseTransitionModal}
        transicao={transicaoPendente}
        mensagemIA={mensagemIA}
        conquistasDesbloqueadas={conquistasDesbloqueadas}
        onContinuar={handleCloseTransitionModal}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header do Perfil */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 mb-6 border border-slate-700">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
              {user?.nome?.[0]?.toUpperCase() || 'K'}
            </div>

            {/* Info do usuário */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user?.nome || 'Ketero'}
              </h1>
              <p className="text-slate-400 mb-4">{user?.email}</p>

              {/* Stats rápidas */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold">{userStats?.dia_total_app || 0}</span>
                  <span className="text-slate-400 text-sm">dias no KETER</span>
                </div>
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-amber-400" />
                  <span className="text-white font-semibold">{userStats?.total_reflexoes || 0}</span>
                  <span className="text-slate-400 text-sm">reflexões</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <span className="text-white font-semibold">{userStats?.total_micro_atos || 0}</span>
                  <span className="text-slate-400 text-sm">atos de bondade</span>
                </div>
              </div>
            </div>

            {/* Fase atual */}
            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700">
              <div className="text-sm text-purple-300 mb-1">Fase Atual</div>
              <div className="text-2xl font-bold text-white">
                {getFaseNome(userStats?.fase_atual)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Dia {userStats?.dia_na_fase || 1}
              </div>
            </div>
          </div>
        </div>

        {/* Abas de navegação */}
        <div className="bg-slate-800/50 rounded-xl p-2 mb-6 border border-slate-700">
          <div className="flex gap-2 overflow-x-auto">
            {abas.map((aba) => {
              const Icon = aba.icon;
              return (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                    abaAtiva === aba.id
                      ? 'bg-gradient-to-r from-purple-600 to-amber-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{aba.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo das abas */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
          {abaAtiva === 'visao-geral' && <VisaoGeral userStats={userStats} />}
          {abaAtiva === 'micro-atos' && <MicroAtosTab userId={user?.id} userStats={userStats} />}
          {abaAtiva === 'reflexoes' && <ReflexoesTab historicoReflexoes={historicoReflexoes} />}
          {abaAtiva === 'conquistas' && <ConquistasTab userId={user?.id} />}
          {abaAtiva === 'configuracoes' && <ConfiguracoesTab user={user} />}
        </div>
      </div>
    </div>
    </>
  );
};

// ================================================
// ABA: Micro-atos
// ================================================
const MicroAtosTab = ({ userId, userStats }) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Micro-atos de Bondade</h2>
        <p className="text-slate-400">
          Seu impacto no mundo através de pequenos atos de bondade
        </p>
      </div>

      {/* Árvore da Bondade */}
      <KindnessTree totalMicroAtos={userStats?.total_micro_atos || 0} />

      {/* Estatísticas Detalhadas */}
      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
        <MicroAtosStatistics userId={userId} />
      </div>
    </div>
  );
};

// ================================================
// ABA: Reflexões
// ================================================
const ReflexoesTab = ({ historicoReflexoes }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Suas Reflexões Noturnas</h2>
        <p className="text-slate-400">
          Histórico completo das suas reflexões e análises
        </p>
      </div>

      <ReflexoesTimeline reflexoes={historicoReflexoes} />
    </div>
  );
};

// ================================================
// ABA: Visão Geral
// ================================================
const VisaoGeral = ({ userStats }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Visão Geral</h2>
        <p className="text-slate-400">Seu progresso na jornada KETER</p>
      </div>

      {/* Grid de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Sequência Atual"
          value={userStats?.sequencia_atual || 0}
          subtext="dias consecutivos"
          color="purple"
        />
        <StatCard
          icon={Trophy}
          label="Recorde"
          value={userStats?.sequencia_maxima || 0}
          subtext="maior sequência"
          color="amber"
        />
        <StatCard
          icon={Calendar}
          label="Total de Práticas"
          value={userStats?.total_praticas || 0}
          subtext="práticas completadas"
          color="pink"
        />
      </div>

      {/* Mais estatísticas podem ser adicionadas aqui */}
    </div>
  );
};

// ================================================
// ABA: Conquistas
// ================================================
const ConquistasTab = ({ userId }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Conquistas</h2>
        <p className="text-slate-400">Suas conquistas desbloqueadas</p>
      </div>
      
      <div className="text-center py-12 text-slate-500">
        Sistema de conquistas em desenvolvimento...
      </div>
    </div>
  );
};

// ================================================
// ABA: Configurações
// ================================================
const ConfiguracoesTab = ({ user }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Configurações</h2>
        <p className="text-slate-400">Personalize sua experiência</p>
      </div>
      
      <div className="text-center py-12 text-slate-500">
        Configurações em desenvolvimento...
      </div>
    </div>
  );
};

// ================================================
// COMPONENTES AUXILIARES
// ================================================

const StatCard = ({ icon: Icon, label, value, subtext, color }) => {
  const colorClasses = {
    purple: 'from-purple-900/50 to-purple-800/50 border-purple-700 text-purple-400',
    amber: 'from-amber-900/50 to-amber-800/50 border-amber-700 text-amber-400',
    pink: 'from-pink-900/50 to-pink-800/50 border-pink-700 text-pink-400',
  };

  return (
    <div className={`bg-gradient-to-br rounded-xl p-6 border ${colorClasses[color]}`}>
      <Icon className="w-8 h-8 mb-3" />
      <div className="text-sm text-slate-300 mb-1">{label}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-400">{subtext}</div>
    </div>
  );
};

const getFaseNome = (fase) => {
  const fases = {
    1: 'DESPERTAR',
    2: 'DISCIPLINA',
    3: 'CONSCIÊNCIA',
    4: 'SERVIÇO'
  };
  return fases[fase] || 'DESPERTAR';
};

export default Perfil;
