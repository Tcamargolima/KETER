-- ================================================
-- SEED: Conteúdo Educacional (15 exemplos)
-- ================================================
-- Execute no SQL Editor do Supabase após criar as tabelas

-- Limpar dados existentes (opcional - apenas em desenvolvimento)
-- TRUNCATE TABLE conteudo_educacional CASCADE;

-- ================================================
-- ARTIGOS
-- ================================================

-- Artigo 1: Despertar - Gratidão
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, conteudo_texto, duracao_min, categoria, tags, ordem, destaque)
VALUES (
  'O Poder Transformador da Gratidão',
  'Como a prática diária de gratidão pode mudar sua vida',
  'DESPERTAR',
  'artigo',
  '# O Poder Transformador da Gratidão

A gratidão é mais do que um sentimento passageiro de agradecimento. É uma prática consciente que pode transformar fundamentalmente a forma como experimentamos a vida.

## Por que a Gratidão Funciona?

Estudos neurocientíficos mostram que praticar gratidão regularmente:
- Aumenta a produção de dopamina e serotonina
- Fortalece conexões neurais positivas
- Reduz níveis de cortisol (hormônio do estresse)

## Como Praticar Gratidão Genuína

A chave não está em listar mecânicamente "coisas boas". Está em **sentir** genuinamente o impacto dessas bênçãos:

1. **Especificidade**: Em vez de "sou grato pela minha família", tente "sou grato pelo sorriso do meu filho esta manhã"
2. **Corporalidade**: Sinta a gratidão no corpo, não apenas na mente
3. **Pequenas coisas**: Café quente, água limpa, um momento de paz

## Exercício Prático

Hoje à noite, antes de dormir:
- Escreva 3 coisas específicas pelas quais é grato
- Para cada uma, feche os olhos e sinta o impacto no seu coração
- Respire profundamente essa sensação

A transformação vem da repetição. Um dia de cada vez.',
  5,
  'Mindfulness',
  '["gratidao", "mindfulness", "pratica_diaria"]',
  1,
  true
);

-- Artigo 2: Disciplina - Hábitos
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, conteudo_texto, duracao_min, categoria, tags, ordem)
VALUES (
  'A Ciência dos Hábitos Duradouros',
  'Por que 66 dias e como vencer a resistência interna',
  'DISCIPLINA',
  'artigo',
  '# A Ciência dos Hábitos Duradouros

Você já tentou mudar algo em sua vida e falhou? Não é sobre força de vontade. É sobre entender como hábitos funcionam.

## O Mito dos 21 Dias

Pesquisas da UCL (University College London) mostram que leva **em média 66 dias** para um novo comportamento se tornar automático. Alguns hábitos levam 18 dias, outros 254.

## A Anatomia de um Hábito

Todo hábito tem 3 componentes:
1. **Gatilho**: O que inicia o comportamento
2. **Rotina**: O comportamento em si
3. **Recompensa**: O que seu cérebro ganha com isso

## Por Que Você Falha

Razões comuns de fracasso:
- Começar grande demais ("vou meditar 1h por dia")
- Não ter um gatilho claro
- Foco na disciplina, não no design do ambiente

## A Estratégia Keter

1. **Comece ridiculamente pequeno**: 3 minutos, não 30
2. **Empilhe hábitos**: "Depois de escovar os dentes, vou respirar 3 vezes"
3. **Celebre imediatamente**: Sinta o orgulho após completar

Lembre-se: progresso consistente vence intensidade esporádica.',
  7,
  'Hábitos',
  '["habitos", "disciplina", "neurociencia"]',
  2
);

-- Artigo 3: Consciência - Padrões Mentais
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, conteudo_texto, duracao_min, categoria, tags, ordem)
VALUES (
  'Reconhecendo Seus Padrões Mentais',
  'O primeiro passo para a transformação real',
  'CONSCIÊNCIA',
  'artigo',
  '# Reconhecendo Seus Padrões Mentais

A verdadeira evolução começa quando você percebe que não é seus pensamentos. Você é quem os observa.

## O Que São Padrões Mentais?

São circuitos neurais repetitivos que sua mente usa automaticamente:
- "Eu sempre falho"
- "Ninguém me entende"
- "Não sou bom o suficiente"

Esses padrões foram instalados ao longo de anos, geralmente na infância.

## Como Identificar Seus Padrões

### Exercício de Observação:
1. Quando sentir uma emoção forte, pause
2. Pergunte: "Que pensamento gerou isso?"
3. Anote o pensamento literal
4. Observe se é um padrão recorrente

### Categorias Comuns:
- **Vitimização**: "As coisas acontecem comigo"
- **Generalização**: "Sempre", "Nunca", "Todo mundo"
- **Catastrofização**: "Tudo vai dar errado"

## O Poder da Observação

Você não precisa mudar os padrões imediatamente. Apenas observe-os, sem julgamento. A consciência em si já inicia a transformação.

Como diz Viktor Frankl: "Entre estímulo e resposta, há um espaço. Nesse espaço está nosso poder de escolha."',
  6,
  'Autoconhecimento',
  '["consciencia", "padroes_mentais", "observacao"]',
  3
);

