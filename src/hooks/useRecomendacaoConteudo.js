// ================================================
// HOOK: useRecomendacaoConteudo
// ================================================
// Hook para recomendações de conteúdo educacional baseadas em IA

import { useState, useEffect } from 'react';
import { chatWithGuia } from '../lib/openai';
import { supabase } from '../lib/supabase';
import { isValidUUID } from '../lib/utils';

/**
 * Hook para recomendação de conteúdo educacional por IA
 * @param {string} userId - ID do usuário
 */
export const useRecomendacaoConteudo = (userId) => {
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // ================================================
  // FUNCTION: Gerar recomendações com IA
  // ================================================
  const gerarRecomendacoes = async (contexto = {}) => {
    if (!userId) {
      setErro('Usuário não autenticado');
      return { data: null, error: 'Usuário não autenticado' };
    }

    // Validar UUID antes de fazer query
    if (!isValidUUID(userId)) {
      console.error('UUID inválido em useRecomendacaoConteudo:', userId);
      setErro('ID de usuário inválido');
      return { data: null, error: 'ID de usuário inválido' };
    }

    try {
      setCarregando(true);
      setErro(null);

      // 1. Buscar contexto do usuário
      const { data: ketero } = await supabase
        .from('keteros')
        .select('*')
        .eq('id', userId)
        .single();

      // 2. Buscar reflexões recentes (últimas 3)
      const { data: reflexoes, error: reflexoesError } = await supabase
        .from('reflexoes')
        .select('sentimentos_dia, mudaria_algo')
        .eq('ketero_id', userId)
        .order('data', { ascending: false })
        .limit(3);

      if (reflexoesError) {
        if (reflexoesError.code === 'PGRST116' || reflexoesError.message?.includes('relation') || reflexoesError.message?.includes('does not exist')) {
          console.error('❌ Tabela não encontrada: reflexoes. Erro:', reflexoesError.code, reflexoesError.message);
          console.error('💡 Crie a tabela "reflexoes" no Supabase usando o arquivo database/schema-reflexoes-enhanced.sql');
        }
      }

      // 3. Buscar todo o conteúdo disponível
      const { data: todosConteudos, error: conteudosError } = await supabase
        .from('conteudo_educacional')
        .select('id, titulo, subtitulo, fase, tipo, categoria, tags, duracao_min')
        .eq('publicado', true)
        .order('ordem', { ascending: true });

      if (conteudosError) {
        if (conteudosError.code === 'PGRST116' || conteudosError.message?.includes('relation') || conteudosError.message?.includes('does not exist')) {
          console.error('❌ Tabela não encontrada: conteudo_educacional. Erro:', conteudosError.code, conteudosError.message);
          console.error('💡 Crie a tabela "conteudo_educacional" no Supabase usando o arquivo database/migrations/add-conteudo-educacional.sql');
        }
        throw conteudosError;
      }

      if (!todosConteudos || todosConteudos.length === 0) {
        setRecomendacoes([]);
        return { data: [], error: null };
      }

      // 4. Construir prompt para IA
      const faseAtual = getFaseNome(ketero?.fase_atual || 1);
      const reflexoesTexto = reflexoes?.map((r, i) => 
        `Reflexão ${i + 1}: ${r.sentimentos_dia?.substring(0, 100) || 'Não fornecida'}`
      ).join('\n') || 'Nenhuma reflexão recente';

      const prompt = `Você é o Guia Keter, especialista em recomendar conteúdo educacional personalizado.

CONTEXTO DO USUÁRIO:
- Fase atual: ${faseAtual}
- Dia no app: ${ketero?.dia_total_app || 1}
- Sequência: ${ketero?.sequencia_atual || 0} dias
- Total práticas: ${ketero?.total_praticas || 0}
- Humor médio (últimas reflexões): ${contexto.humorMedio || 'Não disponível'}

REFLEXÕES RECENTES:
${reflexoesTexto}

CONTEÚDOS DISPONÍVEIS:
${todosConteudos.map((c, i) => 
  `${i + 1}. [${c.tipo.toUpperCase()}] ${c.titulo} (${c.fase || 'Universal'}) - ${c.categoria} - ${c.duracao_min}min`
).join('\n')}

TAREFA:
Com base no perfil e reflexões do usuário, recomende 2-3 conteúdos mais relevantes AGORA.

RESPONDA APENAS COM OS NÚMEROS dos conteúdos separados por vírgula, seguido de um breve motivo (1 linha).
Exemplo: "5, 12, 18 - O usuário está na fase Despertar e suas reflexões indicam necessidade de técnicas básicas de mindfulness e gratidão."`;

      // 5. Chamar IA
      const { resposta, error: iaError } = await chatWithGuia(prompt, {
        nome: ketero?.nome || 'Ketero',
        faseAtual: ketero?.fase_atual || 1,
        diaTotal: ketero?.dia_total_app || 1,
        sequencia: ketero?.sequencia_atual || 0
      });

      if (iaError) throw new Error(iaError);

      // 6. Parsear resposta da IA
      const numeros = resposta.match(/\d+/g)?.map(n => parseInt(n) - 1) || [];
      const conteudosRecomendados = numeros
        .filter(idx => idx >= 0 && idx < todosConteudos.length)
        .map(idx => todosConteudos[idx])
        .slice(0, 3); // Máximo 3 recomendações

      // Se IA falhar, usar fallback baseado em regras
      if (conteudosRecomendados.length === 0) {
        const fallback = recomendarPorRegras(ketero, todosConteudos);
        setRecomendacoes(fallback);
        return { data: fallback, error: null };
      }

      setRecomendacoes(conteudosRecomendados);
      return { data: conteudosRecomendados, error: null, justificativa: resposta };

    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      setErro(error.message);

      // Fallback: recomendar por regras simples
      try {
        const { data: ketero } = await supabase
          .from('keteros')
          .select('fase_atual')
          .eq('id', userId)
          .single();

        const { data: todosConteudos, error: conteudosError } = await supabase
          .from('conteudo_educacional')
          .select('*')
          .eq('publicado', true)
          .limit(20);

        if (conteudosError) {
          if (conteudosError.code === 'PGRST116' || conteudosError.message?.includes('relation') || conteudosError.message?.includes('does not exist')) {
            console.error('❌ Tabela não encontrada: conteudo_educacional. Erro:', conteudosError.code, conteudosError.message);
          }
        }

        const fallback = recomendarPorRegras(ketero, todosConteudos || []);
        setRecomendacoes(fallback);
        return { data: fallback, error: null };
      } catch (fallbackError) {
        console.error('Erro no fallback de recomendações:', fallbackError);
        return { data: [], error: fallbackError };
      }
    } finally {
      setCarregando(false);
    }
  };

  // ================================================
  // FALLBACK: Recomendação por regras simples
  // ================================================
  const recomendarPorRegras = (ketero, conteudos) => {
    const faseAtual = getFaseNome(ketero?.fase_atual || 1);
    
    // Filtrar por fase ou universal
    let conteudosFiltrados = conteudos.filter(c => 
      c.fase === faseAtual || c.fase === null
    );

    // Se não houver conteúdo da fase, pegar universal
    if (conteudosFiltrados.length === 0) {
      conteudosFiltrados = conteudos.filter(c => c.fase === null);
    }

    // Priorizar destaques
    const destaques = conteudosFiltrados.filter(c => c.destaque);
    
    // Retornar até 3 conteúdos
    const recomendados = destaques.length > 0 
      ? destaques.slice(0, 3)
      : conteudosFiltrados.slice(0, 3);

    return recomendados;
  };

  // ================================================
  // HELPER: Nome da fase
  // ================================================
  const getFaseNome = (fase) => {
    const fases = {
      0: 'SEMENTE',
      1: 'DESPERTAR',
      2: 'DISCIPLINA',
      3: 'CONSCIÊNCIA',
      4: 'SERVIÇO'
    };
    return fases[fase] || 'DESPERTAR';
  };

  // ================================================
  // EFFECT: Gerar recomendações ao montar (opcional)
  // ================================================
  // Descomente se quiser carregar automaticamente
  // useEffect(() => {
  //   if (userId) {
  //     gerarRecomendacoes();
  //   }
  // }, [userId]);

  return {
    recomendacoes,
    carregando,
    erro,
    gerarRecomendacoes
  };
};

export default useRecomendacaoConteudo;
