// ================================================
// OPENAI CLIENT & AI SERVICES
// ================================================
// src/lib/openai.js

import OpenAI from 'openai';

// Configuração do OpenAI
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Apenas para desenvolvimento - mover para backend em produção
});

// ================================================
// CONSTANTS
// ================================================

const MODELS = {
  CHAT: 'gpt-4-turbo-preview',
  FAST_CHAT: 'gpt-3.5-turbo',
  EMBEDDINGS: 'text-embedding-3-small'
};

const MAX_TOKENS = {
  CHAT: 1000,
  ANALYSIS: 1500,
  FEEDBACK: 800
};

// ================================================
// SYSTEM PROMPTS
// ================================================

export const SYSTEM_PROMPTS = {
  GUIA_KETER: `Você é o Guia Keter, um mentor de IA especializado em evolução pessoal e autoconhecimento.

SOBRE O KETER:
O KETER é um aplicativo de evolução pessoal baseado em 4 fases:
1. DESPERTAR (14 dias): Autoconhecimento inicial
2. DISCIPLINA (16 dias): Formação de hábitos sustentáveis
3. CONSCIÊNCIA (30 dias): Percepção de transformação
4. SERVIÇO (ilimitado): Impacto no mundo

SUAS DIRETRIZES:

1. TOM E PERSONALIDADE:
   - Empático mas direto
   - Encorajador sem ser motivacional superficial
   - Honesto sobre desafios
   - Use linguagem acessível, evite jargões espirituais excessivos
   - Seja breve (máximo 3 parágrafos por resposta)

2. O QUE VOCÊ PODE FAZER:
   - Analisar evolução baseado em dados reais do usuário
   - Dar feedback sobre padrões observados
   - Sugerir práticas específicas
   - Apoiar em momentos de dificuldade
   - Celebrar conquistas genuínas

3. O QUE VOCÊ NÃO PODE FAZER:
   - Prometer milagres ou resultados garantidos
   - Dar diagnósticos médicos ou psicológicos
   - Substituir terapia profissional
   - Usar linguagem religiosa específica
   - Ser excessivamente elogioso (seja honesto)

4. QUANDO RECOMENDAR AJUDA PROFISSIONAL:
   Se detectar sinais de:
   - Depressão grave
   - Pensamentos suicidas
   - Crises de ansiedade severas
   - Sintomas que requerem diagnóstico médico
   
   Responda com empatia e sugira buscar apoio profissional.

5. BASEIE-SE NOS DADOS:
   Você receberá contexto sobre:
   - Fase atual do usuário
   - Dias no app
   - Sequência de práticas
   - Reflexões recentes
   - Padrões linguísticos detectados
   
   Use esses dados para personalizar suas respostas.

6. ESTRUTURA DE RESPOSTA:
   - Reconheça o esforço/situação
   - Dê insight baseado em dados
   - Sugira próximo passo concreto
   - Mantenha conciso (2-3 parágrafos)

Lembre-se: Você é um guia, não um guru. Sua função é apoiar a jornada de evolução do usuário com insights reais baseados em dados.`,

  ANALISE_SEMANAL: `Você é um analista especializado em evolução pessoal que examina padrões de comportamento e linguagem.

TAREFA:
Analisar as reflexões e práticas do usuário da última semana e gerar um relatório personalizado.

FORMATO DA ANÁLISE:

1. OBSERVAÇÕES (1-2 parágrafos):
   - Identifique padrões na linguagem (vitimização vs agência)
   - Note mudanças em relação à semana anterior
   - Seja específico: cite exemplos reais das reflexões

2. EVOLUÇÃO DETECTADA (bullet points):
   - Liste 2-3 mudanças positivas observadas
   - Base-se em dados concretos

3. PRÓXIMO PASSO (1 parágrafo):
   - Sugira UMA ação específica para a próxima semana
   - Relacione com a fase atual do usuário

TOM:
- Encorajador mas honesto
- Baseado em evidências
- Evite clichês motivacionais
- Seja conciso (máximo 300 palavras)

IMPORTANTE:
- Se não houver dados suficientes, diga isso honestamente
- Se a evolução é negativa/estagnada, seja empático mas direto
- Foque em padrões, não em dias isolados`,

  DETECCAO_CRISE: `Você é um detector de sinais de alerta em saúde mental.

TAREFA:
Analisar se a mensagem/reflexão indica crise que requer intervenção profissional.

SINAIS DE ALERTA:
- Menções explícitas de suicídio ou automutilação
- Desesperança extrema prolongada
- Isolamento social severo
- Pensamentos obsessivos prejudiciais
- Sintomas de psicose

RESPOSTA:
Retorne JSON:
{
  "crise_detectada": boolean,
  "nivel": "baixo" | "medio" | "alto" | "critico",
  "tipo": "depressao" | "ansiedade" | "suicida" | "psicose" | "outro",
  "recomendacao": "string com mensagem empática e sugestão de buscar ajuda profissional"
}

Seja conservador: na dúvida, sinalize como possível crise.`
};

