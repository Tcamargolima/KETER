import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

/**
 * DebugPanel - Technical Validation Component (Dev Mode Only)
 * 
 * Validates all major functions, database queries, and screen connections
 * Only visible when import.meta.env.DEV is true
 */
const DebugPanel = () => {
  const { user, session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  // Test functions
  const tests = [
    {
      id: 'auth-session',
      name: 'Sessão de Autenticação',
      test: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return { success: true, data: { userId: session?.user?.id, email: session?.user?.email } };
      }
    },
    {
      id: 'keteros-profile',
      name: 'Perfil do Ketero',
      test: async () => {
        if (!user?.id) throw new Error('Usuário não autenticado');
        const { data, error } = await supabase
          .from('keteros')
          .select('id, nome, email, fase_atual, dia_na_fase')
          .eq('id', user.id)
          .maybeSingle();
        if (error) throw error;
        return { success: true, data };
      }
    },
    {
      id: 'praticas',
      name: 'Biblioteca de Práticas',
      test: async () => {
        const { data, error } = await supabase
          .from('praticas')
          .select('id, titulo, fase, categoria')
          .order('fase', { ascending: true })
          .limit(5);
        if (error) throw error;
        return { success: true, data, count: data?.length || 0 };
      }
    },
    {
      id: 'praticas-diarias',
      name: 'Práticas Diárias (Histórico)',
      test: async () => {
        if (!user?.id) throw new Error('Usuário não autenticado');
        const { data, error } = await supabase
          .from('praticas_diarias')
          .select('id, data, completada, pratica_id')
          .eq('ketero_id', user.id)
          .order('data', { ascending: false })
          .limit(5);
        if (error) throw error;
        return { success: true, data, count: data?.length || 0 };
      }
    },
    {
      id: 'reflexoes',
      name: 'Reflexões Noturnas',
      test: async () => {
        if (!user?.id) throw new Error('Usuário não autenticado');
        const { data, error } = await supabase
          .from('reflexoes')
          .select('id, data, humor_dia')
          .eq('ketero_id', user.id)
          .order('data', { ascending: false })
          .limit(5);
        if (error) throw error;
        return { success: true, data, count: data?.length || 0 };
      }
    },
    {
      id: 'micro-atos',
      name: 'Micro-Atos de Bondade',
      test: async () => {
        if (!user?.id) throw new Error('Usuário não autenticado');
        const { data, error } = await supabase
          .from('micro_atos')
          .select('id, data, tipo, executado')
          .eq('ketero_id', user.id)
          .order('data', { ascending: false })
          .limit(5);
        if (error) throw error;
        return { success: true, data, count: data?.length || 0 };
      }
    },
    {
      id: 'conquistas',
      name: 'Conquistas',
      test: async () => {
        if (!user?.id) throw new Error('Usuário não autenticado');
        const { data, error } = await supabase
          .from('keteros_conquistas')
          .select('id, conquista_id, desbloqueada_em')
          .eq('ketero_id', user.id)
          .limit(5);
        if (error) throw error;
        return { success: true, data, count: data?.length || 0 };
      }
    },
    {
      id: 'transicoes',
      name: 'Transições de Fase',
      test: async () => {
        if (!user?.id) throw new Error('Usuário não autenticado');
        const { data, error } = await supabase
          .from('transicoes_fase')
          .select('id, fase_anterior, fase_nova, data_transicao')
          .eq('ketero_id', user.id)
          .order('data_transicao', { ascending: false })
          .limit(5);
        if (error) throw error;
        return { success: true, data, count: data?.length || 0 };
      }
    },
    {
      id: 'conteudo-educacional',
      name: 'Conteúdo Educacional',
      test: async () => {
        const { data, error } = await supabase
          .from('conteudo_educacional')
          .select('id, titulo, fase, tipo')
          .eq('publicado', true)
          .limit(5);
        if (error) throw error;
        return { success: true, data, count: data?.length || 0 };
      }
    },
    {
      id: 'circulos',
      name: 'Círculos de Apoio',
      test: async () => {
        const { data, error } = await supabase
          .from('circulos')
          .select('id, nome, descricao, is_public')
          .limit(5);
        if (error) throw error;
        return { success: true, data, count: data?.length || 0 };
      }
    }
  ];

  const runTest = async (test) => {
    setLoading(prev => ({ ...prev, [test.id]: true }));
    try {
      const result = await test.test();
      setTestResults(prev => ({
        ...prev,
        [test.id]: { success: true, ...result, timestamp: new Date().toISOString() }
      }));
    } catch (error) {
      console.error(`Test ${test.id} failed:`, error);
      setTestResults(prev => ({
        ...prev,
        [test.id]: {
          success: false,
          error: error.message,
          code: error.code,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [test.id]: false }));
    }
  };

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const clearResults = () => {
    setTestResults({});
  };

  const getStatusIcon = (testId) => {
    const result = testResults[testId];
    if (!result) return '⚪';
    return result.success ? '✅' : '❌';
  };

  const getStatusColor = (testId) => {
    const result = testResults[testId];
    if (!result) return 'text-gray-500';
    return result.success ? 'text-green-600' : 'text-red-600';
  };

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all"
        title="Debug Panel"
      >
        🔧
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">🔧 Debug Panel</h2>
                <p className="text-sm opacity-90">Validação Técnica - Dev Mode</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-purple-700 p-2 rounded"
              >
                ✕
              </button>
            </div>

            {/* Controls */}
            <div className="bg-gray-50 p-4 border-b flex gap-2">
              <button
                onClick={runAllTests}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                ▶ Executar Todos os Testes
              </button>
              <button
                onClick={clearResults}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                🗑 Limpar Resultados
              </button>
            </div>

            {/* Test List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {tests.map(test => (
                  <div
                    key={test.id}
                    className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getStatusIcon(test.id)}</span>
                        <div>
                          <h3 className="font-semibold">{test.name}</h3>
                          <p className="text-xs text-gray-500">ID: {test.id}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => runTest(test)}
                        disabled={loading[test.id]}
                        className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading[test.id] ? '⏳' : '▶ Testar'}
                      </button>
                    </div>

                    {/* Test Results */}
                    {testResults[test.id] && (
                      <div className={`mt-2 p-3 rounded text-sm ${testResults[test.id].success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        {testResults[test.id].success ? (
                          <>
                            <p className="font-semibold text-green-700 mb-1">✅ Sucesso</p>
                            {testResults[test.id].count !== undefined && (
                              <p className="text-green-600">Registros encontrados: {testResults[test.id].count}</p>
                            )}
                            {testResults[test.id].data && (
                              <details className="mt-2">
                                <summary className="cursor-pointer text-green-600 hover:text-green-700">
                                  Ver dados retornados
                                </summary>
                                <pre className="mt-2 p-2 bg-white rounded text-xs overflow-x-auto">
                                  {JSON.stringify(testResults[test.id].data, null, 2)}
                                </pre>
                              </details>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="font-semibold text-red-700 mb-1">❌ Erro</p>
                            <p className="text-red-600">{testResults[test.id].error}</p>
                            {testResults[test.id].code && (
                              <p className="text-red-500 text-xs mt-1">Código: {testResults[test.id].code}</p>
                            )}
                          </>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(testResults[test.id].timestamp).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 border-t text-sm text-gray-600">
              <p>💡 Este painel só está visível em modo de desenvolvimento.</p>
              <p className="mt-1">Usuário: {user?.email || 'Não autenticado'}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DebugPanel;
