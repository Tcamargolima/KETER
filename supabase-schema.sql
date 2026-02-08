-- ================================================
-- KETER DATABASE SCHEMA - SUPABASE
-- ================================================
-- Este arquivo contém toda a estrutura do banco de dados
-- Execute no SQL Editor do Supabase

-- ================================================
-- 1. TABELA: keteros (usuários)
-- ================================================
CREATE TABLE IF NOT EXISTS keteros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nome VARCHAR(255),
  foto_url VARCHAR(500),
  data_nascimento DATE,
  hora_nascimento TIME,
  local_nascimento VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultimo_acesso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Progressão
  fase_atual INTEGER DEFAULT 1 CHECK (fase_atual BETWEEN 1 AND 4),
  dia_na_fase INTEGER DEFAULT 1,
  dia_total_app INTEGER DEFAULT 1,
  
  -- Estatísticas
  sequencia_atual INTEGER DEFAULT 0,
  sequencia_maxima INTEGER DEFAULT 0,
  total_praticas INTEGER DEFAULT 0,
  total_reflexoes INTEGER DEFAULT 0,
  total_micro_atos INTEGER DEFAULT 0,
  tempo_total_minutos INTEGER DEFAULT 0,
  
  -- Preferências
  horario_pratica TIME DEFAULT '09:00:00',
  horario_reflexao TIME DEFAULT '20:00:00',
  tempo_disponivel VARCHAR(20) DEFAULT '3-5 minutos',
  notificacoes_ativas BOOLEAN DEFAULT true
);

-- RLS (Row Level Security)
ALTER TABLE keteros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver apenas seus próprios dados"
  ON keteros FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar apenas seus próprios dados"
  ON keteros FOR UPDATE
  USING (auth.uid() = id);

-- Índices
CREATE INDEX idx_keteros_email ON keteros(email);
CREATE INDEX idx_keteros_fase ON keteros(fase_atual);

-- ================================================
-- 2. TABELA: avaliacoes_iniciais
-- ================================================
CREATE TABLE IF NOT EXISTS avaliacoes_iniciais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  sentimento_geral INTEGER CHECK (sentimento_geral BETWEEN 1 AND 10),
  incomodo_principal TEXT,
  habitos_desejados JSONB DEFAULT '[]',
  tempo_disponivel VARCHAR(20),
  busca_principal JSONB DEFAULT '[]',
  quer_mapa_completo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE avaliacoes_iniciais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas suas avaliações"
  ON avaliacoes_iniciais FOR ALL
  USING (ketero_id = auth.uid());

-- ================================================
-- 3. TABELA: praticas_diarias
-- ================================================
CREATE TABLE IF NOT EXISTS praticas_diarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  pratica_id INTEGER NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  titulo VARCHAR(255),
  categoria VARCHAR(100),
  duracao_minutos INTEGER,
  completada BOOLEAN DEFAULT false,
  
  -- Feedback pós-prática
  sentimento_pos VARCHAR(50),
  nota_opcional TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(ketero_id, data)
);

ALTER TABLE praticas_diarias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas suas práticas"
  ON praticas_diarias FOR ALL
  USING (ketero_id = auth.uid());

CREATE INDEX idx_praticas_ketero_data ON praticas_diarias(ketero_id, data DESC);
CREATE INDEX idx_praticas_completada ON praticas_diarias(ketero_id, completada);

-- ================================================
-- 4. TABELA: reflexoes_noturnas
-- ================================================
CREATE TABLE IF NOT EXISTS reflexoes_noturnas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Perguntas
  sentimentos_dia TEXT,
  paciencia_bondade VARCHAR(100),
  mudaria_algo TEXT,
  
  -- Análise IA
  analise_ia TEXT,
  palavras_chave JSONB,
  sentimento_detectado VARCHAR(50),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(ketero_id, data)
);

ALTER TABLE reflexoes_noturnas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas suas reflexões"
  ON reflexoes_noturnas FOR ALL
  USING (ketero_id = auth.uid());

CREATE INDEX idx_reflexoes_ketero_data ON reflexoes_noturnas(ketero_id, data DESC);

-- ================================================
-- 5. TABELA: micro_atos
-- ================================================
CREATE TABLE IF NOT EXISTS micro_atos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo VARCHAR(100),
  descricao TEXT,
  executado BOOLEAN DEFAULT false,
  reflexao_pos TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  executado_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE micro_atos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas seus micro-atos"
  ON micro_atos FOR ALL
  USING (ketero_id = auth.uid());