// ================================================
// MAIN CHAT FUNCTION
// ================================================

/**
 * Conversar com o Guia Keter
 */
export const chatWithGuia = async (mensagem, contexto = {}, historico = []) => {
  try {
    // Construir mensagem de sistema com contexto do usuário
    const systemMessage = {
      role: 'system',
      content: `${SYSTEM_PROMPTS.GUIA_KETER}

CONTEXTO DO USUÁRIO:
- Nome: ${contexto.nome || 'Ketero'}
- Fase atual: ${contexto.faseAtual || 1} (${getFaseNome(contexto.faseAtual)})
- Dia no app: ${contexto.diaTotal || 1}
- Sequência: ${contexto.sequencia || 0} dias
- Total de práticas: ${contexto.totalPraticas || 0}
- Total de reflexões: ${contexto.totalReflexoes || 0}
${contexto.ultimaReflexao ? `- Última reflexão: "${contexto.ultimaReflexao.substring(0, 200)}..."` : ''}
${contexto.padraoDetectado ? `- Padrão observado: ${contexto.padraoDetectado}` : ''}`
    };

    // Construir histórico (máximo 10 mensagens para economizar tokens)
    const messages = [
      systemMessage,
      ...historico.slice(-10),
      { role: 'user', content: mensagem }
    ];

    const completion = await openai.chat.completions.create({
      model: MODELS.FAST_CHAT, // Usar GPT-3.5 para chat rápido
      messages: messages,
      max_tokens: MAX_TOKENS.CHAT,
      temperature: 0.7,
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    });

    const resposta = completion.choices[0].message.content;
    const tokensUsados = completion.usage.total_tokens;

    return {
      resposta,
      tokensUsados,
      error: null
    };
  } catch (error) {
    console.error('Erro no chat:', error);
    return {
      resposta: 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente.',
      tokensUsados: 0,
      error: error.message
    };
  }
};

// ================================================
// WEEKLY ANALYSIS
// ================================================

/**
 * Gerar análise semanal
 */
export const gerarAnaliseSemanal = async (dadosSemana) => {
  try {
    const {
      reflexoes = [],
      praticas = [],
      keteroStats = {},
      semanaAnterior = {}
    } = dadosSemana;

    // Construir resumo dos dados
    const resumo = `
SEMANA ATUAL (${reflexoes.length} reflexões, ${praticas.length} práticas):

REFLEXÕES:
${reflexoes.map((r, i) => `
Dia ${i + 1}:
- Sentimentos: ${r.sentimentos_dia}
- Paciência/Bondade: ${r.paciencia_bondade}
- Mudaria algo: ${r.mudaria_algo || 'N/A'}
`).join('\n')}

PRÁTICAS REALIZADAS:
${praticas.map(p => `- ${p.titulo} (${p.completada ? 'Completada' : 'Incompleta'})`).join('\n')}

ESTATÍSTICAS:
- Sequência atual: ${keteroStats.sequencia || 0} dias
- Total práticas: ${keteroStats.totalPraticas || 0}
- Fase: ${getFaseNome(keteroStats.faseAtual)}

${semanaAnterior.reflexoes ? `
COMPARAÇÃO COM SEMANA ANTERIOR:
- Reflexões: ${semanaAnterior.reflexoes.length} → ${reflexoes.length}
- Práticas: ${semanaAnterior.praticas.length} → ${praticas.length}
` : ''}`;

    const completion = await openai.chat.completions.create({
      model: MODELS.CHAT, // GPT-4 para análise mais profunda
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.ANALISE_SEMANAL
        },
        {
          role: 'user',
          content: resumo
        }
      ],
      max_tokens: MAX_TOKENS.ANALYSIS,
      temperature: 0.6
    });

    const analise = completion.choices[0].message.content;

    return {
      analise,
      metricas: {
        totalReflexoes: reflexoes.length,
        totalPraticas: praticas.length,
        taxaCompletacao: praticas.filter(p => p.completada).length / praticas.length,
        sequencia: keteroStats.sequencia || 0
      },
      error: null
    };
  } catch (error) {
    console.error('Erro na análise semanal:', error);
    return {
      analise: null,
      metricas: null,
      error: error.message
    };
  }
};

