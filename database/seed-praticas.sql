-- ================================================
-- SEED: Práticas de exemplo (8-10 práticas iniciais)
-- ================================================
-- Execute no SQL Editor do Supabase após criar a tabela

-- Limpar dados existentes (opcional - use apenas em desenvolvimento)
-- TRUNCATE TABLE praticas CASCADE;

-- ================================================
-- FASE 1: DESPERTAR (Dias 1-14)
-- ================================================

-- Prática 1: Respiração Consciente (4-7-8)
INSERT INTO praticas (titulo, subtitulo, fase, categoria, duracao_min, instrucoes_texto, ordem, dificuldade, icone, cor_categoria, objetivo, beneficios, dica)
VALUES (
  'Respiração 4-7-8',
  'A base de tudo',
  1,
  'Respiração',
  3,
  '[
    {"duracao": 30, "titulo": "Preparação", "instrucoes": "Encontre uma posição confortável. Pode ser sentado ou deitado. Feche os olhos suavemente."},
    {"duracao": 150, "titulo": "Respiração 4-7-8", "instrucoes": "Inspire profundamente pelo nariz contando até 4... Segure o ar por 7 segundos... Expire lentamente pela boca contando até 8... Repita este ciclo, observando cada respiração sem julgar."}
  ]',
  1,
  'Iniciante',
  'wind',
  '#60A5FA',
  'Aprender a ancorar-se no presente através da respiração',
  '["Reduz ansiedade", "Aumenta foco", "Acalma mente"]',
  'Se sua mente vagar, gentilmente traga sua atenção de volta para a respiração. É normal e esperado.'
);

-- Prática 2: Intenção do Dia
INSERT INTO praticas (titulo, subtitulo, fase, categoria, duracao_min, instrucoes_texto, ordem, dificuldade, icone, cor_categoria, objetivo, beneficios, dica)
VALUES (
  'Intenção do Dia',
  'Definindo seu norte',
  1,
  'Propósito',
  4,
  '[
    {"duracao": 60, "titulo": "Centramento", "instrucoes": "Respire profundamente três vezes. Deixe o corpo relaxar. Sinta-se presente neste momento."},
    {"duracao": 120, "titulo": "Definição", "instrucoes": "Pergunte a si mesmo: Qual é minha intenção para hoje? Pode ser uma qualidade (paciência, gentileza), uma ação (ouvir mais, julgar menos) ou um foco (estar presente com minha família)."},
    {"duracao": 60, "titulo": "Ancoragem", "instrucoes": "Visualize seu dia fluindo com essa intenção. Sinta em seu corpo a energia dessa escolha. Essa é sua âncora para o dia."}
  ]',
  2,
  'Iniciante',
  'compass',
  '#F59E0B',
  'Estabelecer uma direção consciente para o dia',
  '["Clareza mental", "Ações alinhadas", "Propósito diário"]',
  'Escreva sua intenção em algum lugar visível. Revisite-a durante o dia.'
);

-- Prática 3: Gratidão Profunda
INSERT INTO praticas (titulo, subtitulo, fase, categoria, duracao_min, instrucoes_texto, ordem, dificuldade, icone, cor_categoria, objetivo, beneficios, dica)
VALUES (
  'Gratidão Profunda',
  'Reconhecendo o que há',
  1,
  'Coração',
  4,
  '[
    {"duracao": 60, "titulo": "Preparação do coração", "instrucoes": "Coloque uma mão no coração. Respire fundo. Sinta o calor da sua mão."},
    {"duracao": 120, "titulo": "Três gratidões", "instrucoes": "Pense em 3 coisas pelas quais você é grato HOJE. Não podem ser genéricas. Busque especificidade: o café quente esta manhã, o sorriso do meu filho, ter acordado sem dor."},
    {"duracao": 60, "titulo": "Sentir", "instrucoes": "Não apenas liste. SINTA cada gratidão. Deixe o sentimento de apreciação se expandir pelo seu corpo. Respire essa sensação."}
  ]',
  3,
  'Iniciante',
  'heart',
  '#EC4899',
  'Cultivar gratidão genuína, não mecânica',
  '["Melhora humor", "Muda perspectiva", "Aumenta satisfação"]',
  'Gratidão genuína é sentida no corpo, não apenas pensada na mente.'
);

-- ================================================
-- FASE 2: DISCIPLINA (Dias 15-30)
-- ================================================

