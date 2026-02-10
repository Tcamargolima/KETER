-- ================================================
-- KETER - PRODUCTION DATABASE SCHEMA
-- ================================================
-- Este é o schema consolidado para deploy em PRODUÇÃO
-- Execute no Supabase SQL Editor em ordem
-- ================================================

-- ================================================
-- ORDEM DE EXECUÇÃO:
-- 1. Este arquivo (schema.sql) - Cria todas as tabelas
-- 2. rls-policies-production.sql - Configura segurança
-- 3. seed-praticas.sql (opcional) - Dados iniciais
-- 4. seed-conquistas.sql (opcional) - Conquistas
-- ================================================

-- ================================================
-- ETAPA 1: CRIAR EXTENSÕES NECESSÁRIAS
-- ================================================
-- UUID para IDs únicos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Full text search (se necessário)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ================================================
-- ETAPA 2: CRIAR TABELAS
-- ================================================

-- 1. KETEROS (Usuários)
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

-- 2. AVALIAÇÕES INICIAIS
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

-- 3. PRÁTICAS DIÁRIAS
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

-- 4. REFLEXÕES NOTURNAS
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

-- 5. MICRO-ATOS
CREATE TABLE IF NOT EXISTS micro_atos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo VARCHAR(100),
  descricao TEXT,
  executado BOOLEAN DEFAULT false,
  impacto_estimado VARCHAR(20) DEFAULT 'médio',
  reflexao_pos TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  executado_at TIMESTAMP WITH TIME ZONE
);

-- 6. EVOLUÇÃO DE FASES
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

-- 7. ANÁLISES IA
CREATE TABLE IF NOT EXISTS analises_ia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL,
  conteudo TEXT NOT NULL,
  metricas JSONB DEFAULT '{}',
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CONVERSAS COM GUIA
CREATE TABLE IF NOT EXISTS conversas_guia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  mensagem_usuario TEXT NOT NULL,
  resposta_guia TEXT NOT NULL,
  contexto JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. CONQUISTAS (Catálogo)
CREATE TABLE IF NOT EXISTS conquistas (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  icone VARCHAR(50),
  categoria VARCHAR(50),
  criterio JSONB DEFAULT '{}',
  pontos INTEGER DEFAULT 0,
  raridade VARCHAR(20) DEFAULT 'comum',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. KETEROS CONQUISTAS (Conquistas Desbloqueadas)
CREATE TABLE IF NOT EXISTS keteros_conquistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  conquista_id INTEGER REFERENCES conquistas(id) ON DELETE CASCADE,
  desbloqueado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visualizado BOOLEAN DEFAULT false,
  
  UNIQUE(ketero_id, conquista_id)
);

-- 11. CÍRCULOS
CREATE TABLE IF NOT EXISTS circulos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  criador_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  max_membros INTEGER DEFAULT 12,
  tipo VARCHAR(50) DEFAULT 'geral',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. MEMBROS DE CÍRCULOS
CREATE TABLE IF NOT EXISTS circulos_membros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  papel VARCHAR(50) DEFAULT 'membro',
  entrou_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ativo BOOLEAN DEFAULT true,
  
  UNIQUE(circulo_id, ketero_id)
);

-- 13. MENSAGENS DE CÍRCULOS
CREATE TABLE IF NOT EXISTS circulos_mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circulo_id UUID REFERENCES circulos(id) ON DELETE CASCADE,
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- ETAPA 3: CRIAR ÍNDICES PARA PERFORMANCE
-- ================================================

-- Keteros
CREATE INDEX IF NOT EXISTS idx_keteros_email ON keteros(email);
CREATE INDEX IF NOT EXISTS idx_keteros_fase ON keteros(fase_atual);

-- Práticas Diárias
CREATE INDEX IF NOT EXISTS idx_praticas_ketero_data ON praticas_diarias(ketero_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_praticas_completada ON praticas_diarias(ketero_id, completada);

-- Reflexões Noturnas
CREATE INDEX IF NOT EXISTS idx_reflexoes_ketero_data ON reflexoes_noturnas(ketero_id, data DESC);

-- Micro-Atos
CREATE INDEX IF NOT EXISTS idx_microatos_ketero_data ON micro_atos(ketero_id, data DESC);

-- Evolução de Fases
CREATE INDEX IF NOT EXISTS idx_fases_ketero ON evolucao_fases(ketero_id, fase);

-- Análises IA
CREATE INDEX IF NOT EXISTS idx_analises_ketero ON analises_ia(ketero_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analises_tipo ON analises_ia(tipo);

-- Conversas
CREATE INDEX IF NOT EXISTS idx_conversas_ketero ON conversas_guia(ketero_id, created_at DESC);

-- Círculos
CREATE INDEX IF NOT EXISTS idx_circulos_ativo ON circulos(ativo);
CREATE INDEX IF NOT EXISTS idx_membros_circulo ON circulos_membros(circulo_id, ativo);
CREATE INDEX IF NOT EXISTS idx_mensagens_circulo ON circulos_mensagens(circulo_id, created_at DESC);

-- ================================================
-- ETAPA 4: CRIAR FUNÇÕES (OPCIONAL)
-- ================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para keteros
DROP TRIGGER IF EXISTS update_keteros_updated_at ON keteros;
CREATE TRIGGER update_keteros_updated_at
  BEFORE UPDATE ON keteros
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- VERIFICAÇÃO FINAL
-- ================================================
-- Execute estas queries para verificar:

-- 1. Listar todas as tabelas criadas:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- 2. Verificar estrutura de uma tabela:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'keteros';

-- 3. Verificar foreign keys:
-- SELECT
--   tc.table_name, 
--   kcu.column_name,
--   ccu.table_name AS foreign_table_name,
--   ccu.column_name AS foreign_column_name
-- FROM information_schema.table_constraints AS tc
-- JOIN information_schema.key_column_usage AS kcu
--   ON tc.constraint_name = kcu.constraint_name
-- JOIN information_schema.constraint_column_usage AS ccu
--   ON ccu.constraint_name = tc.constraint_name
-- WHERE tc.constraint_type = 'FOREIGN KEY';

-- ================================================
-- PRÓXIMOS PASSOS:
-- 1. ✅ Tabelas criadas
-- 2. ⏭️  Execute: rls-policies-production.sql
-- 3. ⏭️  Execute: seed-praticas.sql (opcional)
-- 4. ⏭️  Configure variáveis de ambiente no Vercel
-- 5. ⏭️  Deploy!
-- ================================================