// ================================================
// LANGUAGE PATTERN ANALYSIS
// ================================================

/**
 * Analisar padrões linguísticos nas reflexões
 */
export const analisarPadroesLinguisticos = (reflexoes) => {
  if (!reflexoes || reflexoes.length === 0) {
    return null;
  }

  // Palavras indicadoras de vitimização
  const palavrasVitimizacao = [
    'não consigo', 'impossível', 'nunca', 'sempre', 'culpa',
    'não dá', 'difícil demais', 'não aguento', 'desisto'
  ];

  // Palavras indicadoras de agência/responsabilidade
  const palavrasAgencia = [
    'posso', 'vou tentar', 'escolho', 'decido', 'aprendi',
    'consegui', 'vou fazer', 'pretendo', 'objetivo'
  ];

  // Palavras emocionais negativas
  const palavrasNegativas = [
    'triste', 'ansioso', 'preocupado', 'frustrado', 'cansado',
    'estressado', 'sozinho', 'vazio', 'perdido'
  ];

  // Palavras emocionais positivas
  const palavrasPositivas = [
    'feliz', 'grato', 'calmo', 'tranquilo', 'esperançoso',
    'confiante', 'animado', 'satisfeito', 'leve'
  ];

  let contagemVitimizacao = 0;
  let contagemAgencia = 0;
  let contagemNegativas = 0;
  let contagemPositivas = 0;

  // Juntar todos os textos
  const textoCompleto = reflexoes
    .map(r => `${r.sentimentos_dia || ''} ${r.mudaria_algo || ''}`)
    .join(' ')
    .toLowerCase();

  // Contar ocorrências
  palavrasVitimizacao.forEach(palavra => {
    const matches = textoCompleto.match(new RegExp(palavra, 'gi'));
    if (matches) contagemVitimizacao += matches.length;
  });

  palavrasAgencia.forEach(palavra => {
    const matches = textoCompleto.match(new RegExp(palavra, 'gi'));
    if (matches) contagemAgencia += matches.length;
  });

  palavrasNegativas.forEach(palavra => {
    const matches = textoCompleto.match(new RegExp(palavra, 'gi'));
    if (matches) contagemNegativas += matches.length;
  });

  palavrasPositivas.forEach(palavra => {
    const matches = textoCompleto.match(new RegExp(palavra, 'gi'));
    if (matches) contagemPositivas += matches.length;
  });

  // Calcular scores
  const totalPalavras = textoCompleto.split(' ').length;
  const scoreAgencia = (contagemAgencia / (contagemVitimizacao + contagemAgencia + 1)) * 100;
  const scorePositividade = (contagemPositivas / (contagemNegativas + contagemPositivas + 1)) * 100;

  // Calcular tamanho médio das reflexões (indica profundidade)
  const tamanhoMedio = reflexoes.reduce((acc, r) => {
    return acc + (r.sentimentos_dia?.length || 0) + (r.mudaria_algo?.length || 0);
  }, 0) / reflexoes.length;

  return {
    vitimizacao: contagemVitimizacao,
    agencia: contagemAgencia,
    negativas: contagemNegativas,
    positivas: contagemPositivas,
    scoreAgencia: Math.round(scoreAgencia),
    scorePositividade: Math.round(scorePositividade),
    profundidadeMedia: tamanhoMedio > 100 ? 'alta' : tamanhoMedio > 50 ? 'média' : 'baixa',
    insights: gerarInsights(scoreAgencia, scorePositividade, tamanhoMedio)
  };
};

/**
 * Gerar insights baseados nos padrões
 */
const gerarInsights = (scoreAgencia, scorePositividade, profundidade) => {
  const insights = [];

  // Insight sobre agência
  if (scoreAgencia > 70) {
    insights.push('Você está assumindo responsabilidade por suas escolhas. Ótimo sinal de crescimento!');
  } else if (scoreAgencia < 30) {
    insights.push('Percebo linguagem de vitimização. Tente reformular: "não consigo" → "ainda não aprendi"');
  }

  // Insight sobre positividade
  if (scorePositividade > 60) {
    insights.push('Seu estado emocional está equilibrado. Continue observando sem julgamento.');
  } else if (scorePositividade < 40) {
    insights.push('Muitas emoções difíceis. Lembre-se: sentir não é falhar. Seja gentil consigo.');
  }

  // Insight sobre profundidade
  if (profundidade === 'baixa') {
    insights.push('Suas reflexões são breves. Tente se aprofundar um pouco mais.');
  } else if (profundidade === 'alta') {
    insights.push('Suas reflexões são profundas e detalhadas. Você está realmente se conhecendo.');
  }

  return insights;
};