-- Prática 4: Meditação Guiada 10min
INSERT INTO praticas (titulo, subtitulo, fase, categoria, duracao_min, instrucoes_texto, ordem, dificuldade, icone, cor_categoria, objetivo, beneficios, dica)
VALUES (
  'Meditação Guiada',
  'Silêncio interior',
  2,
  'Meditação',
  10,
  '[
    {"duracao": 120, "titulo": "Preparação", "instrucoes": "Sente-se confortavelmente com a coluna ereta. Feche os olhos. Deixe o corpo relaxar completamente."},
    {"duracao": 420, "titulo": "Observação", "instrucoes": "Observe sua respiração natural, sem controlá-la. Note como o ar entra e sai. Quando pensamentos surgirem, apenas observe-os e volte gentilmente para a respiração."},
    {"duracao": 60, "titulo": "Encerramento", "instrucoes": "Respire fundo 3 vezes. Mova suavemente dedos e mãos. Abra os olhos lentamente. Note como se sente."}
  ]',
  1,
  'Intermediário',
  'brain',
  '#6B46C1',
  'Desenvolver capacidade de observar a mente sem julgar',
  '["Reduz estresse", "Aumenta clareza", "Melhora foco"]',
  'Não tente esvaziar a mente. O objetivo é observar, não controlar.'
);

-- Prática 5: Body Scan (Varredura Corporal)
INSERT INTO praticas (titulo, subtitulo, fase, categoria, duracao_min, instrucoes_texto, ordem, dificuldade, icone, cor_categoria, objetivo, beneficios, dica)
VALUES (
  'Body Scan',
  'Conexão corpo-mente',
  2,
  'Consciência Corporal',
  8,
  '[
    {"duracao": 60, "titulo": "Preparação", "instrucoes": "Deite-se ou sente-se confortavelmente. Feche os olhos. Respire fundo 3 vezes."},
    {"duracao": 360, "titulo": "Varredura", "instrucoes": "Comece pelos pés. Sinta cada parte do corpo por alguns segundos: pés, pernas, quadris, abdômen, peito, mãos, braços, ombros, pescoço, rosto. Apenas observe as sensações sem julgar."},
    {"duracao": 60, "titulo": "Integração", "instrucoes": "Sinta seu corpo como um todo. Respire profundamente. Agradeça ao seu corpo por tudo que ele faz por você."}
  ]',
  2,
  'Intermediário',
  'user',
  '#8B5CF6',
  'Desenvolver consciência corporal e detectar tensões',
  '["Reduz tensão", "Aumenta autoconsciência", "Melhora sono"]',
  'Não force relaxamento. Apenas observe onde há tensão, sem julgamento.'
);

-- Prática 6: Visualização Positiva
INSERT INTO praticas (titulo, subtitulo, fase, categoria, duracao_min, instrucoes_texto, ordem, dificuldade, icone, cor_categoria, objetivo, beneficios, dica)
VALUES (
  'Visualização Positiva',
  'Criando o futuro desejado',
  2,
  'Imaginação',
  5,
  '[
    {"duracao": 60, "titulo": "Centramento", "instrucoes": "Respire profundamente. Relaxe corpo e mente. Sinta-se presente e calmo."},
    {"duracao": 180, "titulo": "Visualização", "instrucoes": "Imagine-se vivendo seu dia ideal. Veja as cores, ouça os sons, sinta as emoções positivas. Seja específico: como você age, como se sente, como interage com os outros."},
    {"duracao": 60, "titulo": "Ancoragem", "instrucoes": "Escolha uma palavra ou imagem dessa visualização. Respire profundamente e sinta essa sensação positiva em seu corpo."}
  ]',
  3,
  'Intermediário',
  'eye',
  '#14B8A6',
  'Programar a mente para resultados positivos',
  '["Aumenta motivação", "Clarifica objetivos", "Melhora humor"]',
  'Visualização funciona melhor quando você realmente SENTE as emoções, não apenas imagina.'
);

-- ================================================
-- FASE 3: CONSCIÊNCIA (Dias 31-60)
-- ================================================

-- Prática 7: Meditação Loving-Kindness (Metta)
INSERT INTO praticas (titulo, subtitulo, fase, categoria, duracao_min, instrucoes_texto, ordem, dificuldade, icone, cor_categoria, objetivo, beneficios, dica)
VALUES (
  'Loving-Kindness (Metta)',
  'Cultivando compaixão',
  3,
  'Compaixão',
  10,
  '[
    {"duracao": 60, "titulo": "Preparação", "instrucoes": "Sente-se confortavelmente. Respire fundo. Coloque uma mão no coração."},
    {"duracao": 480, "titulo": "Frases de Metta", "instrucoes": "Repita mentalmente: Que eu seja feliz. Que eu seja saudável. Que eu esteja em paz. Depois, estenda para outros: um ente querido, uma pessoa neutra, alguém difícil, todos os seres."},
    {"duracao": 60, "titulo": "Integração", "instrucoes": "Sinta a expansão do seu coração. Respire essa sensação de bondade universal."}
  ]',
  1,
  'Avançado',
  'heart',
  '#F43F5E',
  'Desenvolver compaixão por si mesmo e pelos outros',
  '["Reduz raiva", "Aumenta empatia", "Melhora relacionamentos"]',
  'Se for difícil desejar bem a alguém difícil, comece com você mesmo e vá expandindo gradualmente.'
);

