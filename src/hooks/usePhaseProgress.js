// ================================================
// HOOK: usePhaseProgress
// ================================================
// Gerencia progresso e critérios de conclusão de fase

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { generatePhaseTransitionMessage } from '../lib/openai';
import { isValidUUID } from '../lib/utils';

// ================================================
// CRITÉRIOS DE CONCLUSÃO POR FASE
// ================================================
const FASE_CRITERIOS = {
  0: { // Semente
    diasMinimos: 7,
    praticasMinimas: 3,
    reflexoesMinimas: 3,
    streakMinimo: 3,
    conquistasMinimas: 1
  },
  1: { // Despertar  
    diasMinimos: 14,
    praticasMinimas: 10,
    reflexoesMinimas: 7,
    streakMinimo: 7,
    conquistasMinimas: 2
  },
  2: { // Disciplina
    diasMinimos: 16,
    praticasMinimas: 14,
    reflexoesMinimas: 10,
    streakMinimo: 10,
    conquistasMinimas: 3
  },
  3: { // Consciência
    diasMinimos: 21,
    praticasMinimas: 21,
    reflexoesMinimas: 14,
    streakMinimo: 14,
    conquistasMinimas: 5
  },
  4: { // Serviço (sem limite - fase final)
    diasMinimos: null,
    praticasMinimas: null,
    reflexoesMinimas: null,
    streakMinimo: null,
    conquistasMinimas: null
  }
};

