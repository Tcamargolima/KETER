// ================================================
// MICRO-ATOS STATISTICS - Visualização de Estatísticas
// ================================================
// Mostra estatísticas e histórico de micro-atos realizados

import React from 'react';
import { Heart, TrendingUp, Calendar, Award } from 'lucide-react';
import { useMicroAtos } from '../../hooks/useMicroAtos';
import { microAtosLibrary } from '../../data/microAtosLibrary';

export const MicroAtosStatistics = ({ userId }) => {
  const { historico, obterEstatisticas, carregando, erro } = useMicroAtos(userId);
  const stats = obterEstatisticas();

  if (carregando) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-200 rounded-xl"></div>
        <div className="h-24 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-red-800 font-semibold text-lg mb-2">Não foi possível carregar estatísticas</h3>
        <p className="text-red-600 mb-4">{erro}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 text-white">
          <Heart size={32} className="mb-2 opacity-80" />
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="text-sm opacity-90">Total Realizados</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <TrendingUp size={32} className="mb-2 opacity-80" />
          <div className="text-3xl font-bold">{stats.sequenciaAtual}</div>
          <div className="text-sm opacity-90">Dias Seguidos</div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
          <Calendar size={32} className="mb-2 opacity-80" />
          <div className="text-3xl font-bold">{stats.ultimos7Dias.filter(d => d.realizado).length}</div>
          <div className="text-sm opacity-90">Últimos 7 Dias</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <Award size={32} className="mb-2 opacity-80" />
          <div className="text-3xl font-bold">{Object.keys(stats.porCategoria).length}</div>
          <div className="text-sm opacity-90">Categorias</div>
        </div>
      </div>

      {/* Por Categoria */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Por Categoria</h3>
        <div className="space-y-3">
          {Object.entries(stats.porCategoria).map(([categoria, total]) => {
            const catInfo = microAtosLibrary[categoria];
            if (!catInfo) return null;

            const porcentagem = (total / stats.total) * 100;

            return (
              <div key={categoria}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{catInfo.emoji}</span>
                    <span className="font-medium text-gray-700">{catInfo.titulo}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${porcentagem}%`,
                      backgroundColor: catInfo.cor
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Últimos 7 Dias */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Últimos 7 Dias</h3>
        <div className="flex justify-between gap-2">
          {stats.ultimos7Dias.map((dia, index) => {
            const data = new Date(dia.data);
            const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' });
            const catInfo = dia.tipo ? microAtosLibrary[dia.tipo] : null;

            return (
              <div key={index} className="flex-1 text-center">
                <div
                  className={`
                    w-full aspect-square rounded-lg mb-2 flex items-center justify-center text-2xl
                    ${dia.realizado 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-md' 
                      : 'bg-gray-100'
                    }
                  `}
                  style={dia.realizado && catInfo ? {
                    background: `linear-gradient(135deg, ${catInfo.cor} 0%, ${catInfo.cor}dd 100%)`
                  } : {}}
                >
                  {dia.realizado ? (catInfo?.emoji || '✅') : ''}
                </div>
                <div className="text-xs text-gray-600 capitalize">{diaSemana}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Histórico Recente */}
      {historico.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Histórico Recente</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {historico
              .filter(m => m.executado)
              .slice(0, 10)
              .map((microAto, index) => {
                const catInfo = microAtosLibrary[microAto.tipo];
                const data = new Date(microAto.executado_at || microAto.data);
                const dataFormatada = data.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short'
                });

                return (
                  <div
                    key={index}
                    className="p-4 rounded-lg border-l-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    style={{ borderLeftColor: catInfo?.cor || '#6B46C1' }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{catInfo?.emoji || '💝'}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900">
                            {catInfo?.titulo || 'Bondade'}
                          </span>
                          <span className="text-xs text-gray-500">{dataFormatada}</span>
                        </div>
                        <p className="text-sm text-gray-600">{microAto.descricao}</p>
                        {microAto.reflexao_pos && (
                          <p className="text-xs text-gray-500 italic mt-2 pl-3 border-l-2 border-gray-300">
                            "{microAto.reflexao_pos}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Mensagem Motivacional */}
      {stats.total === 0 && (
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 border-2 border-purple-200">
          <p className="text-gray-700 text-center">
            💜 Você ainda não realizou nenhum micro-ato. Comece hoje e faça a diferença no mundo!
          </p>
        </div>
      )}
    </div>
  );
};

export default MicroAtosStatistics;
