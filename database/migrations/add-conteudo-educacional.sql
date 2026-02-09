-- ================================================
-- MIGRATION: Conteúdo Educacional (Fase 10)
-- ================================================
-- Tabela para biblioteca de conteúdo educacional
-- Inspirado em apps como Headspace/Calm/Insight Timer

-- ================================================
-- TABELA: conteudo_educacional
-- ================================================
CREATE TABLE IF NOT EXISTS conteudo_educacional (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  subtitulo TEXT,
  
  -- Fase relacionada (pode ser NULL para conteúdo universal)
  fase VARCHAR(50), -- 'DESPERTAR', 'DISCIPLINA', 'CONSCIÊNCIA', 'SERVIÇO', NULL
  
  -- Tipo de conteúdo
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('artigo', 'video', 'audio', 'curso_curto')),
  
  -- Conteúdo
  conteudo_texto TEXT, -- Texto Markdown para artigos
  url TEXT, -- URL para vídeos (YouTube/Vimeo embed) ou áudios (Supabase Storage)
  
  -- Metadados
  duracao_min INTEGER, -- Duração em minutos (para vídeos e áudios)
  autor VARCHAR(255),
  capa_url TEXT, -- URL da imagem de capa
  
  -- Organização
  ordem INTEGER DEFAULT 0,
  categoria VARCHAR(100), -- Ex: 'Meditação', 'Mindfulness', 'Bondade', etc.
  tags JSONB DEFAULT '[]', -- Array de tags: ['mindfulness', 'evolucao', 'bondade']
  
  -- Status
  publicado BOOLEAN DEFAULT true,
  destaque BOOLEAN DEFAULT false, -- Destacar na home
  
  -- Estatísticas
  visualizacoes INTEGER DEFAULT 0,
  favoritos INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários
COMMENT ON TABLE conteudo_educacional IS 'Biblioteca de conteúdo educacional (artigos, vídeos, áudios, cursos)';
COMMENT ON COLUMN conteudo_educacional.fase IS 'Fase relacionada ao conteúdo (NULL = universal)';
COMMENT ON COLUMN conteudo_educacional.tipo IS 'Tipo: artigo, video, audio, curso_curto';
COMMENT ON COLUMN conteudo_educacional.conteudo_texto IS 'Texto em Markdown para artigos';
COMMENT ON COLUMN conteudo_educacional.url IS 'URL embed (YouTube/Vimeo) ou Storage (áudio)';
COMMENT ON COLUMN conteudo_educacional.tags IS 'Array de tags JSONB';

-- Índices
CREATE INDEX idx_conteudo_fase ON conteudo_educacional(fase);
CREATE INDEX idx_conteudo_tipo ON conteudo_educacional(tipo);
CREATE INDEX idx_conteudo_publicado ON conteudo_educacional(publicado);
CREATE INDEX idx_conteudo_ordem ON conteudo_educacional(ordem);
CREATE INDEX idx_conteudo_tags ON conteudo_educacional USING GIN (tags);

-- ================================================
-- TABELA: conteudo_favoritos (relação usuário-conteúdo)
-- ================================================
CREATE TABLE IF NOT EXISTS conteudo_favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  conteudo_id UUID REFERENCES conteudo_educacional(id) ON DELETE CASCADE,
  
  -- Progresso (para cursos)
  progresso INTEGER DEFAULT 0, -- 0-100%
  completado BOOLEAN DEFAULT false,
  
  -- Offline
  baixado_offline BOOLEAN DEFAULT false,
  
  -- Timestamps
  adicionado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultima_visualizacao TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(ketero_id, conteudo_id)
);

-- Comentários
COMMENT ON TABLE conteudo_favoritos IS 'Conteúdos favoritos e progresso dos usuários';

-- Índices
CREATE INDEX idx_favoritos_ketero ON conteudo_favoritos(ketero_id);
CREATE INDEX idx_favoritos_conteudo ON conteudo_favoritos(conteudo_id);
CREATE INDEX idx_favoritos_offline ON conteudo_favoritos(baixado_offline);

-- ================================================
-- TABELA: conteudo_visualizacoes (histórico)
-- ================================================
CREATE TABLE IF NOT EXISTS conteudo_visualizacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  conteudo_id UUID REFERENCES conteudo_educacional(id) ON DELETE CASCADE,
  
  -- Tempo assistido (para vídeos/áudios)
  tempo_assistido_min INTEGER DEFAULT 0,
  completou BOOLEAN DEFAULT false,
  
  visualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_visualizacoes_ketero ON conteudo_visualizacoes(ketero_id);
CREATE INDEX idx_visualizacoes_conteudo ON conteudo_visualizacoes(conteudo_id);
CREATE INDEX idx_visualizacoes_data ON conteudo_visualizacoes(visualizado_em DESC);

-- ================================================
-- RLS (Row Level Security)
-- ================================================

-- Conteúdo educacional: todos podem ler publicados
ALTER TABLE conteudo_educacional ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ler conteúdo publicado"
  ON conteudo_educacional FOR SELECT
  USING (publicado = true);

-- Favoritos: usuários veem apenas seus próprios
ALTER TABLE conteudo_favoritos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários gerenciam seus favoritos"
  ON conteudo_favoritos FOR ALL
  USING (ketero_id = auth.uid());

-- Visualizações: usuários veem apenas suas próprias
ALTER TABLE conteudo_visualizacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem suas visualizações"
  ON conteudo_visualizacoes FOR ALL
  USING (ketero_id = auth.uid());

-- ================================================
-- FUNÇÕES AUXILIARES
-- ================================================

-- Incrementar contador de visualizações
CREATE OR REPLACE FUNCTION incrementar_visualizacoes_conteudo()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conteudo_educacional
  SET visualizacoes = visualizacoes + 1
  WHERE id = NEW.conteudo_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_incrementar_visualizacoes
  AFTER INSERT ON conteudo_visualizacoes
  FOR EACH ROW
  EXECUTE FUNCTION incrementar_visualizacoes_conteudo();

-- Atualizar contador de favoritos
CREATE OR REPLACE FUNCTION atualizar_favoritos_conteudo()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE conteudo_educacional
    SET favoritos = favoritos + 1
    WHERE id = NEW.conteudo_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE conteudo_educacional
    SET favoritos = favoritos - 1
    WHERE id = OLD.conteudo_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_favoritos
  AFTER INSERT OR DELETE ON conteudo_favoritos
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_favoritos_conteudo();

-- Atualizar updated_at
CREATE OR REPLACE FUNCTION atualizar_updated_at_conteudo()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_updated_at_conteudo
  BEFORE UPDATE ON conteudo_educacional
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_updated_at_conteudo();
