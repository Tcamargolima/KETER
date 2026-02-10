// ================================================
// REFLEXÃO NOTURNA - SISTEMA COMPLETO INTEGRADO
// ================================================
// Este arquivo conecta o componente ReflexaoNoturna com:
// - Supabase (persistência)
// - OpenAI (análise em tempo real)
// - Sistema de notificações (trigger às 20h)

import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { ReflexaoNoturna, PERGUNTAS_REFLEXAO } from './reflexao-microatos';

// ================================================
// CUSTOM HOOK: useReflexaoNoturna
// ================================================

export const useReflexaoNoturna = (userId, faseAtual) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reflexaoHoje, setReflexaoHoje] = useState(null);
  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Verificar se já fez reflexão hoje
  useEffect(() => {
    if (!userId) return;
    
    const verificarReflexaoHoje = async () => {
      try {
        const { supabase } = await import('./supabase-client');
        const hoje = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('reflexoes_noturnas')
          .select('*')
          .eq('ketero_id', userId)
          .eq('data', hoje)
          .single();
        
        if (!error && data) {
          setReflexaoHoje(data);
        }
      } catch (err) {
        // Não fez reflexão hoje
        setReflexaoHoje(null);
      }
    };

    verificarReflexaoHoje();
  }, [userId]);

  // Sistema de notificação às 20h
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

  const salvarReflexao = async (respostas) => {
    if (!userId) return { success: false, error: 'Usuário não autenticado' };
    
    setCarregando(true);
    
    try {
      const { supabase } = await import('./supabase-client');
      const { analisarReflexaoComIA } = await import('./openai-client');
      
      // 1. Preparar dados da reflexão
      const reflexaoData = {
        ketero_id: userId,
        data: new Date().toISOString().split('T')[0],
        sentimentos_dia: respostas.sentimento_dia || '',
        paciencia_bondade: respostas.paciencia_bondade || '',
        mudaria_algo: respostas.mudaria_algo || '',
        // Campos adicionais para fase 2 e 3
        ...(respostas.micro_ato_executado && { micro_ato_executado: respostas.micro_ato_executado }),
        ...(respostas.desafio_disciplina && { desafio_disciplina: respostas.desafio_disciplina }),
        ...(respostas.gratidao_dia && { gratidao_dia: respostas.gratidao_dia }),
        ...(respostas.observacao_mudanca && { observacao_mudanca: respostas.observacao_mudanca }),
        ...(respostas.momento_consciencia && { momento_consciencia: respostas.momento_consciencia }),
        ...(respostas.padrao_observado && { padrao_observado: respostas.padrao_observado }),
        ...(respostas.impacto_outros && { impacto_outros: respostas.impacto_outros })
      };

      // 2. Análise IA em tempo real (opcional - não bloqueia salvamento)
      let analiseIA = null;
      let palavrasChave = [];
      let sentimentoDetectado = 'neutro';
      
      try {
        const textoCompleto = Object.values(respostas)
          .filter(v => typeof v === 'string')
          .join(' ');
        
        const resultado = await analisarReflexaoComIA(textoCompleto, faseAtual);
        
        if (resultado && !resultado.error) {
          analiseIA = resultado.analise;
          palavrasChave = resultado.palavrasChave || [];
          sentimentoDetectado = resultado.sentimento || 'neutro';
        }
      } catch (iaError) {
        console.log('Análise IA falhou, continuando sem análise:', iaError);
        // Não bloqueia o salvamento
      }

      // 3. Salvar no Supabase
      const { data, error } = await supabase
        .from('reflexoes_noturnas')
        .upsert([{
          ...reflexaoData,
          analise_ia: analiseIA,
          palavras_chave: palavrasChave,
          sentimento_detectado: sentimentoDetectado
        }], {
          onConflict: 'ketero_id,data',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) throw error;

      // 4. Atualizar contador de reflexões
      const { data: profile } = await supabase
        .from('keteros')
        .select('total_reflexoes')
        .eq('id', userId)
        .single();

      if (profile) {
        await supabase
          .from('keteros')
          .update({
            total_reflexoes: (profile.total_reflexoes || 0) + 1,
            ultimo_acesso: new Date().toISOString()
          })
          .eq('id', userId);
      }

      // 5. Atualizar estado
      setReflexaoHoje(data);
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
    }
  };

  return {
    mostrarModal,
    setMostrarModal,
    mostrarNotificacao,
    setMostrarNotificacao,
    reflexaoHoje,
    salvarReflexao,
    carregando,
    jaFezReflexaoHoje: !!reflexaoHoje
  };
};

// ================================================
// COMPONENTE: NotificacaoReflexao
// ================================================

