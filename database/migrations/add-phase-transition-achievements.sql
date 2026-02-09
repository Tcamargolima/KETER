-- ================================================
-- MIGRATION: Conquistas de Transição de Fase
-- ================================================
-- Adicionar conquistas específicas para transições de fase

-- Conquista: Transcendente Semente (Fase 0 → 1)
INSERT INTO conquistas (id, nome, descricao, criterio, icone, raridade)
VALUES (
  'transcendente-semente',
  'Transcendente Semente',
  'Completou a fase Semente e iniciou sua jornada de transformação!',
  '{"tipo": "transicao_fase", "fase_completada": 0}',
  '🌱',
  'comum'
)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  criterio = EXCLUDED.criterio;

-- Conquista: Transcendente Despertar (Fase 1 → 2)
INSERT INTO conquistas (id, nome, descricao, criterio, icone, raridade)
VALUES (
  'transcendente-despertar',
  'Transcendente do Despertar',
  'Completou a fase Despertar com dedicação e autoconhecimento!',
  '{"tipo": "transicao_fase", "fase_completada": 1}',
  '🌿',
  'raro'
)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  criterio = EXCLUDED.criterio;

-- Conquista: Transcendente Disciplina (Fase 2 → 3)
INSERT INTO conquistas (id, nome, descricao, criterio, icone, raridade)
VALUES (
  'transcendente-disciplina',
  'Transcendente da Disciplina',
  'Completou a fase Disciplina com força e consistência!',
  '{"tipo": "transicao_fase", "fase_completada": 2}',
  '🌳',
  'epico'
)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  criterio = EXCLUDED.criterio;

-- Conquista: Transcendente Consciência (Fase 3 → 4)
INSERT INTO conquistas (id, nome, descricao, criterio, icone, raridade)
VALUES (
  'transcendente-consciencia',
  'Transcendente da Consciência',
  'Completou a fase Consciência com sabedoria e percepção expandida!',
  '{"tipo": "transicao_fase", "fase_completada": 3}',
  '🌲',
  'lendario'
)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  criterio = EXCLUDED.criterio;

-- ================================================
-- FUNÇÃO: Desbloquear Conquista de Transição
-- ================================================
CREATE OR REPLACE FUNCTION desbloquear_conquista_transicao(
  ketero_uuid UUID,
  fase_completada INTEGER
)
RETURNS UUID AS $$
DECLARE
  conquista_id_val TEXT;
  nova_conquista_ketero_id UUID;
BEGIN
  -- Determinar ID da conquista baseado na fase completada
  conquista_id_val := CASE fase_completada
    WHEN 0 THEN 'transcendente-semente'
    WHEN 1 THEN 'transcendente-despertar'
    WHEN 2 THEN 'transcendente-disciplina'
    WHEN 3 THEN 'transcendente-consciencia'
    ELSE NULL
  END;

  -- Se fase válida, inserir conquista
  IF conquista_id_val IS NOT NULL THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id, desbloqueada_em, visualizada)
    VALUES (ketero_uuid, conquista_id_val, NOW(), FALSE)
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING
    RETURNING id INTO nova_conquista_ketero_id;

    RETURN nova_conquista_ketero_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- ATUALIZAR FUNÇÃO verificar_transicao_fase
-- ================================================
-- Adicionar desbloqueio de conquista ao transitar

CREATE OR REPLACE FUNCTION verificar_transicao_fase(ketero_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  fase_atual_val INTEGER;
  progresso_atual DECIMAL;
  pode_transitar BOOLEAN := FALSE;
  nova_fase INTEGER;
  transicao_id_val UUID;
  conquista_desbloqueada_id UUID;
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
      dias_na_fase, praticas_completadas, reflexoes_feitas, sequencia_maxima_alcancada
    )
    SELECT 
      id, fase_atual, nova_fase,
      dia_na_fase, total_praticas, total_reflexoes, sequencia_maxima
    FROM keteros
    WHERE id = ketero_uuid
    RETURNING id INTO transicao_id_val;

    -- Desbloquear conquista de transição
    conquista_desbloqueada_id := desbloquear_conquista_transicao(ketero_uuid, fase_atual_val);

    -- Adicionar conquista à lista de conquistas desbloqueadas na transição
    IF conquista_desbloqueada_id IS NOT NULL THEN
      UPDATE transicoes_fase SET
        conquistas_desbloqueadas = COALESCE(conquistas_desbloqueadas, '[]'::jsonb) || 
          jsonb_build_array(
            CASE fase_atual_val
              WHEN 0 THEN 'transcendente-semente'
              WHEN 1 THEN 'transcendente-despertar'
              WHEN 2 THEN 'transcendente-disciplina'
              WHEN 3 THEN 'transcendente-consciencia'
            END
          )
      WHERE id = transicao_id_val;
    END IF;
    
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

-- Comentários
COMMENT ON FUNCTION desbloquear_conquista_transicao IS 'Desbloqueia conquista específica ao completar uma fase';
