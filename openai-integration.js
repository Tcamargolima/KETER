// ==================== OPENAI INTEGRATION ====================
// Sistema completo de IA para KETER

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Apenas para desenvolvimento - em produção use backend
});

// ==================== SYSTEM PROMPTS ====================

export const SYSTEM_PROMPTS = {
  guia_keter: `Você é o Guia Keter, um mentor de IA especializado em evolução pessoal e autoconhecimento.

CONTEXTO DO KETER:
- KETER é uma plataforma de evolução pessoal baseada em 4 fases: Despertar, Disciplina, Consciência e Serviço
- Combina práticas de meditação, reflexão diária e micro-atos de bondade
- Fundamentado em Espiritismo Kardecista, Cabala, ciência moderna e filosofias orientais
- Totalmente gratuito, sem gurus, focado em evolução real

SEU PAPEL:
- Ser empático, mas direto e honesto
- Basear-se sempre nos dados reais do usuário (práticas, reflexões, padrões)
- Não fazer promessas vazias ou garantir resultados
- Incentivar prática consistente, não dependência do chat
- Usar linguagem simples e acessível, evitando jargões espirituais excessivos
- Ser breve (máximo 3-4 parágrafos por resposta)

DIRETRIZES:
✅ SEMPRE:
- Conectar com os dados observáveis do usuário
- Apontar evolução específica quando percebida
- Sugerir próxima ação prática concreta
- Reconhecer esforço e progresso, mesmo pequeno
- Validar sentimentos e dificuldades

❌ NUNCA:
- Prometer curas ou milagres
- Dar diagnósticos médicos ou psicológicos
- Substituir terapia profissional
- Usar linguagem religiosa dogmática específica
- Fazer o usuário sentir-se culpado por falhas

CRISES EMOCIONAIS:
Se detectar sinais de:
- Ideação suicida
- Auto-mutilação
- Psicose ou desconexão da realidade
- Depressão severa
→ Gentilmente sugira buscar ajuda profissional imediata (psicólogo, psiquiatra, CVV 188)

TOM:
- Compassivo mas realista
- Sábio mas humilde
- Encorajador mas honesto
- Como um amigo sábio que te conhece há anos`,

  analise_semanal: `Você é um analista especializado em evolução pessoal que examina padrões de linguagem e comportamento.

TAREFA:
Analisar as reflexões noturnas da última semana e identificar mudanças significativas.

MÉTODO DE ANÁLISE:
1. ANÁLISE LINGUÍSTICA:
   - Palavras de vitimização (diminuíram ou aumentaram?): "não consigo", "impossível", "nunca", "culpa"
   - Palavras de agência (aumentaram?): "posso", "escolho", "vou tentar", "aprendi", "decidi"
   - Tom emocional (melhorou, piorou, estável?)
   - Profundidade das reflexões (superficial → profundo?)

2. PADRÕES COMPORTAMENTAIS:
   - Consistência nas práticas
   - Execução de micro-atos
   - Nível de autocompaixão vs autocrítica

3. MUDANÇAS OBSERVÁVEIS:
   - Compare semana atual com semana anterior
   - Identifique pelo menos 1 mudança específica (pode ser sutil)
   - Se nenhuma mudança clara, reconheça o esforço de manter consistência

FORMATO DA RESPOSTA:
{
  "nivel_evolucao": "ALTA_EVOLUCAO" | "EVOLUCAO_MODERADA" | "ESTAVEL" | "DIFICULDADES",
  "mudancas_observadas": ["mudança 1", "mudança 2"],
  "padroes_linguisticos": {
    "vitimizacao": "diminuiu 40%",
    "agencia": "aumentou 60%",
    "tom_emocional": "mais equilibrado"
  },
  "mensagem_feedback": "2-3 parágrafos personalizados reconhecendo evolução e encorajando próximos passos",
  "proximo_passo": "sugestão concreta de ação"
}

SEJA:
- Específico (cite exemplos das reflexões)
- Honesto (não exagere mudanças inexistentes)
- Encorajador (mesmo se evolução for pequena)`,

  deteccao_crise: `Você é um sistema de detecção de crises emocionais.

TAREFA: Analisar texto do usuário e detectar sinais de crise que requerem intervenção profissional.

SINAIS DE ALERTA GRAVE (requer recomendação de ajuda profissional):
- Menção explícita ou implícita de suicídio
- Descrição de planos de auto-mutilação
- Desconexão da realidade (alucinações, delírios)
- Desesperança extrema persistente
- Isolamento social severo
- Abuso de substâncias mencionado

SINAIS DE ALERTA MODERADO (requer suporte extra mas não urgente):
- Tristeza profunda persistente
- Ansiedade paralisante
- Perda de interesse em tudo
- Alterações graves de sono/apetite
- Autocrítica destrutiva severa

FORMATO RESPOSTA:
{
  "nivel_alerta": "GRAVE" | "MODERADO" | "NORMAL",
  "sinais_detectados": ["sinal 1", "sinal 2"],
  "recomendacao": "texto de resposta empática + orientação para buscar ajuda se grave"
}

IMPORTANTE:
- Seja sensível e não alarmista
- Sempre valide os sentimentos
- Nunca diagnostique
- Encoraje buscar profissional quando necessário`,

  analise_padrao_reflexoes: `Analise o conjunto de reflexões e identifique padrões recorrentes.

BUSQUE:
1. TEMAS RECORRENTES: O que o usuário menciona repetidamente?
2. GATILHOS EMOCIONAIS: O que desencadeia reações fortes?
3. VALORES CENTRAIS: O que parece importar mais para essa pessoa?
4. CONFLITOS INTERNOS: Há contradições entre o que diz querer e como age?
5. ÁREAS DE CRESCIMENTO: Onde há progresso visível?

FORMATO:
{
  "temas_recorrentes": ["tema 1", "tema 2", "tema 3"],
  "principais_desafios": ["desafio 1", "desafio 2"],
  "valores_observados": ["valor 1", "valor 2"],
  "areas_crescimento": ["área 1", "área 2"],
  "sugestoes_praticas": ["sugestão 1", "sugestão 2"]
}

Seja compassivo e construtivo.`
};

