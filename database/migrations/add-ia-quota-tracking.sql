-- ================================================
-- DATABASE MIGRATION: AI Quota Tracking
-- ================================================
-- Purpose: Track and limit AI API usage per user
-- Date: 2024-02-10
-- Author: KETER Team

-- ================================================
-- AI USAGE TRACKING TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS ai_usage_quotas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES keteros(id) ON DELETE CASCADE,
    
    -- Daily limits
    chat_messages_today INTEGER DEFAULT 0,
    reflections_analyzed_today INTEGER DEFAULT 0,
    
    -- Tracking dates
    last_chat_at TIMESTAMP WITH TIME ZONE,
    last_reflection_at TIMESTAMP WITH TIME ZONE,
    quota_reset_date DATE DEFAULT CURRENT_DATE,
    
    -- Token usage (for cost tracking)
    total_tokens_used INTEGER DEFAULT 0,
    tokens_used_today INTEGER DEFAULT 0,
    
    -- Cost estimation (in USD)
    estimated_cost_total DECIMAL(10,4) DEFAULT 0.00,
    estimated_cost_today DECIMAL(10,4) DEFAULT 0.00,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_user_quota UNIQUE(user_id),
    CONSTRAINT check_chat_limit CHECK (chat_messages_today >= 0 AND chat_messages_today <= 100),
    CONSTRAINT check_reflection_limit CHECK (reflections_analyzed_today >= 0 AND reflections_analyzed_today <= 10)
);

-- ================================================
-- INDEXES
-- ================================================

-- Index for daily quota checks
CREATE INDEX IF NOT EXISTS idx_ai_quotas_user_reset 
ON ai_usage_quotas(user_id, quota_reset_date);

-- Index for cost monitoring
CREATE INDEX IF NOT EXISTS idx_ai_quotas_cost 
ON ai_usage_quotas(estimated_cost_today DESC, quota_reset_date);

-- Index for high-usage users
CREATE INDEX IF NOT EXISTS idx_ai_quotas_high_usage 
ON ai_usage_quotas(chat_messages_today DESC, quota_reset_date)
WHERE chat_messages_today > 30;

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS
ALTER TABLE ai_usage_quotas ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own quota
CREATE POLICY quota_select_own
ON ai_usage_quotas
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can only update their own quota
CREATE POLICY quota_update_own
ON ai_usage_quotas
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: System can insert quotas for new users
CREATE POLICY quota_insert_system
ON ai_usage_quotas
FOR INSERT
WITH CHECK (true);

-- ================================================
-- FUNCTIONS
-- ================================================

-- Function: Reset daily quotas (run by cron job)
CREATE OR REPLACE FUNCTION reset_daily_ai_quotas()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE ai_usage_quotas
    SET 
        chat_messages_today = 0,
        reflections_analyzed_today = 0,
        tokens_used_today = 0,
        estimated_cost_today = 0.00,
        quota_reset_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE quota_reset_date < CURRENT_DATE;
END;
$$;

