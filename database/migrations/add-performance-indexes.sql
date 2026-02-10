-- ================================================
-- DATABASE MIGRATION: Performance Indexes
-- ================================================
-- Purpose: Add composite indexes for frequently used queries
-- Date: 2024-02-10
-- Author: KETER Team

-- ================================================
-- PRACTICES INDEXES
-- ================================================

-- Index for user's practice history ordered by date
CREATE INDEX IF NOT EXISTS idx_praticas_diarias_user_date 
ON praticas_diarias(user_id, data_pratica DESC)
WHERE completada = true;

-- Index for date-based queries (used in calendar views)
CREATE INDEX IF NOT EXISTS idx_praticas_diarias_date 
ON praticas_diarias(data_pratica DESC);

-- Index for user's incomplete practices
CREATE INDEX IF NOT EXISTS idx_praticas_diarias_incomplete 
ON praticas_diarias(user_id, completada)
WHERE completada = false;

-- ================================================
-- REFLECTIONS INDEXES
-- ================================================

-- Index for user's reflection history
CREATE INDEX IF NOT EXISTS idx_reflexoes_user_date 
ON reflexoes(user_id, created_at DESC);

-- Index for sentiment analysis queries
CREATE INDEX IF NOT EXISTS idx_reflexoes_sentiment 
ON reflexoes(user_id, sentimento, created_at DESC)
WHERE sentimento IS NOT NULL;

-- Index for night reflections by date
CREATE INDEX IF NOT EXISTS idx_reflexoes_noturnas_user_date 
ON reflexoes_noturnas(ketero_id, data DESC);

-- ================================================
-- CHAT/IA INDEXES
-- ================================================

-- Index for chat message threads
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_thread 
ON chat_messages(user_id, thread_id, created_at DESC);

-- Index for recent chat messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_recent 
ON chat_messages(user_id, created_at DESC);

-- Index for AI conversations
CREATE INDEX IF NOT EXISTS idx_conversas_guia_user 
ON conversas_guia(ketero_id, created_at DESC);

-- ================================================
-- USER STATS INDEXES
-- ================================================

-- Index for active users by last access
CREATE INDEX IF NOT EXISTS idx_keteros_last_access 
ON keteros(ultimo_acesso DESC)
WHERE ultimo_acesso IS NOT NULL;

-- Index for users by phase
CREATE INDEX IF NOT EXISTS idx_keteros_phase 
ON keteros(fase_atual, dia_total_app DESC);

-- Index for high-performing users (streak tracking)
CREATE INDEX IF NOT EXISTS idx_keteros_streak 
ON keteros(sequencia_maxima DESC)
WHERE sequencia_maxima > 7;

-- ================================================
-- ACHIEVEMENTS INDEXES
-- ================================================

-- Index for user achievements
CREATE INDEX IF NOT EXISTS idx_keteros_conquistas_user 
ON keteros_conquistas(ketero_id, desbloqueada_em DESC);

-- Index for unseen achievements
CREATE INDEX IF NOT EXISTS idx_keteros_conquistas_unseen 
ON keteros_conquistas(ketero_id, visualizada)
WHERE visualizada = false;

-- ================================================
-- CONTENT INDEXES
-- ================================================

-- Index for content by phase and category
CREATE INDEX IF NOT EXISTS idx_conteudo_educacional_phase_category 
ON conteudo_educacional(fase, categoria, ordem_exibicao);

-- Index for featured content
CREATE INDEX IF NOT EXISTS idx_conteudo_educacional_featured 
ON conteudo_educacional(destaque, fase)
WHERE destaque = true AND ativo = true;

-- ================================================
-- ANALYTICS & MONITORING
-- ================================================

-- Index for tracking daily active users
CREATE INDEX IF NOT EXISTS idx_praticas_daily_active 
ON praticas_diarias(data_pratica, ketero_id)
WHERE completada = true;

-- Index for tracking engagement
CREATE INDEX IF NOT EXISTS idx_reflexoes_daily_engagement 
ON reflexoes(DATE(created_at), user_id);

-- ================================================
-- VALIDATION QUERIES
-- ================================================

-- Verify indexes were created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- ================================================
-- PERFORMANCE NOTES
-- ================================================
/*
These indexes should improve performance for:

1. Dashboard queries (user stats, recent activities)
2. Calendar views (practices by date range)
3. Reflection history browsing
4. AI chat history retrieval
5. Achievement notifications
6. Analytics and reporting

Expected impact:
- 50-70% reduction in query time for frequent operations
- Better support for pagination
- Faster dashboard loading
- Improved scalability for user growth

Maintenance:
- Indexes are automatically maintained by PostgreSQL
- Monitor index usage with: pg_stat_user_indexes
- Consider VACUUM ANALYZE after bulk data changes
*/
