-- ================================================
-- ATUALIZAÇÃO DO SCHEMA - Reflexões Noturnas Enhanced
-- ================================================
-- Execute no SQL Editor do Supabase

-- 1. Criar tabela reflexoes se não existir (com novos campos)
CREATE TABLE IF NOT EXISTS reflexoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Perguntas da reflexão (formato novo)
  humor_dia INTEGER CHECK (humor_dia BETWEEN 1 AND 10),
  padroes_linguisticos TEXT,
  aprendizado_praticas TEXT,
  micro_ato_realizado BOOLEAN DEFAULT false,
  micro_ato_descricao TEXT,
  notas_livres TEXT,
  
  -- Análise IA
  analise_ia TEXT,
  sentimento_detectado VARCHAR(50),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(ketero_id, data)
);

-- 2. Habilitar RLS
ALTER TABLE reflexoes ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de segurança
DROP POLICY IF EXISTS "Usuários veem apenas suas reflexões" ON reflexoes;
CREATE POLICY "Usuários veem apenas suas reflexões"
  ON reflexoes FOR ALL
  USING (ketero_id = auth.uid());

-- 4. Índices para performance
CREATE INDEX IF NOT EXISTS idx_reflexoes_ketero_data ON reflexoes(ketero_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_reflexoes_created ON reflexoes(created_at DESC);

-- 5. Adicionar conquista "Reflexivo Iniciante" (3 dias consecutivos)
INSERT INTO conquistas (id, nome, descricao, criterio, icone, raridade)
VALUES (
  'reflexivo-iniciante',
  'Reflexivo Iniciante',
  'Completou 3 reflexões noturnas consecutivas!',
  '{"reflexoes_consecutivas": 3}',
  'moon',
  'comum'
)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  criterio = EXCLUDED.criterio;

-- 6. Função para incrementar contador de reflexões
CREATE OR REPLACE FUNCTION increment_reflexoes(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE keteros
  SET 
    total_reflexoes = total_reflexoes + 1,
    ultimo_acesso = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Função para verificar reflexões consecutivas
CREATE OR REPLACE FUNCTION verificar_reflexoes_consecutivas(p_user_id UUID, p_quantidade INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  reflexoes_count INTEGER;
  ultima_data DATE;
  data_atual DATE;
  consecutivo BOOLEAN := TRUE;
BEGIN
  -- Pegar as últimas N reflexões
  SELECT COUNT(*), MAX(data) INTO reflexoes_count, ultima_data
  FROM reflexoes
  WHERE ketero_id = p_user_id;

  -- Se não tiver reflexões suficientes, retornar falso
  IF reflexoes_count < p_quantidade THEN
    RETURN FALSE;
  END IF;

  -- Verificar se as últimas reflexões são consecutivas
  -- Para ordem DESC: data_anterior (mais recente) - data (mais antiga) = 1
  SELECT COUNT(*) = p_quantidade INTO consecutivo
  FROM (
    SELECT data, 
           LAG(data) OVER (ORDER BY data DESC) as data_anterior
    FROM reflexoes
    WHERE ketero_id = p_user_id
    ORDER BY data DESC
    LIMIT p_quantidade
  ) sub
  WHERE data_anterior IS NULL 
     OR data_anterior - data = 1;  -- For DESC order: newer - older = 1

  RETURN consecutivo;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger para verificar conquista após nova reflexão
CREATE OR REPLACE FUNCTION check_reflexao_conquistas()
RETURNS TRIGGER AS $$
DECLARE
  total_reflexoes INTEGER;
BEGIN
  -- Verificar conquista "Reflexivo Iniciante" (3 dias consecutivos)
  IF verificar_reflexoes_consecutivas(NEW.ketero_id, 3) THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id)
    VALUES (NEW.ketero_id, 'reflexivo-iniciante')
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING;
  END IF;

  -- Verificar conquista "10-reflexoes" (10 reflexões totais)
  SELECT COUNT(*) INTO total_reflexoes
  FROM reflexoes
  WHERE ketero_id = NEW.ketero_id;

  IF total_reflexoes >= 10 THEN
    INSERT INTO keteros_conquistas (ketero_id, conquista_id)
    VALUES (NEW.ketero_id, '10-reflexoes')
    ON CONFLICT (ketero_id, conquista_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Criar trigger
DROP TRIGGER IF EXISTS trigger_check_reflexao_conquistas ON reflexoes;
CREATE TRIGGER trigger_check_reflexao_conquistas
  AFTER INSERT ON reflexoes
  FOR EACH ROW
  EXECUTE FUNCTION check_reflexao_conquistas();

-- 10. Comentários para documentação
COMMENT ON TABLE reflexoes IS 'Reflexões noturnas dos usuários com análise IA';
COMMENT ON COLUMN reflexoes.humor_dia IS 'Humor do dia de 1 a 10';
COMMENT ON COLUMN reflexoes.padroes_linguisticos IS 'Padrões linguísticos observados';
COMMENT ON COLUMN reflexoes.aprendizado_praticas IS 'Aprendizados das práticas do dia';
COMMENT ON COLUMN reflexoes.micro_ato_realizado IS 'Se realizou um micro-ato de bondade';
COMMENT ON COLUMN reflexoes.micro_ato_descricao IS 'Descrição do micro-ato';
COMMENT ON COLUMN reflexoes.notas_livres IS 'Notas livres adicionais';

-- ================================================
-- FIM DA ATUALIZAÇÃO
-- ================================================