// ==================== FUNÇÕES DE IA ====================

export const aiService = {
  /**
   * Chat com o Guia Keter
   */
  async chatGuia(mensagemUsuario, contextoKetero, historicoMensagens = []) {
    try {
      const contexto = `
DADOS DO KETERO:
- Nome: ${contextoKetero.nome}
- Fase atual: ${contextoKetero.fase_atual} (${['Despertar', 'Disciplina', 'Consciência', 'Serviço'][contextoKetero.fase_atual - 1]})
- Dias no sistema: ${contextoKetero.dia_total || 0}
- Sequência atual: ${contextoKetero.sequencia_atual} dias
- Total de práticas: ${contextoKetero.total_praticas}
- Última prática: ${contextoKetero.ultima_pratica || 'ainda não fez hoje'}
${contextoKetero.padrao_recente ? `- Padrão observado: ${contextoKetero.padrao_recente}` : ''}
`;

      const messages = [
        { role: 'system', content: SYSTEM_PROMPTS.guia_keter + '\n\n' + contexto },
        ...historicoMensagens,
        { role: 'user', content: mensagemUsuario }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        max_tokens: 500,
        temperature: 0.7
      });

      return {
        mensagem: response.choices[0].message.content,
        tokens: response.usage.total_tokens
      };
    } catch (error) {
      console.error('Erro no chat:', error);
      // Fallback response
      return {
        mensagem: 'Desculpe, tive um problema técnico. Mas estou aqui. Como posso ajudar?',
        tokens: 0,
        erro: true
      };
    }
  },

  /**
   * Análise semanal de reflexões
   */
  async analisarReflexoesSemanal(reflexoes, ketero) {
    try {
      const reflexoesTexto = reflexoes.map((r, i) => 
        `DIA ${i + 1} (${new Date(r.data).toLocaleDateString('pt-BR')}):\n${JSON.stringify(r.respostas, null, 2)}`
      ).join('\n\n');

      const prompt = `Analise estas reflexões da última semana:

${reflexoesTexto}

DADOS DO KETERO:
- Fase: ${ketero.fase_atual}
- Total práticas: ${ketero.total_praticas}
- Sequência: ${ketero.sequencia_atual} dias

Forneça análise no formato JSON solicitado.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS.analise_semanal },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.5,
        response_format: { type: 'json_object' }
      });

      const analise = JSON.parse(response.choices[0].message.content);
      return {
        ...analise,
        tokens: response.usage.total_tokens
      };
    } catch (error) {
      console.error('Erro na análise semanal:', error);
      return {
        nivel_evolucao: 'ESTAVEL',
        mensagem_feedback: 'Continue praticando. A consistência é o caminho.',
        proximo_passo: 'Mantenha sua rotina diária.',
        tokens: 0,
        erro: true
      };
    }
  },

  /**
   * Detecção de crise emocional
   */
  async detectarCrise(textoReflexao) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS.deteccao_crise },
          { role: 'user', content: `Analise este texto:\n\n${textoReflexao}` }
        ],
        max_tokens: 300,
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Erro na detecção de crise:', error);
      return {
        nivel_alerta: 'NORMAL',
        sinais_detectados: [],
        recomendacao: null
      };
    }
  },

  /**
   * Análise de padrões de longo prazo
   */
  async analisarPadroesGerais(reflexoes, ketero) {
    try {
      const reflexoesTexto = reflexoes.slice(0, 30).map((r, i) => 
        `${new Date(r.data).toLocaleDateString('pt-BR')}: ${JSON.stringify(r.respostas)}`
      ).join('\n');

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS.analise_padrao_reflexoes },
          { role: 'user', content: `Analise estas reflexões:\n\n${reflexoesTexto}` }
        ],
        max_tokens: 600,
        temperature: 0.5,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Erro na análise de padrões:', error);
      return {
        temas_recorrentes: [],
        principais_desafios: [],
        valores_observados: [],
        areas_crescimento: [],
        sugestoes_praticas: []
      };
    }
  },

  /**
   * Gerar mapa Keter inicial (numerologia + análise)
   */
  async gerarMapaInicial(dadosOnboarding, userData) {
    try {
      const prompt = `Com base nestes dados, gere um mapa inicial de evolução pessoal:

AVALIAÇÃO:
- Sentimento geral: ${dadosOnboarding.sentimento}/10
- Incomoda: ${dadosOnboarding.incomodo}
- Hábitos desejados: ${dadosOnboarding.habitos.join(', ')}
- Tempo disponível: ${dadosOnboarding.tempo}
- Busca: ${dadosOnboarding.busca.join(', ')}

${userData.dataNascimento ? `Data nascimento: ${userData.dataNascimento}` : ''}
${userData.nomeCompleto ? `Nome: ${userData.nomeCompleto}` : ''}

Gere JSON com:
{
  "pontos_fortes": ["força 1", "força 2", "força 3"],
  "areas_desenvolvimento": ["área 1", "área 2"],
  "foco_inicial": "texto personalizado sobre onde focar nos próximos 30 dias",
  "numerologia": {
    "caminho_vida": "número e significado (se data disponível)",
    "missao_alma": "interpretação"
  },
  "recomendacoes_praticas": ["prática 1", "prática 2"]
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'Você é um analista de evolução pessoal especializado em criar mapas iniciais personalizados.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Erro ao gerar mapa:', error);
      return {
        pontos_fortes: ['Abertura para mudança', 'Busca por autoconhecimento'],
        areas_desenvolvimento: ['Criar consistência', 'Desenvolver disciplina'],
        foco_inicial: 'Nos próximos 30 dias, foque em criar o hábito de prática diária.',
        recomendacoes_praticas: ['Respiração consciente', 'Gratidão diária']
      };
    }
  },

  /**
   * Sugerir próxima prática baseada em contexto
   */
  async sugerirProximaPratica(ketero, historicoReflexoes) {
    try {
      const ultimasReflexoes = historicoReflexoes.slice(0, 3).map(r => 
        JSON.stringify(r.respostas)
      ).join('\n');

      const prompt = `Com base no histórico do ketero, sugira a próxima prática ideal:

KETERO:
- Fase: ${ketero.fase_atual}
- Dias: ${ketero.dia_total}
- Últimas reflexões: ${ultimasReflexoes}

PRÁTICAS DISPONÍVEIS: Respiração, Meditação, Gratidão, Perdão, Auto-compaixão, Body Scan, Presença

Responda JSON:
{
  "pratica_sugerida": "nome da prática",
  "razao": "por que essa prática agora",
  "foco": "em que focar durante a prática"
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você sugere práticas personalizadas de meditação e autoconhecimento.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Erro ao sugerir prática:', error);
      return {
        pratica_sugerida: 'Respiração Consciente',
        razao: 'É sempre um bom começo',
        foco: 'Ancorar-se no presente'
      };
    }
  }
};

// ==================== ANÁLISE DE LINGUAGEM (LOCAL) ====================

export const analiseLocal = {
  /**
   * Conta palavras de vitimização vs agência
   */
  analisarPadroesLinguisticos(textos) {
    const palavrasVitimizacao = ['não consigo', 'impossível', 'nunca', 'culpa', 'não posso', 'incapaz'];
    const palavrasAgencia = ['posso', 'escolho', 'vou tentar', 'aprendi', 'decidi', 'vou fazer'];

    let contagemVitimizacao = 0;
    let contagemAgencia = 0;

    textos.forEach(texto => {
      const textoLower = texto.toLowerCase();
      palavrasVitimizacao.forEach(palavra => {
        if (textoLower.includes(palavra)) contagemVitimizacao++;
      });
      palavrasAgencia.forEach(palavra => {
        if (textoLower.includes(palavra)) contagemAgencia++;
      });
    });

    return {
      vitimizacao: contagemVitimizacao,
      agencia: contagemAgencia,
      ratio: contagemAgencia / Math.max(contagemVitimizacao, 1),
      tendencia: contagemAgencia > contagemVitimizacao ? 'positiva' : 'atencao'
    };
  },

  /**
   * Detecta profundidade da reflexão
   */
  calcularProfundidade(texto) {
    const tamanho = texto.length;
    const palavrasEmocionais = ['sinto', 'percebo', 'aprendi', 'descobri', 'entendo', 'reconheço'];
    const contagemEmocional = palavrasEmocionais.filter(p => 
      texto.toLowerCase().includes(p)
    ).length;

    // Score 1-10
    let score = 0;
    if (tamanho > 200) score += 3;
    else if (tamanho > 100) score += 2;
    else score += 1;

    score += Math.min(contagemEmocional * 2, 5);

    if (texto.includes('porque') || texto.includes('pois')) score += 2;

    return Math.min(score, 10);
  },

  /**
   * Compara duas semanas de reflexões
   */
  compararPeriodos(reflexoesAntes, reflexoesDepois) {
    const textosAntes = reflexoesAntes.map(r => 
      Object.values(r.respostas).join(' ')
    );
    const textosDepois = reflexoesDepois.map(r => 
      Object.values(r.respostas).join(' ')
    );

    const padraoAntes = this.analisarPadroesLinguisticos(textosAntes);
    const padraoDepois = this.analisarPadroesLinguisticos(textosDepois);

    const profundidadeAntes = textosAntes.reduce((acc, t) => 
      acc + this.calcularProfundidade(t), 0
    ) / textosAntes.length;

    const profundidadeDepois = textosDepois.reduce((acc, t) => 
      acc + this.calcularProfundidade(t), 0
    ) / textosDepois.length;

    return {
      mudanca_vitimizacao: ((padraoAntes.vitimizacao - padraoDepois.vitimizacao) / Math.max(padraoAntes.vitimizacao, 1)) * 100,
      mudanca_agencia: ((padraoDepois.agencia - padraoAntes.agencia) / Math.max(padraoAntes.agencia, 1)) * 100,
      mudanca_profundidade: profundidadeDepois - profundidadeAntes,
      evolucao_detectada: padraoDepois.ratio > padraoAntes.ratio && profundidadeDepois > profundidadeAntes
    };
  }
};

// ==================== RESPOSTAS RÁPIDAS PRÉ-PROGRAMADAS ====================

export const respostasRapidas = {
  'como estou evoluindo': (ketero) => `
Vejo que você está há ${ketero.dia_total || 0} dias no KETER e já completou ${ketero.total_praticas} práticas. 

${ketero.sequencia_atual > 0 ? `Sua sequência de ${ketero.sequencia_atual} dias mostra comprometimento real.` : 'Mantenha a consistência para ver mudanças mais profundas.'}

${ketero.total_praticas > 7 ? 'Você já passou da inércia inicial - agora é criar o hábito.' : 'Cada prática conta. Continue!'}
`,

  'estou com dificuldade': () => `
É completamente normal ter dificuldades. Evolução não é linear.

Algumas sugestões:
1. Se esquece de praticar → Configure notificações ou escolha um "gatilho" (ex: depois do café)
2. Se não sente mudanças → Mudanças reais são sutis no início. Continue observando.
3. Se está desmotivado → Lembre por que começou. Releia suas primeiras reflexões.

O que especificamente está difícil para você?
`,

  'preciso de motivação': (ketero) => `
Motivação vem e vai. Disciplina permanece.

Você já provou que é capaz - está aqui há ${ketero.dia_total || 0} dias. Isso não é acidente.

Não espere motivação para praticar. Pratique e a motivação vem depois.

Apenas 5 minutos hoje. Você consegue.
`,

  'quero mudar rotina': () => `
Ótimo! Flexibilidade é importante.

O que você gostaria de ajustar?
- Horário das práticas?
- Tipo de práticas?
- Duração?
- Foco das reflexões?

Me conte e eu te ajudo a adaptar sua rotina.
`
};
