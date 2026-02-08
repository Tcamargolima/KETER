-- ================================================
-- MIGRATION: Add impacto_estimado to micro_atos
-- ================================================
-- Execute no SQL Editor do Supabase

-- Add impacto_estimado column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'micro_atos' 
    AND column_name = 'impacto_estimado'
  ) THEN
    ALTER TABLE micro_atos 
    ADD COLUMN impacto_estimado VARCHAR(20) DEFAULT 'médio';
    
    COMMENT ON COLUMN micro_atos.impacto_estimado IS 'Estimativa de impacto do micro-ato: pequeno, médio, grande';
  END IF;
END $$;