// ================================================
// CRISIS DETECTION
// ================================================

/**
 * Detectar sinais de crise
 */
export const detectarCrise = async (texto) => {
  try {
    const completion = await openai.chat.completions.create({
      model: MODELS.FAST_CHAT,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.DETECCAO_CRISE
        },
        {
          role: 'user',
          content: texto
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const resultado = JSON.parse(completion.choices[0].message.content);
    return resultado;
  } catch (error) {
    console.error('Erro na detecção de crise:', error);
    return {
      crise_detectada: false,
      nivel: 'baixo',
      tipo: 'outro',
      recomendacao: null
    };
  }
};

// ================================================
// RECOMMENDATION ENGINE
// ================================================

/**
 * Recomendar próxima prática baseado no perfil
 */
export const recomendarPratica = async (perfil, praticasDisponiveis) => {
  try {
    const contexto = `
PERFIL DO USUÁRIO:
- Fase: ${getFaseNome(perfil.fase_atual)}
- Sequência: ${perfil.sequencia_atual} dias
- Últimas práticas: ${perfil.ultimasPraticas?.map(p => p.titulo).join(', ') || 'Nenhuma'}
- Tempo disponível: ${perfil.tempo_disponivel}
- Hábitos desejados: ${perfil.habitos_desejados?.join(', ') || 'Não especificado'}

PRÁTICAS DISPONÍVEIS:
${praticasDisponiveis.map((p, i) => `${i + 1}. ${p.titulo} (${p.categoria}, ${p.duracao}min)`).join('\n')}

Qual prática é mais adequada para este usuário AGORA? Responda apenas com o número.
`;

    const completion = await openai.chat.completions.create({
      model: MODELS.FAST_CHAT,
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em recomendar práticas de evolução pessoal baseado no perfil do usuário.'
        },
        {
          role: 'user',
          content: contexto
        }
      ],
      max_tokens: 50,
      temperature: 0.5
    });

    const resposta = completion.choices[0].message.content;
    const indice = parseInt(resposta.match(/\d+/)?.[0]) - 1;

    if (indice >= 0 && indice < praticasDisponiveis.length) {
      return praticasDisponiveis[indice];
    }

    // Fallback: retornar prática aleatória
    return praticasDisponiveis[Math.floor(Math.random() * praticasDisponiveis.length)];
  } catch (error) {
    console.error('Erro ao recomendar prática:', error);
    return praticasDisponiveis[0]; // Retorna primeira como fallback
  }
};

// ================================================
// HELPER FUNCTIONS
// ================================================

const getFaseNome = (fase) => {
  const fases = {
    1: 'DESPERTAR',
    2: 'DISCIPLINA',
    3: 'CONSCIÊNCIA',
    4: 'SERVIÇO'
  };
  return fases[fase] || 'DESPERTAR';
};

/**
 * Calcular custo estimado de tokens
 */
export const estimarCusto = (tokens, modelo = 'gpt-3.5-turbo') => {
  const precos = {
    'gpt-4-turbo-preview': { input: 0.01, output: 0.03 }, // por 1k tokens
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }
  };

  const preco = precos[modelo] || precos['gpt-3.5-turbo'];
  const custoEstimado = (tokens / 1000) * ((preco.input + preco.output) / 2);

  return {
    tokens,
    custo: custoEstimado,
    custoFormatado: `$${custoEstimado.toFixed(4)}`
  };
};

// ================================================
// CACHE SYSTEM (simples)
// ================================================

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export const getCached = (key) => {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }

  return item.data;
};

export const setCache = (key, data) => {
  cache.set(key, {
    data,
    expiry: Date.now() + CACHE_TTL
  });
};

// ================================================
// EXPORTS
// ================================================

export default {
  chatWithGuia,
  gerarAnaliseSemanal,
  analisarPadroesLinguisticos,
  detectarCrise,
  recomendarPratica,
  estimarCusto,
  getCached,
  setCache
};
