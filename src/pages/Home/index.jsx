import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Clock, TrendingUp, BookOpen, Play, ChevronRight, MessageCircle } from 'lucide-react';
import { usePraticas } from '../../hooks/usePraticas';
import { usePhaseProgress } from '../../hooks/usePhaseProgress';
import { MicroAtosCard } from '../../components/features/MicroAtosCard';
import { PhaseTransitionModal } from '../../components/features/PhaseTransitionModal';

/**
 * Componente Home - Dashboard Principal
 * Mostra a próxima prática recomendada pela IA
 */
const Home = ({ userId, onStartPratica, onOpenLibrary }) => {
  const navigate = useNavigate();
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo de volta! ✨
        </h1>
        <p className="text-gray-600">
          Você está na Fase {faseAtual} da sua jornada KETER
        </p>
      </div>

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
                <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                  <TrendingUp size={18} />
                  <span>{praticaRecomendada.dificuldade}</span>
                </div>
              </div>

              <p className="text-purple-50 mb-6">{praticaRecomendada.objetivo}</p>

              {/* Benefícios */}
              <div className="mb-6">
                <p className="text-sm font-medium text-purple-200 mb-2">Benefícios:</p>
                <div className="flex flex-wrap gap-2">
                  {(typeof praticaRecomendada.beneficios === 'string' 
                    ? JSON.parse(praticaRecomendada.beneficios) 
                    : praticaRecomendada.beneficios || []
                  ).map((beneficio, idx) => (
                    <span
                      key={idx}
                      className="text-sm px-3 py-1 rounded-full bg-white/20"
                    >
                      {beneficio}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dica */}
              {praticaRecomendada.dica && (
                <div className="bg-white/10 rounded-lg p-4 mb-6">
                  <p className="text-sm text-purple-100">
                    💡 <strong>Dica:</strong> {praticaRecomendada.dica}
                  </p>
                </div>
              )}
            </div>

            {/* Botão de Iniciar */}
            <button
              onClick={() => onStartPratica && onStartPratica(praticaRecomendada)}
              className="w-full bg-white text-purple-600 font-bold py-4 px-6 rounded-xl hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Play size={24} />
              Iniciar Prática Agora
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-purple-100 mb-4">
              Não foi possível carregar uma recomendação no momento.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50"
            >
              Tentar Novamente
            </button>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total de Práticas */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Práticas Completas</h3>
              <BookOpen className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{estatisticas.total}</p>
          </div>

          {/* Tempo Total */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Minutos Praticados</h3>
              <Clock className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{estatisticas.tempoTotal}</p>
          </div>

          {/* Sequência */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Dias Seguidos</h3>
              <TrendingUp className="text-orange-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{estatisticas.sequenciaAtual}</p>
          </div>
        </div>
      )}

      {/* Micro-ato do Dia */}
      <div className="mb-8">
        <MicroAtosCard userId={userId} />
      </div>

      {/* Círculos - Community Feature */}
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-md p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle size={24} />
              <h3 className="text-xl font-bold">
                Círculos 🌟
              </h3>
            </div>
            <p className="text-purple-50">
              Conecte-se com outros Keteros em círculos de conversa em tempo real
            </p>
          </div>
          <button
            onClick={() => navigate('/circulos')}
            className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all whitespace-nowrap"
          >
            Explorar
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Link para Biblioteca */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Explorar Biblioteca de Práticas
            </h3>
            <p className="text-gray-600">
              Descubra mais práticas organizadas por fase e categoria
            </p>
          </div>
          <button
            onClick={onOpenLibrary}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all"
          >
            Ver Todas
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
