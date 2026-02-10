// ================================================
// COMPONENTES DE IA PARA O KETER
// ================================================
// src/components/IA/AnaliseSemanal.jsx

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Brain, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useAnaliseSemanal, usePadroesLinguisticos } from '../../hooks/useIA';

export const AnaliseSemanal = () => {
  const { analise, loading, error, gerarAnalise } = useAnaliseSemanal();
  const { padroes, evolucao } = usePadroesLinguisticos(7);
  const [expandido, setExpandido] = useState(false);

  if (error) {
    return (
      <div className="bg-red-900/20 backdrop-blur-xl rounded-2xl p-4 border border-red-500/30">
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="text-purple-200 font-semibold">Analisando sua evolução...</p>
            <p className="text-slate-400 text-sm">A IA está processando suas reflexões</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analise) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-bold text-purple-200">Análise Semanal</h3>
          </div>
          <span className="text-xs text-slate-400">Disponível a cada 7 dias</span>
        </div>
        <p className="text-slate-300 mb-4">
          A IA pode analisar seus padrões de evolução quando você tiver pelo menos 3 reflexões.
        </p>
        <button
          onClick={gerarAnalise}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          Gerar Análise Agora
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-bold text-purple-200">Análise da IA</h3>
        </div>
        <button
          onClick={() => setExpandido(!expandido)}
          className="text-purple-300 hover:text-purple-200"
        >
          {expandido ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Preview de Métricas */}
      {padroes && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-900/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-xs">Agência</span>
              {evolucao && (
                evolucao.agencia > 5 ? <TrendingUp className="w-4 h-4 text-green-400" /> :
                evolucao.agencia < -5 ? <TrendingDown className="w-4 h-4 text-red-400" /> :
                <Minus className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-purple-200">{padroes.scoreAgencia}%</span>
              {evolucao && evolucao.agencia !== 0 && (
                <span className={`text-sm ${evolucao.agencia > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {evolucao.agencia > 0 ? '+' : ''}{Math.round(evolucao.agencia)}%
                </span>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-xs">Positividade</span>
              {evolucao && (
                evolucao.positividade > 5 ? <TrendingUp className="w-4 h-4 text-green-400" /> :
                evolucao.positividade < -5 ? <TrendingDown className="w-4 h-4 text-red-400" /> :
                <Minus className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-purple-200">{padroes.scorePositividade}%</span>
              {evolucao && evolucao.positividade !== 0 && (
                <span className={`text-sm ${evolucao.positividade > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {evolucao.positividade > 0 ? '+' : ''}{Math.round(evolucao.positividade)}%
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Texto da Análise (expandível) */}
      {expandido && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-slate-900/50 rounded-xl p-4">
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
              {analise.texto}
            </p>
          </div>

          {/* Insights dos Padrões */}
          {padroes?.insights && padroes.insights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-purple-300">Padrões Detectados:</h4>
              {padroes.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2 bg-slate-900/30 rounded-lg p-3">
                  <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-sm">{insight}</p>
                </div>
              ))}
            </div>
          )}

          {/* Métricas Detalhadas */}
          {analise.metricas && (
            <div className="bg-slate-900/30 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-purple-300 mb-3">Estatísticas da Semana:</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-400">Reflexões:</span>
                  <span className="text-white ml-2 font-semibold">{analise.metricas.totalReflexoes}</span>
                </div>
                <div>
                  <span className="text-slate-400">Práticas:</span>
                  <span className="text-white ml-2 font-semibold">{analise.metricas.totalPraticas}</span>
                </div>
                <div>
                  <span className="text-slate-400">Taxa Conclusão:</span>
                  <span className="text-white ml-2 font-semibold">
                    {Math.round(analise.metricas.taxaCompletacao * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Sequência:</span>
                  <span className="text-white ml-2 font-semibold">{analise.metricas.sequencia} dias</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={gerarAnalise}
            className="w-full py-2 text-purple-300 text-sm hover:text-purple-200 transition-all"
          >
            Gerar Nova Análise
          </button>
        </div>
      )}
    </div>
  );
};

// ================================================
// CHAT INTELIGENTE COM IA
// ================================================

import { Send, Loader2 } from 'lucide-react';
import { useGuiaInteligente } from '../../hooks/useIA';

export const ChatInteligente = () => {
  const { mensagens, isTyping, error, enviarMensagem } = useGuiaInteligente();
  const [input, setInput] = useState('');
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [mensagens, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      enviarMensagem(input.trim());
      setInput('');
    }
  };

  // Quick replies sugeridos
  const quickReplies = [
    "Como estou evoluindo?",
    "Estou com dificuldade",
    "Preciso de motivação",
    "Qual próxima prática?"
  ];

  const [showQuickReplies, setShowQuickReplies] = useState(mensagens.length <= 1);

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagens.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : msg.tipo === 'crise'
                  ? 'bg-red-900/50 border-2 border-red-500 text-red-100'
                  : 'bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 text-slate-200'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.tokens && (
                <span className="text-xs opacity-50 mt-2 block">
                  {msg.tokens} tokens
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="text-slate-400 text-sm">Guia está pensando...</span>
            </div>
          </div>
        )}

        {/* Quick Replies */}
        {showQuickReplies && !isTyping && (
          <div className="flex flex-wrap gap-2 justify-center">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => {
                  enviarMensagem(reply);
                  setShowQuickReplies(false);
                }}
                className="px-4 py-2 bg-slate-800/50 text-slate-300 text-sm rounded-full border border-purple-500/20 hover:bg-slate-700/50 transition-all"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-center">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-900/50 backdrop-blur-xl border-t border-purple-500/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isTyping}
            className="flex-1 bg-slate-800/50 text-slate-200 rounded-full px-6 py-3 border border-purple-500/20 focus:border-purple-500 outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full disabled:opacity-50 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

// ================================================
// WIDGET DE PADRÕES LINGUÍSTICOS
// ================================================

export const PadroesLinguisticos = ({ dias = 7 }) => {
  const { padroes } = usePadroesLinguisticos(dias);

  if (!padroes) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20">
        <p className="text-slate-400 text-sm text-center">
          Dados insuficientes. Continue refletindo diariamente.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 space-y-4">
      <h3 className="text-lg font-bold text-purple-200 flex items-center gap-2">
        <Brain className="w-5 h-5" />
        Seus Padrões
      </h3>

      {/* Bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Agência</span>
            <span className="text-purple-300 font-semibold">{padroes.scoreAgencia}%</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: `${padroes.scoreAgencia}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Positividade</span>
            <span className="text-purple-300 font-semibold">{padroes.scorePositividade}%</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: `${padroes.scorePositividade}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Profundidade</span>
            <span className="text-purple-300 font-semibold capitalize">{padroes.profundidadeMedia}</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ 
                width: padroes.profundidadeMedia === 'alta' ? '100%' : 
                       padroes.profundidadeMedia === 'média' ? '60%' : '30%' 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Word counts */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-800/50 rounded-lg p-2">
          <span className="text-slate-400">Agência:</span>
          <span className="text-green-400 ml-1 font-semibold">{padroes.agencia}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2">
          <span className="text-slate-400">Vitimização:</span>
          <span className="text-red-400 ml-1 font-semibold">{padroes.vitimizacao}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2">
          <span className="text-slate-400">Positivas:</span>
          <span className="text-green-400 ml-1 font-semibold">{padroes.positivas}</span>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2">
          <span className="text-slate-400">Negativas:</span>
          <span className="text-red-400 ml-1 font-semibold">{padroes.negativas}</span>
        </div>
      </div>
    </div>
  );
};

// ================================================
// EXPORT ALL
// ================================================

export default {
  AnaliseSemanal,
  ChatInteligente,
  PadroesLinguisticos
};
