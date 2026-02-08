// ================================================
// MICRO-ATOS CARD - Seleção e Execução Diária
// ================================================
// Card interativo com seleção de categoria, troca de micro-ato
// e confirmação de execução com reflexão

import React, { useState } from 'react';
import { 
  Heart, 
  RefreshCw, 
  CheckCircle, 
  Edit3, 
  X, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useMicroAtos } from '../../hooks/useMicroAtos';

// ================================================
// COMPONENTE PRINCIPAL
// ================================================

export const MicroAtosCard = ({ userId, onComplete }) => {
  const {
    microAtoAtual,
    jaRealizouHoje,
    carregando,
    erro,
    categorias,
    trocarMicroAto,
    marcarComoExecutado,
    criarMicroAtoCustomizado
  } = useMicroAtos(userId);

  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [mostrarCustom, setMostrarCustom] = useState(false);
  const [reflexao, setReflexao] = useState('');
  const [customDescricao, setCustomDescricao] = useState('');
  const [customCategoria, setCustomCategoria] = useState('bondade');
  const [salvando, setSalvando] = useState(false);

  // Encontrar categoria do micro-ato atual
  const categoriaAtual = categorias.find(c => c.id === microAtoAtual?.tipo);

  // ================================================
  // HANDLERS
  // ================================================

  const handleTrocarMicroAto = async (categoria = null) => {
    setSalvando(true);
    await trocarMicroAto(categoria);
    setSalvando(false);
    setMostrarOpcoes(false);
  };

  const handleMarcarExecutado = async () => {
    setSalvando(true);
    const result = await marcarComoExecutado(reflexao);
    setSalvando(false);
    
    if (!result.error) {
      setMostrarConfirmacao(false);
      setReflexao('');
      if (onComplete) onComplete();
    }
  };

  const handleCriarCustomizado = async () => {
    if (!customDescricao.trim()) return;

    setSalvando(true);
    const result = await criarMicroAtoCustomizado(customDescricao, customCategoria);
    setSalvando(false);

    if (!result.error) {
      setMostrarCustom(false);
      setCustomDescricao('');
    }
  };

  // ================================================
  // LOADING STATE
  // ================================================

  if (carregando) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // ================================================
  // ERROR STATE
  // ================================================

  if (erro) {
    return (
      <div className="bg-red-50 rounded-2xl shadow-lg p-8 border-2 border-red-200">
        <p className="text-red-600">Erro ao carregar micro-ato: {erro}</p>
      </div>
    );
  }

  // ================================================
  // JÁ REALIZOU HOJE
  // ================================================

  if (jaRealizouHoje) {
    return (
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle size={32} className="text-green-100" />
          <h3 className="text-2xl font-bold">Micro-ato Realizado! 🎉</h3>
        </div>
        <p className="text-green-50 text-lg">
          Você já completou seu micro-ato de bondade hoje. Volte amanhã para uma nova oportunidade de fazer a diferença!
        </p>
        {microAtoAtual?.reflexao_pos && (
          <div className="mt-6 p-4 bg-white/20 rounded-xl">
            <p className="text-sm text-green-100 mb-2">Sua reflexão:</p>
            <p className="text-white italic">"{microAtoAtual.reflexao_pos}"</p>
          </div>
        )}
      </div>
    );
  }

  // ================================================
  // MODAL DE OPÇÕES
  // ================================================

  if (mostrarOpcoes) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Escolher Categoria</h3>
          <button
            onClick={() => setMostrarOpcoes(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleTrocarMicroAto(cat.id)}
              disabled={salvando}
              className="p-6 rounded-xl border-2 hover:border-purple-400 hover:bg-purple-50 transition-all text-center group"
              style={{ borderColor: cat.cor + '40' }}
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <div className="font-semibold text-gray-900">{cat.titulo}</div>
              <div className="text-sm text-gray-500">{cat.total} atos</div>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setMostrarOpcoes(false);
            setMostrarCustom(true);
          }}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors text-gray-600 font-medium"
        >
          ✍️ Criar meu próprio micro-ato
        </button>
      </div>
    );
  }

  // ================================================
  // MODAL CUSTOMIZADO
  // ================================================

  if (mostrarCustom) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Criar Micro-ato</h3>
          <button
            onClick={() => {
              setMostrarCustom(false);
              setMostrarOpcoes(true);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={customCategoria}
              onChange={(e) => setCustomCategoria(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            >
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.titulo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descreva seu micro-ato
            </label>
            <textarea
              value={customDescricao}
              onChange={(e) => setCustomDescricao(e.target.value)}
              placeholder="Ex: Ligar para minha mãe e dizer que a amo"
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none min-h-[120px] resize-none"
              maxLength={200}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {customDescricao.length}/200
            </div>
          </div>

          <button
            onClick={handleCriarCustomizado}
            disabled={!customDescricao.trim() || salvando}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {salvando ? 'Salvando...' : 'Confirmar Micro-ato'}
          </button>
        </div>
      </div>
    );
  }

  // ================================================
  // MODAL DE CONFIRMAÇÃO
  // ================================================

  if (mostrarConfirmacao) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Parabéns! 🎉</h3>
          <button
            onClick={() => setMostrarConfirmacao(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Como foi realizar este micro-ato? Que impacto você percebeu?
          </p>
          <textarea
            value={reflexao}
            onChange={(e) => setReflexao(e.target.value)}
            placeholder="Compartilhe sua experiência... (opcional)"
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none min-h-[120px] resize-none"
            maxLength={500}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {reflexao.length}/500
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setMostrarConfirmacao(false)}
            className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleMarcarExecutado}
            disabled={salvando}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    );
  }

  // ================================================
  // CARD PRINCIPAL - MICRO-ATO DO DIA
  // ================================================

  return (
    <div
      className="rounded-2xl shadow-xl p-8 text-white relative overflow-hidden"
      style={{
        background: categoriaAtual 
          ? `linear-gradient(135deg, ${categoriaAtual.cor} 0%, ${categoriaAtual.cor}dd 100%)`
          : 'linear-gradient(135deg, #EC4899 0%, #EC4899dd 100%)'
      }}
    >
      {/* Background decorativo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

      {/* Conteúdo */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Sparkles size={28} className="text-white" />
          <h2 className="text-2xl font-bold">Micro-ato do Dia</h2>
        </div>

        {/* Categoria */}
        {categoriaAtual && (
          <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-4 py-2 rounded-full">
            <span className="text-2xl">{categoriaAtual.emoji}</span>
            <span className="font-semibold">{categoriaAtual.titulo}</span>
          </div>
        )}

        {/* Descrição do micro-ato */}
        <p className="text-xl mb-8 leading-relaxed">
          {microAtoAtual?.descricao || 'Carregando micro-ato...'}
        </p>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setMostrarConfirmacao(true)}
            className="flex-1 bg-white text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            Já Realizei
          </button>

          <button
            onClick={() => setMostrarOpcoes(true)}
            className="bg-white/20 hover:bg-white/30 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Trocar
          </button>
        </div>

        {/* Dica */}
        <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
          <p className="text-sm text-white/90">
            💡 <strong>Dica:</strong> Não precisa ser perfeito. O importante é a intenção sincera de fazer o bem.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MicroAtosCard;
