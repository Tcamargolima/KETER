import React, { useState, useEffect } from 'react';
import { Filter, Clock, Search, BookOpen, Heart, Brain, Wind, Target, User, Eye, Gift, Footprints } from 'lucide-react';
import { usePraticas } from '../../hooks/usePraticas';

// Mapa de ícones
const ICON_MAP = {
  wind: Wind,
  compass: Target,
  heart: Heart,
  brain: Brain,
  user: User,
  eye: Eye,
  gift: Gift,
  'book-open': BookOpen,
  footprints: Footprints
};

// Nomes das fases
const FASES = {
  1: 'Despertar',
  2: 'Disciplina',
  3: 'Consciência',
  4: 'Serviço'
};

// Cores das fases
const CORES_FASES = {
  1: '#F59E0B',
  2: '#EC4899',
  3: '#6B46C1',
  4: '#10B981'
};

/**
 * Componente de Card de Prática (Preview)
 */
const PracticeCard = ({ pratica, onClick }) => {
  const IconComponent = ICON_MAP[pratica.icone] || BookOpen;
  const beneficiosArray = typeof pratica.beneficios === 'string' 
    ? JSON.parse(pratica.beneficios) 
    : pratica.beneficios || [];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6 border border-gray-100 hover:border-gray-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: pratica.cor_categoria + '20' }}
          >
            <IconComponent
              size={24}
              style={{ color: pratica.cor_categoria }}
            />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{pratica.titulo}</h3>
            <p className="text-sm text-gray-500">{pratica.subtitulo}</p>
          </div>
        </div>
      </div>

      {/* Metadados */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <Clock size={16} />
          <span>{pratica.duracao_min} min</span>
        </div>
        <div className="px-2 py-1 rounded-full text-xs font-medium" style={{ 
          backgroundColor: CORES_FASES[pratica.fase] + '20',
          color: CORES_FASES[pratica.fase]
        }}>
          Fase {pratica.fase}: {FASES[pratica.fase]}
        </div>
        <div className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
          {pratica.dificuldade}
        </div>
      </div>

      {/* Categoria e Objetivo */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">{pratica.categoria}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{pratica.objetivo}</p>
      </div>

      {/* Benefícios */}
      <div className="flex flex-wrap gap-2">
        {beneficiosArray.slice(0, 3).map((beneficio, idx) => (
          <span
            key={idx}
            className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700"
          >
            {beneficio}
          </span>
        ))}
      </div>
    </div>
  );
};

/**
 * Componente Principal: PracticeLibrary
 */
const PracticeLibrary = ({ userId, onSelectPratica }) => {
  const {
    praticas,
    praticasFiltradas,
    carregando,
    erro,
    filtrarPraticas,
    obterCategorias
  } = usePraticas(userId);

  const [filtros, setFiltros] = useState({
    fase: null,
    categoria: null,
    busca: ''
  });

  const [categorias, setCategorias] = useState([]);

  // Obter categorias disponíveis
  useEffect(() => {
    if (praticas.length > 0) {
      setCategorias(obterCategorias());
    }
  }, [praticas]);

  // Aplicar filtros
  useEffect(() => {
    let resultado = [...praticas];

    // Filtrar por fase
    if (filtros.fase) {
      resultado = resultado.filter(p => p.fase === filtros.fase);
    }

    // Filtrar por categoria
    if (filtros.categoria) {
      resultado = resultado.filter(p => p.categoria === filtros.categoria);
    }

    // Filtrar por busca
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      resultado = resultado.filter(p =>
        p.titulo.toLowerCase().includes(busca) ||
        p.subtitulo?.toLowerCase().includes(busca) ||
        p.categoria.toLowerCase().includes(busca) ||
        p.objetivo?.toLowerCase().includes(busca)
      );
    }

    filtrarPraticas(filtros);
  }, [filtros, praticas]);

  const handleFaseChange = (fase) => {
    setFiltros(prev => ({ ...prev, fase: prev.fase === fase ? null : fase }));
  };

  const handleCategoriaChange = (categoria) => {
    setFiltros(prev => ({ ...prev, categoria: prev.categoria === categoria ? null : categoria }));
  };

  const handleBuscaChange = (e) => {
    setFiltros(prev => ({ ...prev, busca: e.target.value }));
  };

  const limparFiltros = () => {
    setFiltros({ fase: null, categoria: null, busca: '' });
  };

  // Loading
  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Erro
  if (erro) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Erro ao carregar práticas: {erro}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Biblioteca de Práticas</h1>
        <p className="text-gray-600">
          Explore {praticas.length} práticas organizadas por fase e categoria
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        {/* Busca */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar práticas..."
              value={filtros.busca}
              onChange={handleBuscaChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtro de Fase */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Filter size={16} className="inline mr-1" />
            Filtrar por Fase
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map(fase => (
              <button
                key={fase}
                onClick={() => handleFaseChange(fase)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filtros.fase === fase
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={filtros.fase === fase ? { backgroundColor: CORES_FASES[fase] } : {}}
              >
                Fase {fase}: {FASES[fase]}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro de Categoria */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Categoria
          </label>
          <div className="flex flex-wrap gap-2">
            {categorias.map(categoria => (
              <button
                key={categoria}
                onClick={() => handleCategoriaChange(categoria)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filtros.categoria === categoria
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        {/* Botão Limpar Filtros */}
        {(filtros.fase || filtros.categoria || filtros.busca) && (
          <button
            onClick={limparFiltros}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Resultados */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Mostrando {praticasFiltradas.length} {praticasFiltradas.length === 1 ? 'prática' : 'práticas'}
        </p>
      </div>

      {/* Grid de Práticas */}
      {praticasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {praticasFiltradas.map(pratica => (
            <PracticeCard
              key={pratica.id}
              pratica={pratica}
              onClick={() => onSelectPratica && onSelectPratica(pratica)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma prática encontrada
          </h3>
          <p className="text-gray-600 mb-4">
            Tente ajustar seus filtros ou buscar por outros termos
          </p>
          <button
            onClick={limparFiltros}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default PracticeLibrary;