-- Prática 8: Caminhada Consciente
INSERT INTO praticas (titulo, subtitulo, fase, categoria, duracao_min, instrucoes_texto, ordem, dificuldade, icone, cor_categoria, objetivo, beneficios, dica)
VALUES (
  'Caminhada Consciente',
  'Meditação em movimento',
  3,
  'Movimento',
  15,
  '[
    {"duracao": 60, "titulo": "Preparação", "instrucoes": "Escolha um local tranquilo para caminhar. Pode ser dentro de casa ou ao ar livre."},
    {"duracao": 780, "titulo": "Caminhada", "instrucoes": "Caminhe lentamente. Sinta cada passo: o pé levantando, movendo, tocando o chão. Observe as sensações no corpo. Se a mente vagar, volte para as sensações dos pés tocando o chão."},
    {"duracao": 60, "titulo": "Encerramento", "instrucoes": "Pare. Respire fundo. Note como se sente. Agradeça a si mesmo por esse momento de presença."}
  ]',
  2,
  'Avançado',
  'footprints',
  '#10B981',
  'Trazer mindfulness para atividades cotidianas',
  '["Reduz ansiedade", "Aumenta presença", "Melhora humor"]',
  'Não precisa ser rápido. O objetivo é presença, não exercício físico.'
);

-- Prática 9: Diário de Insights
INSERT INTO praticas (titulo, subtitulo, fase, categoria, duracao_min, instrucoes_texto, ordem, dificuldade, icone, cor_categoria, objetivo, beneficios, dica)
VALUES (
  'Diário de Insights',
  'Capturando sabedoria',
  3,
  'Reflexão',
  10,
  '[
    {"duracao": 120, "titulo": "Reflexão Guiada", "instrucoes": "Respire fundo. Pergunte a si mesmo: Que padrão notei em mim hoje? Que insight tive sobre minha vida? O que aprendi sobre mim mesmo?"},
    {"duracao": 420, "titulo": "Escrita Livre", "instrucoes": "Escreva livremente suas reflexões. Não julgue, não edite. Deixe os pensamentos fluírem para o papel ou tela."},
    {"duracao": 60, "titulo": "Síntese", "instrucoes": "Releia o que escreveu. Circule ou destaque uma frase que ressoa. Essa é sua sabedoria do dia."}
  ]',
  3,
  'Avançado',
  'book-open',
  '#F59E0B',
  'Desenvolver autoconsciência através da escrita reflexiva',
  '["Aumenta clareza", "Processa emoções", "Revela padrões"]',
  'Não precisa ser perfeito ou profundo. O simples ato de escrever já traz insights.'
);

-- Prática 10: Micro-ato de Bondade
INSERT INTO praticas (titulo, subtitulo, fase, categoria, duracao_min, instrucoes_texto, ordem, dificuldade, icone, cor_categoria, objetivo, beneficios, dica)
VALUES (
  'Micro-ato de Bondade',
  'Pequenos gestos, grande impacto',
  3,
  'Serviço',
  5,
  '[
    {"duracao": 60, "titulo": "Intenção", "instrucoes": "Respire fundo. Conecte-se com sua intenção de fazer o bem, por menor que seja o gesto."},
    {"duracao": 180, "titulo": "Ação", "instrucoes": "Faça um pequeno ato de bondade: um elogio sincero, ajudar alguém, doar algo, sorrir para um estranho, enviar uma mensagem carinhosa."},
    {"duracao": 60, "titulo": "Reflexão", "instrucoes": "Note como você se sente. A bondade beneficia quem dá tanto quanto quem recebe."}
  ]',
  4,
  'Intermediário',
  'gift',
  '#10B981',
  'Cultivar a prática do serviço desinteressado',
  '["Aumenta felicidade", "Cria conexões", "Dá propósito"]',
  'Não precisa ser grande. O impacto está na intenção sincera, não no tamanho do gesto.'
);

-- ================================================
-- FIM DO SEED
-- ================================================

-- Verificar práticas inseridas
-- SELECT fase, ordem, titulo, categoria, duracao_min FROM praticas ORDER BY fase, ordem;
