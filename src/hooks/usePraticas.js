// ================================================
// HOOK: usePraticas
// ================================================
// Gerencia o sistema de práticas com:
// - Busca de práticas do Supabase
// - Filtragem por fase e categoria
// - Recomendação de próxima prática baseada em IA
// - Histórico de práticas completadas

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { isValidUUID } from '../lib/utils';

export const usePraticas = (userId) => {
  const [praticas, setPraticas] = useState([]);
  const [praticasFiltradas, setPraticasFiltradas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [faseAtual, setFaseAtual] = useState(1);

  // ================================================
  // 1. Carregar todas as práticas do Supabase
  // ================================================
  useEffect(() => {
    carregarPraticas();
  }, []);

  const carregarPraticas = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const { data, error } = await supabase
        .from('praticas')
        .select('*')
        .order('fase', { ascending: true })
        .order('ordem', { ascending: true });

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.error('❌ Tabela não encontrada: praticas. Erro:', error.code, error.message);
          console.error('💡 Crie a tabela "praticas" no Supabase usando o arquivo database/migration-praticas-table.sql');
        }
        throw error;
      }

      setPraticas(data || []);
      setPraticasFiltradas(data || []);
    } catch (err) {
      console.error('Erro ao carregar práticas:', err);
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  // ================================================
  // 2. Obter fase atual do usuário
  // ================================================
  useEffect(() => {
    if (!userId) return;

    // Validar UUID antes de fazer query
    if (!isValidUUID(userId)) {
      console.error('UUID inválido em usePraticas:', userId);
      setErro('ID de usuário inválido');
      return;
    }

    const obterFaseUsuario = async () => {
      try {
        const { data, error } = await supabase
          .from('keteros')
          .select('fase_atual')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data) {
          setFaseAtual(data.fase_atual || 1);
        }
      } catch (err) {
        console.error('Erro ao obter fase do usuário:', err);
      }
    };

    obterFaseUsuario();
  }, [userId]);

  // ================================================
  // 3. Filtrar práticas
  // ================================================
  const filtrarPraticas = (filtros) => {
    let resultado = [...praticas];

    if (filtros.fase) {
      resultado = resultado.filter(p => p.fase === filtros.fase);
    }

    if (filtros.categoria) {
      resultado = resultado.filter(p => p.categoria === filtros.categoria);
    }

    if (filtros.dificuldade) {
      resultado = resultado.filter(p => p.dificuldade === filtros.dificuldade);
    }

    setPraticasFiltradas(resultado);
    return resultado;
  };

  // ================================================
  // 4. Obter prática por ID
  // ================================================
  const obterPraticaPorId = async (praticaId) => {
    try {
      const { data, error } = await supabase
        .from('praticas')
        .select('*')
        .eq('id', praticaId)
        .maybeSingle();

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.error('❌ Tabela não encontrada: praticas. Erro:', error.code, error.message);
          console.error('💡 Crie a tabela "praticas" no Supabase usando o arquivo database/migration-praticas-table.sql');
        }
        throw error;
      }
      return { data, error: null };
    } catch (err) {
      console.error('Erro ao obter prática por ID:', err);
      return { data: null, error: err };
    }
  };

  // ================================================
  // 5. Obter práticas da fase atual
  // ================================================
  const obterPraticasDaFase = (fase = faseAtual) => {
    return praticas.filter(p => p.fase === fase);
  };

  // ================================================
  // 6. Obter histórico de práticas do usuário
  // ================================================
  const obterHistoricoPraticas = async (limite = 30) => {
    if (!userId) return { data: [], error: null };

    // Validar UUID antes de fazer query
    if (!isValidUUID(userId)) {
      console.error('UUID inválido em obterHistoricoPraticas:', userId);
      return { data: [], error: 'ID de usuário inválido' };
    }

    try {
      const { data, error } = await supabase
        .from('praticas_diarias')
        .select('*')
        .eq('ketero_id', userId)
        .eq('completada', true)
        .order('completed_at', { ascending: false })
        .limit(limite);

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.error('❌ Tabela não encontrada: praticas_diarias. Erro:', error.code, error.message);
          console.error('💡 Crie a tabela "praticas_diarias" no Supabase usando o arquivo supabase-schema.sql');
        }
        throw error;
      }
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Erro ao obter histórico de práticas:', err);
      return { data: [], error: err };
    }
  };

  // ================================================
  // 7. Recomendar próxima prática (IA simplificada)
  // ================================================
  const recomendarProximaPratica = async () => {
    try {
      // 1. Obter práticas da fase atual
      const praticasFase = obterPraticasDaFase(faseAtual);
      
      if (praticasFase.length === 0) {
        console.warn('Nenhuma prática disponível para fase', faseAtual);
        return { 
          data: null, 
          error: 'Nenhuma prática cadastrada para esta fase. Adicione práticas na biblioteca!' 
        };
      }

      // 2. Obter histórico recente
      const { data: historico } = await obterHistoricoPraticas(7);

      // 3. Filtrar práticas já feitas recentemente
      const praticasRecentesIds = new Set(
        historico
          .filter(h => {
            const dias = Math.floor((Date.now() - new Date(h.completed_at).getTime()) / (1000 * 60 * 60 * 24));
            return dias < 3; // Últimos 3 dias
          })
          .map(h => h.pratica_id)
      );

      // 4. Práticas disponíveis (não feitas recentemente)
      let praticasDisponiveis = praticasFase.filter(p => 
        !Array.from(praticasRecentesIds).some(id => id === p.id)
      );

      // 5. Se todas foram feitas, usar todas da fase
      if (praticasDisponiveis.length === 0) {
        praticasDisponiveis = praticasFase;
      }

      // 6. Lógica de recomendação simples:
      // - Priorizar práticas de menor duração pela manhã
      // - Práticas mais longas à tarde/noite
      const hora = new Date().getHours();
      const ehManha = hora >= 6 && hora < 12;

      praticasDisponiveis.sort((a, b) => {
        if (ehManha) {
          return a.duracao_min - b.duracao_min; // Menor duração primeiro
        } else {
          return b.duracao_min - a.duracao_min; // Maior duração primeiro
        }
      });

      // 7. Retornar primeira prática recomendada
      return { data: praticasDisponiveis[0], error: null };
    } catch (err) {
      console.error('Erro ao recomendar prática:', err);
      return { data: null, error: err };
    }
  };

  // ================================================
  // 8. Obter categorias únicas
  // ================================================
  const obterCategorias = () => {
    return [...new Set(praticas.map(p => p.categoria))].sort();
  };

  // ================================================
  // 9. Obter estatísticas de práticas
  // ================================================
  const obterEstatisticas = async () => {
    if (!userId) return null;

    // Validar UUID antes de fazer query
    if (!isValidUUID(userId)) {
      console.error('UUID inválido em obterEstatisticas:', userId);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('praticas_diarias')
        .select('*')
        .eq('ketero_id', userId)
        .eq('completada', true);

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.error('❌ Tabela não encontrada: praticas_diarias. Erro:', error.code, error.message);
          console.error('💡 Crie a tabela "praticas_diarias" no Supabase usando o arquivo supabase-schema.sql');
        }
        throw error;
      }

      const estatisticas = {
        total: data.length,
        tempoTotal: data.reduce((acc, p) => acc + (p.duracao_minutos || 0), 0),
        porCategoria: {},
        sequenciaAtual: 0
      };

      // Agrupar por categoria
      data.forEach(p => {
        const cat = p.categoria || 'Outros';
        estatisticas.porCategoria[cat] = (estatisticas.porCategoria[cat] || 0) + 1;
      });

      // Calcular sequência atual
      const hoje = new Date();
      let dias = 0;
      while (dias < 365) {
        const dataCheck = new Date(hoje);
        dataCheck.setDate(dataCheck.getDate() - dias);
        const dataStr = dataCheck.toISOString().split('T')[0];
        
        const praticaDia = data.find(p => p.data === dataStr);
        if (!praticaDia) break;
        dias++;
      }
      estatisticas.sequenciaAtual = dias;

      return estatisticas;
    } catch (err) {
      console.error('Erro ao obter estatísticas:', err);
      return null;
    }
  };

  // ================================================
  // Retornar API do hook
  // ================================================
  return {
    // Estado
    praticas,
    praticasFiltradas,
    carregando,
    erro,
    faseAtual,

    // Métodos
    carregarPraticas,
    filtrarPraticas,
    obterPraticaPorId,
    obterPraticasDaFase,
    obterHistoricoPraticas,
    recomendarProximaPratica,
    obterCategorias,
    obterEstatisticas
  };
};

export default usePraticas;