-- Artigo 4: Bondade - Compaixão
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, conteudo_texto, duracao_min, categoria, tags, ordem, destaque)
VALUES (
  'Bondade Como Prática Espiritual',
  'Por que pequenos atos mudam tudo',
  'DISCIPLINA',
  'artigo',
  '# Bondade Como Prática Espiritual

Bondade não é apenas "ser legal". É uma prática deliberada de expansão da consciência.

## A Neurociência da Bondade

Quando você pratica bondade:
- Seu cérebro libera oxitocina (hormônio da conexão)
- Reduz inflamação no corpo
- Ativa as mesmas áreas que o exercício físico

**Fato surpreendente**: Quem pratica bondade vive mais tempo. Estudos mostram aumento de 22-44% na longevidade.

## Micro-atos de Bondade

Não precisa ser grandioso:
- Segurar a porta para alguém
- Enviar uma mensagem para alguém que você não fala há tempo
- Fazer um elogio sincero a um desconhecido
- Deixar uma gorjeta generosa

## Por Que Começar Pequeno?

Grandes gestos são esporádicos. Pequenos atos são diários. E é a repetição que transforma quem você é.

## O Efeito Dominó

Pesquisas mostram que um ato de bondade gera **média de 3 novos atos** por outras pessoas. Você literalmente cria ondas de luz.

Comece hoje: escolha UM micro-ato e execute. Observe como você se sente depois.',
  5,
  'Bondade',
  '["bondade", "compaixao", "micro_atos"]',
  4,
  true
);

-- Artigo 5: Mindfulness - Respiração
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, conteudo_texto, duracao_min, categoria, tags, ordem)
VALUES (
  'Respiração: Sua Âncora no Presente',
  'Por que todos os mestres começam com a respiração',
  'DESPERTAR',
  'artigo',
  '# Respiração: Sua Âncora no Presente

Em todas as tradições espirituais - do Budismo ao Espiritismo, da Cabala ao Yoga - a respiração é o ponto de partida.

## Por Que a Respiração?

1. **Sempre disponível**: Você respira 20.000 vezes por dia
2. **Ponte corpo-mente**: Única função autônoma que você pode controlar conscientemente
3. **Indicador emocional**: Seu estado emocional se reflete na respiração

## Técnica 4-7-8 (Dr. Andrew Weil)

1. Inspire pelo nariz contando até 4
2. Segure por 7 segundos
3. Expire pela boca contando até 8

**Efeito**: Ativa sistema nervoso parassimpático (relaxamento)

## Respiração no Dia a Dia

Você não precisa sentar para meditar. Use respiração como âncora:
- Antes de responder uma mensagem difícil: 3 respirações
- No trânsito: observe sua respiração em vez de brigar com ela
- Antes de dormir: respire conscientemente por 2 minutos

## O Insight Profundo

Quando você observa sua respiração, você percebe: **você não está respirando, você está sendo respirado**. A vida flui através de você.',
  4,
  'Mindfulness',
  '["respiracao", "mindfulness", "meditacao"]',
  5
);

-- ================================================
-- VÍDEOS (YouTube Embeds)
-- ================================================

-- Vídeo 1: Meditação Guiada 10min
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, url, duracao_min, categoria, tags, ordem, destaque)
VALUES (
  'Meditação Guiada para Iniciantes',
  'Prática guiada de 10 minutos para acalmar a mente',
  'DESPERTAR',
  'video',
  'https://www.youtube.com/embed/inpok4MKVLM', -- Meditação Guiada - 10 Minutos
  10,
  'Meditação',
  '["meditacao", "guiada", "iniciantes"]',
  6,
  true
);

