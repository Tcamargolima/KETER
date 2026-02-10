-- ================================================
-- KETER - Row Level Security (RLS) Policies
-- ================================================
-- Execute este arquivo APÓS criar as tabelas
-- Garante segurança dos dados em produção
-- ================================================

-- ================================================
-- IMPORTANTE: Habilitar RLS em TODAS as tabelas
-- ================================================
-- Este passo é CRÍTICO para segurança em produção
-- RLS garante que usuários só acessem seus próprios dados

ALTER TABLE keteros ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_iniciais ENABLE ROW LEVEL SECURITY;
ALTER TABLE praticas_diarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflexoes_noturnas ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_atos ENABLE ROW LEVEL SECURITY;
ALTER TABLE evolucao_fases ENABLE ROW LEVEL SECURITY;
ALTER TABLE analises_ia ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversas_guia ENABLE ROW LEVEL SECURITY;
ALTER TABLE conquistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE keteros_conquistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE circulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE circulos_membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE circulos_mensagens ENABLE ROW LEVEL SECURITY;

-- ================================================
-- 1. KETEROS (Usuários)
-- ================================================
-- Usuários só podem ver e editar seus próprios dados

-- SELECT: Ver apenas próprio perfil
DROP POLICY IF EXISTS "Usuários podem ver apenas seus próprios dados" ON keteros;
CREATE POLICY "Usuários podem ver apenas seus próprios dados"
  ON keteros FOR SELECT
  USING (auth.uid() = id);

-- UPDATE: Atualizar apenas próprio perfil
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus próprios dados" ON keteros;
CREATE POLICY "Usuários podem atualizar apenas seus próprios dados"
  ON keteros FOR UPDATE
  USING (auth.uid() = id);

-- INSERT: Criar próprio perfil (quando faz signup)
DROP POLICY IF EXISTS "Usuários podem criar seu próprio perfil" ON keteros;
CREATE POLICY "Usuários podem criar seu próprio perfil"
  ON keteros FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ================================================
-- 2. AVALIAÇÕES INICIAIS
-- ================================================
-- Usuários só veem suas próprias avaliações

DROP POLICY IF EXISTS "Usuários veem apenas suas avaliações" ON avaliacoes_iniciais;
CREATE POLICY "Usuários veem apenas suas avaliações"
  ON avaliacoes_iniciais FOR ALL
  USING (ketero_id = auth.uid());

-- ================================================
-- 3. PRÁTICAS DIÁRIAS
-- ================================================
-- Usuários só veem suas próprias práticas

DROP POLICY IF EXISTS "Usuários veem apenas suas práticas" ON praticas_diarias;
CREATE POLICY "Usuários veem apenas suas práticas"
  ON praticas_diarias FOR ALL
  USING (ketero_id = auth.uid());

-- ================================================
-- 4. REFLEXÕES NOTURNAS
-- ================================================
-- Usuários só veem suas próprias reflexões

DROP POLICY IF EXISTS "Usuários veem apenas suas reflexões" ON reflexoes_noturnas;
CREATE POLICY "Usuários veem apenas suas reflexões"
  ON reflexoes_noturnas FOR ALL
  USING (ketero_id = auth.uid());

-- ================================================
-- 5. MICRO-ATOS
-- ================================================
-- Usuários só veem seus próprios micro-atos

DROP POLICY IF EXISTS "Usuários veem apenas seus micro-atos" ON micro_atos;
CREATE POLICY "Usuários veem apenas seus micro-atos"
  ON micro_atos FOR ALL
  USING (ketero_id = auth.uid());

-- ================================================
-- 6. EVOLUÇÃO DE FASES
-- ================================================
-- Usuários só veem sua própria evolução

DROP POLICY IF EXISTS "Usuários veem apenas suas fases" ON evolucao_fases;
CREATE POLICY "Usuários veem apenas suas fases"
  ON evolucao_fases FOR ALL
  USING (ketero_id = auth.uid());

-- ================================================
-- 7. ANÁLISES IA
-- ================================================
-- Usuários só veem suas próprias análises

DROP POLICY IF EXISTS "Usuários veem apenas suas análises" ON analises_ia;
CREATE POLICY "Usuários veem apenas suas análises"
  ON analises_ia FOR ALL
  USING (ketero_id = auth.uid());

