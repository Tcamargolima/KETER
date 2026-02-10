-- ================================================
-- SEED DATA: Notificações de Exemplo
-- ================================================
-- Exemplos de notificações para testes e demonstração
-- Execute após criar a tabela notifications

-- IMPORTANTE: Substitua 'seu-user-id-aqui' pelo UUID real do usuário de teste

-- Exemplo 1: Lembrete de Prática Matinal
INSERT INTO notifications (user_id, type, title, body, read, data) VALUES
  ('seu-user-id-aqui', 'lembrete_pratica', '🌅 Hora da prática matinal!', 'Comece seu dia com clareza. Uma prática rápida pode transformar todo o seu dia. A IA recomenda agora!', false, '{"tipo_lembrete": "matinal", "hora": "07:30"}');

-- Exemplo 2: Lembrete de Reflexão Noturna
INSERT INTO notifications (user_id, type, title, body, read, data) VALUES
  ('seu-user-id-aqui', 'lembrete_reflexao', '🌙 Vamos refletir sobre o dia?', 'Reserve alguns minutos para registrar seus sentimentos e aprendizados de hoje. É um momento só seu.', false, '{"tipo_lembrete": "noturno", "hora": "21:00"}');

-- Exemplo 3: Streak Perdido
INSERT INTO notifications (user_id, type, title, body, read, data) VALUES
  ('seu-user-id-aqui', 'streak_perdido', '💔 Seu streak foi interrompido...', 'Você tinha 15 dias seguidos! Mas não se preocupe, vamos reconectar? Um novo começo está a um passo de distância.', false, '{"streak_perdido": 15}');

-- Exemplo 4: Nova Conquista
INSERT INTO notifications (user_id, type, title, body, read, data) VALUES
  ('seu-user-id-aqui', 'conquista', '🏆 Nova Conquista!', 'Parabéns! Você desbloqueou: Constância - 7 dias de prática seguida!', false, '{"conquista_id": "semana-completa"}');

-- Exemplo 5: Feedback da IA
INSERT INTO notifications (user_id, type, title, body, read, data) VALUES
  ('seu-user-id-aqui', 'ia_feedback', '💫 A IA percebeu algo...', 'Notei uma energia mais baixa na sua última reflexão. Que tal uma prática de gratidão ou respiração? Estou aqui para apoiar você.', false, '{"sentimento": "baixo", "sugestao": "pratica_gratidao"}');

-- Exemplo 6: Notificação já lida (para teste)
INSERT INTO notifications (user_id, type, title, body, read, data) VALUES
  ('seu-user-id-aqui', 'conquista', '🏆 Primeira Conquista!', 'Você completou sua primeira prática! Continue assim.', true, '{"conquista_id": "primeiro-passo"}');

-- ================================================
-- QUERY ÚTEIS PARA TESTES
-- ================================================

-- Ver todas as notificações de um usuário
-- SELECT * FROM notifications WHERE user_id = 'seu-user-id-aqui' ORDER BY created_at DESC;

-- Contar notificações não lidas
-- SELECT COUNT(*) FROM notifications WHERE user_id = 'seu-user-id-aqui' AND read = false;

-- Marcar todas como lidas
-- UPDATE notifications SET read = true WHERE user_id = 'seu-user-id-aqui' AND read = false;

-- Deletar todas notificações de um usuário (cuidado!)
-- DELETE FROM notifications WHERE user_id = 'seu-user-id-aqui';

-- Ver notificações por tipo
-- SELECT type, COUNT(*) as total FROM notifications WHERE user_id = 'seu-user-id-aqui' GROUP BY type;
