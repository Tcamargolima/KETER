// ================================================
// HOOK: useFaseTransicao
// ================================================
// Gerencia lógica de transições de fase

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

const FASES_CONFIG = [
  {
    id: 0,
    nome: 'Semente',
    cor: '#A78BFA',      // Roxo claro
    gradiente: 'from-purple-400 to-purple-600',
    icone: '🌱',
    duracao: 7,
    objetivo: 'Plantar a intenção',
    mensagem: 'Você está plantando as sementes da sua transformação',
    desbloqueios: ['Avaliação inicial', 'Primeira prática']
  },
  {
    id: 1,
    nome: 'Raiz',
    cor: '#F59E0B',      // Âmbar
    gradiente: 'from-amber-400 to-orange-500',
    icone: '🌿',
    duracao: 14,
    objetivo: 'Criar fundação sólida',
    mensagem: 'Suas raízes estão se aprofundando',
    desbloqueios: ['Práticas fundacionais', 'Reflexões noturnas']
  },
  {
    id: 2,
    nome: 'Tronco',
    cor: '#EC4899',      // Rosa
    gradiente: 'from-pink-400 to-pink-600',
    icone: '🌳',
    duracao: 16,
    objetivo: 'Fortalecer disciplina',
    mensagem: 'Você está construindo força interior',
    desbloqueios: ['Biblioteca completa', 'Micro-atos de bondade', 'Análise semanal IA']
  },
  {
    id: 3,
    nome: 'Copa',
    cor: '#6B46C1',      // Roxo escuro
    gradiente: 'from-purple-600 to-indigo-600',
    icone: '🌲',
    duracao: 30,
    objetivo: 'Expandir consciência',
    mensagem: 'Sua consciência está florescendo',
    desbloqueios: ['Práticas avançadas', 'Mapa completo', 'Comunidade']
  },
  {
    id: 4,
    nome: 'Flor',
    cor: '#10B981',      // Verde
    gradiente: 'from-emerald-400 to-green-500',
    icone: '🌸',
    duracao: null,
    objetivo: 'Servir o mundo',
    mensagem: 'Você é a transformação que deseja ver',
    desbloqueios: ['Modo guia', 'Impacto social', 'Todas as features']
  }
];

export const useFaseTransicao = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [faseAtual, setFaseAtual] = useState(null);
  const [progresso, setProgresso] = useState(0);
  const [proximaTransicao, setProximaTransicao] = useState(null);
  const [historicoTransicoes, setHistoricoTransicoes] = useState([]);
  const [mostrandoAnimacao, setMostrandoAnimacao] = useState(false);

  // Buscar dados da fase atual
  const carregarFaseAtual = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Buscar dados do ketero
      const { data: keteroData, error: keteroError } = await supabase
        .from('keteros')
        .select('fase_atual, fase_nome, progresso_fase, dia_na_fase, data_inicio_fase, historico_fases')
        .eq('id', user.id)
        .single();

      if (keteroError) throw keteroError;

      const faseConfig = FASES_CONFIG[keteroData.fase_atual];
      
      setFaseAtual({
        ...faseConfig,
        diaAtual: keteroData.dia_na_fase,
        dataInicio: keteroData.data_inicio_fase,
        historico: keteroData.historico_fases || []
      });
      
      setProgresso(keteroData.progresso_fase || 0);

      // Calcular próxima transição
      if (keteroData.fase_atual < 4) {
        const proximaFase = FASES_CONFIG[keteroData.fase_atual + 1];
        const diasRestantes = faseConfig.duracao - keteroData.dia_na_fase;
        const progressoRestante = 100 - keteroData.progresso_fase;

        setProximaTransicao({
          fase: proximaFase,
          diasRestantes: Math.max(0, diasRestantes),
          progressoRestante: Math.max(0, progressoRestante)
        });
      }

      // Buscar histórico de transições
      const { data: transicoesData } = await supabase
        .from('transicoes_fase')
        .select('*')
        .eq('ketero_id', user.id)
        .order('data_transicao', { ascending: false });

      if (transicoesData) {
        setHistoricoTransicoes(transicoesData);

        // Verificar se há transição não vista
        const transicaoNaoVista = transicoesData.find(t => !t.animacao_vista);
        if (transicaoNaoVista) {
          setMostrandoAnimacao(true);
        }
      }

    } catch (error) {
      console.error('Erro ao carregar fase:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Verificar transição (chamado manualmente ou após ação)
  const verificarTransicao = useCallback(async () => {
    if (!user?.id) return { transitou: false };

    try {
      // Chamar função do banco
      const { data, error } = await supabase
        .rpc('verificar_transicao_fase', { ketero_uuid: user.id });

      if (error) throw error;

      if (data) {
        // Transição ocorreu!
        await carregarFaseAtual();
        setMostrandoAnimacao(true);
        
        return { transitou: true };
      }

      return { transitou: false };

    } catch (error) {
      console.error('Erro ao verificar transição:', error);
      return { transitou: false, error };
    }
  }, [user?.id, carregarFaseAtual]);

  // Marcar animação como vista
  const marcarAnimacaoVista = useCallback(async (transicaoId) => {
    try {
      await supabase
        .from('transicoes_fase')
        .update({ animacao_vista: true })
        .eq('id', transicaoId);

      setMostrandoAnimacao(false);
      
    } catch (error) {
      console.error('Erro ao marcar animação:', error);
    }
  }, []);

  // Adicionar feedback do usuário
  const adicionarFeedback = useCallback(async (transicaoId, feedback) => {
    try {
      await supabase
        .from('transicoes_fase')
        .update({ feedback_usuario: feedback })
        .eq('id', transicaoId);
        
    } catch (error) {
      console.error('Erro ao adicionar feedback:', error);
    }
  }, []);

  // Calcular progresso visual (para animações)
  const getProgressoVisual = useCallback(() => {
    if (!faseAtual) return 0;
    
    return {
      porcentagem: progresso,
      diasCompletados: faseAtual.diaAtual - 1,
      diasTotais: faseAtual.duracao,
      diasRestantes: Math.max(0, faseAtual.duracao - faseAtual.diaAtual)
    };
  }, [faseAtual, progresso]);

  // Obter desbloqueios da fase
  const getDesbloqueios = useCallback((faseId) => {
    return FASES_CONFIG[faseId]?.desbloqueios || [];
  }, []);

  // Subscription para mudanças em tempo real
  useEffect(() => {
    if (!user?.id) return;

    carregarFaseAtual();

    // Subscribe para transições
    const subscription = supabase
      .channel('transicoes_fase_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transicoes_fase',
          filter: `ketero_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Nova transição detectada!', payload);
          carregarFaseAtual();
          setMostrandoAnimacao(true);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, carregarFaseAtual]);

  return {
    loading,
    faseAtual,
    progresso,
    proximaTransicao,
    historicoTransicoes,
    mostrandoAnimacao,
    verificarTransicao,
    marcarAnimacaoVista,
    adicionarFeedback,
    getProgressoVisual,
    getDesbloqueios,
    FASES_CONFIG
  };
};
