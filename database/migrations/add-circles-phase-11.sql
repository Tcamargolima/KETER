-- ================================================
-- FASE 11: COMUNIDADE LEVE (CÍRCULOS) - DATABASE SCHEMA
-- ================================================
-- Migration para adicionar suporte a círculos de chat em grupo

-- ================================================
-- 1. TABELA: circulos (Círculos de Chat)
-- ================================================
CREATE TABLE IF NOT EXISTS circulos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  fase_relacionada INTEGER CHECK (fase_relacionada BETWEEN 1 AND 11),
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES keteros(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadados
  descricao TEXT,
  max_membros INTEGER DEFAULT 50,
  cor_tema VARCHAR(20) DEFAULT 'purple'
);

-- Índices para performance
CREATE INDEX idx_circulos_fase ON circulos(fase_relacionada);
CREATE INDEX idx_circulos_public ON circulos(is_public);
CREATE INDEX idx_circulos_created_by ON circulos(created_by);

-- RLS (Row Level Security)
ALTER TABLE circulos ENABLE ROW LEVEL SECURITY;

-- Todos podem ver círculos públicos
CREATE POLICY "Círculos públicos são visíveis para todos"
  ON circulos FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

-- Apenas o criador pode atualizar/deletar
CREATE POLICY "Apenas criador pode atualizar círculo"
  ON circulos FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Apenas criador pode deletar círculo"
  ON circulos FOR DELETE
  USING (created_by = auth.uid());

-- Qualquer usuário autenticado pode criar círculo
CREATE POLICY "Usuários autenticados podem criar círculos"
  ON circulos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ================================================
-- 2. TABELA: circulo_membros (Membros dos Círculos)
-- ================================================
CREATE TABLE IF NOT EXISTS circulo_membros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES keteros(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'moderator', 'member')),
  
  UNIQUE(circulo_id, user_id)
);

-- Índices
CREATE INDEX idx_circulo_membros_circulo ON circulo_membros(circulo_id);
CREATE INDEX idx_circulo_membros_user ON circulo_membros(user_id);

-- RLS
ALTER TABLE circulo_membros ENABLE ROW LEVEL SECURITY;

-- Membros podem ver quem está no círculo
CREATE POLICY "Membros veem membros do círculo"
  ON circulo_membros FOR SELECT
  USING (
    circulo_id IN (
      SELECT circulo_id FROM circulo_membros WHERE user_id = auth.uid()
    )
    OR circulo_id IN (
      SELECT id FROM circulos WHERE is_public = true
    )
  );

-- Usuários podem entrar em círculos
CREATE POLICY "Usuários podem entrar em círculos"
  ON circulo_membros FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    (
      -- Pode entrar em círculo público
      circulo_id IN (SELECT id FROM circulos WHERE is_public = true)
      -- Ou foi convidado (implementar convites no futuro)
    )
  );

-- Usuários podem sair de círculos
CREATE POLICY "Usuários podem sair de círculos"
  ON circulo_membros FOR DELETE
  USING (user_id = auth.uid());

-- Owner pode remover membros
CREATE POLICY "Owner pode remover membros"
  ON circulo_membros FOR DELETE
  USING (
    circulo_id IN (
      SELECT circulo_id FROM circulo_membros 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- ================================================
-- 3. TABELA: circulo_mensagens (Mensagens dos Círculos)
-- ================================================
CREATE TABLE IF NOT EXISTS circulo_mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES keteros(id) ON DELETE SET NULL,
  mensagem TEXT NOT NULL,
  anonimo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadados
  user_nome VARCHAR(255), -- Cache do nome para mensagens anônimas
  editada BOOLEAN DEFAULT false
);

-- Índices
CREATE INDEX idx_circulo_mensagens_circulo ON circulo_mensagens(circulo_id);
CREATE INDEX idx_circulo_mensagens_user ON circulo_mensagens(user_id);
CREATE INDEX idx_circulo_mensagens_created ON circulo_mensagens(created_at);

-- RLS
ALTER TABLE circulo_mensagens ENABLE ROW LEVEL SECURITY;

-- Membros podem ler mensagens
CREATE POLICY "Membros podem ler mensagens do círculo"
  ON circulo_mensagens FOR SELECT
  USING (
    deleted_at IS NULL AND
    circulo_id IN (
      SELECT circulo_id FROM circulo_membros WHERE user_id = auth.uid()
    )
  );

-- Membros podem enviar mensagens
CREATE POLICY "Membros podem enviar mensagens"
  ON circulo_mensagens FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    circulo_id IN (
      SELECT circulo_id FROM circulo_membros WHERE user_id = auth.uid()
    )
  );

