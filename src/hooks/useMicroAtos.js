// ================================================
// HOOK: useMicroAtos
// ================================================
// Gerencia o sistema de micro-atos de bondade com:
// - Seleção e recomendação de micro-atos
// - Registro de execução
// - Histórico e estatísticas
// - Integração com IA

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { recomendarMicroAtoPorFase, getMicroAtosPorCategoria, getCategorias } from '../data/microAtosLibrary';
import { isValidUUID } from '../lib/utils';

export const useMicroAtos = (userId) => {
  const [microAtoAtual, setMicroAtoAtual] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [faseAtual, setFaseAtual] = useState(1);
  const [jaRealizouHoje, setJaRealizouHoje] = useState(false);

  // ================================================
  // 1. Carregar dados iniciais
  // ================================================
  useEffect(() => {
    if (!userId) {
      setCarregando(false);
      return;
    }

    // Validar UUID antes de fazer query
    if (!isValidUUID(userId)) {
      console.error('UUID inválido em useMicroAtos:', userId);
      setErro('ID de usuário inválido');
      setCarregando(false);
      return;
    }

    carregarDados();
  }, [userId]);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      setErro(null);

      // Carregar fase do usuário
      const { data: ketero, error: keteroError } = await supabase
        .from('keteros')
        .select('fase_atual')
        .eq('id', userId)
        .maybeSingle();

      if (keteroError) {
        console.error('Erro ao carregar fase do ketero:', keteroError);
        throw keteroError;
      }
      setFaseAtual(ketero?.fase_atual || 1);

      // Carregar histórico de micro-atos
      const { data: historicoData, error: historicoError } = await supabase
        .from('micro_atos')
        .select('*')
        .eq('ketero_id', userId)
        .order('data', { ascending: false })
        .limit(30);

      if (historicoError) throw historicoError;
      setHistorico(historicoData || []);

      // Verificar se já realizou micro-ato hoje
      const hoje = new Date().toISOString().split('T')[0];
      const microAtoHoje = historicoData?.find(m => m.data === hoje && m.executado);
      setJaRealizouHoje(!!microAtoHoje);

      // Carregar ou criar micro-ato do dia
      await carregarMicroAtoDoDia(ketero?.fase_atual || 1, historicoData || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  // ================================================
  // 2. Carregar ou criar micro-ato do dia
  // ================================================
  const carregarMicroAtoDoDia = async (fase, hist) => {
    try {
      const hoje = new Date().toISOString().split('T')[0];

      // Verificar se já existe um micro-ato para hoje
      const { data: existente, error: erroExistente } = await supabase
        .from('micro_atos')
        .select('*')
        .eq('ketero_id', userId)
        .eq('data', hoje)
        .maybeSingle();

      if (erroExistente && erroExistente.code !== 'PGRST116') {
        console.error('Erro ao buscar micro-ato existente:', erroExistente);
        throw erroExistente;
      }

      if (existente) {
        setMicroAtoAtual(existente);
        return existente;
      }

      // Se não existe, recomendar um novo
      const recomendacao = recomendarMicroAtoPorFase(fase, hist);

      // Criar novo micro-ato
      const { data: novoMicroAto, error: erroNovo } = await supabase
        .from('micro_atos')
        .insert([
          {
            ketero_id: userId,
            data: hoje,
            tipo: recomendacao.categoria,
            descricao: recomendacao.descricao,
            executado: false
          }
        ])
        .select()
        .maybeSingle();

      if (erroNovo) {
        console.error('Erro ao criar novo micro-ato:', erroNovo);
        throw erroNovo;
      }

      setMicroAtoAtual(novoMicroAto || null);
      return novoMicroAto;
    } catch (err) {
      console.error('Erro ao carregar micro-ato do dia:', err);
      throw err;
    }
  };

  // ================================================
  // 3. Trocar micro-ato (escolher outro)
  // ================================================
  const trocarMicroAto = async (categoria = null) => {
    try {
      setErro(null);

      if (!microAtoAtual) {
        throw new Error('Nenhum micro-ato atual para trocar');
      }

      // Escolher nova recomendação
      const novaRecomendacao = categoria
        ? getMicroAtosPorCategoria(categoria)[
            Math.floor(Math.random() * getMicroAtosPorCategoria(categoria).length)
          ]
        : recomendarMicroAtoPorFase(faseAtual, historico);

      // Atualizar no banco
      const { data, error } = await supabase
        .from('micro_atos')
        .update({
          tipo: novaRecomendacao.categoria,
          descricao: novaRecomendacao.descricao
        })
        .eq('id', microAtoAtual.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Erro ao trocar micro-ato:', error);
        throw error;
      }

      setMicroAtoAtual(data);
      return { data, error: null };
    } catch (err) {
      console.error('Erro ao trocar micro-ato:', err);
      setErro(err.message);
      return { data: null, error: err };
    }
  };

  // ================================================
  // 4. Marcar como executado
  // ================================================
  const marcarComoExecutado = async (reflexao = '') => {
    try {
      setErro(null);

      if (!microAtoAtual) {
        throw new Error('Nenhum micro-ato para executar');
      }

      // Atualizar micro-ato
      const { data, error } = await supabase
        .from('micro_atos')
        .update({
          executado: true,
          executado_at: new Date().toISOString(),
          reflexao_pos: reflexao
        })
        .eq('id', microAtoAtual.id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Erro ao atualizar micro-ato:', error);
        throw error;
      }

      // Atualizar contadores do usuário
      const { error: updateError } = await supabase.rpc('increment_micro_atos', {
        user_id: userId
      });

      if (updateError) {
        console.error('Erro ao incrementar contador:', updateError);
      }

      setMicroAtoAtual(data);
      setJaRealizouHoje(true);

      // Recarregar histórico
      await carregarDados();

      // Verificar conquistas (se existir função)
      try {
        await supabase.rpc('verificar_conquistas_micro_atos', {
          user_id: userId
        });
      } catch (conquistaError) {
        console.log('Função de conquistas não existe ainda:', conquistaError);
      }

      return { data, error: null };
    } catch (err) {
      console.error('Erro ao marcar como executado:', err);
      setErro(err.message);
      return { data: null, error: err };
    }
  };

  // ================================================
  // 5. Criar micro-ato customizado
  // ================================================
  const criarMicroAtoCustomizado = async (descricao, categoria = 'bondade') => {
    try {
      setErro(null);
      const hoje = new Date().toISOString().split('T')[0];

      // Verificar se já existe micro-ato hoje
      if (microAtoAtual) {
        // Atualizar o existente
        const { data, error } = await supabase
          .from('micro_atos')
          .update({
            tipo: categoria,
            descricao: descricao
          })
          .eq('id', microAtoAtual.id)
          .select()
          .maybeSingle();

        if (error) {
          console.error('Erro ao atualizar micro-ato customizado:', error);
          throw error;
        }
        setMicroAtoAtual(data);
        return { data, error: null };
      }

      // Criar novo
      const { data, error } = await supabase
        .from('micro_atos')
        .insert([
          {
            ketero_id: userId,
            data: hoje,
            tipo: categoria,
            descricao: descricao,
            executado: false
          }
        ])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Erro ao criar micro-ato customizado:', error);
        throw error;
      }

      setMicroAtoAtual(data);
      return { data, error: null };
    } catch (err) {
      console.error('Erro ao criar micro-ato customizado:', err);
      setErro(err.message);
      return { data: null, error: err };
    }
  };

  // ================================================
  // 6. Obter estatísticas
  // ================================================
  const obterEstatisticas = () => {
    const total = historico.filter(m => m.executado).length;
    const porCategoria = {};
    const ultimos7Dias = [];

    // Contar por categoria
    historico
      .filter(m => m.executado)
      .forEach(m => {
        const cat = m.tipo || 'outros';
        porCategoria[cat] = (porCategoria[cat] || 0) + 1;
      });

    // Últimos 7 dias
    const hoje = new Date();
    for (let i = 0; i < 7; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      const dataStr = data.toISOString().split('T')[0];
      
      const microAto = historico.find(m => m.data === dataStr && m.executado);
      ultimos7Dias.push({
        data: dataStr,
        realizado: !!microAto,
        tipo: microAto?.tipo || null
      });
    }

    // Calcular sequência atual
    let sequenciaAtual = 0;
    for (let i = 0; i < ultimos7Dias.length; i++) {
      if (ultimos7Dias[i].realizado) {
        sequenciaAtual++;
      } else {
        break;
      }
    }

    return {
      total,
      porCategoria,
      ultimos7Dias: ultimos7Dias.reverse(),
      sequenciaAtual,
      categorias: getCategorias()
    };
  };

  // ================================================
  // 7. Obter histórico detalhado
  // ================================================
  const obterHistorico = async (limite = 30) => {
    try {
      const { data, error } = await supabase
        .from('micro_atos')
        .select('*')
        .eq('ketero_id', userId)
        .eq('executado', true)
        .order('executado_at', { ascending: false })
        .limit(limite);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (err) {
      console.error('Erro ao obter histórico:', err);
      return { data: [], error: err };
    }
  };

  // ================================================
  // Retornar API do hook
  // ================================================
  return {
    // Estado
    microAtoAtual,
    historico,
    carregando,
    erro,
    faseAtual,
    jaRealizouHoje,

    // Métodos
    carregarDados,
    trocarMicroAto,
    marcarComoExecutado,
    criarMicroAtoCustomizado,
    obterEstatisticas,
    obterHistorico,
    
    // Utilitários
    categorias: getCategorias()
  };
};

export default useMicroAtos;