-- Vídeo 2: Mindfulness no Dia a Dia
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, url, duracao_min, categoria, tags, ordem)
VALUES (
  'Como Praticar Mindfulness no Dia a Dia',
  'Técnicas práticas para estar presente em qualquer momento',
  'CONSCIÊNCIA',
  'video',
  'https://www.youtube.com/embed/6p_yaNFSYao', -- Mindfulness Prático
  8,
  'Mindfulness',
  '["mindfulness", "pratica", "dia_a_dia"]',
  7
);

-- Vídeo 3: Compaixão
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, url, duracao_min, categoria, tags, ordem)
VALUES (
  'Meditação da Compaixão (Loving-Kindness)',
  'Cultive amor bondoso por você e pelos outros',
  'SERVIÇO',
  'video',
  'https://www.youtube.com/embed/sz7cpV7ERsM', -- Loving Kindness Meditation
  15,
  'Compaixão',
  '["compaixao", "loving_kindness", "bondade"]',
  8
);

-- ================================================
-- ÁUDIOS (Simulado - URLs de exemplo)
-- ================================================

-- Áudio 1: Sons da Natureza
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, url, duracao_min, categoria, tags, ordem)
VALUES (
  'Sons da Natureza para Meditação',
  'Chuva suave e pássaros para relaxamento profundo',
  NULL, -- Universal
  'audio',
  '/audio/natureza-chuva.mp3', -- Placeholder - substituir com Supabase Storage URL
  20,
  'Relaxamento',
  '["audio", "natureza", "relaxamento"]',
  9
);

-- Áudio 2: Frequência 432Hz
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, url, duracao_min, categoria, tags, ordem)
VALUES (
  'Frequência 432Hz - Cura e Equilíbrio',
  'Som terapêutico para meditação profunda',
  'CONSCIÊNCIA',
  'audio',
  '/audio/432hz-healing.mp3', -- Placeholder
  30,
  'Som Terapêutico',
  '["audio", "frequencia", "432hz", "cura"]',
  10
);

-- ================================================
-- CURSOS CURTOS (Multi-partes)
-- ================================================

-- Curso 1: Introdução à Meditação (Série)
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, conteudo_texto, duracao_min, categoria, tags, ordem, destaque)
VALUES (
  'Introdução à Meditação - Parte 1/3',
  'Entendendo o que é meditação (e o que não é)',
  'DESPERTAR',
  'curso_curto',
  '# Introdução à Meditação - Parte 1

## O Que É Meditação?

Meditação não é:
- ❌ Esvaziar a mente
- ❌ Parar de pensar
- ❌ Entrar em transe
- ❌ Apenas para monges

Meditação É:
- ✅ Observar seus pensamentos sem se identificar com eles
- ✅ Treinar a atenção
- ✅ Desenvolver consciência do momento presente
- ✅ Para qualquer pessoa

## Os 3 Pilares

1. **Intenção**: Por que você medita?
2. **Atenção**: Para onde direciona sua mente?
3. **Atitude**: Como você se relaciona com a experiência?

## Próximo Passo

Na Parte 2, você aprenderá sua primeira técnica prática.

**Continue para Parte 2 →**',
  5,
  'Meditação',
  '["curso", "meditacao", "introducao"]',
  11,
  true
);

-- Curso 2: Gratidão Prática (Série)
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, conteudo_texto, duracao_min, categoria, tags, ordem)
VALUES (
  'Curso: Gratidão Transformadora - Parte 1/3',
  'Da prática mecânica à gratidão que transforma',
  'DESPERTAR',
  'curso_curto',
  '# Gratidão Transformadora - Parte 1

## Por Que Gratidão Funciona

Não é "pensamento positivo" superficial. É neuroplasticidade em ação.

### O Estudo de Emmons & McCullough (2003)
- Grupo A: Escreveu 5 gratidões por semana
- Grupo B: Escreveu 5 aborrecimentos por semana
- Grupo C: Escreveu eventos neutros

**Resultado após 10 semanas**:
- Grupo A: 25% mais otimista, fez 1.5h mais exercício/semana, menos sintomas físicos

## O Erro Comum

Listar gratidões como checklist:
"Sou grato pela saúde, família, casa..."

Isso é mecânico. Seu cérebro não muda.

## O Jeito Certo

1. **Especificidade extrema**: "O café que minha esposa fez, ainda quente quando acordei"
2. **Sentir no corpo**: Onde você sente gratidão? Peito? Garganta?
3. **Surpresa**: Busque o inesperado do dia

**Próxima aula**: Exercício prático de 7 dias',
  6,
  'Gratidão',
  '["curso", "gratidao", "neuroplasticidade"]',
  12
);

