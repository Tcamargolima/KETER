-- ================================================
-- MIGRATION: Criar tabela de práticas (Biblioteca)
-- ================================================
-- Execute no SQL Editor do Supabase

-- 1. Criar tabela praticas (biblioteca de práticas)
CREATE TABLE IF NOT EXISTS praticas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  subtitulo VARCHAR(255),
  fase INTEGER NOT NULL CHECK (fase BETWEEN 1 AND 4),
  categoria VARCHAR(100) NOT NULL,
  duracao_min INTEGER NOT NULL,
  instrucoes_texto TEXT NOT NULL,
  audio_url VARCHAR(500),
  ordem INTEGER NOT NULL,
  
  -- Metadados adicionais
  dificuldade VARCHAR(50) DEFAULT 'Iniciante',
  icone VARCHAR(50),
  cor_categoria VARCHAR(20),
  objetivo TEXT,
  beneficios JSONB DEFAULT '[]',
  dica TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir ordem única por fase
  UNIQUE(fase, ordem)
);

-- 2. Habilitar RLS
ALTER TABLE praticas ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de segurança - práticas são públicas (todos podem ver)
CREATE POLICY "Práticas são visíveis para todos"
  ON praticas FOR SELECT
  USING (true);

-- 4. Índices para performance
CREATE INDEX IF NOT EXISTS idx_praticas_fase ON praticas(fase, ordem);
CREATE INDEX IF NOT EXISTS idx_praticas_categoria ON praticas(categoria);

-- 5. Comentários para documentação
COMMENT ON TABLE praticas IS 'Biblioteca de práticas organizadas por fase e categoria';
COMMENT ON COLUMN praticas.fase IS 'Fase da jornada: 1-Despertar, 2-Disciplina, 3-Consciência, 4-Serviço';
COMMENT ON COLUMN praticas.categoria IS 'Categoria da prática: Respiração, Propósito, Coração, etc';
COMMENT ON COLUMN praticas.duracao_min IS 'Duração em minutos';
COMMENT ON COLUMN praticas.instrucoes_texto IS 'Instruções completas em texto (JSON com etapas)';
COMMENT ON COLUMN praticas.audio_url IS 'URL opcional do áudio guiado';
COMMENT ON COLUMN praticas.ordem IS 'Ordem de apresentação dentro da fase';

-- ================================================
-- FIM DA MIGRATION
-- ================================================
