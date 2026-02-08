// ================================================
// REACT HOOKS FOR AI INTEGRATION
// ================================================
// src/hooks/useIA.js

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useKetero, useReflexoes } from './useAuth';
import {
  chatWithGuia as chatIA,
  gerarAnaliseSemanal,
  analisarPadroesLinguisticos,
  detectarCrise,
  recomendarPratica,
  getCached,
  setCache
} from '../lib/openai';
import { salvarConversaGuia, salvarAnaliseIA } from '../lib/supabase';

// ================================================
// USE GUIA INTELIGENTE (Chat com IA)
// ================================================

export const useGuiaInteligente = () => {
  const { user, profile } = useAuth();
  const { stats } = useKetero();
  const { reflexoes } = useReflexoes();
  
  const [mensagens, setMensagens] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Mensagem inicial
  useEffect(() => {
    if (mensagens.length === 0) {
      setMensagens([{
        role: 'assistant',
        content: 'Olá! Sou o Guia Keter, sua IA de evolução pessoal. Como posso ajudar você hoje?\n\nPosso:\n• Analisar sua evolução\n• Responder dúvidas sobre práticas\n• Sugerir próximos passos\n• Ajudar com desafios',
        timestamp: Date.now()
      }]);
    }
  }, []);

  const enviarMensagem = useCallback(async (mensagem) => {
    if (!user || !mensagem.trim()) return;

    // Adicionar mensagem do usuário
    const novaMsgUser = {
      role: 'user',
      content: mensagem,
      timestamp: Date.now()
    };
    setMensagens(prev => [...prev, novaMsgUser]);
    setIsTyping(true);
    setError(null);

    try {
      // Verificar se é uma crise
      const crise = await detectarCrise(mensagem);
      
      if (crise.crise_detectada && crise.nivel === 'critico') {
        // Resposta especial para crise
        const respostaCrise = {
          role: 'assistant',
          content: crise.recomendacao,
          timestamp: Date.now(),
          tipo: 'crise'
        };
        setMensagens(prev => [...prev, respostaCrise]);
        setIsTyping(false);
        return;
      }

      // Preparar contexto
      const contexto = {
        nome: profile?.nome,
        faseAtual: stats?.faseAtual,
        diaTotal: stats?.diaAtual,
        sequencia: stats?.sequencia,
        totalPraticas: stats?.totalPraticas,
        totalReflexoes: stats?.totalReflexoes,
        ultimaReflexao: reflexoes[0]?.sentimentos_dia
      };

      // Analisar padrões se houver reflexões
      if (reflexoes.length > 0) {
        const padroes = analisarPadroesLinguisticos(reflexoes.slice(0, 7));
        if (padroes && padroes.insights.length > 0) {
          contexto.padraoDetectado = padroes.insights[0];
        }
      }

      // Histórico (últimas 10 mensagens)
      const historico = mensagens.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      // Chamar IA
      const { resposta, tokensUsados, error } = await chatIA(
        mensagem,
        contexto,
        historico
      );

      if (error) {
        throw new Error(error);
      }

      // Adicionar resposta da IA
      const novaMsgIA = {
        role: 'assistant',
        content: resposta,
        timestamp: Date.now(),
        tokens: tokensUsados
      };
      setMensagens(prev => [...prev, novaMsgIA]);

      // Salvar no banco (assíncrono, não bloqueia)
      salvarConversaGuia(user.id, mensagem, resposta, {
        tokens: tokensUsados,
        ...contexto
      }).catch(err => console.error('Erro ao salvar conversa:', err));

    } catch (err) {
      console.error('Erro no chat:', err);
      setError('Desculpe, tive um problema. Tente novamente.');
      
      // Mensagem de erro amigável
      setMensagens(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpe, tive um problema ao processar sua mensagem. Pode tentar novamente?',
        timestamp: Date.now(),
        erro: true
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [user, profile, stats, reflexoes, mensagens]);

  const limparChat = () => {
    setMensagens([{
      role: 'assistant',
      content: 'Chat limpo. Como posso ajudar?',
      timestamp: Date.now()
    }]);
  };

  return {
    mensagens,
    isTyping,
    error,
    enviarMensagem,
    limparChat
  };
};

// ================================================
// USE ANALISE SEMANAL
// ================================================

export const useAnaliseSemanal = () => {
  const { user } = useAuth();
  const { stats } = useKetero();
  const { reflexoes } = useReflexoes();
  
  const [analise, setAnalise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const gerarAnalise = useCallback(async () => {
    if (!user || reflexoes.length < 3) {
      setError('Você precisa de pelo menos 3 reflexões para gerar uma análise.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Verificar cache
      const cacheKey = `analise_${user.id}_${Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))}`;
      const cached = getCached(cacheKey);
      
      if (cached) {
        setAnalise(cached);
        setLoading(false);
        return cached;
      }

      // Pegar últimas 7 reflexões e práticas
      const ultimasReflexoes = reflexoes.slice(0, 7);
      
      // TODO: buscar práticas da semana do Supabase
      const praticas = []; // Placeholder

      const dadosSemana = {
        reflexoes: ultimasReflexoes,
        praticas: praticas,
        keteroStats: stats
      };

      const { analise: textoAnalise, metricas } = await gerarAnaliseSemanal(dadosSemana);

      if (!textoAnalise) {
        throw new Error('Falha ao gerar análise');
      }

      // Analisar padrões linguísticos
      const padroes = analisarPadroesLinguisticos(ultimasReflexoes);

      const resultado = {
        texto: textoAnalise,
        metricas,
        padroes,
        geradoEm: Date.now()
      };

      setAnalise(resultado);
      setCache(cacheKey, resultado);

      // Salvar no banco
      await salvarAnaliseIA(user.id, {
        tipo: 'semanal',
        conteudo: textoAnalise,
        metricas: { ...metricas, padroes }
      });

      return resultado;
    } catch (err) {
      console.error('Erro ao gerar análise:', err);
      setError('Não foi possível gerar a análise. Tente novamente.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, reflexoes, stats]);

  // Auto-gerar análise se é domingo e ainda não foi gerada
  useEffect(() => {
    if (user && stats?.diaAtual % 7 === 0 && !analise) {
      gerarAnalise();
    }
  }, [user, stats]);

  return {
    analise,
    loading,
    error,
    gerarAnalise
  };
};

// ================================================
// USE PADROES LINGUISTICOS
// ================================================

export const usePadroesLinguisticos = (dias = 7) => {
  const { reflexoes } = useReflexoes();
  const [padroes, setPadroes] = useState(null);
  const [evolucao, setEvolucao] = useState(null);

  useEffect(() => {
    if (reflexoes.length < 2) return;

    // Analisar período atual
    const reflexoesAtuais = reflexoes.slice(0, dias);
    const padroesAtuais = analisarPadroesLinguisticos(reflexoesAtuais);
    setPadroes(padroesAtuais);

    // Comparar com período anterior (se houver dados)
    if (reflexoes.length >= dias * 2) {
      const reflexoesAnteriores = reflexoes.slice(dias, dias * 2);
      const padroesAnteriores = analisarPadroesLinguisticos(reflexoesAnteriores);

      const mudanca = {
        agencia: padroesAtuais.scoreAgencia - padroesAnteriores.scoreAgencia,
        positividade: padroesAtuais.scorePositividade - padroesAnteriores.scorePositividade,
        tendencia: getTendencia(
          padroesAtuais.scoreAgencia - padroesAnteriores.scoreAgencia,
          padroesAtuais.scorePositividade - padroesAnteriores.scorePositividade
        )
      };

      setEvolucao(mudanca);
    }
  }, [reflexoes, dias]);

  return { padroes, evolucao };
};

const getTendencia = (deltaAgencia, deltaPositividade) => {
  const media = (deltaAgencia + deltaPositividade) / 2;
  
  if (media > 15) return 'melhora_significativa';
  if (media > 5) return 'melhora_leve';
  if (media > -5) return 'estavel';
  if (media > -15) return 'piora_leve';
  return 'piora_significativa';
};

// ================================================
// USE RECOMENDACAO PRATICA
// ================================================

export const useRecomendacaoPratica = (praticasDisponiveis) => {
  const { profile } = useAuth();
  const [praticaRecomendada, setPraticaRecomendada] = useState(null);
  const [loading, setLoading] = useState(false);

  const buscarRecomendacao = useCallback(async () => {
    if (!profile || !praticasDisponiveis || praticasDisponiveis.length === 0) {
      return;
    }

    setLoading(true);

    try {
      const pratica = await recomendarPratica(profile, praticasDisponiveis);
      setPraticaRecomendada(pratica);
    } catch (err) {
      console.error('Erro ao recomendar prática:', err);
      // Fallback: escolher aleatória
      setPraticaRecomendada(
        praticasDisponiveis[Math.floor(Math.random() * praticasDisponiveis.length)]
      );
    } finally {
      setLoading(false);
    }
  }, [profile, praticasDisponiveis]);

  useEffect(() => {
    buscarRecomendacao();
  }, [profile]);

  return { praticaRecomendada, loading, buscarRecomendacao };
};

// ================================================
// USE DETECÇÃO CRISE
// ================================================

export const useDeteccaoCrise = () => {
  const [ultimaCrise, setUltimaCrise] = useState(null);

  const verificarCrise = useCallback(async (texto) => {
    if (!texto || texto.length < 10) return null;

    try {
      const resultado = await detectarCrise(texto);
      
      if (resultado.crise_detectada) {
        setUltimaCrise(resultado);
      }

      return resultado;
    } catch (err) {
      console.error('Erro ao detectar crise:', err);
      return null;
    }
  }, []);

  return { verificarCrise, ultimaCrise };
};

// ================================================
// HELPER: Salvar Análise no Supabase
// ================================================

const salvarAnaliseIA = async (userId, dados) => {
  try {
    const { supabase } = await import('../lib/supabase');
    
    const { error } = await supabase
      .from('analises_ia')
      .insert([{
        ketero_id: userId,
        tipo: dados.tipo,
        conteudo: dados.conteudo,
        metricas: dados.metricas,
        lida: false
      }]);

    if (error) throw error;
  } catch (err) {
    console.error('Erro ao salvar análise:', err);
  }
};

// ================================================
// EXPORTS
// ================================================

export {
  useGuiaInteligente,
  useAnaliseSemanal,
  usePadroesLinguisticos,
  useRecomendacaoPratica,
  useDeteccaoCrise
};
