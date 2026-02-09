// ================================================
// EXEMPLO: Como integrar NotificationSystem no Home
// ================================================
// Este arquivo demonstra como adicionar o sistema de notificações
// em qualquer página da aplicação

import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, TrendingUp, BookOpen, Play, ChevronRight } from 'lucide-react';
import { usePraticas } from '../../hooks/usePraticas';
import { usePhaseProgress } from '../../hooks/usePhaseProgress';
import { MicroAtosCard } from '../../components/features/MicroAtosCard';
import { PhaseTransitionModal } from '../../components/features/PhaseTransitionModal';
import { NotificationSystem } from '../../components/features/NotificationSystem';
import { supabase } from '../../lib/supabase';

/**
 * Componente Home - Dashboard Principal COM NOTIFICAÇÕES
 * Mostra a próxima prática recomendada pela IA
 */
const HomeWithNotifications = ({ userId, onStartPratica, onOpenLibrary, onOpenReflexao }) => {
  const {
    faseAtual,
    recomendarProximaPratica,
    obterEstatisticas,
    carregando
  } = usePraticas(userId);

  const {
    transicaoPendente,
    mensagemIA,
    conquistasDesbloqueadas,
    marcarTransicaoVista,
    verificarETransitar
  } = usePhaseProgress();

  const [praticaRecomendada, setPraticaRecomendada] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);
  const [carregandoRecomendacao, setCarregandoRecomendacao] = useState(true);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // ================================================
  // NOVO: Buscar perfil do usuário
  // ================================================
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('keteros')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setUserProfile(data);
      }
    };

    fetchProfile();
  }, [userId]);

  // Verificar transição pendente ao carregar
  useEffect(() => {
    if (transicaoPendente && !showTransitionModal) {
      setShowTransitionModal(true);
    }
  }, [transicaoPendente]);

  // Carregar recomendação e estatísticas
  useEffect(() => {
    if (!userId) return;

    const carregarDados = async () => {
      setCarregandoRecomendacao(true);

      // Verificar se há transição disponível
      await verificarETransitar();

      // Buscar prática recomendada
      const { data: pratica } = await recomendarProximaPratica();
      setPraticaRecomendada(pratica);

      // Buscar estatísticas
      const stats = await obterEstatisticas();
      setEstatisticas(stats);

      setCarregandoRecomendacao(false);
    };

    carregarDados();
  }, [userId]);

  // Handler para fechar modal de transição
  const handleCloseTransitionModal = async () => {
    if (transicaoPendente) {
      await marcarTransicaoVista(transicaoPendente.id);
    }
    setShowTransitionModal(false);
  };

  // ================================================
  // NOVO: Handler para clique em notificação
  // ================================================
  const handleNotificationClick = (notification) => {
    // Redirecionar baseado no tipo de notificação
    switch (notification.type) {
      case 'lembrete_pratica':
        // Redirecionar para página de prática
        if (onStartPratica) {
          onStartPratica(praticaRecomendada);
        }
        break;
      
      case 'lembrete_reflexao':
        // Redirecionar para página de reflexão
        if (onOpenReflexao) {
          onOpenReflexao();
        }
        break;
      
      case 'conquista':
        // Pode abrir modal de conquista ou página de perfil
        console.log('Conquista desbloqueada:', notification.data);
        break;
      
      case 'ia_feedback':
        // Pode abrir chat com IA ou sugestão de prática
        if (notification.data?.sugestao && onStartPratica) {
          console.log('IA sugeriu:', notification.data.sugestao);
        }
        break;
      
      default:
        console.log('Notificação:', notification);
    }
  };

  // Loading
  if (carregando || carregandoRecomendacao) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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

      <div className="max-w-7xl mx-auto p-6">
        {/* ================================================
            NOVO: Header com Sistema de Notificações
            ================================================ */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta! ✨
            </h1>
            <p className="text-gray-600">
              Você está na Fase {faseAtual} da sua jornada KETER
            </p>
          </div>
          
          {/* Sistema de Notificações */}
          <NotificationSystem
            userId={userId}
            userProfile={userProfile}
            onNotificationClick={handleNotificationClick}
          />
        </div>

        {/* Resto do conteúdo da página Home... */}
        {/* Prática Recomendada */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={24} className="text-yellow-300" />
            <h2 className="text-2xl font-bold">Próxima Prática Recomendada</h2>
          </div>

          {praticaRecomendada ? (
            <div>
              <div className="mb-6">
                <h3 className="text-3xl font-bold mb-2">{praticaRecomendada.titulo}</h3>
                <p className="text-purple-100 text-lg mb-4">{praticaRecomendada.subtitulo}</p>
                
                <div className="flex items-center gap-4 text-sm mb-6">
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                    <Clock size={18} />
                    <span>{praticaRecomendada.duracao_min} minutos</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                    <BookOpen size={18} />
                    <span>{praticaRecomendada.categoria}</span>
                  </div>
                </div>

                <button
                  onClick={() => onStartPratica && onStartPratica(praticaRecomendada)}
                  className="mt-4 px-8 py-3 bg-white text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
                >
                  <Play size={20} />
                  Começar Prática
                </button>
              </div>
            </div>
          ) : (
            <p className="text-purple-100">Carregando recomendação...</p>
          )}
        </div>

        {/* Estatísticas */}
        {estatisticas && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-purple-600" size={24} />
                <h3 className="font-semibold text-gray-700">Sequência Atual</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{estatisticas.sequencia_atual} dias</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-purple-600" size={24} />
                <h3 className="font-semibold text-gray-700">Total de Práticas</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{estatisticas.total_praticas}</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-purple-600" size={24} />
                <h3 className="font-semibold text-gray-700">Tempo Total</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{estatisticas.tempo_total_minutos} min</p>
            </div>
          </div>
        )}

        {/* Micro Atos */}
        <MicroAtosCard userId={userId} />
      </div>
    </>
  );
};

export default HomeWithNotifications;