-- ================================================
-- 8. CONVERSAS COM GUIA
-- ================================================
-- Usuários só veem suas próprias conversas

DROP POLICY IF EXISTS "Usuários veem apenas suas conversas" ON conversas_guia;
CREATE POLICY "Usuários veem apenas suas conversas"
  ON conversas_guia FOR ALL
  USING (ketero_id = auth.uid());

-- ================================================
-- 9. CONQUISTAS (Tabela de Conquistas Disponíveis)
-- ================================================
-- Todos podem ver conquistas disponíveis (público)
-- Ninguém pode modificar (apenas admin via SQL)

DROP POLICY IF EXISTS "Todos podem ver conquistas" ON conquistas;
CREATE POLICY "Todos podem ver conquistas"
  ON conquistas FOR SELECT
  USING (true);

-- ================================================
-- 10. KETEROS_CONQUISTAS (Conquistas do Usuário)
-- ================================================
-- Usuários só veem suas próprias conquistas

DROP POLICY IF EXISTS "Usuários veem apenas suas conquistas" ON keteros_conquistas;
CREATE POLICY "Usuários veem apenas suas conquistas"
  ON keteros_conquistas FOR ALL
  USING (ketero_id = auth.uid());

-- ================================================
-- 11. CÍRCULOS
-- ================================================
-- Círculos podem ser vistos por todos (público)
-- Apenas criador pode atualizar

DROP POLICY IF EXISTS "Todos podem ver círculos ativos" ON circulos;
CREATE POLICY "Todos podem ver círculos ativos"
  ON circulos FOR SELECT
  USING (ativo = true);

DROP POLICY IF EXISTS "Apenas criador pode atualizar círculo" ON circulos;
CREATE POLICY "Apenas criador pode atualizar círculo"
  ON circulos FOR UPDATE
  USING (criador_id = auth.uid());

DROP POLICY IF EXISTS "Usuários podem criar círculos" ON circulos;
CREATE POLICY "Usuários podem criar círculos"
  ON circulos FOR INSERT
  WITH CHECK (criador_id = auth.uid());

-- ================================================
-- 12. MEMBROS DE CÍRCULOS
-- ================================================
-- Membros veem participantes do mesmo círculo

DROP POLICY IF EXISTS "Membros veem participantes do círculo" ON circulos_membros;
CREATE POLICY "Membros veem participantes do círculo"
  ON circulos_membros FOR SELECT
  USING (
    circulo_id IN (
      SELECT circulo_id FROM circulos_membros WHERE ketero_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Usuários podem entrar em círculos" ON circulos_membros;
CREATE POLICY "Usuários podem entrar em círculos"
  ON circulos_membros FOR INSERT
  WITH CHECK (ketero_id = auth.uid());

-- ================================================
-- 13. MENSAGENS DE CÍRCULOS
-- ================================================
-- Membros veem mensagens do círculo

DROP POLICY IF EXISTS "Membros veem mensagens do círculo" ON circulos_mensagens;
CREATE POLICY "Membros veem mensagens do círculo"
  ON circulos_mensagens FOR SELECT
  USING (
    circulo_id IN (
      SELECT circulo_id FROM circulos_membros WHERE ketero_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Membros podem enviar mensagens" ON circulos_mensagens;
CREATE POLICY "Membros podem enviar mensagens"
  ON circulos_mensagens FOR INSERT
  WITH CHECK (
    ketero_id = auth.uid() AND
    circulo_id IN (
      SELECT circulo_id FROM circulos_membros WHERE ketero_id = auth.uid()
    )
  );

-- ================================================
-- VERIFICAÇÃO FINAL
-- ================================================
-- Execute esta query para verificar que RLS está habilitado:
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename;
--
-- Todos devem ter rowsecurity = true
-- ================================================

-- ================================================
-- NOTAS IMPORTANTES DE SEGURANÇA
-- ================================================
-- 1. ✅ RLS habilitado em TODAS as tabelas
-- 2. ✅ Usuários só acessam seus próprios dados
-- 3. ✅ Conquistas são públicas (apenas leitura)
-- 4. ✅ Círculos públicos são visíveis
-- 5. ✅ Mensagens apenas para membros do círculo
-- 6. ⚠️  NUNCA desabilite RLS em produção
-- 7. ⚠️  Sempre teste policies antes de deploy
-- 8. ⚠️  Use auth.uid() para verificar identidade
-- ================================================
