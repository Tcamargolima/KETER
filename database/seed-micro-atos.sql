-- ================================================
-- SEED: Micro-atos de Bondade - 15 Exemplos
-- ================================================
-- Execute no SQL Editor do Supabase
-- Este seed adiciona 15 micro-atos de exemplo para um usuário

-- NOTE: Replace 'YOUR_USER_ID_HERE' with the actual UUID of the user
-- You can get the user ID from: SELECT id FROM keteros LIMIT 1;

-- Micro-atos de Bondade (3 exemplos)
INSERT INTO micro_atos (ketero_id, data, tipo, descricao, executado, impacto_estimado, executado_at)
VALUES 
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '14 days', 'bondade', 'Enviar uma mensagem carinhosa para alguém que você não fala há tempo', true, 'médio', CURRENT_DATE - INTERVAL '14 days' + TIME '09:30:00'),
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '12 days', 'bondade', 'Fazer um elogio sincero a um desconhecido', true, 'pequeno', CURRENT_DATE - INTERVAL '12 days' + TIME '14:20:00'),
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '10 days', 'bondade', 'Segurar a porta para alguém que vem atrás', true, 'pequeno', CURRENT_DATE - INTERVAL '10 days' + TIME '08:15:00');

-- Micro-atos de Perdão (3 exemplos)
INSERT INTO micro_atos (ketero_id, data, tipo, descricao, executado, impacto_estimado, executado_at)
VALUES 
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '9 days', 'perdao', 'Liberar um ressentimento que você está carregando', true, 'grande', CURRENT_DATE - INTERVAL '9 days' + TIME '20:45:00'),
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '7 days', 'perdao', 'Perdoar-se por um erro do passado', true, 'grande', CURRENT_DATE - INTERVAL '7 days' + TIME '21:30:00'),
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '6 days', 'perdao', 'Escolher não responder com raiva a uma provocação', true, 'médio', CURRENT_DATE - INTERVAL '6 days' + TIME '16:00:00');

-- Micro-atos de Generosidade (3 exemplos)
INSERT INTO micro_atos (ketero_id, data, tipo, descricao, executado, impacto_estimado, executado_at)
VALUES 
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '5 days', 'generosidade', 'Doar algo que você não usa mais', true, 'médio', CURRENT_DATE - INTERVAL '5 days' + TIME '10:00:00'),
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '4 days', 'generosidade', 'Compartilhar conhecimento com alguém', true, 'médio', CURRENT_DATE - INTERVAL '4 days' + TIME '15:30:00'),
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '3 days', 'generosidade', 'Pagar o café de alguém na fila', true, 'pequeno', CURRENT_DATE - INTERVAL '3 days' + TIME '08:45:00');

-- Micro-atos de Presença (2 exemplos)
INSERT INTO micro_atos (ketero_id, data, tipo, descricao, executado, impacto_estimado, executado_at)
VALUES 
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '2 days', 'presenca', 'Guardar o celular durante uma conversa', true, 'médio', CURRENT_DATE - INTERVAL '2 days' + TIME '19:00:00'),
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '1 day', 'presenca', 'Ouvir sem interromper ou dar conselhos', true, 'médio', CURRENT_DATE - INTERVAL '1 day' + TIME '18:30:00');

-- Micro-atos de Serviço (2 exemplos)
INSERT INTO micro_atos (ketero_id, data, tipo, descricao, executado, impacto_estimado, executado_at)
VALUES 
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '8 days', 'servico', 'Fazer uma tarefa doméstica que não é sua', true, 'pequeno', CURRENT_DATE - INTERVAL '8 days' + TIME '17:00:00'),
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '11 days', 'servico', 'Ajudar alguém com tecnologia', true, 'pequeno', CURRENT_DATE - INTERVAL '11 days' + TIME '11:30:00');

-- Micro-atos de Gratidão (2 exemplos)
INSERT INTO micro_atos (ketero_id, data, tipo, descricao, executado, impacto_estimado, executado_at)
VALUES 
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '13 days', 'gratidao', 'Agradecer verbalmente a três pessoas hoje', true, 'médio', CURRENT_DATE - INTERVAL '13 days' + TIME '12:00:00'),
  ('YOUR_USER_ID_HERE', CURRENT_DATE - INTERVAL '15 days', 'gratidao', 'Escrever uma carta de gratidão', true, 'grande', CURRENT_DATE - INTERVAL '15 days' + TIME '21:00:00');

-- Verificar os micro-atos inseridos
SELECT 
  data,
  tipo,
  descricao,
  executado,
  impacto_estimado
FROM micro_atos 
WHERE ketero_id = 'YOUR_USER_ID_HERE'
ORDER BY data DESC;

-- Atualizar contador do usuário
-- (Será atualizado automaticamente pelo trigger, mas você pode verificar com:)
-- SELECT total_micro_atos FROM keteros WHERE id = 'YOUR_USER_ID_HERE';
