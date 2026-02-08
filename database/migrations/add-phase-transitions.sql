-- ================================================
-- MIGRATION: TRANSIÇÕES DE FASE
-- ================================================
-- Execute no SQL Editor do Supabase

-- Atualizar tabela keteros para suportar 5 fases (adicionando Semente)
ALTER TABLE keteros 
  DROP CONSTRAINT IF EXISTS keteros_fase_atual_check,
  ADD CONSTRAINT keteros_fase_atual_check CHECK (fase_atual BETWEEN 0 AND 4);

-- Adicionar campos para transições
ALTER TABLE keteros 
  ADD COLUMN IF NOT EXISTS fase_nome VARCHAR(50) DEFAULT 'Semente',
  ADD COLUMN IF NOT EXISTS progresso_fase DECIMAL(5,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS data_inicio_fase TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS historico_fases JSONB DEFAULT '[]';

-- ================================================
-- TABELA: transicoes_fase
-- ================================================
CREATE TABLE IF NOT EXISTS transicoes_fase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  fase_anterior INTEGER NOT NULL,
  fase_nova INTEGER NOT NULL,
  data_transicao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Métricas da fase anterior
  dias_na_fase INTEGER,
  praticas_completadas INTEGER,
  reflexoes_feitas INTEGER,
  micro_atos_realizados INTEGER,
  sequencia_maxima_alcancada INTEGER,
  
  -- Conquistas desbloqueadas na transição
  conquistas_desbloqueadas JSONB DEFAULT '[]',
  
  -- Mensagem personalizada da IA
  mensagem_ia TEXT,
  insight_principal TEXT,
  
  -- Visualização
  animacao_vista BOOLEAN DEFAULT false,
  feedback_usuario TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE transicoes_fase ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas suas transições"
  ON transicoes_fase FOR ALL
  USING (ketero_id = auth.uid());

-- Índices
CREATE INDEX idx_transicoes_ketero ON transicoes_fase(ketero_id);
CREATE INDEX idx_transicoes_data ON transicoes_fase(data_transicao DESC);

-- ================================================
-- FUNÇÃO: Calcular Progresso da Fase
-- ================================================
CREATE OR REPLACE FUNCTION calcular_progresso_fase(ketero_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  fase_atual_val INTEGER;
  dias_na_fase_val INTEGER;
  duracao_fase INTEGER;
  praticas_completadas_val INTEGER;
  reflexoes_feitas_val INTEGER;
  progresso DECIMAL;
BEGIN
  -- Buscar dados do ketero
  SELECT fase_atual, dia_na_fase, total_praticas, total_reflexoes
  INTO fase_atual_val, dias_na_fase_val, praticas_completadas_val, reflexoes_feitas_val
  FROM keteros
  WHERE id = ketero_uuid;
  
  -- Definir duração da fase
  duracao_fase := CASE fase_atual_val
    WHEN 0 THEN 7   -- Semente: 7 dias
    WHEN 1 THEN 14  -- Despertar: 14 dias
    WHEN 2 THEN 16  -- Disciplina: 16 dias
    WHEN 3 THEN 30  -- Consciência: 30 dias
    WHEN 4 THEN NULL -- Serviço: infinito
    ELSE 14
  END;
  
  -- Se fase infinita, usar métricas alternativas
  IF duracao_fase IS NULL THEN
    -- Fase Serviço: progresso baseado em ações
    progresso := LEAST(100.00, (praticas_completadas_val + reflexoes_feitas_val) * 0.5);
  ELSE
    -- Calcular progresso baseado em dias
    progresso := (dias_na_fase_val::DECIMAL / duracao_fase::DECIMAL) * 100.0;
    
    -- Bonus por práticas e reflexões
    progresso := progresso + (praticas_completadas_val * 0.5);
    progresso := progresso + (reflexoes_feitas_val * 0.3);
    
    -- Limitar a 100%
    progresso := LEAST(100.00, progresso);
  END IF;
  
  RETURN ROUND(progresso, 2);
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- FUNÇÃO: Verificar e Executar Transição de Fase
-- ================================================
CREATE OR REPLACE FUNCTION verificar_transicao_fase(ketero_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  fase_atual_val INTEGER;
  progresso_atual DECIMAL;
  pode_transitar BOOLEAN := FALSE;
  nova_fase INTEGER;
BEGIN
  -- Buscar fase atual
  SELECT fase_atual INTO fase_atual_val
  FROM keteros
  WHERE id = ketero_uuid;
  
  -- Calcular progresso
  progresso_atual := calcular_progresso_fase(ketero_uuid);
  
  -- Verificar se pode transitar (>= 100%)
  IF progresso_atual >= 100.00 AND fase_atual_val < 4 THEN
    pode_transitar := TRUE;
    nova_fase := fase_atual_val + 1;
    
    -- Registrar transição
    INSERT INTO transicoes_fase (
      ketero_id, fase_anterior, fase_nova, 
      dias_na_fase, praticas_completadas, reflexoes_feitas
    )
    SELECT 
      id, fase_atual, nova_fase,
      dia_na_fase, total_praticas, total_reflexoes
    FROM keteros
    WHERE id = ketero_uuid;
    
    -- Atualizar ketero
    UPDATE keteros SET
      fase_atual = nova_fase,
      fase_nome = CASE nova_fase
        WHEN 1 THEN 'Despertar'
        WHEN 2 THEN 'Disciplina'
        WHEN 3 THEN 'Consciência'
        WHEN 4 THEN 'Serviço'
        ELSE 'Semente'
      END,
      dia_na_fase = 1,
      progresso_fase = 0.00,
      data_inicio_fase = NOW(),
      historico_fases = historico_fases || jsonb_build_object(
        'fase', fase_atual_val,
        'inicio', data_inicio_fase,
        'fim', NOW(),
        'dias', dia_na_fase
      )
    WHERE id = ketero_uuid;
  END IF;
  
  RETURN pode_transitar;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- TRIGGER: Atualizar progresso após prática/reflexão
-- ================================================
CREATE OR REPLACE FUNCTION atualizar_progresso_fase_trigger()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE keteros SET
    progresso_fase = calcular_progresso_fase(NEW.ketero_id)
  WHERE id = NEW.ketero_id;
  
  -- Verificar se deve transitar
  PERFORM verificar_transicao_fase(NEW.ketero_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para práticas
DROP TRIGGER IF EXISTS trigger_progresso_pratica ON praticas_diarias;
CREATE TRIGGER trigger_progresso_pratica
  AFTER INSERT OR UPDATE ON praticas_diarias
  FOR EACH ROW
  WHEN (NEW.completada = TRUE)
  EXECUTE FUNCTION atualizar_progresso_fase_trigger();

-- Trigger para reflexões (assumindo que existe a tabela)
DROP TRIGGER IF EXISTS trigger_progresso_reflexao ON reflexoes_noturnas;
CREATE TRIGGER trigger_progresso_reflexao
  AFTER INSERT ON reflexoes_noturnas
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_progresso_fase_trigger();

-- ================================================
-- VIEW: Resumo de Progresso
-- ================================================
CREATE OR REPLACE VIEW v_progresso_fase AS
SELECT 
  k.id,
  k.email,
  k.nome,
  k.fase_atual,
  k.fase_nome,
  k.dia_na_fase,
  k.progresso_fase,
  k.data_inicio_fase,
  CASE k.fase_atual
    WHEN 0 THEN 7
    WHEN 1 THEN 14
    WHEN 2 THEN 16
    WHEN 3 THEN 30
    ELSE NULL
  END as duracao_fase_dias,
  k.total_praticas,
  k.total_reflexoes,
  k.total_micro_atos,
  k.sequencia_atual,
  k.sequencia_maxima,
  (
    SELECT COUNT(*) 
    FROM transicoes_fase t 
    WHERE t.ketero_id = k.id
  ) as total_transicoes
FROM keteros k;

-- Comentários
COMMENT ON TABLE transicoes_fase IS 'Histórico de transições entre fases do desenvolvimento';
COMMENT ON FUNCTION calcular_progresso_fase IS 'Calcula progresso percentual na fase atual';
COMMENT ON FUNCTION verificar_transicao_fase IS 'Verifica e executa transição automática de fase';