CREATE INDEX idx_microatos_ketero_data ON micro_atos(ketero_id, data DESC);

-- ================================================
-- 6. TABELA: evolucao_fases
-- ================================================
CREATE TABLE IF NOT EXISTS evolucao_fases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  fase INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  data_conclusao DATE,
  criterios_cumpridos JSONB DEFAULT '{}',
  analise_ia TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE evolucao_fases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas suas fases"
  ON evolucao_fases FOR ALL
  USING (ketero_id = auth.uid());

CREATE INDEX idx_fases_ketero ON evolucao_fases(ketero_id, fase);

-- ================================================
-- 7. TABELA: analises_ia
-- ================================================
CREATE TABLE IF NOT EXISTS analises_ia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- 'semanal', 'fase_transicao', 'conversa'
  conteudo TEXT NOT NULL,
  metricas JSONB DEFAULT '{}',
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE analises_ia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas suas análises"
  ON analises_ia FOR ALL
  USING (ketero_id = auth.uid());

CREATE INDEX idx_analises_ketero_tipo ON analises_ia(ketero_id, tipo, created_at DESC);

-- ================================================
-- 8. TABELA: conversas_guia
-- ================================================
CREATE TABLE IF NOT EXISTS conversas_guia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  mensagem_ketero TEXT NOT NULL,
  resposta_ia TEXT NOT NULL,
  contexto JSONB DEFAULT '{}',
  tokens_usados INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE conversas_guia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas suas conversas"
  ON conversas_guia FOR ALL
  USING (ketero_id = auth.uid());

CREATE INDEX idx_conversas_ketero ON conversas_guia(ketero_id, created_at DESC);

-- ================================================
-- 9. TABELA: conquistas
-- ================================================
CREATE TABLE IF NOT EXISTS conquistas (
  id VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  criterio JSONB NOT NULL,
  icone VARCHAR(100),
  raridade VARCHAR(20) DEFAULT 'comum',
  ativo BOOLEAN DEFAULT true
);

-- Popular conquistas iniciais
INSERT INTO conquistas (id, nome, descricao, criterio, icone, raridade) VALUES
  ('primeiro-passo', 'Primeiro Passo', 'Completou sua primeira prática!', '{"totalPraticas": 1}', 'target', 'comum'),
  ('semana-completa', 'Constância', '7 dias de prática seguida!', '{"sequencia": 7}', 'flame', 'rara'),
  ('21-dias', 'Disciplinado', '21 dias de prática seguida!', '{"sequencia": 21}', 'trophy', 'epica'),
  ('10-reflexoes', 'Reflexivo', '10 reflexões completas!', '{"totalReflexoes": 10}', 'book-open', 'comum'),
  ('fase-2', 'Evoluído', 'Chegou à Fase 2: Disciplina!', '{"faseAtual": 2}', 'zap', 'rara'),
  ('10-microatos', 'Bondoso', '10 micro-atos de bondade!', '{"totalMicroAtos": 10}', 'heart', 'rara');

-- ================================================
-- 10. TABELA: keteros_conquistas
-- ================================================
CREATE TABLE IF NOT EXISTS keteros_conquistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  conquista_id VARCHAR(50) REFERENCES conquistas(id),
  desbloqueada_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visualizada BOOLEAN DEFAULT false,
  UNIQUE(ketero_id, conquista_id)
);

ALTER TABLE keteros_conquistas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas suas conquistas"
  ON keteros_conquistas FOR ALL
  USING (ketero_id = auth.uid());

CREATE INDEX idx_conquistas_ketero ON keteros_conquistas(ketero_id);

-- ================================================
-- 11. TABELA: circulos (para Fase 6)
-- ================================================
CREATE TABLE IF NOT EXISTS circulos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  tema VARCHAR(255),
  descricao TEXT,
  emoji VARCHAR(10) DEFAULT '🌟',
  maximo_membros INTEGER DEFAULT 12,
  fase_minima_requerida INTEGER DEFAULT 3,
  criado_por UUID REFERENCES keteros(id),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE circulos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver círculos ativos"
  ON circulos FOR SELECT
  USING (ativo = true);

CREATE POLICY "Apenas criador pode atualizar círculo"
  ON circulos FOR UPDATE
  USING (criado_por = auth.uid());