-- Function: Check if user has quota available
CREATE OR REPLACE FUNCTION check_ai_quota(
    p_user_id UUID,
    p_type TEXT -- 'chat' or 'reflection'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_quota RECORD;
    v_limit INTEGER;
BEGIN
    -- Get or create quota record
    INSERT INTO ai_usage_quotas (user_id, quota_reset_date)
    VALUES (p_user_id, CURRENT_DATE)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Reset if new day
    PERFORM reset_daily_ai_quotas();
    
    -- Get current quota
    SELECT * INTO v_quota
    FROM ai_usage_quotas
    WHERE user_id = p_user_id;
    
    -- Check limit
    IF p_type = 'chat' THEN
        v_limit := 50;
        RETURN v_quota.chat_messages_today < v_limit;
    ELSIF p_type = 'reflection' THEN
        v_limit := 3;
        RETURN v_quota.reflections_analyzed_today < v_limit;
    ELSE
        RETURN false;
    END IF;
END;
$$;

-- Function: Increment AI usage
CREATE OR REPLACE FUNCTION increment_ai_usage(
    p_user_id UUID,
    p_type TEXT, -- 'chat' or 'reflection'
    p_tokens INTEGER,
    p_cost DECIMAL(10,4)
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Reset if new day
    PERFORM reset_daily_ai_quotas();
    
    -- Update usage
    IF p_type = 'chat' THEN
        UPDATE ai_usage_quotas
        SET 
            chat_messages_today = chat_messages_today + 1,
            last_chat_at = NOW(),
            total_tokens_used = total_tokens_used + p_tokens,
            tokens_used_today = tokens_used_today + p_tokens,
            estimated_cost_total = estimated_cost_total + p_cost,
            estimated_cost_today = estimated_cost_today + p_cost,
            updated_at = NOW()
        WHERE user_id = p_user_id;
    ELSIF p_type = 'reflection' THEN
        UPDATE ai_usage_quotas
        SET 
            reflections_analyzed_today = reflections_analyzed_today + 1,
            last_reflection_at = NOW(),
            total_tokens_used = total_tokens_used + p_tokens,
            tokens_used_today = tokens_used_today + p_tokens,
            estimated_cost_total = estimated_cost_total + p_cost,
            estimated_cost_today = estimated_cost_today + p_cost,
            updated_at = NOW()
        WHERE user_id = p_user_id;
    END IF;
END;
$$;

-- Function: Get user's remaining quota
CREATE OR REPLACE FUNCTION get_ai_quota_remaining(p_user_id UUID)
RETURNS TABLE (
    chat_remaining INTEGER,
    reflection_remaining INTEGER,
    tokens_used_today INTEGER,
    cost_today DECIMAL(10,4)
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Reset if new day
    PERFORM reset_daily_ai_quotas();
    
    RETURN QUERY
    SELECT 
        50 - COALESCE(chat_messages_today, 0) as chat_remaining,
        3 - COALESCE(reflections_analyzed_today, 0) as reflection_remaining,
        COALESCE(tokens_used_today, 0) as tokens_used_today,
        COALESCE(estimated_cost_today, 0.00) as cost_today
    FROM ai_usage_quotas
    WHERE user_id = p_user_id;
END;
$$;

-- ================================================
-- TRIGGERS
-- ================================================

-- Trigger: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ai_quota_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ai_quota_update_timestamp
BEFORE UPDATE ON ai_usage_quotas
FOR EACH ROW
EXECUTE FUNCTION update_ai_quota_timestamp();

-- ================================================
-- INITIAL DATA
-- ================================================

-- Create quota records for existing users
INSERT INTO ai_usage_quotas (user_id, quota_reset_date)
SELECT id, CURRENT_DATE
FROM keteros
ON CONFLICT (user_id) DO NOTHING;

-- ================================================
-- CRON JOB SETUP (via pg_cron extension)
-- ================================================
/*
-- Run daily at midnight UTC to reset quotas
SELECT cron.schedule(
    'reset-ai-quotas',
    '0 0 * * *',
    $$SELECT reset_daily_ai_quotas();$$
);
*/

-- ================================================
-- USAGE EXAMPLES
-- ================================================

/*
-- Check if user can send chat message
SELECT check_ai_quota('user-uuid-here', 'chat');

-- Increment chat usage
SELECT increment_ai_usage('user-uuid-here', 'chat', 150, 0.0003);

-- Get remaining quota
SELECT * FROM get_ai_quota_remaining('user-uuid-here');

-- Get high-usage users (for monitoring)
SELECT 
    k.nome,
    k.email,
    q.chat_messages_today,
    q.reflections_analyzed_today,
    q.estimated_cost_today
FROM ai_usage_quotas q
JOIN keteros k ON k.id = q.user_id
WHERE q.quota_reset_date = CURRENT_DATE
ORDER BY q.estimated_cost_today DESC
LIMIT 20;
*/

-- ================================================
-- MONITORING QUERIES
-- ================================================

-- View: Daily AI usage summary
CREATE OR REPLACE VIEW daily_ai_usage_summary AS
SELECT 
    quota_reset_date as date,
    COUNT(*) as active_users,
    SUM(chat_messages_today) as total_chat_messages,
    SUM(reflections_analyzed_today) as total_reflections,
    SUM(tokens_used_today) as total_tokens,
    SUM(estimated_cost_today) as total_cost,
    AVG(chat_messages_today) as avg_chat_per_user,
    AVG(reflections_analyzed_today) as avg_reflections_per_user
FROM ai_usage_quotas
WHERE quota_reset_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY quota_reset_date
ORDER BY quota_reset_date DESC;

-- ================================================
-- NOTES
-- ================================================
/*
Rate Limits:
- Chat: 50 messages per day per user
- Reflection Analysis: 3 per day per user

Cost Tracking:
- Tokens are tracked for monitoring
- Costs are estimates based on OpenAI pricing
- GPT-3.5-turbo: ~$0.0015 per 1K tokens

Security:
- RLS ensures users can only see their own quotas
- Backend Edge Functions enforce limits
- Database functions provide additional validation

Monitoring:
- daily_ai_usage_summary view for analytics
- High-usage user queries for cost control
- Automated daily quota reset via cron
*/
