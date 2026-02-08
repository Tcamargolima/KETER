-- ================================================
-- MIGRATION: Micro-atos Functions and Updates
-- ================================================
-- Funções SQL para suportar o sistema de micro-atos

-- ================================================
-- 1. Função para incrementar contador de micro-atos
-- ================================================
CREATE OR REPLACE FUNCTION increment_micro_atos(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE keteros
  SET 
    total_micro_atos = COALESCE(total_micro_atos, 0) + 1,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$;

-- ================================================
-- 2. Adicionar coluna total_micro_atos se não existir
-- ================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'keteros' 
    AND column_name = 'total_micro_atos'
  ) THEN
    ALTER TABLE keteros ADD COLUMN total_micro_atos INTEGER DEFAULT 0;
  END IF;
END $$;

-- ================================================
-- 3. Função para verificar conquistas de micro-atos
-- ================================================
CREATE OR REPLACE FUNCTION verificar_conquistas_micro_atos(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_micro_atos INTEGER;
  sequencia_dias INTEGER;
BEGIN
  -- Obter estatísticas do usuário
  SELECT 
    COALESCE(COUNT(*), 0) FILTER (WHERE executado = true),
    COALESCE(COUNT(DISTINCT data), 0) FILTER (WHERE executado = true)
  INTO total_micro_atos, sequencia_dias
  FROM micro_atos
  WHERE ketero_id = user_id;

  -- Conquista: Primeiro micro-ato (1 ato)
  IF total_micro_atos >= 1 THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id, desbloqueada_em, visualizada)
    VALUES (user_id, 'primeiro_micro_ato', NOW(), false)
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING;
  END IF;

  -- Conquista: Bondade Iniciante (7 atos)
  IF total_micro_atos >= 7 THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id, desbloqueada_em, visualizada)
    VALUES (user_id, 'bondade_iniciante', NOW(), false)
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING;
  END IF;

  -- Conquista: Coração Generoso (30 atos)
  IF total_micro_atos >= 30 THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id, desbloqueada_em, visualizada)
    VALUES (user_id, 'coracao_generoso', NOW(), false)
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING;
  END IF;

  -- Conquista: Agente de Luz (100 atos)
  IF total_micro_atos >= 100 THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id, desbloqueada_em, visualizada)
    VALUES (user_id, 'agente_de_luz', NOW(), false)
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING;
  END IF;

  -- Conquista: Sequência de 7 dias
  IF sequencia_dias >= 7 THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id, desbloqueada_em, visualizada)
    VALUES (user_id, 'bondade_consistente', NOW(), false)
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING;
  END IF;
END;
$$;

-- ================================================
-- 4. Inserir conquistas relacionadas a micro-atos
-- ================================================
INSERT INTO conquistas (id, titulo, descricao, icone, nivel, categoria)
VALUES 
  (
    'primeiro_micro_ato',
    'Primeiro Passo',
    'Realizou seu primeiro micro-ato de bondade',
    '💝',
    1,
    'micro_atos'
  ),
  (
    'bondade_iniciante',
    'Bondade Iniciante',
    'Completou 7 micro-atos de bondade',
    '🌸',
    2,
    'micro_atos'
  ),
  (
    'bondade_consistente',
    'Bondade Consistente',
    'Realizou micro-atos por 7 dias seguidos',
    '🔥',
    3,
    'micro_atos'
  ),
  (
    'coracao_generoso',
    'Coração Generoso',
    'Completou 30 micro-atos de bondade',
    '💖',
    4,
    'micro_atos'
  ),
  (
    'agente_de_luz',
    'Agente de Luz',
    'Realizou 100 micro-atos de bondade',
    '✨',
    5,
    'micro_atos'
  )
ON CONFLICT (id) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  descricao = EXCLUDED.descricao,
  icone = EXCLUDED.icone,
  nivel = EXCLUDED.nivel,
  categoria = EXCLUDED.categoria;

-- ================================================
-- 5. Trigger para atualizar contador automaticamente
-- ================================================
CREATE OR REPLACE FUNCTION atualizar_contador_micro_atos()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.executado = true AND (OLD.executado IS NULL OR OLD.executado = false) THEN
    UPDATE keteros
    SET total_micro_atos = COALESCE(total_micro_atos, 0) + 1
    WHERE id = NEW.ketero_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS trigger_contador_micro_atos ON micro_atos;
CREATE TRIGGER trigger_contador_micro_atos
  AFTER INSERT OR UPDATE ON micro_atos
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_contador_micro_atos();

-- ================================================
-- 6. View para estatísticas de micro-atos
-- ================================================
CREATE OR REPLACE VIEW view_micro_atos_stats AS
SELECT 
  k.id as ketero_id,
  k.nome,
  COUNT(*) FILTER (WHERE m.executado = true) as total_realizados,
  COUNT(DISTINCT m.tipo) FILTER (WHERE m.executado = true) as categorias_diferentes,
  MAX(m.executado_at) as ultimo_realizado,
  COUNT(*) FILTER (WHERE m.executado = true AND m.data >= CURRENT_DATE - INTERVAL '7 days') as ultimos_7_dias
FROM keteros k
LEFT JOIN micro_atos m ON k.id = m.ketero_id
GROUP BY k.id, k.nome;

-- ================================================
-- 7. Índices para performance
-- ================================================
CREATE INDEX IF NOT EXISTS idx_micro_atos_executado ON micro_atos(executado) WHERE executado = true;
CREATE INDEX IF NOT EXISTS idx_micro_atos_tipo ON micro_atos(tipo);
CREATE INDEX IF NOT EXISTS idx_micro_atos_executado_at ON micro_atos(executado_at DESC) WHERE executado_at IS NOT NULL;

-- ================================================
-- 8. Comentários para documentação
-- ================================================
COMMENT ON FUNCTION increment_micro_atos IS 'Incrementa o contador de micro-atos realizados pelo usuário';
COMMENT ON FUNCTION verificar_conquistas_micro_atos IS 'Verifica e desbloqueia conquistas relacionadas a micro-atos';
COMMENT ON VIEW view_micro_atos_stats IS 'Estatísticas agregadas de micro-atos por usuário';
