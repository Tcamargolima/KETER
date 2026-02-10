// ==================== SUPABASE CONFIGURATION ====================
// Setup completo do Supabase para KETER

import { createClient } from '@supabase/supabase-js';

// ==================== CLIENT SETUP ====================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// ==================== DATABASE SCHEMA SQL ====================
// Execute este SQL no Supabase SQL Editor para criar todas as tabelas

export const DATABASE_SCHEMA = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== TABELA: keteros (usuários) ====================
CREATE TABLE IF NOT EXISTS keteros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nome VARCHAR(255),
  foto_url VARCHAR(500),
  data_nascimento DATE,
  hora_nascimento TIME,
  local_nascimento VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  ultimo_acesso TIMESTAMP,
  fase_atual INTEGER DEFAULT 1,
  dia_na_fase INTEGER DEFAULT 1,
  sequencia_atual INTEGER DEFAULT 0,
  sequencia_maxima INTEGER DEFAULT 0,
  total_praticas INTEGER DEFAULT 0,
  total_reflexoes INTEGER DEFAULT 0,
  total_micro_atos INTEGER DEFAULT 0,
  tempo_total_minutos INTEGER DEFAULT 0,
  notificacoes_ativas BOOLEAN DEFAULT true,
  horario_pratica_manha TIME DEFAULT '09:00',
  horario_reflexao_noite TIME DEFAULT '20:00'
);

-- ==================== TABELA: avaliacoes_iniciais ====================
CREATE TABLE IF NOT EXISTS avaliacoes_iniciais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  sentimento_geral INTEGER CHECK (sentimento_geral BETWEEN 1 AND 10),
  incomodo_principal TEXT,
  habitos_desejados JSONB,
  tempo_disponivel VARCHAR(20),
  busca_principal JSONB,
  quer_mapa_completo BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==================== TABELA: mapas_keter ====================
CREATE TABLE IF NOT EXISTS mapas_keter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  pontos_fortes JSONB,
  areas_desenvolvimento JSONB,
  foco_inicial TEXT,
  mapa_astral JSONB,
  numerologia JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==================== TABELA: praticas_diarias ====================
CREATE TABLE IF NOT EXISTS praticas_diarias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  pratica_id INTEGER NOT NULL,
  data DATE NOT NULL,
  duracao_minutos INTEGER,
  completada BOOLEAN DEFAULT false,
  sentimento_pos VARCHAR(50),
  nota_opcional TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  UNIQUE(ketero_id, data, pratica_id)
);

-- ==================== TABELA: reflexoes_noturnas ====================
CREATE TABLE IF NOT EXISTS reflexoes_noturnas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  fase INTEGER NOT NULL,
  respostas JSONB NOT NULL,
  analise_ia TEXT,
  sentimento_geral VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(ketero_id, data)
);

-- ==================== TABELA: micro_atos ====================
CREATE TABLE IF NOT EXISTS micro_atos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  categoria VARCHAR(50),
  descricao TEXT NOT NULL,
  executado BOOLEAN DEFAULT false,
  reflexao_pos TEXT,
  impacto_percebido INTEGER CHECK (impacto_percebido BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW(),
  executed_at TIMESTAMP
);

-- ==================== TABELA: evolucao_fases ====================
CREATE TABLE IF NOT EXISTS evolucao_fases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  fase INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  data_conclusao DATE,
  criterios_cumpridos JSONB,
  analise_ia TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==================== TABELA: analises_ia ====================
CREATE TABLE IF NOT EXISTS analises_ia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL,
  conteudo TEXT NOT NULL,
  metricas JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analises_tipo ON analises_ia(ketero_id, tipo, created_at DESC);

-- ==================== TABELA: conversas_guia ====================
CREATE TABLE IF NOT EXISTS conversas_guia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  mensagem_ketero TEXT NOT NULL,
  resposta_ia TEXT NOT NULL,
  contexto JSONB,
  tokens_usados INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversas_data ON conversas_guia(ketero_id, created_at DESC);

