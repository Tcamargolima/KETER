-- ================================================
-- KETER - FASE 8: NOTIFICAÇÕES IN-APP
-- ================================================
-- Schema para sistema de notificações e lembretes inteligentes
-- Execute este SQL no Supabase SQL Editor após o schema principal

-- ================================================
-- TABELA: notifications
-- ================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES keteros(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'lembrete_pratica',
    'lembrete_reflexao', 
    'streak_perdido',
    'conquista',
    'ia_feedback'
  )),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB DEFAULT '{}'::jsonb,
  
  -- Índices para performance
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES keteros(id) ON DELETE CASCADE
);

-- Habilitar Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Usuários podem ver apenas suas próprias notificações
CREATE POLICY "Usuários veem apenas suas notificações"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- RLS Policy: Usuários podem inserir suas próprias notificações
CREATE POLICY "Usuários podem criar suas notificações"
  ON notifications FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RLS Policy: Usuários podem atualizar suas próprias notificações
CREATE POLICY "Usuários podem atualizar suas notificações"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- RLS Policy: Usuários podem deletar suas próprias notificações
CREATE POLICY "Usuários podem deletar suas notificações"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- Índices para otimização de queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(user_id, type);

-- ================================================
-- FUNÇÃO: Criar notificação automática
-- ================================================
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type VARCHAR(50),
  p_title VARCHAR(255),
  p_body TEXT,
  p_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, body, data)
  VALUES (p_user_id, p_type, p_title, p_body, p_data)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- TRIGGER: Notificar quando conquista é desbloqueada
-- ================================================
CREATE OR REPLACE FUNCTION notify_conquista_desbloqueada()
RETURNS TRIGGER AS $$
DECLARE
  v_conquista_nome VARCHAR(255);
BEGIN
  -- Buscar nome da conquista
  SELECT nome INTO v_conquista_nome
  FROM conquistas
  WHERE id = NEW.conquista_id;
  
  -- Criar notificação
  PERFORM create_notification(
    NEW.ketero_id,
    'conquista',
    '🏆 Nova Conquista!',
    'Parabéns! Você desbloqueou: ' || v_conquista_nome,
    jsonb_build_object('conquista_id', NEW.conquista_id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para conquistas
DROP TRIGGER IF EXISTS trigger_notify_conquista ON keteros_conquistas;
CREATE TRIGGER trigger_notify_conquista
  AFTER INSERT ON keteros_conquistas
  FOR EACH ROW
  EXECUTE FUNCTION notify_conquista_desbloqueada();

-- ================================================
-- DADOS SEED: Notificações de exemplo
-- ================================================
-- Estas são apenas para teste e demonstração
-- Em produção, as notificações serão criadas dinamicamente

COMMENT ON TABLE notifications IS 'Notificações in-app e lembretes inteligentes para usuários';
COMMENT ON COLUMN notifications.type IS 'Tipo da notificação: lembrete_pratica, lembrete_reflexao, streak_perdido, conquista, ia_feedback';
COMMENT ON COLUMN notifications.data IS 'Dados adicionais em formato JSON para contexto da notificação';

-- ================================================
-- FIM DO SCHEMA DE NOTIFICAÇÕES
-- ================================================