export const NotificacaoReflexao = ({ onAbrir, onFechar, mostrar }) => {
  if (!mostrar) return null;

  return (
    <div className="fixed top-4 right-4 z-40 animate-slide-in">
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 border-2 border-purple-500 rounded-2xl p-4 shadow-2xl max-w-sm backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-purple-300 animate-bounce" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-purple-200 mb-1">Hora da Reflexão Noturna 🌙</h3>
            <p className="text-sm text-slate-300 mb-3">
              Reserve 5 minutos para refletir sobre seu dia
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={onAbrir}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Fazer Agora
              </button>
              <button
                onClick={onFechar}
                className="px-3 py-2 bg-slate-800/50 text-slate-400 rounded-lg hover:bg-slate-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

// ================================================
// COMPONENTE: ReflexaoWrapper (com análise IA)
// ================================================

export const ReflexaoWrapper = ({ fase, userId, onFechar, onSalvar }) => {
  const [analisando, setAnalisando] = useState(false);
  const [analiseResultado, setAnaliseResultado] = useState(null);

  const handleSalvar = async (reflexaoData) => {
    setAnalisando(true);
    
    const resultado = await onSalvar(reflexaoData);
    
    if (resultado.success && resultado.analiseIA) {
      setAnaliseResultado(resultado.analiseIA);
    }
    
    setAnalisando(false);
  };

  return (
    <>
      {!analiseResultado ? (
        <ReflexaoNoturna
          fase={fase}
          onSalvar={handleSalvar}
          onFechar={onFechar}
        />
      ) : (
        <AnaliseIAModal
          analise={analiseResultado}
          onFechar={onFechar}
        />
      )}

      {analisando && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60">
          <div className="bg-slate-900 rounded-2xl p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-purple-200 font-semibold">Analisando sua reflexão...</p>
            <p className="text-slate-400 text-sm mt-2">A IA está processando seus insights</p>
          </div>
        </div>
      )}
    </>
  );
};

// ================================================
// COMPONENTE: AnaliseIAModal
// ================================================

const AnaliseIAModal = ({ analise, onFechar }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl p-8 max-w-2xl w-full border border-purple-500/30 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
            <span className="text-4xl">✨</span>
          </div>
          <h2 className="text-2xl font-bold text-purple-200">Análise da sua Reflexão</h2>
          <p className="text-slate-400 text-sm mt-2">Insights gerados pela IA</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-700">
          <p className="text-slate-200 leading-relaxed whitespace-pre-line">
            {analise}
          </p>
        </div>

        <button
          onClick={onFechar}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all font-semibold"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

// ================================================
// HELPER: Analisar Reflexão com IA
// ================================================
// ⚠️ SECURITY WARNING: This function exposes the OpenAI API key in the browser
// This is acceptable ONLY for development/prototyping
// 
// TODO FOR PRODUCTION:
// 1. Move this to a Supabase Edge Function or serverless backend
// 2. Use environment variables on the server side
// 3. Implement rate limiting per user
// 4. Add authentication checks
// 
// See SETUP-REFLEXAO-NOTURNA.md for migration guide to Edge Functions

export const analisarReflexaoComIA = async (textoReflexao, faseAtual) => {
  try {
    const { default: OpenAI } = await import('openai');
    
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    const prompt = `Analise esta reflexão noturna de um usuário na Fase ${faseAtual} do KETER (evolução pessoal):

"${textoReflexao}"

Forneça:
1. Um feedback empático e construtivo (2-3 parágrafos)
2. Um insight sobre o estado emocional
3. Uma sugestão prática para amanhã

Mantenha tom encorajador mas honesto.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Você é um guia empático de evolução pessoal. Forneça feedback construtivo e encorajador.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const analise = completion.choices[0].message.content;

    // Detectar palavras-chave e sentimento básico
    const palavrasChave = extrairPalavrasChave(textoReflexao);
    const sentimento = detectarSentimento(textoReflexao);

    return {
      analise,
      palavrasChave,
      sentimento,
      error: null
    };
  } catch (error) {
    console.error('Erro na análise IA:', error);
    return {
      analise: null,
      palavrasChave: [],
      sentimento: 'neutro',
      error: error.message
    };
  }
};

// ================================================
// HELPERS: Análise Local (fallback)
// ================================================

const extrairPalavrasChave = (texto) => {
  const palavrasPositivas = ['feliz', 'grato', 'bem', 'melhor', 'progresso', 'sucesso', 'alegre'];
  const palavrasNegativas = ['triste', 'difícil', 'problema', 'frustrado', 'cansado', 'ansioso'];
  
  const textoLower = texto.toLowerCase();
  const palavras = [];
  
  palavrasPositivas.forEach(p => {
    if (textoLower.includes(p)) palavras.push(p);
  });
  
  palavrasNegativas.forEach(p => {
    if (textoLower.includes(p)) palavras.push(p);
  });
  
  return palavras.slice(0, 5);
};

const detectarSentimento = (texto) => {
  const textoLower = texto.toLowerCase();
  
  const positivas = ['feliz', 'grato', 'bem', 'melhor', 'ótimo', 'bom', 'alegre'];
  const negativas = ['triste', 'mal', 'difícil', 'ruim', 'frustrado', 'cansado'];
  
  let scorePositivo = 0;
  let scoreNegativo = 0;
  
  positivas.forEach(p => {
    if (textoLower.includes(p)) scorePositivo++;
  });
  
  negativas.forEach(p => {
    if (textoLower.includes(p)) scoreNegativo++;
  });
  
  if (scorePositivo > scoreNegativo) return 'positivo';
  if (scoreNegativo > scorePositivo) return 'negativo';
  return 'neutro';
};