-- ==================== TABELA: circulos ====================
CREATE TABLE IF NOT EXISTS circulos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  tema VARCHAR(255),
  descricao TEXT,
  maximo_membros INTEGER DEFAULT 12,
  ativo BOOLEAN DEFAULT true,
  criado_por UUID REFERENCES keteros(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==================== TABELA: circulos_membros ====================
CREATE TABLE IF NOT EXISTS circulos_membros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  entrou_em TIMESTAMP DEFAULT NOW(),
  ativo BOOLEAN DEFAULT true,
  role VARCHAR(20) DEFAULT 'membro',
  UNIQUE(circulo_id, ketero_id)
);

-- ==================== TABELA: circulos_mensagens ====================
CREATE TABLE IF NOT EXISTS circulos_mensagens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  editada BOOLEAN DEFAULT false,
  deletada BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mensagens_circulo ON circulos_mensagens(circulo_id, created_at DESC);

-- ==================== TABELA: conquistas ====================
CREATE TABLE IF NOT EXISTS conquistas (
  id VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  criterio JSONB NOT NULL,
  icone VARCHAR(50),
  raridade VARCHAR(20) DEFAULT 'comum',
  ordem INTEGER DEFAULT 0
);

-- ==================== TABELA: keteros_conquistas ====================
CREATE TABLE IF NOT EXISTS keteros_conquistas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  conquista_id VARCHAR(50) REFERENCES conquistas(id),
  desbloqueada_em TIMESTAMP DEFAULT NOW(),
  visualizada BOOLEAN DEFAULT false,
  UNIQUE(ketero_id, conquista_id)
);

-- ==================== SEED DATA: Conquistas Iniciais ====================
INSERT INTO conquistas (id, nome, descricao, criterio, icone, raridade, ordem) VALUES
('primeiro-passo', 'Primeiro Passo', 'Completou sua primeira prática!', '{"praticas": 1}', 'star', 'comum', 1),
('semana-completa', 'Constância', '7 dias de prática seguida!', '{"sequencia": 7}', 'flame', 'rara', 2),
('21-dias', 'Disciplinado', '21 dias de prática seguida!', '{"sequencia": 21}', 'trophy', 'epica', 3),
('10-praticas', 'Dedicado', 'Completou 10 práticas!', '{"praticas": 10}', 'target', 'comum', 4),
('50-praticas', 'Comprometido', 'Completou 50 práticas!', '{"praticas": 50}', 'zap', 'rara', 5),
('100-praticas', 'Mestre', 'Completou 100 práticas!', '{"praticas": 100}', 'crown', 'epica', 6),
('10-micro-atos', 'Bondoso', '10 micro-atos de bondade!', '{"micro_atos": 10}', 'heart', 'rara', 7),
('30-reflexoes', 'Reflexivo', '30 reflexões completas!', '{"reflexoes": 30}', 'book-open', 'comum', 8),
('entrou-circulo', 'Comunitário', 'Entrou em um Círculo!', '{"circulos": 1}', 'users', 'rara', 9),
('evolucao-detectada', 'Transformação', 'IA detectou mudança real!', '{"ia_mudanca": true}', 'trending-up', 'epica', 10),
('fase-2', 'Disciplinado', 'Chegou à Fase 2!', '{"fase": 2}', 'target', 'rara', 11),
('fase-3', 'Consciente', 'Chegou à Fase 3!', '{"fase": 3}', 'brain', 'epica', 12),
('fase-4', 'Servo', 'Chegou à Fase 4!', '{"fase": 4}', 'heart', 'lendaria', 13)
ON CONFLICT (id) DO NOTHING;

