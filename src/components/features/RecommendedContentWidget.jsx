// ================================================
// COMPONENT: RecommendedContentWidget
// ================================================
// Widget para mostrar conteúdo recomendado na Home

import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRecomendacaoConteudo } from '../../hooks/useRecomendacaoConteudo';

/**
 * RecommendedContentWidget Component
 * Mostra 1-2 conteúdos recomendados pela IA na Home
 */
const RecommendedContentWidget = ({ userId }) => {
  const navigate = useNavigate();
  const { recomendacoes, carregando, gerarRecomendacoes } = useRecomendacaoConteudo(userId);

  useEffect(() => {
    if (userId) {
      gerarRecomendacoes();
    }
  }, [userId]);

  if (carregando) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse flex space-x-4 w-full">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recomendacoes || recomendacoes.length === 0) {
    return null;
  }

  // Mostrar apenas os 2 primeiros
  const topRecommendations = recomendacoes.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-xl shadow-md p-4 sm:p-6 border border-purple-100 min-h-[300px] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Sparkles size={20} className="text-purple-600 flex-shrink-0" />
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
          Conteúdo Sugerido para Sua Fase
        </h3>
      </div>

      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
        Com base na sua evolução e reflexões recentes, recomendamos:
      </p>

      {/* Lista de Recomendações */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 flex-1">
        {topRecommendations.map((conteudo, idx) => (
          <motion.div
            key={conteudo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-lg p-4 hover:shadow-md transition-all cursor-pointer border border-purple-100"
            onClick={() => navigate('/sabedoria')}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-purple-600" />
                  <span className="text-xs font-medium text-purple-600 uppercase">
                    {conteudo.tipo}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-1">
                  {conteudo.titulo}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {conteudo.subtitulo}
                </p>
                {conteudo.duracao_min && (
                  <p className="text-xs text-gray-500 mt-2">
                    ⏱️ {conteudo.duracao_min} minutos
                  </p>
                )}
              </div>
              <ChevronRight size={20} className="text-purple-400 flex-shrink-0" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Botão Ver Mais */}
      <button
        onClick={() => navigate('/sabedoria')}
        className="w-full bg-gradient-to-r from-purple-600 to-amber-600 text-white font-bold py-3 px-4 sm:px-6 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        Ver Biblioteca Completa
        <ChevronRight size={20} />
      </button>
    </motion.div>
  );
};

export default RecommendedContentWidget;
