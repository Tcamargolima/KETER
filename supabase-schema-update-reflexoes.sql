-- ================================================
-- ATUALIZAÇÃO DO SCHEMA - REFLEXÕES NOTURNAS
-- ================================================
-- Este arquivo adiciona colunas para suportar reflexões das Fases 2 e 3
-- Execute no SQL Editor do Supabase

-- Adicionar colunas para Fase 2
ALTER TABLE reflexoes_noturnas 
ADD COLUMN IF NOT EXISTS micro_ato_executado VARCHAR(100),
ADD COLUMN IF NOT EXISTS desafio_disciplina TEXT,
ADD COLUMN IF NOT EXISTS gratidao_dia TEXT;

-- Adicionar colunas para Fase 3
ALTER TABLE reflexoes_noturnas
ADD COLUMN IF NOT EXISTS observacao_mudanca TEXT,
ADD COLUMN IF NOT EXISTS momento_consciencia VARCHAR(100),
ADD COLUMN IF NOT EXISTS padrao_observado TEXT,
ADD COLUMN IF NOT EXISTS impacto_outros TEXT;

-- Comentários para documentação
COMMENT ON COLUMN reflexoes_noturnas.micro_ato_executado IS 'Resposta sobre execução do micro-ato (Fase 2)';
COMMENT ON COLUMN reflexoes_noturnas.desafio_disciplina IS 'Maior desafio de disciplina do dia (Fase 2)';
COMMENT ON COLUMN reflexoes_noturnas.gratidao_dia IS 'Lista de gratidões do dia (Fase 2)';
COMMENT ON COLUMN reflexoes_noturnas.observacao_mudanca IS 'Mudança observada em si mesmo (Fase 3)';
COMMENT ON COLUMN reflexoes_noturnas.momento_consciencia IS 'Presença plena durante o dia (Fase 3)';
COMMENT ON COLUMN reflexoes_noturnas.padrao_observado IS 'Padrões repetitivos detectados (Fase 3)';
COMMENT ON COLUMN reflexoes_noturnas.impacto_outros IS 'Impacto das ações em outros (Fase 3)';

-- Atualizar a função de incremento de reflexões (se não existir)
CREATE OR REPLACE FUNCTION increment_reflexoes(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE keteros
  SET total_reflexoes = total_reflexoes + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- FIM DA ATUALIZAÇÃO
-- ================================================