-- ==================== ÍNDICES PARA PERFORMANCE ====================
CREATE INDEX IF NOT EXISTS idx_keteros_email ON keteros(email);
CREATE INDEX IF NOT EXISTS idx_praticas_ketero_data ON praticas_diarias(ketero_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_reflexoes_ketero_data ON reflexoes_noturnas(ketero_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_micro_atos_ketero_data ON micro_atos(ketero_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_circulos_membros_ketero ON circulos_membros(ketero_id, ativo);
CREATE INDEX IF NOT EXISTS idx_conquistas_ketero ON keteros_conquistas(ketero_id);

-- ==================== ROW LEVEL SECURITY (RLS) ====================
-- Habilitar RLS em todas as tabelas
ALTER TABLE keteros ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_iniciais ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapas_keter ENABLE ROW LEVEL SECURITY;
ALTER TABLE praticas_diarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflexoes_noturnas ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_atos ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolucao_fases ENABLE ROW LEVEL SECURITY;
ALTER TABLE analises_ia ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversas_guia ENABLE ROW LEVEL SECURITY;
ALTER TABLE circulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE circulos_membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE circulos_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE keteros_conquistas ENABLE ROW LEVEL SECURITY;

-- Policies para keteros (usuários veem apenas seus próprios dados)
CREATE POLICY "Users can view own data" ON keteros
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON keteros
  FOR UPDATE USING (auth.uid() = id);

-- Policies para dados pessoais (praticas, reflexoes, etc)
CREATE POLICY "Users view own practices" ON praticas_diarias
  FOR ALL USING (ketero_id = auth.uid());

CREATE POLICY "Users view own reflections" ON reflexoes_noturnas
  FOR ALL USING (ketero_id = auth.uid());

CREATE POLICY "Users view own micro acts" ON micro_atos
  FOR ALL USING (ketero_id = auth.uid());

CREATE POLICY "Users view own analyses" ON analises_ia
  FOR ALL USING (ketero_id = auth.uid());

CREATE POLICY "Users view own conversations" ON conversas_guia
  FOR ALL USING (ketero_id = auth.uid());

CREATE POLICY "Users view own achievements" ON keteros_conquistas
  FOR ALL USING (ketero_id = auth.uid());

-- Policies para círculos (membros veem conteúdo)
CREATE POLICY "Public can view active circles" ON circulos
  FOR SELECT USING (ativo = true);

CREATE POLICY "Members can view circle messages" ON circulos_mensagens
  FOR SELECT USING (
    circulo_id IN (
      SELECT circulo_id FROM circulos_membros 
      WHERE ketero_id = auth.uid() AND ativo = true
    )
  );

CREATE POLICY "Members can insert messages" ON circulos_mensagens
  FOR INSERT WITH CHECK (
    circulo_id IN (
      SELECT circulo_id FROM circulos_membros 
      WHERE ketero_id = auth.uid() AND ativo = true
    )
  );

-- Policies para conquistas (todos podem ver)
CREATE POLICY "Anyone can view achievements" ON conquistas
  FOR SELECT TO authenticated USING (true);
`;

// ==================== HELPER FUNCTIONS ====================

export const supabaseHelpers = {
  // Auth helpers
  async signUp(email, password, userData = {}) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) throw authError;

    // Criar perfil do ketero
    const { data: keteroData, error: keteroError } = await supabase
      .from('keteros')
      .insert([{
        id: authData.user.id,
        email,
        nome: userData.nome || email.split('@')[0],
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (keteroError) throw keteroError;

    return { user: authData.user, ketero: keteroData };
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: ketero } = await supabase
      .from('keteros')
      .select('*')
      .eq('id', user.id)
      .single();

    return ketero;
  },

  // Ketero data helpers
  async updateKetero(id, updates) {
    const { data, error } = await supabase
      .from('keteros')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSequencia(keteroId, increment = true) {
    const ketero = await this.getCurrentUser();
    const updates = increment 
      ? {
          sequencia_atual: ketero.sequencia_atual + 1,
          sequencia_maxima: Math.max(ketero.sequencia_maxima, ketero.sequencia_atual + 1)
        }
      : { sequencia_atual: 0 };

    return this.updateKetero(keteroId, updates);
  },

  // Práticas helpers
  async salvarPratica(keteroId, praticaData) {
    const { data, error } = await supabase
      .from('praticas_diarias')
      .insert([{
        ketero_id: keteroId,
        ...praticaData
      }])
      .select()
      .single();

    if (error) throw error;

    // Atualizar stats do ketero
    await supabase.rpc('increment_praticas', { ketero_id: keteroId });

    return data;
  },

  async getPraticasDoDia(keteroId, data) {
    const { data: praticas, error } = await supabase
      .from('praticas_diarias')
      .select('*')
      .eq('ketero_id', keteroId)
      .eq('data', data);

    if (error) throw error;
    return praticas;
  },

  // Reflexões helpers
  async salvarReflexao(keteroId, reflexaoData) {
    const { data, error } = await supabase
      .from('reflexoes_noturnas')
      .insert([{
        ketero_id: keteroId,
        ...reflexaoData
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getReflexoesRecentes(keteroId, limit = 7) {
    const { data, error } = await supabase
      .from('reflexoes_noturnas')
      .select('*')
      .eq('ketero_id', keteroId)
      .order('data', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Micro-atos helpers
  async salvarMicroAto(keteroId, microAtoData) {
    const { data, error } = await supabase
      .from('micro_atos')
      .insert([{
        ketero_id: keteroId,
        ...microAtoData
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async executarMicroAto(microAtoId, reflexao) {
    const { data, error } = await supabase
      .from('micro_atos')
      .update({
        executado: true,
        reflexao_pos: reflexao,
        executed_at: new Date().toISOString()
      })
      .eq('id', microAtoId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Conquistas helpers
  async verificarConquistas(keteroId) {
    const ketero = await this.getCurrentUser();
    const conquistas = [];

    // Lógica de verificação de conquistas
    if (ketero.total_praticas === 1) {
      conquistas.push('primeiro-passo');
    }
    if (ketero.sequencia_atual === 7) {
      conquistas.push('semana-completa');
    }
    if (ketero.sequencia_atual === 21) {
      conquistas.push('21-dias');
    }
    if (ketero.total_praticas === 10) {
      conquistas.push('10-praticas');
    }
    if (ketero.total_micro_atos === 10) {
      conquistas.push('10-micro-atos');
    }

    // Inserir conquistas não desbloqueadas
    for (const conquistaId of conquistas) {
      await supabase
        .from('keteros_conquistas')
        .upsert([{
          ketero_id: keteroId,
          conquista_id: conquistaId
        }], { onConflict: 'ketero_id,conquista_id' });
    }

    return conquistas;
  },

  async getConquistasDesbloqueadas(keteroId) {
    const { data, error } = await supabase
      .from('keteros_conquistas')
      .select(`
        *,
        conquista:conquistas(*)
      `)
      .eq('ketero_id', keteroId);

    if (error) throw error;
    return data;
  },

  // Análises IA helpers
  async salvarAnaliseIA(keteroId, tipo, conteudo, metricas = {}) {
    const { data, error } = await supabase
      .from('analises_ia')
      .insert([{
        ketero_id: keteroId,
        tipo,
        conteudo,
        metricas
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUltimaAnalise(keteroId, tipo) {
    const { data, error } = await supabase
      .from('analises_ia')
      .select('*')
      .eq('ketero_id', keteroId)
      .eq('tipo', tipo)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  },

  // Círculos helpers
  async getCirculosDisponiveis() {
    const { data, error } = await supabase
      .from('circulos')
      .select(`
        *,
        membros:circulos_membros(count)
      `)
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async entrarCirculo(keteroId, circuloId) {
    const { data, error } = await supabase
      .from('circulos_membros')
      .insert([{
        circulo_id: circuloId,
        ketero_id: keteroId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMensagensCirculo(circuloId, limit = 50) {
    const { data, error } = await supabase
      .from('circulos_mensagens')
      .select(`
        *,
        ketero:keteros(nome, foto_url)
      `)
      .eq('circulo_id', circuloId)
      .eq('deletada', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.reverse(); // Mais antigas primeiro
  },

  async enviarMensagemCirculo(circuloId, keteroId, mensagem) {
    const { data, error } = await supabase
      .from('circulos_mensagens')
      .insert([{
        circulo_id: circuloId,
        ketero_id: keteroId,
        mensagem
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// ==================== REALTIME SUBSCRIPTIONS ====================

export function subscribeToCirculo(circuloId, onNewMessage) {
  return supabase
    .channel(`circulo:${circuloId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'circulos_mensagens',
        filter: `circulo_id=eq.${circuloId}`
      },
      (payload) => {
        onNewMessage(payload.new);
      }
    )
    .subscribe();
}

export function unsubscribeFromCirculo(subscription) {
  supabase.removeChannel(subscription);
}
`;

// ==================== ENVIRONMENT VARIABLES TEMPLATE ====================
export const ENV_TEMPLATE = `
# SUPABASE
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OPENAI
VITE_OPENAI_API_KEY=sk-your-key-here
`;
