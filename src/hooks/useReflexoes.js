// ================================================
// HOOK: useReflexoes
// ================================================
// Gerencia o sistema de reflexões noturnas com:
// - Verificação de horário (20:00-23:59)
// - Check de reflexão diária
// - Integração com Supabase
// - Análise IA automática
// - Sistema de conquistas

import { useState, useEffect } from 'react';

export const useReflexoes = (userId) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reflexaoHoje, setReflexaoHoje] = useState(null);
  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [analisando, setAnalisando] = useState(false);
  const [analiseResultado, setAnaliseResultado] = useState(null);
  const [historicoReflexoes, setHistoricoReflexoes] = useState([]);

  // ================================================
  // 1. Verificar se já fez reflexão hoje
  // ================================================
  useEffect(() => {
    if (!userId) return;

    const verificarReflexaoHoje = async () => {
      try {
        const { default: supabase } = await import('../lib/supabase');
        const hoje = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
          .from('reflexoes')
          .select('*')
          .eq('ketero_id', userId)
          .eq('data', hoje)
          .maybeSingle();

        if (!error && data) {
          setReflexaoHoje(data);
        } else {
          setReflexaoHoje(null);
        }
      } catch (err) {
        console.error('Erro ao verificar reflexão:', err);
        setReflexaoHoje(null);
      }
    };

    verificarReflexaoHoje();
  }, [userId]);

  // ================================================
  // 2. Sistema de notificação (20:00 - 23:59)
  // ================================================
  useEffect(() => {
    const verificarHorario = () => {
      const agora = new Date();
      const hora = agora.getHours();

      // Mostrar notificação entre 20h e 23h59
      // Apenas se não fez reflexão hoje
      if (hora >= 20 && hora <= 23 && !reflexaoHoje) {
        setMostrarNotificacao(true);
      } else {
        setMostrarNotificacao(false);
      }
    };

    // Verificar imediatamente
    verificarHorario();

    // Verificar a cada minuto
    const interval = setInterval(verificarHorario, 60000);

    return () => clearInterval(interval);
  }, [reflexaoHoje]);

  // ================================================
  // 3. Carregar histórico de reflexões
  // ================================================
  useEffect(() => {
    if (!userId) return;

    const carregarHistorico = async () => {
      try {
        const { default: supabase } = await import('../lib/supabase');

        const { data, error } = await supabase
          .from('reflexoes')
          .select('*')
          .eq('ketero_id', userId)
          .order('data', { ascending: false })
          .limit(30);

        if (!error && data) {
          setHistoricoReflexoes(data);
        }
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
      }
    };

    carregarHistorico();
  }, [userId, reflexaoHoje]); // Recarregar quando adicionar nova reflexão

  // ================================================
  // 4. Salvar reflexão com análise IA
  // ================================================
  const salvarReflexao = async (reflexaoData) => {
    if (!userId) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    setCarregando(true);
    setAnalisando(true);

    try {
      const { default: supabase } = await import('../lib/supabase');

      // Preparar dados para salvar
      const dadosReflexao = {
        ketero_id: userId,
        data: new Date().toISOString().split('T')[0],
        humor_dia: reflexaoData.humor_dia,
        padroes_linguisticos: reflexaoData.padroes_linguisticos,
        aprendizado_praticas: reflexaoData.aprendizado_praticas,
        micro_ato_realizado: reflexaoData.micro_ato_realizado,
        micro_ato_descricao: reflexaoData.micro_ato_descricao || null,
        notas_livres: reflexaoData.notas_livres || null,
      };

      // Análise IA automática (não bloqueia salvamento)
      let analiseIA = null;
      try {
        const textoCompleto = [
          `Humor: ${reflexaoData.humor_dia}/10`,
          `Padrões: ${reflexaoData.padroes_linguisticos}`,
          `Aprendizado: ${reflexaoData.aprendizado_praticas}`,
          reflexaoData.micro_ato_descricao ? `Bondade: ${reflexaoData.micro_ato_descricao}` : '',
          reflexaoData.notas_livres || ''
        ].filter(Boolean).join('\n');

        const resultadoIA = await analisarComIA(textoCompleto);
        if (resultadoIA && !resultadoIA.error) {
          analiseIA = resultadoIA.analise;
          dadosReflexao.analise_ia = analiseIA;
          dadosReflexao.sentimento_detectado = resultadoIA.sentimento;
        }
      } catch (iaError) {
        console.log('Análise IA falhou, continuando sem análise:', iaError);
      }

      // Salvar no Supabase
      const { data, error } = await supabase
        .from('reflexoes')
        .upsert([dadosReflexao], {
          onConflict: 'ketero_id,data',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar contador de reflexões
      await supabase.rpc('increment_reflexoes', { p_user_id: userId });

      // Verificar conquistas
      await verificarConquistas(userId);

      // Atualizar estado
      setReflexaoHoje(data);
      setAnaliseResultado(analiseIA);
      setMostrarModal(false);
      setMostrarNotificacao(false);

      return {
        success: true,
        data,
        analiseIA
      };
    } catch (error) {
      console.error('Erro ao salvar reflexão:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setCarregando(false);
      setAnalisando(false);
    }
  };

  // ================================================
  // 5. Análise com IA (OpenAI)
  // ================================================
  const analisarComIA = async (textoReflexao) => {
    try {
      const { analisarReflexao } = await import('../lib/openai');
      
      const resultado = await analisarReflexao(textoReflexao);
      
      return resultado;
    } catch (error) {
      console.error('Erro na análise IA:', error);
      return {
        analise: null,
        sentimento: 'neutro',
        error: error.message
      };
    }
  };

  // ================================================
  // 6. Verificar e desbloquear conquistas
  // ================================================
  const verificarConquistas = async (userId) => {
    try {
      const { default: supabase } = await import('../lib/supabase');

      // Buscar últimas reflexões para verificar sequência
      const { data: reflexoes } = await supabase
        .from('reflexoes')
        .select('data')
        .eq('ketero_id', userId)
        .order('data', { ascending: false })
        .limit(3);

      if (!reflexoes || reflexoes.length < 3) return;

      // Verificar se as últimas 3 reflexões são consecutivas
      const datas = reflexoes.map(r => new Date(r.data));
      const isConsecutivo = verificarDiasConsecutivos(datas, 3);

      if (isConsecutivo) {
        // Desbloquear conquista "Reflexivo Iniciante"
        await supabase
          .from('keteros_conquistas')
          .upsert([{
            ketero_id: userId,
            conquista_id: 'reflexivo-iniciante'
          }], {
            onConflict: 'ketero_id,conquista_id',
            ignoreDuplicates: true
          });
      }
    } catch (error) {
      console.error('Erro ao verificar conquistas:', error);
    }
  };

  // Helper: Verificar dias consecutivos
  const verificarDiasConsecutivos = (datas, quantidade) => {
    if (datas.length < quantidade) return false;

    for (let i = 0; i < quantidade - 1; i++) {
      const diff = Math.abs(datas[i] - datas[i + 1]);
      const diasDiff = diff / (1000 * 60 * 60 * 24);
      
      // Verificar se a diferença está próxima de 1 dia (threshold: 0.9 a 1.1)
      // Isso lida com variações de horário e fusos horários
      if (diasDiff < 0.9 || diasDiff > 1.1) return false;
    }

    return true;
  };

  // ================================================
  // 7. Retorno do hook
  // ================================================
  return {
    // Estado
    mostrarModal,
    setMostrarModal,
    mostrarNotificacao,
    setMostrarNotificacao,
    reflexaoHoje,
    carregando,
    analisando,
    analiseResultado,
    historicoReflexoes,
    jaFezReflexaoHoje: !!reflexaoHoje,

    // Métodos
    salvarReflexao,
  };
};

export default useReflexoes;
