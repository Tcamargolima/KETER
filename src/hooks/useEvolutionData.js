// ================================================
// HOOK: useEvolutionData
// ================================================
// Processa e agrega dados para gráficos de evolução:
// - Streak Calendar (dias ativos)
// - Humor/Linha de Evolução Emocional
// - Progresso por Categoria
// - Padrões Detectados pela IA

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, subDays } from 'date-fns';
import { isValidUUID } from '../lib/utils';

export const useEvolutionData = (userId, daysRange = 90) => {
  const [reflexoes, setReflexoes] = useState([]);
  const [praticas, setPraticas] = useState([]);
  const [microAtos, setMicroAtos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // ================================================
  // 1. Carregar dados do Supabase
  // ================================================
  useEffect(() => {
    if (!userId) {
      setCarregando(false);
      return;
    }

    // Validar UUID antes de fazer query
    if (!isValidUUID(userId)) {
      console.error('UUID inválido em useEvolutionData:', userId);
      setErro('ID de usuário inválido');
      setCarregando(false);
      return;
    }

    const carregarDados = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const dataInicio = subDays(new Date(), daysRange).toISOString().split('T')[0];

        // Carregar reflexões
        const { data: reflexoesData, error: reflexoesError } = await supabase
          .from('reflexoes')
          .select('*')
          .eq('ketero_id', userId)
          .gte('data', dataInicio)
          .order('data', { ascending: true });

        if (reflexoesError) throw reflexoesError;

        // Carregar práticas completadas
        const { data: praticasData, error: praticasError } = await supabase
          .from('praticas_diarias')
          .select('*, praticas(categoria, nome)')
          .eq('ketero_id', userId)
          .eq('completada', true)
          .gte('completed_at', dataInicio)
          .order('completed_at', { ascending: true });

        if (praticasError) throw praticasError;

        // Carregar micro-atos
        const { data: microAtosData, error: microAtosError } = await supabase
          .from('micro_atos')
          .select('*')
          .eq('ketero_id', userId)
          .eq('executado', true)
          .gte('data', dataInicio)
          .order('data', { ascending: true });

        if (microAtosError) throw microAtosError;

        setReflexoes(reflexoesData || []);
        setPraticas(praticasData || []);
        setMicroAtos(microAtosData || []);
      } catch (err) {
        console.error('Erro ao carregar dados de evolução:', err);
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [userId, daysRange]);

  // ================================================
  // 2. Processar Streak Calendar (Heat Map)
  // ================================================
  const streakCalendarData = useMemo(() => {
    if (!reflexoes.length && !praticas.length && !microAtos.length) {
      return { labels: [], data: [], rawData: [] };
    }

    const hoje = new Date();
    const dataInicio = subDays(hoje, daysRange);
    const diasIntervalo = eachDayOfInterval({ start: dataInicio, end: hoje });

    const atividadePorDia = {};

    // Contar atividades por dia
    diasIntervalo.forEach(dia => {
      const diaStr = format(dia, 'yyyy-MM-dd');
      atividadePorDia[diaStr] = 0;
    });

    // Adicionar reflexões
    reflexoes.forEach(r => {
      if (atividadePorDia[r.data] !== undefined) {
        atividadePorDia[r.data]++;
      }
    });

    // Adicionar práticas
    praticas.forEach(p => {
      const dia = p.completed_at?.split('T')[0];
      if (dia && atividadePorDia[dia] !== undefined) {
        atividadePorDia[dia]++;
      }
    });

    // Adicionar micro-atos
    microAtos.forEach(m => {
      if (atividadePorDia[m.data] !== undefined) {
        atividadePorDia[m.data]++;
      }
    });

    // Preparar dados para o gráfico (últimos 30 dias para visualização)
    const ultimos30Dias = eachDayOfInterval({
      start: subDays(hoje, 29),
      end: hoje
    });

    const labels = ultimos30Dias.map(dia => format(dia, 'dd/MM'));
    const data = ultimos30Dias.map(dia => {
      const diaStr = format(dia, 'yyyy-MM-dd');
      return atividadePorDia[diaStr] || 0;
    });

    return {
      labels,
      data,
      rawData: atividadePorDia
    };
  }, [reflexoes, praticas, microAtos, daysRange]);

  // ================================================
  // 3. Processar Humor/Evolução Emocional
  // ================================================
  const moodEvolutionData = useMemo(() => {
    if (!reflexoes.length) {
      return { labels: [], data: [], media: 0 };
    }

    // Agrupar reflexões por dia e calcular média de humor
    const humorPorDia = {};
    reflexoes.forEach(r => {
      if (r.humor_dia && r.data) {
        if (!humorPorDia[r.data]) {
          humorPorDia[r.data] = [];
        }
        humorPorDia[r.data].push(r.humor_dia);
      }
    });

    // Calcular média para cada dia
    const diasComHumor = Object.entries(humorPorDia)
      .map(([data, humores]) => ({
        data,
        media: humores.reduce((acc, h) => acc + h, 0) / humores.length
      }))
      .sort((a, b) => new Date(a.data) - new Date(b.data));

    const labels = diasComHumor.map(d => format(new Date(d.data), 'dd/MM'));
    const data = diasComHumor.map(d => d.media);
    const media = data.length > 0 ? data.reduce((acc, h) => acc + h, 0) / data.length : 0;

    return {
      labels,
      data,
      media: Math.round(media * 10) / 10
    };
  }, [reflexoes]);

  // ================================================
  // 4. Processar Progresso por Categoria
  // ================================================
  const progressByCategoryData = useMemo(() => {
    if (!praticas.length) {
      return { labels: [], data: [], total: 0 };
    }

    const categorias = {};
    praticas.forEach(p => {
      const categoria = p.praticas?.categoria || 'Outros';
      categorias[categoria] = (categorias[categoria] || 0) + 1;
    });

    const labels = Object.keys(categorias);
    const data = Object.values(categorias);
    const total = praticas.length;

    return {
      labels,
      data,
      total
    };
  }, [praticas]);

  // ================================================
  // 5. Processar Padrões Detectados pela IA
  // ================================================
  const aiPatternsData = useMemo(() => {
    if (!reflexoes.length) {
      return {
        labels: ['Sem dados'],
        data: [100],
        agencia: 0,
        vitimizacao: 0,
        neutro: 100
      };
    }

    let agencia = 0;
    let vitimizacao = 0;
    let neutro = 0;

    reflexoes.forEach(r => {
      if (!r.analise_ia) {
        neutro++;
        return;
      }

      // Analisar texto da análise IA em busca de padrões
      const analise = r.analise_ia.toLowerCase();
      
      // Palavras-chave para agência (proatividade, responsabilidade)
      const palavrasAgencia = [
        'agência', 'proativ', 'responsabilidade', 'iniciativa',
        'ação', 'controle', 'decisão', 'escolha', 'poder'
      ];
      
      // Palavras-chave para vitimização (passividade, culpa externa)
      const palavrasVitimizacao = [
        'vítima', 'culpa', 'impotente', 'impossível', 'não consigo',
        'destino', 'sorte', 'injust'
      ];

      const temAgencia = palavrasAgencia.some(palavra => analise.includes(palavra));
      const temVitimizacao = palavrasVitimizacao.some(palavra => analise.includes(palavra));

      if (temAgencia && !temVitimizacao) {
        agencia++;
      } else if (temVitimizacao && !temAgencia) {
        vitimizacao++;
      } else {
        neutro++;
      }
    });

    const total = reflexoes.length;
    const labels = [];
    const data = [];

    if (agencia > 0) {
      labels.push('Agência');
      data.push(Math.round((agencia / total) * 100));
    }
    if (vitimizacao > 0) {
      labels.push('Vitimização');
      data.push(Math.round((vitimizacao / total) * 100));
    }
    if (neutro > 0) {
      labels.push('Neutro/Balanceado');
      data.push(Math.round((neutro / total) * 100));
    }

    return {
      labels,
      data,
      agencia: Math.round((agencia / total) * 100),
      vitimizacao: Math.round((vitimizacao / total) * 100),
      neutro: Math.round((neutro / total) * 100)
    };
  }, [reflexoes]);

  // ================================================
  // 6. Estatísticas gerais
  // ================================================
  const statistics = useMemo(() => {
    return {
      totalReflexoes: reflexoes.length,
      totalPraticas: praticas.length,
      totalMicroAtos: microAtos.length,
      diasAtivos: Object.values(streakCalendarData.rawData || {}).filter(v => v > 0).length,
      mediaHumor: moodEvolutionData.media,
      sequenciaAtual: calcularSequenciaAtual(streakCalendarData.rawData || {})
    };
  }, [reflexoes, praticas, microAtos, streakCalendarData, moodEvolutionData]);

  // ================================================
  // Helper: Calcular sequência atual de dias
  // ================================================
  const calcularSequenciaAtual = (atividadePorDia) => {
    const hoje = new Date();
    let sequencia = 0;

    for (let i = 0; i < 365; i++) {
      const dia = subDays(hoje, i);
      const diaStr = format(dia, 'yyyy-MM-dd');
      
      if (atividadePorDia[diaStr] && atividadePorDia[diaStr] > 0) {
        sequencia++;
      } else {
        break;
      }
    }

    return sequencia;
  };

  // ================================================
  // Retornar dados processados
  // ================================================
  return {
    // Estado
    carregando,
    erro,

    // Dados processados
    streakCalendarData,
    moodEvolutionData,
    progressByCategoryData,
    aiPatternsData,
    statistics,

    // Dados brutos
    reflexoes,
    praticas,
    microAtos
  };
};

export default useEvolutionData;