-- Usuário pode atualizar suas próprias mensagens
CREATE POLICY "Usuários podem editar suas mensagens"
  ON circulo_mensagens FOR UPDATE
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Owner pode deletar qualquer mensagem (soft delete)
CREATE POLICY "Owner pode deletar mensagens"
  ON circulo_mensagens FOR UPDATE
  USING (
    circulo_id IN (
      SELECT circulo_id FROM circulo_membros 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- ================================================
-- 4. FUNÇÕES AUXILIARES
-- ================================================

-- Função para adicionar criador como owner automaticamente
CREATE OR REPLACE FUNCTION add_creator_as_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO circulo_membros (circulo_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_creator_as_owner
  AFTER INSERT ON circulos
  FOR EACH ROW
  EXECUTE FUNCTION add_creator_as_owner();

-- Função para contar membros de um círculo
CREATE OR REPLACE FUNCTION count_circulo_membros(circulo_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM circulo_membros WHERE circulo_id = circulo_uuid;
$$ LANGUAGE sql STABLE;

-- Função para verificar se usuário é membro
CREATE OR REPLACE FUNCTION is_circulo_member(circulo_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM circulo_membros 
    WHERE circulo_id = circulo_uuid AND user_id = user_uuid
  );
$$ LANGUAGE sql STABLE;

-- Função para obter última mensagem de um círculo
CREATE OR REPLACE FUNCTION get_last_message(circulo_uuid UUID)
RETURNS TABLE(mensagem TEXT, created_at TIMESTAMPTZ) AS $$
  SELECT mensagem, created_at 
  FROM circulo_mensagens 
  WHERE circulo_id = circulo_uuid AND deleted_at IS NULL
  ORDER BY created_at DESC 
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- ================================================
-- 5. SEED DATA - Círculos Públicos por Fase
-- ================================================

-- Círculos públicos para cada fase (exemplo)
INSERT INTO circulos (nome, fase_relacionada, is_public, descricao, cor_tema)
VALUES 
  ('Primeiros Passos 🌱', 1, true, 'Para quem está começando a jornada KETER', 'green'),
  ('Reflexões Diárias ☀️', 1, true, 'Compartilhe suas reflexões e insights', 'amber'),
  ('Práticas em Grupo 🧘', 2, true, 'Praticantes que meditam juntos', 'purple'),
  ('Micro Atos de Bondade 💚', 3, true, 'Compartilhe seus atos de bondade', 'emerald'),
  ('Evolução Contínua 📈', 4, true, 'Histórias de evolução e crescimento', 'blue'),
  ('Comunidade Geral 🌟', NULL, true, 'Espaço aberto para todos os Keteros', 'violet')
ON CONFLICT DO NOTHING;

-- ================================================
-- 6. VIEWS ÚTEIS
-- ================================================

-- View para círculos com contagem de membros e última mensagem
CREATE OR REPLACE VIEW circulos_com_stats AS
SELECT 
  c.*,
  count_circulo_membros(c.id) as total_membros,
  (SELECT mensagem FROM get_last_message(c.id)) as ultima_mensagem,
  (SELECT created_at FROM get_last_message(c.id)) as ultima_mensagem_em
FROM circulos c;

-- ================================================
-- COMENTÁRIOS
-- ================================================
COMMENT ON TABLE circulos IS 'Círculos de chat em grupo para comunidade KETER';
COMMENT ON TABLE circulo_membros IS 'Membros dos círculos - controle de acesso';
COMMENT ON TABLE circulo_mensagens IS 'Mensagens enviadas nos círculos';
