// ================================================
// COMPONENT: ContentCard
// ================================================
// Card individual de conteúdo educacional

import React from 'react';
import { BookOpen, Video, Headphones, GraduationCap, Clock, Heart, Eye, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ContentCard Component
 * @param {object} conteudo - Objeto de conteúdo educacional
 * @param {boolean} isFavorito - Se o conteúdo é favorito do usuário
 * @param {number} progresso - Progresso do conteúdo (0-100) para cursos
 * @param {function} onClick - Callback ao clicar no card
 * @param {function} onToggleFavorito - Callback ao favoritar/desfavoritar
 */
const ContentCard = ({ 
  conteudo, 
  isFavorito = false,
  progresso = 0,
  onClick,
  onToggleFavorito 
}) => {
  // ================================================
  // HELPERS: Ícones e cores por tipo
  // ================================================
  const getTipoIcon = (tipo) => {
    const icons = {
      artigo: <BookOpen size={20} />,
      video: <Video size={20} />,
      audio: <Headphones size={20} />,
      curso_curto: <GraduationCap size={20} />
    };
    return icons[tipo] || <BookOpen size={20} />;
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      artigo: 'Artigo',
      video: 'Vídeo',
      audio: 'Áudio',
      curso_curto: 'Curso'
    };
    return labels[tipo] || 'Conteúdo';
  };

  const getFaseColor = (fase) => {
    const colors = {
      'DESPERTAR': 'from-blue-500 to-cyan-500',
      'DISCIPLINA': 'from-purple-500 to-pink-500',
      'CONSCIÊNCIA': 'from-amber-500 to-orange-500',
      'SERVIÇO': 'from-green-500 to-emerald-500'
    };
    return colors[fase] || 'from-purple-600 to-amber-600';
  };

  // ================================================
  // HANDLERS
  // ================================================
  const handleClick = () => {
    if (onClick) onClick(conteudo);
  };

  const handleFavoritoClick = (e) => {
    e.stopPropagation(); // Prevenir propagação para o card
    if (onToggleFavorito) onToggleFavorito(conteudo.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
        {/* Header com gradiente da fase */}
        <div className={`h-2 bg-gradient-to-r ${getFaseColor(conteudo.fase)}`} />

        {/* Conteúdo do Card */}
        <div className="p-6">
          {/* Header: Tipo + Favorito */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-purple-600">
              {getTipoIcon(conteudo.tipo)}
              <span className="text-sm font-medium">{getTipoLabel(conteudo.tipo)}</span>
            </div>

            {/* Botão Favorito */}
            <button
              onClick={handleFavoritoClick}
              className="p-2 rounded-full hover:bg-purple-50 transition-colors"
              aria-label="Adicionar aos favoritos"
            >
              {isFavorito ? (
                <Heart size={20} className="text-red-500 fill-current" />
              ) : (
                <Heart size={20} className="text-gray-400 hover:text-red-500" />
              )}
            </button>
          </div>

          {/* Título */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {conteudo.titulo}
          </h3>

          {/* Subtítulo */}
          {conteudo.subtitulo && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {conteudo.subtitulo}
            </p>
          )}

          {/* Meta informações */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            {/* Duração */}
            {conteudo.duracao_min && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{conteudo.duracao_min} min</span>
              </div>
            )}

            {/* Visualizações */}
            {conteudo.visualizacoes > 0 && (
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>{conteudo.visualizacoes}</span>
              </div>
            )}

            {/* Categoria */}
            {conteudo.categoria && (
              <div className="flex items-center gap-1">
                <Bookmark size={16} />
                <span>{conteudo.categoria}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {conteudo.tags && Array.isArray(conteudo.tags) && conteudo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {conteudo.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Fase Badge */}
          {conteudo.fase && (
            <div className="mb-4">
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full text-white bg-gradient-to-r ${getFaseColor(conteudo.fase)}`}>
                {conteudo.fase}
              </span>
            </div>
          )}

          {/* Barra de Progresso (para cursos) */}
          {conteudo.tipo === 'curso_curto' && progresso > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progresso</span>
                <span className="font-medium">{progresso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-amber-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-purple-600 font-medium text-sm group-hover:underline">
              {conteudo.tipo === 'video' && 'Assistir →'}
              {conteudo.tipo === 'audio' && 'Ouvir →'}
              {conteudo.tipo === 'artigo' && 'Ler →'}
              {conteudo.tipo === 'curso_curto' && 'Continuar →'}
            </span>
          </div>
        </div>

        {/* Badge de Destaque */}
        {conteudo.destaque && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-lg">
              ⭐ Destaque
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContentCard;
