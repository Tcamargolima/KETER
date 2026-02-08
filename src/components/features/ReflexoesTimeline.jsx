// ================================================
// REFLEXÕES TIMELINE - Timeline de reflexões passadas
// ================================================
// Componente para exibir histórico de reflexões no perfil

import React from 'react';
import { Calendar, Moon, TrendingUp, Heart, Brain, Clock } from 'lucide-react';

export const ReflexoesTimeline = ({ reflexoes = [] }) => {
  if (!reflexoes || reflexoes.length === 0) {
    return (
      <div className="text-center py-12">
        <Moon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-400 mb-2">
          Nenhuma reflexão ainda
        </h3>
        <p className="text-slate-500">
          Faça sua primeira reflexão noturna hoje às 20h
        </p>
      </div>
    );
  }

  // Formatar data para exibição
  const formatarData = (dataStr) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Determinar emoji do humor
  const getHumorEmoji = (humor) => {
    if (humor <= 3) return '😢';
    if (humor <= 5) return '😐';
    if (humor <= 7) return '🙂';
    if (humor <= 9) return '😊';
    return '😄';
  };

  // Determinar cor do sentimento
  const getSentimentoColor = (sentimento) => {
    switch (sentimento) {
      case 'positivo': return 'text-green-400';
      case 'negativo': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-4 border border-purple-700">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-white">{reflexoes.length}</div>
              <div className="text-sm text-purple-300">Reflexões Totais</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/50 rounded-xl p-4 border border-amber-700">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-amber-400" />
            <div>
              <div className="text-2xl font-bold text-white">
                {calcularHumorMedio(reflexoes).toFixed(1)}
              </div>
              <div className="text-sm text-amber-300">Humor Médio</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/50 rounded-xl p-4 border border-pink-700">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-400" />
            <div>
              <div className="text-2xl font-bold text-white">
                {contarMicroAtos(reflexoes)}
              </div>
              <div className="text-sm text-pink-300">Atos de Bondade</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline de reflexões */}
      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-amber-500 to-purple-500" />

        <div className="space-y-6">
          {reflexoes.map((reflexao, index) => (
            <div key={reflexao.id} className="relative pl-20">
              {/* Dot na timeline */}
              <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 border-4 border-slate-900 shadow-lg" />

              {/* Card da reflexão */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 hover:border-purple-500 transition-all p-6 shadow-lg">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{getHumorEmoji(reflexao.humor_dia)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {formatarData(reflexao.data)}
                        </h3>
                        <p className="text-sm text-slate-400">
                          Humor: {reflexao.humor_dia}/10
                        </p>
                      </div>
                    </div>
                  </div>

                  {reflexao.sentimento_detectado && (
                    <span className={`text-sm font-medium ${getSentimentoColor(reflexao.sentimento_detectado)}`}>
                      {reflexao.sentimento_detectado}
                    </span>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="space-y-3">
                  {reflexao.padroes_linguisticos && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-300">Padrões Linguísticos</span>
                      </div>
                      <p className="text-slate-300 text-sm line-clamp-2">
                        {reflexao.padroes_linguisticos}
                      </p>
                    </div>
                  )}

                  {reflexao.aprendizado_praticas && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-amber-300">Aprendizados</span>
                      </div>
                      <p className="text-slate-300 text-sm line-clamp-2">
                        {reflexao.aprendizado_praticas}
                      </p>
                    </div>
                  )}

                  {reflexao.micro_ato_realizado && reflexao.micro_ato_descricao && (
                    <div className="bg-pink-900/20 rounded-lg p-3 border border-pink-800/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span className="text-sm font-medium text-pink-300">Ato de Bondade</span>
                      </div>
                      <p className="text-slate-300 text-sm">
                        {reflexao.micro_ato_descricao}
                      </p>
                    </div>
                  )}

                  {reflexao.notas_livres && (
                    <details className="group">
                      <summary className="cursor-pointer text-sm text-purple-400 hover:text-purple-300 transition-colors">
                        Ver notas completas
                      </summary>
                      <p className="mt-2 text-slate-300 text-sm">
                        {reflexao.notas_livres}
                      </p>
                    </details>
                  )}
                </div>

                {/* Análise IA */}
                {reflexao.analise_ia && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">✨</span>
                      <span className="text-sm font-medium text-purple-300">Análise IA</span>
                    </div>
                    <p className="text-slate-400 text-sm italic line-clamp-3">
                      {reflexao.analise_ia}
                    </p>
                  </div>
                )}

                {/* Footer com horário */}
                <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>
                    Registrado em {new Date(reflexao.created_at).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ================================================
// HELPER FUNCTIONS
// ================================================

const calcularHumorMedio = (reflexoes) => {
  if (!reflexoes || reflexoes.length === 0) return 0;
  const soma = reflexoes.reduce((acc, r) => acc + (r.humor_dia || 0), 0);
  return soma / reflexoes.length;
};

const contarMicroAtos = (reflexoes) => {
  if (!reflexoes || reflexoes.length === 0) return 0;
  return reflexoes.filter(r => r.micro_ato_realizado).length;
};

export default ReflexoesTimeline;
