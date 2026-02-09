// ================================================
// COMPONENT: ContentLibrary
// ================================================
// Biblioteca de conteúdo educacional com filtros

import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Video, Headphones, GraduationCap, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ContentCard from './ContentCard';
import ContentDetailModal from './ContentDetailModal';
import { useConteudoEducacional } from '../../hooks/useConteudoEducacional';
import { useRecomendacaoConteudo } from '../../hooks/useRecomendacaoConteudo';

/**
 * ContentLibrary Component
 * Biblioteca completa de conteúdo educacional
 * @param {string} userId - ID do usuário
 */
const ContentLibrary = ({ userId }) => {
  const [filtros, setFiltros] = useState({
    fase: null,
    tipo: null,
    categoria: null
  });
  const [busca, setBusca] = useState('');
  const [conteudoSelecionado, setConteudoSelecionado] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Hooks
  const {
    conteudos,
    favoritos,
    carregando,
    erro,
    toggleFavorito,
    registrarVisualizacao,
    atualizarProgresso,
    marcarOffline,
    isFavorito,
    getProgresso,
    buscarPorTexto
  } = useConteudoEducacional(userId, filtros);

  const {
    recomendacoes,
    carregando: carregandoRec,
    gerarRecomendacoes
  } = useRecomendacaoConteudo(userId);

  // ================================================
  // EFFECTS
  // ================================================
  useEffect(() => {
    // Gerar recomendações ao montar
    gerarRecomendacoes();
  }, []);

  // ================================================
  // HANDLERS
  // ================================================
  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value // Toggle
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      fase: null,
      tipo: null,
      categoria: null
    });
    setBusca('');
  };

  const handleConteudoClick = (conteudo) => {
    setConteudoSelecionado(conteudo);
  };

  const handleCloseModal = () => {
    setConteudoSelecionado(null);
  };

  // ================================================
  // COMPUTED: Conteúdos filtrados
  // ================================================
  const conteudosFiltrados = busca ? buscarPorTexto(busca) : conteudos;

  // Categorias únicas
  const categorias = [...new Set(conteudos.map(c => c.categoria).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          📚 Sabedoria KETER
        </h1>
        <p className="text-gray-600 text-lg">
          Biblioteca de conteúdo educacional para sua evolução
        </p>
      </div>

      {/* Recomendações da IA */}
      {recomendacoes.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={24} />
            <h2 className="text-2xl font-bold">Recomendado para Você</h2>
          </div>
          <p className="mb-6 text-purple-100">
            Com base na sua fase atual e reflexões recentes, selecionamos estes conteúdos:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recomendacoes.map(conteudo => (
              <div
                key={conteudo.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => handleConteudoClick(conteudo)}
              >
                <h3 className="font-bold mb-2">{conteudo.titulo}</h3>
                <p className="text-sm text-purple-100 mb-2 line-clamp-2">{conteudo.subtitulo}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-white/20 rounded">
                    {conteudo.tipo}
                  </span>
                  <span>{conteudo.duracao_min} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barra de Busca e Filtros */}
      <div className="mb-6 space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por título, categoria ou tags..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Botão Toggle Filtros */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} />
            <span className="font-medium">Filtros</span>
          </button>

          {/* Indicador de filtros ativos */}
          {(filtros.fase || filtros.tipo || filtros.categoria) && (
            <button
              onClick={limparFiltros}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Painel de Filtros */}
        {mostrarFiltros && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6 space-y-6"
          >
            {/* Filtro: Fase */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Fase</h3>
              <div className="flex flex-wrap gap-2">
                {['DESPERTAR', 'DISCIPLINA', 'CONSCIÊNCIA', 'SERVIÇO'].map(fase => (
                  <button
                    key={fase}
                    onClick={() => handleFiltroChange('fase', fase)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filtros.fase === fase
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {fase}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro: Tipo */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Tipo de Conteúdo</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { valor: 'artigo', label: 'Artigos', icon: <BookOpen size={16} /> },
                  { valor: 'video', label: 'Vídeos', icon: <Video size={16} /> },
                  { valor: 'audio', label: 'Áudios', icon: <Headphones size={16} /> },
                  { valor: 'curso_curto', label: 'Cursos', icon: <GraduationCap size={16} /> }
                ].map(({ valor, label, icon }) => (
                  <button
                    key={valor}
                    onClick={() => handleFiltroChange('tipo', valor)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      filtros.tipo === valor
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro: Categoria */}
            {categorias.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">Categoria</h3>
                <div className="flex flex-wrap gap-2">
                  {categorias.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleFiltroChange('categoria', cat)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filtros.categoria === cat
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Loading */}
      {carregando && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Erro */}
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          <p className="font-medium">Erro ao carregar conteúdos:</p>
          <p className="text-sm">{erro}</p>
        </div>
      )}

      {/* Grid de Conteúdos */}
      {!carregando && conteudosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            Nenhum conteúdo encontrado com os filtros selecionados.
          </p>
          <button
            onClick={limparFiltros}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Limpar Filtros
          </button>
        </div>
      )}

      {!carregando && conteudosFiltrados.length > 0 && (
        <>
          {/* Contador de resultados */}
          <div className="mb-4 text-gray-600">
            <span className="font-medium">{conteudosFiltrados.length}</span> conteúdos encontrados
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conteudosFiltrados.map(conteudo => (
              <ContentCard
                key={conteudo.id}
                conteudo={conteudo}
                isFavorito={isFavorito(conteudo.id)}
                progresso={getProgresso(conteudo.id)}
                onClick={handleConteudoClick}
                onToggleFavorito={toggleFavorito}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal de Detalhes */}
      <ContentDetailModal
        isOpen={!!conteudoSelecionado}
        onClose={handleCloseModal}
        conteudo={conteudoSelecionado}
        isFavorito={conteudoSelecionado ? isFavorito(conteudoSelecionado.id) : false}
        progresso={conteudoSelecionado ? getProgresso(conteudoSelecionado.id) : 0}
        onToggleFavorito={toggleFavorito}
        onRegistrarVisualizacao={registrarVisualizacao}
        onMarcarOffline={marcarOffline}
        onAtualizarProgresso={atualizarProgresso}
      />
    </div>
  );
};

export default ContentLibrary;