-- ================================================
-- 12. TABELA: circulos_membros
-- ================================================
CREATE TABLE IF NOT EXISTS circulos_membros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  papel VARCHAR(20) DEFAULT 'membro', -- 'admin', 'moderador', 'membro'
  entrou_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ativo BOOLEAN DEFAULT true,
  UNIQUE(circulo_id, ketero_id)
);

ALTER TABLE circulos_membros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Membros veem participantes do círculo"
  ON circulos_membros FOR SELECT
  USING (
    circulo_id IN (
      SELECT circulo_id FROM circulos_membros WHERE ketero_id = auth.uid() AND ativo = true
    )
  );

-- ================================================
-- 13. TABELA: circulos_mensagens
-- ================================================
CREATE TABLE IF NOT EXISTS circulos_mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  editada BOOLEAN DEFAULT false,
  deletada BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE circulos_mensagens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Membros veem mensagens do círculo"
  ON circulos_mensagens FOR SELECT
  USING (
    circulo_id IN (
      SELECT circulo_id FROM circulos_membros WHERE ketero_id = auth.uid() AND ativo = true
    )
  );

CREATE INDEX idx_mensagens_circulo ON circulos_mensagens(circulo_id, created_at DESC);

-- ================================================
-- FUNCTIONS & TRIGGERS
-- ================================================

-- Função: Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para keteros
CREATE TRIGGER update_keteros_updated_at
  BEFORE UPDATE ON keteros
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função: Verificar e desbloquear conquistas
CREATE OR REPLACE FUNCTION verificar_conquistas()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar conquista "primeiro-passo"
  IF NEW.total_praticas = 1 THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id)
    VALUES (NEW.id, 'primeiro-passo')
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING;
  END IF;
  
  -- Verificar conquista "semana-completa"
  IF NEW.sequencia_atual = 7 THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id)
    VALUES (NEW.id, 'semana-completa')
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING;
  END IF;
  
  -- Verificar conquista "21-dias"
  IF NEW.sequencia_atual = 21 THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id)
    VALUES (NEW.id, '21-dias')
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING;
  END IF;
  
  -- Verificar conquista "10-reflexoes"
  IF NEW.total_reflexoes = 10 THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id)
    VALUES (NEW.id, '10-reflexoes')
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING;
  END IF;
  
  -- Verificar conquista "fase-2"
  IF NEW.fase_atual = 2 AND OLD.fase_atual < 2 THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id)
    VALUES (NEW.id, 'fase-2')
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING;
  END IF;
  
  -- Verificar conquista "10-microatos"
  IF NEW.total_micro_atos = 10 THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id)
    VALUES (NEW.id, '10-microatos')
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar conquistas
CREATE TRIGGER trigger_verificar_conquistas
  AFTER UPDATE ON keteros
  FOR EACH ROW
  EXECUTE FUNCTION verificar_conquistas();

-- ================================================
-- VIEWS ÚTEIS
-- ================================================

-- View: Resumo do Ketero
CREATE OR REPLACE VIEW ketero_resumo AS
SELECT 
  k.id,
  k.nome,
  k.email,
  k.fase_atual,
  k.dia_na_fase,
  k.dia_total_app,
  k.sequencia_atual,
  k.total_praticas,
  k.total_reflexoes,
  k.total_micro_atos,
  COUNT(DISTINCT kc.conquista_id) as total_conquistas
FROM keteros k
LEFT JOIN keteros_conquistas kc ON k.id = kc.ketero_id
GROUP BY k.id;

-- ================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ================================================
COMMENT ON TABLE keteros IS 'Tabela principal de usuários do KETER';
COMMENT ON TABLE praticas_diarias IS 'Registro de práticas diárias realizadas';
COMMENT ON TABLE reflexoes_noturnas IS 'Reflexões noturnas com análise de IA';
COMMENT ON TABLE analises_ia IS 'Análises semanais e contextuais geradas pela IA';
COMMENT ON TABLE conquistas IS 'Catálogo de conquistas disponíveis';
COMMENT ON TABLE keteros_conquistas IS 'Conquistas desbloqueadas por cada usuário';

-- ================================================
-- FIM DO SCHEMA
-- ================================================
-- Para executar:
-- 1. Acesse seu projeto Supabase
-- 2. Vá em SQL Editor
-- 3. Cole todo este conteúdo
-- 4. Execute (Run)
-- 5. Verifique se todas as tabelas foram criadas