export const usePhaseProgress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [faseAtual, setFaseAtual] = useState(null);
  const [progresso, setProgresso] = useState({
    dias: 0,
    praticas: 0,
    reflexoes: 0,
    streak: 0,
    conquistas: 0
  });
  const [criterios, setCriterios] = useState(null);
  const [podeTransitar, setPodeTransitar] = useState(false);
  const [transicaoPendente, setTransicaoPendente] = useState(null);
  const [mensagemIA, setMensagemIA] = useState('');
  const [conquistasDesbloqueadas, setConquistasDesbloqueadas] = useState([]);

  // Carregar progresso atual
  const carregarProgresso = useCallback(async () => {
    if (!user?.id) return;

    // Validar UUID antes de fazer query
    if (!isValidUUID(user.id)) {
      console.error('UUID inválido em usePhaseProgress:', user.id);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Buscar dados do ketero
      const { data: keteroData, error: keteroError } = await supabase
        .from('keteros')
        .select(`
          fase_atual,
          dia_na_fase,
          total_praticas,
          sequencia_atual,
          sequencia_maxima
        `)
        .eq('id', user.id)
        .maybeSingle();

      if (keteroError) {
        console.error('Erro ao buscar dados do ketero:', keteroError);
        throw keteroError;
      }

      // Tratar data null com defaults
      const faseAtualValue = keteroData?.fase_atual ?? 1;
      setFaseAtual(faseAtualValue);
      
      // Contar conquistas
      const { data: conquistasData, error: conquistasError } = await supabase
        .from('keteros_conquistas')
        .select('conquista_id')
        .eq('ketero_id', user.id);

      if (conquistasError) {
        console.error('Erro ao buscar conquistas:', conquistasError);
      }

      const totalConquistas = conquistasData?.length || 0;

      // Contar reflexões manualmente (já que campo não existe em keteros)
      const { count: totalReflexoes, error: reflexoesError } = await supabase
        .from('reflexoes')
        .select('id', { count: 'exact', head: true })
        .eq('ketero_id', user.id);

      if (reflexoesError) {
        console.error('Erro ao contar reflexões:', reflexoesError);
      }

      // Atualizar progresso com defaults para valores ausentes
      setProgresso({
        dias: keteroData?.dia_na_fase || 0,
        praticas: keteroData?.total_praticas || 0,
        reflexoes: totalReflexoes || 0,
        streak: keteroData?.sequencia_atual || 0,
        conquistas: totalConquistas
      });

      // Buscar critérios da fase atual
      const criteriosFase = FASE_CRITERIOS[faseAtualValue];
      setCriterios(criteriosFase);

      // Verificar se pode transitar
      if (faseAtualValue < 4 && criteriosFase) {
        const pode = 
          (keteroData?.dia_na_fase || 0) >= criteriosFase.diasMinimos &&
          (keteroData?.total_praticas || 0) >= criteriosFase.praticasMinimas &&
          (totalReflexoes || 0) >= criteriosFase.reflexoesMinimas &&
          (keteroData?.sequencia_maxima || 0) >= criteriosFase.streakMinimo &&
          totalConquistas >= criteriosFase.conquistasMinimas;

        setPodeTransitar(pode);
      } else {
        setPodeTransitar(false);
      }

      // Verificar se há transição não vista
      const { data: transicaoData, error: transicaoError } = await supabase
        .from('transicoes_fase')
        .select('*')
        .eq('ketero_id', user.id)
        .eq('animacao_vista', false)
        .order('data_transicao', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (transicaoError && transicaoError.code !== 'PGRST116') {
        console.error('Erro ao buscar transição:', transicaoError);
      }

      if (transicaoData) {
        setTransicaoPendente(transicaoData);

        // Gerar mensagem da IA se não existir
        if (!transicaoData.mensagem_ia) {
          await gerarMensagemIA(transicaoData);
        } else {
          setMensagemIA(transicaoData.mensagem_ia);
        }

        // Buscar conquistas desbloqueadas na transição
        if (transicaoData.conquistas_desbloqueadas && Array.isArray(transicaoData.conquistas_desbloqueadas)) {
          const conquistaIds = transicaoData.conquistas_desbloqueadas;
          
          if (conquistaIds.length > 0) {
            const { data: conquistasDetalhes, error: conquistasErro } = await supabase
              .from('conquistas')
              .select('*')
              .in('id', conquistaIds);

            if (!conquistasErro && conquistasDetalhes) {
              setConquistasDesbloqueadas(conquistasDetalhes);
            }
          }
        }
      }

    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Gerar mensagem da IA
  const gerarMensagemIA = async (transicao) => {
    try {
      // Buscar nome do usuário
      const { data: userData } = await supabase
        .from('keteros')
        .select('nome')
        .eq('id', user.id)
        .maybeSingle();

      const nomeUsuario = userData?.nome || 'Ketero';
      const faseNova = getFaseNome(transicao.fase_nova);

      // Gerar mensagem
      const mensagem = await generatePhaseTransitionMessage(
        nomeUsuario,
        faseNova,
        transicao
      );

      setMensagemIA(mensagem);

      // Salvar mensagem no banco
      await supabase
        .from('transicoes_fase')
        .update({ mensagem_ia: mensagem })
        .eq('id', transicao.id);

    } catch (error) {
      console.error('Erro ao gerar mensagem IA:', error);
      // Mensagem padrão em caso de erro
      setMensagemIA('Parabéns pela sua evolução! Continue sua jornada com dedicação e propósito. ✨');
    }
  };

  // Helper: nome da fase
  const getFaseNome = (faseId) => {
    const nomes = ['Semente', 'Despertar', 'Disciplina', 'Consciência', 'Serviço'];
    return nomes[faseId] || 'Desconhecida';
  };

  // Verificar e executar transição
  const verificarETransitar = useCallback(async () => {
    if (!user?.id || !podeTransitar) return { transitou: false };

    try {
      // Chamar função RPC do banco
      const { data, error } = await supabase
        .rpc('verificar_transicao_fase', { ketero_uuid: user.id });

      if (error) throw error;

      if (data) {
        // Transição ocorreu!
        await carregarProgresso();
        return { transitou: true };
      }

      return { transitou: false };

    } catch (error) {
      console.error('Erro ao verificar transição:', error);
      return { transitou: false, error };
    }
  }, [user?.id, podeTransitar, carregarProgresso]);

  // Marcar transição como vista
  const marcarTransicaoVista = useCallback(async (transicaoId) => {
    if (!transicaoId) return;

    try {
      await supabase
        .from('transicoes_fase')
        .update({ animacao_vista: true })
        .eq('id', transicaoId);

      setTransicaoPendente(null);
      setMensagemIA('');
      setConquistasDesbloqueadas([]);

    } catch (error) {
      console.error('Erro ao marcar transição:', error);
    }
  }, []);

  // Adicionar feedback
  const adicionarFeedback = useCallback(async (transicaoId, feedback) => {
    if (!transicaoId) return;

    try {
      await supabase
        .from('transicoes_fase')
        .update({ feedback_usuario: feedback })
        .eq('id', transicaoId);

    } catch (error) {
      console.error('Erro ao adicionar feedback:', error);
    }
  }, []);

  // Calcular progresso percentual
  const calcularProgressoPercentual = useCallback(() => {
    if (!criterios || faseAtual === 4) return 100;

    const percentualDias = criterios.diasMinimos > 0 
      ? Math.min(100, (progresso.dias / criterios.diasMinimos) * 100) 
      : 100;
    const percentualPraticas = criterios.praticasMinimas > 0 
      ? Math.min(100, (progresso.praticas / criterios.praticasMinimas) * 100) 
      : 100;
    const percentualReflexoes = criterios.reflexoesMinimas > 0 
      ? Math.min(100, (progresso.reflexoes / criterios.reflexoesMinimas) * 100) 
      : 100;
    const percentualStreak = criterios.streakMinimo > 0 
      ? Math.min(100, (progresso.streak / criterios.streakMinimo) * 100) 
      : 100;
    const percentualConquistas = criterios.conquistasMinimas > 0 
      ? Math.min(100, (progresso.conquistas / criterios.conquistasMinimas) * 100) 
      : 100;

    // Média ponderada
    return Math.round(
      (percentualDias * 0.3) +
      (percentualPraticas * 0.25) +
      (percentualReflexoes * 0.2) +
      (percentualStreak * 0.15) +
      (percentualConquistas * 0.1)
    );
  }, [criterios, progresso, faseAtual]);

  // Carregar dados ao montar
  useEffect(() => {
    if (user?.id) {
      carregarProgresso();
    }
  }, [user?.id, carregarProgresso]);

  return {
    loading,
    faseAtual,
    progresso,
    criterios,
    podeTransitar,
    transicaoPendente,
    mensagemIA,
    conquistasDesbloqueadas,
    progressoPercentual: calcularProgressoPercentual(),
    verificarETransitar,
    marcarTransicaoVista,
    adicionarFeedback,
    recarregar: carregarProgresso
  };
};
