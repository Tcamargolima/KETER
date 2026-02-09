// ================================================
// COMPONENT: ContentDetailModal
// ================================================
// Modal para exibir conteúdo educacional completo

import React, { useState, useEffect } from 'react';
import { X, Clock, Heart, Download, Check, BookOpen, Video, Headphones, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

/**
 * ContentDetailModal Component
 * @param {boolean} isOpen - Se o modal está aberto
 * @param {function} onClose - Callback para fechar o modal
 * @param {object} conteudo - Objeto de conteúdo educacional
 * @param {boolean} isFavorito - Se é favorito
 * @param {function} onToggleFavorito - Toggle favorito
 * @param {function} onRegistrarVisualizacao - Registrar visualização
 * @param {function} onMarcarOffline - Marcar para offline
 * @param {number} progresso - Progresso do conteúdo (0-100)
 * @param {function} onAtualizarProgresso - Atualizar progresso
 */
const ContentDetailModal = ({
  isOpen,
  onClose,
  conteudo,
  isFavorito = false,
  onToggleFavorito,
  onRegistrarVisualizacao,
  onMarcarOffline,
  progresso = 0,
  onAtualizarProgresso
}) => {
  const [videoWatched, setVideoWatched] = useState(false);
  const [tempoInicio, setTempoInicio] = useState(null);

  // ================================================
  // EFFECTS
  // ================================================
  useEffect(() => {
    if (isOpen && conteudo) {
      setTempoInicio(Date.now());
      
      // Registrar visualização ao abrir
      if (onRegistrarVisualizacao) {
        onRegistrarVisualizacao(conteudo.id, 0, false);
      }
    }
  }, [isOpen, conteudo?.id]);

  // ================================================
  // HANDLERS
  // ================================================
  const handleClose = () => {
    // Calcular tempo e registrar visualização ao fechar
    if (tempoInicio && conteudo && onRegistrarVisualizacao) {
      const tempoDecorrido = Math.floor((Date.now() - tempoInicio) / 60000); // em minutos
      onRegistrarVisualizacao(conteudo.id, tempoDecorrido, videoWatched);
    }
    setTempoInicio(null);
    setVideoWatched(false);
    onClose();
  };

  const handleMarcarCompleto = () => {
    if (onAtualizarProgresso) {
      onAtualizarProgresso(conteudo.id, 100);
    }
    setVideoWatched(true);
  };

  const handleDownloadOffline = () => {
    if (onMarcarOffline) {
      onMarcarOffline(conteudo.id, true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: conteudo.titulo,
        text: conteudo.subtitulo,
        url: window.location.href
      });
    } else {
      // Fallback: copiar link
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  // ================================================
  // HELPERS
  // ================================================
  const getTipoIcon = (tipo) => {
    const icons = {
      artigo: <BookOpen size={24} />,
      video: <Video size={24} />,
      audio: <Headphones size={24} />
    };
    return icons[tipo] || <BookOpen size={24} />;
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

  if (!conteudo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header com Gradiente */}
              <div className={`bg-gradient-to-r ${getFaseColor(conteudo.fase)} p-6 text-white relative`}>
                {/* Botão Fechar */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>

                {/* Tipo */}
                <div className="flex items-center gap-2 mb-3 opacity-90">
                  {getTipoIcon(conteudo.tipo)}
                  <span className="text-sm font-medium uppercase">{conteudo.tipo}</span>
                </div>

                {/* Título */}
                <h2 className="text-3xl font-bold mb-2">{conteudo.titulo}</h2>

                {/* Subtítulo */}
                {conteudo.subtitulo && (
                  <p className="text-white/90 text-lg">{conteudo.subtitulo}</p>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-4 mt-4 text-sm">
                  {conteudo.duracao_min && (
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{conteudo.duracao_min} min</span>
                    </div>
                  )}
                  {conteudo.categoria && (
                    <span className="px-3 py-1 bg-white/20 rounded-full">
                      {conteudo.categoria}
                    </span>
                  )}
                  {conteudo.fase && (
                    <span className="px-3 py-1 bg-white/20 rounded-full font-medium">
                      {conteudo.fase}
                    </span>
                  )}
                </div>
              </div>

              {/* Barra de Ações */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  {/* Favorito */}
                  <button
                    onClick={() => onToggleFavorito && onToggleFavorito(conteudo.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isFavorito 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <Heart size={18} className={isFavorito ? 'fill-current' : ''} />
                    <span className="text-sm font-medium">
                      {isFavorito ? 'Favoritado' : 'Favoritar'}
                    </span>
                  </button>

                  {/* Download Offline */}
                  <button
                    onClick={handleDownloadOffline}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <Download size={18} />
                    <span className="text-sm font-medium">Offline</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Compartilhar */}
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <Share2 size={18} />
                    <span className="text-sm font-medium">Compartilhar</span>
                  </button>

                  {/* Marcar Completo */}
                  <button
                    onClick={handleMarcarCompleto}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  >
                    <Check size={18} />
                    <span className="text-sm font-medium">Marcar Completo</span>
                  </button>
                </div>
              </div>

              {/* Conteúdo Scrollável */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Vídeo Embed */}
                {conteudo.tipo === 'video' && conteudo.url && (
                  <div className="mb-6">
                    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl">
                      <iframe
                        src={conteudo.url}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={conteudo.titulo}
                      />
                    </div>
                  </div>
                )}

                {/* Áudio Player */}
                {conteudo.tipo === 'audio' && conteudo.url && (
                  <div className="mb-6">
                    <audio
                      controls
                      className="w-full"
                      src={conteudo.url}
                    >
                      Seu navegador não suporta o elemento de áudio.
                    </audio>
                  </div>
                )}

                {/* Conteúdo Texto (Markdown) */}
                {conteudo.conteudo_texto && (
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown>{conteudo.conteudo_texto}</ReactMarkdown>
                  </div>
                )}

                {/* Autor */}
                {conteudo.autor && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Por <span className="font-medium text-gray-700">{conteudo.autor}</span>
                    </p>
                  </div>
                )}

                {/* Tags */}
                {conteudo.tags && Array.isArray(conteudo.tags) && conteudo.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {conteudo.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-sm px-3 py-1 rounded-full bg-purple-100 text-purple-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Barra de Progresso (cursos) */}
              {conteudo.tipo === 'curso_curto' && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Seu progresso</span>
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContentDetailModal;
