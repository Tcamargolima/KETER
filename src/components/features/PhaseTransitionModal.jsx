// ================================================
// PHASE TRANSITION MODAL - Cerimônia de Transição de Fase
// ================================================
// Modal celebratório com animações, confetes e mensagem IA

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Sparkles, ArrowRight, Trophy, Star, Zap, Crown } from 'lucide-react';

// ================================================
// CONFIGURAÇÃO DE CORES POR FASE
// ================================================
const FASE_COLORS = {
  0: {
    nome: 'Semente',
    gradiente: 'from-purple-400 via-purple-500 to-purple-600',
    bg: 'bg-purple-500',
    text: 'text-purple-600',
    confettiColors: ['#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9']
  },
  1: {
    nome: 'Despertar',
    gradiente: 'from-purple-500 via-purple-600 to-indigo-600',
    bg: 'bg-purple-600',
    text: 'text-purple-700',
    confettiColors: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6']
  },
  2: {
    nome: 'Disciplina',
    gradiente: 'from-amber-400 via-amber-500 to-orange-500',
    bg: 'bg-amber-500',
    text: 'text-amber-600',
    confettiColors: ['#FBBF24', '#F59E0B', '#D97706', '#F97316']
  },
  3: {
    nome: 'Consciência',
    gradiente: 'from-pink-400 via-pink-500 to-pink-600',
    bg: 'bg-pink-500',
    text: 'text-pink-600',
    confettiColors: ['#F472B6', '#EC4899', '#DB2777', '#BE185D']
  },
  4: {
    nome: 'Serviço',
    gradiente: 'from-amber-500 via-yellow-500 to-amber-600',
    bg: 'bg-yellow-500',
    text: 'text-yellow-600',
    confettiColors: ['#F59E0B', '#FBBF24', '#F59E0B', '#D97706', '#EAB308']
  }
};

// ================================================
// ÍCONES POR FASE
// ================================================
const FASE_ICONS = {
  0: '🌱',
  1: '🌿',
  2: '🌳',
  3: '🌲',
  4: '🌸'
};

// ================================================
// COMPONENTE PRINCIPAL
// ================================================
export const PhaseTransitionModal = ({
  isOpen,
  onClose,
  transicao,
  mensagemIA,
  conquistasDesbloqueadas = [],
  onContinuar
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Configurar tamanho da janela para confetti
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);

    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // Ativar confetti quando abrir modal
  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Desativar confetti após 5 segundos
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!transicao) return null;

  const faseAnterior = transicao.fase_anterior;
  const faseNova = transicao.fase_nova;
  const faseConfig = FASE_COLORS[faseNova];

  // Handler para continuar
  const handleContinuar = () => {
    if (onContinuar) {
      onContinuar();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Confetti */}
          {showConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              colors={faseConfig.confettiColors}
              numberOfPieces={200}
              recycle={false}
              gravity={0.3}
            />
          )}

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleContinuar}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ 
                type: "spring", 
                duration: 0.6,
                bounce: 0.3
              }}
              className="max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Card Principal */}
              <div className={`bg-gradient-to-br ${faseConfig.gradiente} rounded-3xl shadow-2xl overflow-hidden`}>
                
                {/* Header com Ícone */}
                <div className="p-8 pb-6 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 0.2,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="inline-flex items-center justify-center w-24 h-24 mb-4 bg-white/20 backdrop-blur-md rounded-full"
                  >
                    <span className="text-6xl">{FASE_ICONS[faseNova]}</span>
                  </motion.div>

                  {/* Título */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold text-white mb-2"
                  >
                    Fase {faseConfig.nome} Desbloqueada! ✨
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-2 text-white/90"
                  >
                    <Sparkles size={20} />
                    <span className="text-lg">Sua jornada evolui</span>
                  </motion.div>
                </div>

                {/* Conteúdo */}
                <div className="bg-white/95 backdrop-blur-sm p-8">
                  
                  {/* Transição Visual */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-4 mb-8"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{FASE_ICONS[faseAnterior]}</div>
                      <div className="text-sm text-gray-600">{FASE_COLORS[faseAnterior].nome}</div>
                    </div>

                    <div className="flex-shrink-0">
                      <ArrowRight size={32} className="text-gray-400" />
                    </div>

                    <div className="text-center">
                      <div className="text-4xl mb-2">{FASE_ICONS[faseNova]}</div>
                      <div className={`text-sm font-semibold ${faseConfig.text}`}>
                        {faseConfig.nome}
                      </div>
                    </div>
                  </motion.div>

                  {/* Mensagem da IA */}
                  {mensagemIA && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <Sparkles size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Mensagem do Guia KETER
                          </h3>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {mensagemIA}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Conquistas Desbloqueadas */}
                  {conquistasDesbloqueadas.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="mb-8"
                    >
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Trophy size={20} className="text-yellow-500" />
                        Conquistas Desbloqueadas
                      </h3>
                      <div className="space-y-2">
                        {conquistasDesbloqueadas.map((conquista, index) => (
                          <motion.div
                            key={conquista.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + (index * 0.1) }}
                            className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200"
                          >
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                              <Crown size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{conquista.nome}</div>
                              <div className="text-sm text-gray-600">{conquista.descricao}</div>
                            </div>
                            <Star size={20} className="text-yellow-500" />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Estatísticas da Fase Anterior */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
                  >
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">
                        {transicao.dias_na_fase || 0}
                      </div>
                      <div className="text-sm text-gray-600">Dias</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">
                        {transicao.praticas_completadas || 0}
                      </div>
                      <div className="text-sm text-gray-600">Práticas</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                      <div className="text-2xl font-bold text-pink-600">
                        {transicao.reflexoes_feitas || 0}
                      </div>
                      <div className="text-sm text-gray-600">Reflexões</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl">
                      <div className="text-2xl font-bold text-amber-600">
                        {transicao.sequencia_maxima_alcancada || 0}
                      </div>
                      <div className="text-sm text-gray-600">Streak</div>
                    </div>
                  </motion.div>

                  {/* Botão Continuar */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    onClick={handleContinuar}
                    className={`w-full py-4 px-6 bg-gradient-to-r ${faseConfig.gradiente} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2`}
                  >
                    <span>Continuar Jornada</span>
                    <ArrowRight size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