-- Curso 3: Consciência Emocional
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, conteudo_texto, duracao_min, categoria, tags, ordem)
VALUES (
  'Consciência Emocional - Parte 1/4',
  'Aprendendo a nomear e processar emoções',
  'CONSCIÊNCIA',
  'curso_curto',
  '# Consciência Emocional - Parte 1

## A Analfabetização Emocional

Maioria das pessoas tem vocabulário emocional limitado:
- "Estou bem"
- "Estou mal"
- "Estou estressado"

Isso é como ter apenas 3 cores para pintar toda a experiência humana.

## A Roda das Emoções (Robert Plutchik)

Existem 8 emoções primárias:
1. Alegria
2. Tristeza
3. Raiva
4. Medo
5. Confiança
6. Nojo
7. Surpresa
8. Antecipação

E dezenas de nuances: frustração, melancolia, ansiedade, apreensão...

## Por Que Nomear Importa

Pesquisa da UCLA (Matthew Lieberman):
- Nomear uma emoção reduz ativação da amígdala (centro do medo)
- Aumenta ativação do córtex pré-frontal (razão)

**"Nomeie para domar"** (Name it to tame it)

## Exercício

Nas próximas 24h, sempre que sentir algo forte:
1. Pause
2. Escaneie seu corpo
3. Tente nomear com precisão: não "ansioso", mas "apreensivo" ou "inquieto"

**Parte 2**: Como processar emoções difíceis',
  7,
  'Emoções',
  '["curso", "emocoes", "consciencia"]',
  13
);

-- ================================================
-- CONTEÚDO UNIVERSAL (Sem fase específica)
-- ================================================

-- Artigo Universal: Meditação e Ciência
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, conteudo_texto, duracao_min, categoria, tags, ordem)
VALUES (
  'Meditação e Neurociência: O Que Sabemos',
  'Revisão de estudos científicos sobre meditação',
  NULL, -- Universal
  'artigo',
  '# Meditação e Neurociência

## Estudos Principais

### 1. Harvard Medical School (2011)
- **Estudo**: 8 semanas de meditação mindfulness
- **Resultado**: Aumento de massa cinzenta no hipocampo (memória e aprendizado)

### 2. University of Wisconsin (Davidson et al.)
- **Estudo**: Monges budistas vs. iniciantes
- **Resultado**: Meditadores experientes têm atividade gamma 25x maior (estados de clareza)

### 3. Massachusetts General Hospital
- **Estudo**: Redução de ansiedade em 8 semanas
- **Resultado**: Redução de 30-40% em sintomas de ansiedade

## O Que Muda no Cérebro

1. **Córtex Pré-frontal**: Mais espesso (tomada de decisão)
2. **Amígdala**: Menor (menos reatividade emocional)
3. **Hipocampo**: Maior (melhor memória)
4. **Ínsula**: Mais ativa (consciência corporal)

## Quanto Tempo Até Ver Resultados?

- **8 semanas**: Mudanças mensuráveis no cérebro
- **15 minutos/dia**: Dose efetiva mínima
- **Prática irregular**: Poucos benefícios duradouros

## Conclusão

Meditação não é misticismo. É treino mental com efeitos neurologicamente mensuráveis.',
  8,
  'Ciência',
  '["ciencia", "neurociencia", "estudos"]',
  14
);

-- Vídeo Universal: Respiração
INSERT INTO conteudo_educacional (titulo, subtitulo, fase, tipo, url, duracao_min, categoria, tags, ordem, destaque)
VALUES (
  'Técnicas de Respiração para Ansiedade',
  'Método comprovado para acalmar o sistema nervoso em minutos',
  NULL, -- Universal
  'video',
  'https://www.youtube.com/embed/tybOi4hjZFQ', -- Breathing Techniques
  12,
  'Respiração',
  '["respiracao", "ansiedade", "tecnicas"]',
  15,
  true
);

-- Mensagem de sucesso
SELECT 'Seed de conteúdo educacional concluído! Total de itens: ' || COUNT(*)::TEXT AS mensagem
FROM conteudo_educacional;

-- Verificar distribuição por fase
SELECT 
  COALESCE(fase, 'UNIVERSAL') as fase,
  COUNT(*) as total,
  tipo
FROM conteudo_educacional
GROUP BY fase, tipo
ORDER BY fase, tipo;
