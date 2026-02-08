# KETER.CENTER - GUIA DE PROMPTS LOVABLE
## Estratégia de Desenvolvimento em Fases

---

## 📋 VISÃO GERAL DA ESTRATÉGIA

### Divisão em Fases
```
FASE 1: FUNDAÇÃO (Semana 1-2)
├─ Estrutura base do projeto
├─ Autenticação
├─ Database schema
└─ Primeiras telas estáticas

FASE 2: ONBOARDING (Semana 2-3)
├─ Avaliação inicial
├─ Geração do Mapa Keter
└─ Primeira prática

FASE 3: ENGAJAMENTO (Semana 3-4)
├─ Sistema de práticas diárias
├─ Reflexões noturnas
└─ Dashboard de progresso

FASE 4: INTELIGÊNCIA (Semana 4-5)
├─ Integração OpenAI
├─ Chat com Guia
└─ Análises semanais

FASE 5: GAMIFICAÇÃO (Semana 5-6)
├─ Sistema de fases
├─ Conquistas
└─ Sequências/streaks
```

### Por que essa ordem?
- ✅ Validação rápida (funcional em 2 semanas)
- ✅ Cada fase adiciona valor mensurável
- ✅ Pode parar e testar a qualquer momento
- ✅ IA só entra quando o core está funcionando

---

## 🎯 FASE 1: FUNDAÇÃO
**Objetivo:** Ter login funcionando + estrutura básica em 2-3 dias
**Duração:** 2-3 dias
**Resultado:** Você consegue logar e ver telas básicas

### PROMPT 1.1 - Inicialização do Projeto
```
Crie um projeto web app chamado KETER com as seguintes características:

IDENTIDADE VISUAL:
- Nome: KETER
- Tagline: "Sua evolução, seu ritmo, seu centro"
- Paleta de cores:
  * Primária: #4A90E2 (azul sereno)
  * Secundária: #7B68EE (violeta espiritual)
  * Neutra: #2C3E50 (cinza escuro)
  * Fundo: #F8F9FA (off-white)
  * Sucesso: #52C41A
  * Alerta: #FAAD14

STACK TÉCNICO:
- Frontend: React + TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- Routing: React Router v6
- State: React Context API (por enquanto)

ESTRUTURA INICIAL:
Crie a estrutura de pastas:
/src
  /components
    /ui (shadcn components)
    /layout
  /pages
    /auth
    /onboarding
    /dashboard
  /lib
  /hooks
  /types

PRIMEIRA TELA:
Crie uma landing page simples com:
- Logo KETER (texto estilizado por enquanto)
- Tagline
- Botão "Começar minha jornada"
- Design clean, minimalista, sereno
```

### PROMPT 1.2 - Setup Supabase + Auth
```
Configure Supabase como backend do KETER:

SUPABASE SETUP:
1. Instale @supabase/supabase-js
2. Configure cliente Supabase em /src/lib/supabase.ts
3. Use variáveis de ambiente:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

AUTENTICAÇÃO:
Implemente auth com as seguintes features:

1. Página de Login/Cadastro (/auth)
   - Tabs: Login | Cadastro
   - Campos:
     * Email (obrigatório)
     * Senha (min 8 caracteres, obrigatório)
   - Botão "Entrar com Email"
   - Design: card centralizado, fundo gradient suave

2. Lógica:
   - Cadastro: supabase.auth.signUp()
   - Login: supabase.auth.signInWithPassword()
   - Persistência de sessão
   - Redirect para /onboarding após cadastro
   - Redirect para /dashboard se já completou onboarding

3. Protected Routes:
   - Criar HOC ou hook para proteger rotas
   - Redirecionar para /auth se não autenticado

VALIDAÇÕES:
- Email válido
- Senha com feedback visual de força
- Mensagens de erro amigáveis em português
```

### PROMPT 1.3 - Database Schema Base
```
Crie o schema inicial do banco de dados no Supabase:

Execute os seguintes SQLs no Supabase SQL Editor:

-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela principal de usuários (keteros)
CREATE TABLE keteros (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nome VARCHAR(255),
  foto_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  ultimo_acesso TIMESTAMP DEFAULT NOW(),
  
  -- Dados de progresso
  fase_atual VARCHAR(50) DEFAULT 'DESPERTAR',
  dia_na_fase INTEGER DEFAULT 1,
  onboarding_completo BOOLEAN DEFAULT FALSE,
  
  -- Estatísticas básicas
  sequencia_atual INTEGER DEFAULT 0,
  sequencia_maxima INTEGER DEFAULT 0,
  total_praticas INTEGER DEFAULT 0,
  total_reflexoes INTEGER DEFAULT 0,
  
  -- Vincular com auth
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Política RLS (Row Level Security)
ALTER TABLE keteros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios dados"
  ON keteros FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Usuários podem atualizar seus próprios dados"
  ON keteros FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Trigger para criar ketero ao fazer signup
CREATE OR REPLACE FUNCTION create_ketero_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO keteros (auth_user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_ketero_on_signup();

-- Índices
CREATE INDEX idx_keteros_auth_user ON keteros(auth_user_id);
CREATE INDEX idx_keteros_email ON keteros(email);

IMPORTANTE: Depois de criar, configure as variáveis de ambiente no Lovable.
```

### PROMPT 1.4 - Estrutura de Navegação
```
Implemente a navegação principal do app:

ESTRUTURA:
1. Layout com bottom navigation (mobile-first)
2. 5 tabs principais:
   - Casa (Home icon)
   - Prática (Play icon)
   - Guia (MessageCircle icon)
   - Círculos (Users icon) - BLOQUEADO inicialmente
   - Perfil (User icon)

IMPLEMENTAÇÃO:
- Use React Router para navegação
- Bottom nav fixo, sempre visível
- Ícones do lucide-react
- Tab ativo: cor primária
- Tab inativo: cinza claro
- Badge de notificação quando aplicável

PÁGINAS PLACEHOLDER (por enquanto):
/dashboard/home - "Home Page - Em construção"
/dashboard/pratica - "Prática - Em breve"
/dashboard/guia - "Guia - Em breve"
/dashboard/circulos - Card "Bloqueado até Fase 3"
/dashboard/perfil - Dados básicos do usuário

DESIGN:
- Mobile-first
- Transitions suaves
- Feedback visual ao clicar
- Acessibilidade (aria-labels)
```

---

## 🎯 FASE 2: ONBOARDING
**Objetivo:** Fluxo completo de primeira experiência
**Duração:** 3-4 dias
**Resultado:** Novo usuário consegue completar avaliação e ver mapa inicial

### PROMPT 2.1 - Fluxo de Onboarding
```
Crie o fluxo de onboarding completo do KETER:

ESTRUTURA:
Sequência de 5 telas (/onboarding):
1. /onboarding/welcome
2. /onboarding/sobre
3. /onboarding/avaliacao
4. /onboarding/processando
5. /onboarding/mapa

TELA 1 - WELCOME:
- Logo grande
- Título: "Bem-vindo ao KETER"
- Texto: "Vamos começar uma jornada de autoconhecimento. Não é rápido. Não é mágico. É real."
- Botão: "Começar minha jornada"
- Design: Centralizado, minimalista

TELA 2 - SOBRE (carrossel opcional - pode pular):
4 cards deslizáveis:
1. "Práticas diárias de 5 minutos"
2. "IA que acompanha sua evolução"
3. "Comunidade de apoio"
4. "Sempre gratuito"
- Botões: "Pular" | "Próximo"
- Indicador de progresso (dots)

IMPLEMENTAÇÃO:
- Stepper visual no topo
- Navegação: só avançar (não voltar)
- Salvar progresso a cada etapa
- Mobile-first, mas responsivo
```

### PROMPT 2.2 - Avaliação Inicial (Parte 1)
```
Implemente a tela de avaliação inicial:

TELA 3 - AVALIAÇÃO:
Header: "Vamos te conhecer" + Progresso (1/5, 2/5...)

PERGUNTA 1 - Sentimento Geral:
"Como você se sente na maior parte do tempo?"
- Slider de 1-10 com emojis visuais
- 1: 😔 Muito mal
- 5: 😐 Neutro
- 10: 😊 Muito bem
- Input texto (opcional): "O que mais te incomoda hoje?"

PERGUNTA 2 - Hábitos Desejados:
"Quais hábitos você gostaria de ter?"
- Checkboxes múltiplos:
  [ ] Meditação diária
  [ ] Mais paciência
  [ ] Exercício físico
  [ ] Reflexão regular
  [ ] Perdoar mais facilmente
  [ ] Servir aos outros
  [ ] Outro: [input text]

PERGUNTA 3 - Tempo Disponível:
"Quanto tempo você tem por dia?"
- Radio buttons:
  ( ) 3-5 minutos
  ( ) 10-15 minutos
  ( ) 20+ minutos

PERGUNTA 4 - Busca Principal:
"O que você mais busca agora?" (múltipla escolha)
[ ] Paz interior
[ ] Disciplina
[ ] Propósito
[ ] Conexão
[ ] Perdão
[ ] Autoconhecimento

PERGUNTA 5 - Mapa Completo (opcional):
"Quer um mapa mais completo?"
Texto explicativo: "Podemos gerar seu mapa numerológico e análise mais profunda"
- Botões: "Sim, quero" | "Agora não"

SE SIM:
- Nome completo (obrigatório)
- Data nascimento (obrigatório)
- Hora nascimento (opcional)
- Local nascimento (opcional)

VALIDAÇÃO:
- Não avança sem responder obrigatórias
- Salvar no Supabase a cada resposta (draft)
- Botões: "Anterior" | "Próximo"
```

### PROMPT 2.3 - Tabela de Avaliação + Processamento
```
Crie a estrutura de dados para armazenar avaliação:

DATABASE:
-- Tabela de avaliações
CREATE TABLE avaliacoes_iniciais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  
  -- Respostas
  sentimento_geral INTEGER CHECK (sentimento_geral BETWEEN 1 AND 10),
  incomodo_principal TEXT,
  habitos_desejados JSONB, -- array de strings
  tempo_disponivel VARCHAR(20),
  busca_principal JSONB, -- array de strings
  
  -- Mapa completo (opcional)
  quer_mapa_completo BOOLEAN DEFAULT FALSE,
  nome_completo VARCHAR(255),
  data_nascimento DATE,
  hora_nascimento TIME,
  local_nascimento VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS
ALTER TABLE avaliacoes_iniciais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas avaliações"
  ON avaliacoes_iniciais FOR ALL
  USING (ketero_id IN (
    SELECT id FROM keteros WHERE auth_user_id = auth.uid()
  ));

TELA 4 - PROCESSANDO:
- Animação de loading suave
- Textos que mudam:
  * "Analisando suas respostas..."
  * "Identificando seu ponto de partida..."
  * "Criando seu mapa pessoal..."
- Duração: 3-5 segundos
- Simular processamento (por enquanto)
```

### PROMPT 2.4 - Mapa Keter Inicial (mockup)
```
Crie a tela do Mapa Keter Inicial:

TELA 5 - SEU MAPA KETER:
Design: Card centralizado, fundo gradient suave

ESTRUTURA:
┌─────────────────────────────────┐
│  SEU MAPA KETER INICIAL         │
├─────────────────────────────────┤
│                                 │
│  Nível Atual: DESPERTAR         │
│  Fase: Descoberta (Dia 1)       │
│                                 │
│  Seus Pontos Fortes:            │
│  ✓ Desejo genuíno de crescer    │
│  ✓ Abertura para mudança        │
│                                 │
│  Áreas de Desenvolvimento:      │
│  → Criar rotina consistente     │
│  → Desenvolver paciência        │
│                                 │
│  Seu Foco Inicial:              │
│  Nos próximos 14 dias, vamos    │
│  trabalhar autoconhecimento e   │
│  criar sua primeira prática.    │
│                                 │
│  [Começar agora]                │
└─────────────────────────────────┘

LÓGICA (por enquanto - mockup):
- Pontos fortes: genéricos baseados em ter completado
- Áreas de desenvolvimento: baseadas nos hábitos escolhidos
- Foco inicial: sempre o mesmo texto

Ao clicar "Começar agora":
- Marcar onboarding_completo = TRUE
- Redirecionar para /dashboard/home
- Mostrar celebração/confetti

DATABASE:
CREATE TABLE mapas_keter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  avaliacao_id UUID REFERENCES avaliacoes_iniciais(id),
  
  pontos_fortes JSONB,
  areas_desenvolvimento JSONB,
  foco_inicial TEXT,
  
  -- Dados completos (se optou)
  mapa_numerologico JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS
ALTER TABLE mapas_keter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus mapas"
  ON mapas_keter FOR ALL
  USING (ketero_id IN (
    SELECT id FROM keteros WHERE auth_user_id = auth.uid()
  ));
```

---

## 🎯 FASE 3: ENGAJAMENTO (CORE DO PRODUTO)
**Objetivo:** Usuário pode fazer práticas diárias e reflexões
**Duração:** 4-5 dias
**Resultado:** Loop principal funciona (prática → reflexão → progresso)

### PROMPT 3.1 - Biblioteca de Práticas
```
Crie o sistema de práticas diárias:

DATABASE:
-- Biblioteca de práticas (seed data)
CREATE TABLE praticas_biblioteca (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  duracao_minutos INTEGER DEFAULT 5,
  tipo VARCHAR(50), -- 'respiracao', 'meditacao', 'reflexao'
  fase VARCHAR(50) DEFAULT 'DESPERTAR',
  ordem INTEGER, -- dia 1, 2, 3...
  
  -- Conteúdo
  instrucoes TEXT[], -- array de passos
  audio_url VARCHAR(500), -- futuro
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Práticas do usuário (histórico)
CREATE TABLE praticas_diarias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  pratica_id UUID REFERENCES praticas_biblioteca(id),
  
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  completada BOOLEAN DEFAULT FALSE,
  duracao_real_minutos INTEGER,
  
  -- Feedback
  sentimento_pos VARCHAR(50), -- emoji
  nota_opcional TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- RLS
ALTER TABLE praticas_diarias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar suas práticas"
  ON praticas_diarias FOR ALL
  USING (ketero_id IN (
    SELECT id FROM keteros WHERE auth_user_id = auth.uid()
  ));

-- Índices
CREATE INDEX idx_praticas_ketero_data ON praticas_diarias(ketero_id, data);

SEED DATA - Primeiras 7 Práticas:
INSERT INTO praticas_biblioteca (titulo, descricao, duracao_minutos, tipo, fase, ordem, instrucoes) VALUES
('Respiração Consciente', 'Primeira conexão com sua respiração', 3, 'respiracao', 'DESPERTAR', 1, 
ARRAY[
  'Sente-se confortavelmente',
  'Respire fundo pelo nariz contando até 4',
  'Segure por 4 segundos',
  'Solte pela boca lentamente contando até 6',
  'Repita por 3 minutos'
]),

('Intenção do Dia', 'Defina sua intenção antes de começar', 5, 'reflexao', 'DESPERTAR', 2,
ARRAY[
  'Respire fundo 3 vezes',
  'Reflita: Como quero me sentir hoje?',
  'Escolha UMA palavra que representa isso',
  'Repita mentalmente: Hoje escolho [palavra]',
  'Leve essa intenção com você'
]),

('Gratidão Simples', 'Reconheça o que já tem', 5, 'reflexao', 'DESPERTAR', 3,
ARRAY[
  'Respire e relaxe',
  'Pense em 3 coisas pelas quais é grato hoje',
  'Podem ser simples: um café, um sorriso, saúde',
  'Sinta genuinamente a gratidão',
  'Anote mentalmente ou no app'
]);

-- Adicione mais 4 práticas seguindo esse padrão
```

### PROMPT 3.2 - Tela Home (Dashboard)
```
Implemente a tela Home completa:

LAYOUT (/dashboard/home):

┌──────────────────────────────────────┐
│ ☰  KETER            🔔 [2]           │
├──────────────────────────────────────┤
│                                      │
│  Olá, [Nome] 👋                      │
│                                      │
│  📍 Fase Atual: DESPERTAR            │
│  Dia 1 de 14                         │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 🔥 SEQUÊNCIA: 0 DIAS           │ │
│  │ Comece sua primeira prática!   │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ PRÁTICA DE HOJE                │ │
│  │                                │ │
│  │ ⏱ Respiração Consciente        │ │
│  │ 3 minutos                      │ │
│  │                                │ │
│  │     [▶ COMEÇAR]                │ │
│  └────────────────────────────────┘ │
│                                      │
│  📝 REFLEXÃO DE HOJE                │
│  └─ Ainda não feita                 │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│  📊 SEU PROGRESSO                    │
│  Práticas: 0/14                      │
│  [Ver detalhes >]                   │
│                                      │
└──────────────────────────────────────┘

LÓGICA:
1. Buscar dados do ketero (nome, fase, dia)
2. Buscar prática do dia (baseado em dia_na_fase)
3. Verificar se já praticou hoje
4. Mostrar sequência atual
5. Status da reflexão noturna

COMPONENTES:
- StreakCard (sequência)
- PraticaCard (prática do dia)
- ReflexaoStatus
- ProgressBar

INTERAÇÕES:
- Clicar em "COMEÇAR" → /dashboard/pratica
- Clicar reflexão → /dashboard/reflexao
- Clicar progresso → /dashboard/perfil
```

### PROMPT 3.3 - Player de Prática
```
Crie o player de prática guiada:

PÁGINA: /dashboard/pratica

ESTRUTURA:

TELA 1 - Preview:
┌──────────────────────────────────────┐
│ ← Prática de Hoje                    │
├──────────────────────────────────────┤
│                                      │
│  RESPIRAÇÃO CONSCIENTE               │
│  3 minutos                           │
│                                      │
│  ┌────────────────────────────────┐ │
│  │                                │ │
│  │         ⊙                      │ │
│  │                                │ │
│  │    [▶ INICIAR PRÁTICA]         │ │
│  │                                │ │
│  └────────────────────────────────┘ │
│                                      │
│  📖 O QUE VAMOS FAZER:               │
│                                      │
│  1️⃣ Sentar confortavelmente          │
│  2️⃣ Respirar conscientemente         │
│  3️⃣ Contar ciclos de respiração      │
│                                      │
│  💡 DICA:                            │
│  Não se preocupe com perfeição.      │
│  O importante é estar presente.      │
│                                      │
└──────────────────────────────────────┘

TELA 2 - Em Prática:
┌──────────────────────────────────────┐
│  RESPIRAÇÃO CONSCIENTE               │
│                                      │
│  [●●●●●●○○○○] 1:45                  │
│                                      │
│  ┌────────────────────────────────┐ │
│  │                                │ │
│  │   Respire fundo pelo nariz...  │ │
│  │                                │ │
│  │   [Animação de respiração]     │ │
│  │                                │ │
│  └────────────────────────────────┘ │
│                                      │
│  [⏸ Pausar]  [⏹ Parar]              │
└──────────────────────────────────────┘

TELA 3 - Finalização:
"Parabéns! Você completou sua primeira prática! 🌟

Como você se sente agora?"

[😌 Calmo] [😊 Bem] [😐 Normal] [😟 Ansioso]

[Campo texto opcional: "Quer compartilhar algo?"]

[Botão: Finalizar]

FUNCIONALIDADES:
- Timer funcional
- Exibir instruções passo a passo
- Salvar prática ao completar
- Atualizar sequência
- Atualizar total_praticas
```

### PROMPT 3.4 - Reflexões Noturnas
```
Implemente o sistema de reflexões:

DATABASE:
CREATE TABLE reflexoes_noturnas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Perguntas
  sentimentos_dia TEXT,
  paciencia_bondade VARCHAR(100),
  mudaria_algo TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS
ALTER TABLE reflexoes_noturnas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar suas reflexões"
  ON reflexoes_noturnas FOR ALL
  USING (ketero_id IN (
    SELECT id FROM keteros WHERE auth_user_id = auth.uid()
  ));

-- Índice
CREATE INDEX idx_reflexoes_ketero_data ON reflexoes_noturnas(ketero_id, data);

PÁGINA: /dashboard/reflexao

┌──────────────────────────────────────┐
│ ← Reflexão do Dia                    │
├──────────────────────────────────────┤
│                                      │
│  "Antes de dormir, vamos refletir    │
│   sobre hoje. Não há resposta certa. │
│   Seja honesto." 🌙                  │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│  Pergunta 1:                         │
│  "O que você sentiu durante o dia?"  │
│                                      │
│  [Textarea - 280 caracteres]         │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│  Pergunta 2:                         │
│  "Você tratou alguém com paciência   │
│   ou bondade hoje?"                  │
│                                      │
│  ( ) Sim, me orgulho disso           │
│  ( ) Tentei, mas foi difícil         │
│  ( ) Não, e me arrependo             │
│  ( ) Não tive oportunidade           │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│  Pergunta 3:                         │
│  "Se pudesse reviver hoje,           │
│   mudaria algo?"                     │
│                                      │
│  [Textarea - 280 caracteres]         │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│  [Salvar reflexão]                   │
│                                      │
└──────────────────────────────────────┘

TELA DE SUCESSO:
"Obrigado por sua honestidade.
A IA está acompanhando sua jornada.

Amanhã te vejo de novo. 💫"

NOTIFICAÇÕES:
- Push notification às 20h (configurável)
- Texto: "Hora da sua reflexão do dia 🌙"
```

---

## 🎯 FASE 4: INTELIGÊNCIA (IA)
**Objetivo:** Integrar OpenAI para análises e chat
**Duração:** 3-4 dias
**Resultado:** IA funcionando com feedback semanal + chat básico

### PROMPT 4.1 - Setup OpenAI
```
Configure integração com OpenAI:

INSTALAÇÃO:
npm install openai

SUPABASE EDGE FUNCTION:
Crie uma Edge Function para chamar OpenAI de forma segura.

Arquivo: supabase/functions/ai-chat/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openaiKey = Deno.env.get('OPENAI_API_KEY')

serve(async (req) => {
  const { messages, keteroId, tipo } = await req.json()
  
  // Buscar contexto do usuário
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  
  const { data: ketero } = await supabase
    .from('keteros')
    .select('*')
    .eq('id', keteroId)
    .single()
  
  // Chamar OpenAI
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Você é o Guia Keter, um mentor empático de evolução pessoal.
          
          Contexto do usuário:
          - Nome: ${ketero.nome || 'Ketero'}
          - Fase: ${ketero.fase_atual}
          - Dias no sistema: ${ketero.dia_na_fase}
          
          Seja empático, direto, e prático.
          Nunca prometa milagres.
          Máximo 3 parágrafos.`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  })
  
  const data = await response.json()
  
  return new Response(
    JSON.stringify({ reply: data.choices[0].message.content }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})

CONFIGURAR NO SUPABASE:
1. Ir em Edge Functions
2. Criar função "ai-chat"
3. Adicionar secret OPENAI_API_KEY
4. Deploy
```

### PROMPT 4.2 - Chat com Guia
```
Crie a interface de chat com o Guia IA:

PÁGINA: /dashboard/guia

┌──────────────────────────────────────┐
│ ← Seu Guia Keter                     │
├──────────────────────────────────────┤
│                                      │
│  🤖 Guia Keter                       │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ Olá! Como posso ajudar você    │ │
│  │ hoje?                          │ │
│  │                                │ │
│  │ Posso:                         │ │
│  │ • Analisar sua evolução        │ │
│  │ • Responder dúvidas            │ │
│  │ • Sugerir próximos passos      │ │
│  │ • Ajudar com desafios          │ │
│  └────────────────────────────────┘ │
│                                      │
│  💬 CONVERSAS RÁPIDAS:               │
│                                      │
│  [Como estou evoluindo?]             │
│  [Estou com dificuldade]             │
│  [Preciso de motivação]              │
│  [Quero mudar minha rotina]          │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│  💬 [Digite sua mensagem...]         │
│     [Enviar]                         │
│                                      │
└──────────────────────────────────────┘

DATABASE:
CREATE TABLE conversas_guia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  mensagem_ketero TEXT,
  resposta_ia TEXT,
  contexto JSONB, -- fase, dia, etc
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS
ALTER TABLE conversas_guia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas conversas"
  ON conversas_guia FOR ALL
  USING (ketero_id IN (
    SELECT id FROM keteros WHERE auth_user_id = auth.uid()
  ));

FUNCIONALIDADE:
- Exibir histórico de conversas
- Enviar mensagem → chamar Edge Function
- Mostrar typing indicator
- Salvar conversa no banco
- Limite: 10 mensagens/dia (free tier)
```

### PROMPT 4.3 - Análise Semanal Automatizada
```
Implemente análise semanal da evolução:

DATABASE:
CREATE TABLE analises_ia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  tipo VARCHAR(50) DEFAULT 'semanal',
  
  conteudo TEXT,
  metricas JSONB, -- dados que geraram a análise
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS
ALTER TABLE analises_ia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas análises"
  ON analises_ia FOR ALL
  USING (ketero_id IN (
    SELECT id FROM keteros WHERE auth_user_id = auth.uid()
  ));

EDGE FUNCTION: supabase/functions/weekly-analysis/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { keteroId } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  
  // Buscar reflexões da última semana
  const { data: reflexoes } = await supabase
    .from('reflexoes_noturnas')
    .select('*')
    .eq('ketero_id', keteroId)
    .gte('data', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .order('data', { ascending: true })
  
  // Buscar práticas
  const { data: praticas } = await supabase
    .from('praticas_diarias')
    .select('*')
    .eq('ketero_id', keteroId)
    .gte('data', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  
  // Gerar análise com IA
  const prompt = `Analise a evolução deste Ketero na última semana:
  
  REFLEXÕES:
  ${reflexoes.map(r => `Dia ${r.data}: ${r.sentimentos_dia}`).join('\n')}
  
  PRÁTICAS:
  ${praticas.length} práticas completas
  
  Forneça:
  1. Mudanças observadas (2-3 frases)
  2. Padrões emocionais
  3. Próximo passo sugerido
  
  Seja encorajador mas honesto. Máximo 3 parágrafos.`
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    }),
  })
  
  const data = await response.json()
  const analise = data.choices[0].message.content
  
  // Salvar análise
  await supabase.from('analises_ia').insert({
    ketero_id: keteroId,
    tipo: 'semanal',
    conteudo: analise,
    metricas: {
      reflexoes: reflexoes.length,
      praticas: praticas.length,
    },
  })
  
  return new Response(
    JSON.stringify({ analise }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})

TRIGGER AUTOMÁTICO:
Executar toda segunda-feira às 9h via Supabase Cron ou função serverless.

NOTIFICAÇÃO:
"Sua análise semanal está pronta! 📊"
```

---

## 🎯 FASE 5: GAMIFICAÇÃO
**Objetivo:** Sistema de níveis, conquistas e sequências
**Duração:** 2-3 dias
**Resultado:** Engajamento aumenta com feedback visual

### PROMPT 5.1 - Sistema de Fases
```
Implemente o sistema de progressão entre fases:

LÓGICA DAS 4 FASES:

FASE 1: DESPERTAR (Dias 1-14)
Critério de desbloqueio:
- 10 práticas completas em 14 dias
- 7 reflexões noturnas

FASE 2: DISCIPLINA (Dias 15-30)
Critério:
- 21 dias de prática (podem ser não-consecutivos)
- Qualidade crescente nas reflexões (análise IA)

FASE 3: CONSCIÊNCIA (Dias 31-60)
Critério:
- 45 dias no sistema
- IA detecta mudança de padrão linguístico
- Participação em pelo menos 1 discussão

FASE 4: SERVIÇO (Dias 60+)
Critério:
- Completar 1 missão de legado
- Manter consistência

DATABASE:
CREATE TABLE evolucao_fases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  
  fase VARCHAR(50),
  data_inicio DATE,
  data_conclusao DATE,
  
  criterios_cumpridos JSONB,
  analise_ia TEXT, -- feedback da transição
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS
ALTER TABLE evolucao_fases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver sua evolução"
  ON evolucao_fases FOR ALL
  USING (ketero_id IN (
    SELECT id FROM keteros WHERE auth_user_id = auth.uid()
  ));

FUNÇÃO DE VERIFICAÇÃO:
Criar Cloud Function que roda diariamente e verifica:
1. Ketero atingiu critérios?
2. Se sim, promover para próxima fase
3. Gerar análise IA da transição
4. Enviar notificação de parabéns
5. Atualizar keteros.fase_atual
```

### PROMPT 5.2 - Sistema de Conquistas
```
Implemente sistema de conquistas (achievements):

DATABASE:
-- Conquistas disponíveis
CREATE TABLE conquistas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  icone VARCHAR(100), -- emoji ou URL
  
  criterio JSONB, -- { tipo: 'praticas', valor: 10 }
  categoria VARCHAR(50), -- 'inicio', 'consistencia', 'impacto'
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conquistas desbloqueadas
CREATE TABLE keteros_conquistas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ketero_id UUID REFERENCES keteros(id) ON DELETE CASCADE,
  conquista_id UUID REFERENCES conquistas(id),
  
  desbloqueada_em TIMESTAMP DEFAULT NOW()
);

-- RLS
ALTER TABLE keteros_conquistas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas conquistas"
  ON keteros_conquistas FOR ALL
  USING (ketero_id IN (
    SELECT id FROM keteros WHERE auth_user_id = auth.uid()
  ));

SEED DATA - Conquistas Iniciais:
INSERT INTO conquistas (nome, descricao, icone, criterio, categoria) VALUES
('Primeiro Passo', 'Completou primeira prática', '🌱', 
 '{"tipo": "praticas", "valor": 1}', 'inicio'),

('Chama Acesa', '7 dias de sequência', '🔥', 
 '{"tipo": "sequencia", "valor": 7}', 'consistencia'),

('Disciplinado', '21 dias de prática', '💪', 
 '{"tipo": "praticas", "valor": 21}', 'consistencia'),

('Reflexivo', '30 reflexões completas', '📝', 
 '{"tipo": "reflexoes", "valor": 30}', 'consistencia'),

('Bondade em Ação', '10 micro-atos', '💚', 
 '{"tipo": "micro_atos", "valor": 10}', 'impacto'),

('Evoluído', 'Chegou à Fase 3', '🌟', 
 '{"tipo": "fase", "valor": "CONSCIENCIA"}', 'evolucao');

LÓGICA DE VERIFICAÇÃO:
Toda vez que usuário completa ação:
1. Verificar conquistas ainda não desbloqueadas
2. Se critério atingido, desbloquear
3. Mostrar modal de parabéns
4. Adicionar em keteros_conquistas

COMPONENTE UI:
Modal de conquista desbloqueada:
- Animação de confetti
- Ícone grande
- Nome da conquista
- Descrição
- Botão "Continuar"
```

### PROMPT 5.3 - Dashboard de Perfil Completo
```
Recrie a página de Perfil com todos os dados:

PÁGINA: /dashboard/perfil

┌──────────────────────────────────────┐
│ ← Meu Perfil                         │
├──────────────────────────────────────┤
│                                      │
│      [Foto circular]                 │
│      Maria Silva                     │
│      Ketero desde 15/02/2025         │
│                                      │
│  [Editar perfil]                     │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│  📍 MEU NÍVEL                        │
│  Fase 2: DISCIPLINA                  │
│  Dia 23/30                           │
│                                      │
│  [Barra de progresso visual]         │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│  📊 ESTATÍSTICAS                     │
│                                      │
│  🔥 Sequência atual: 7 dias          │
│  📝 Total de práticas: 23            │
│  💚 Micro-atos: 18                   │
│  📖 Reflexões: 21                    │
│  ⏱ Tempo total: 2h 15min            │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│  🏆 CONQUISTAS (4/15)                │
│                                      │
│  [Grid de conquistas]                │
│  🌱 ✓  🔥 ✓  💪 ○  📝 ✓              │
│  💚 ○  🌟 ○  ...                     │
│                                      │
│  [Ver todas >]                       │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│  📈 EVOLUÇÃO                         │
│                                      │
│  [Gráfico simples - práticas/semana] │
│                                      │
│  ─────────────────────────────────  │
│                                      │
│  ⚙️ CONFIGURAÇÕES                    │
│  • Notificações                      │
│  • Horários de prática               │
│  • Privacidade                       │
│  • Meu mapa completo                 │
│                                      │
│  💝 APOIAR O KETER                   │
│  • Fazer doação (opcional)           │
│  • Convidar amigos                   │
│                                      │
│  📚 SOBRE & AJUDA                    │
│  • Como funciona                     │
│  • FAQ                               │
│  • Contato                           │
│  • Sair                              │
│                                      │
└──────────────────────────────────────┘

GRÁFICOS:
Use biblioteca leve como recharts ou chart.js
Mostrar:
- Práticas por semana (últimas 4 semanas)
- Reflexões por semana
- Evolução da sequência
```

---

## 📦 RESUMO DOS PROMPTS POR PRIORIDADE

### SEMANA 1 (MVP Mínimo Testável)
```
✅ PROMPT 1.1 - Setup inicial do projeto
✅ PROMPT 1.2 - Autenticação
✅ PROMPT 1.3 - Database base
✅ PROMPT 1.4 - Navegação

RESULTADO: Login funciona + estrutura criada
```

### SEMANA 2 (Onboarding Completo)
```
✅ PROMPT 2.1 - Fluxo onboarding
✅ PROMPT 2.2 - Avaliação inicial
✅ PROMPT 2.3 - Tabela avaliação
✅ PROMPT 2.4 - Mapa Keter inicial

RESULTADO: Novo usuário completa jornada inicial
```

### SEMANA 3 (Core Loop)
```
✅ PROMPT 3.1 - Biblioteca práticas
✅ PROMPT 3.2 - Home dashboard
✅ PROMPT 3.3 - Player de prática
✅ PROMPT 3.4 - Reflexões noturnas

RESULTADO: Loop diário funciona (prática → reflexão)
```

### SEMANA 4 (Inteligência)
```
✅ PROMPT 4.1 - Setup OpenAI
✅ PROMPT 4.2 - Chat com Guia
✅ PROMPT 4.3 - Análise semanal

RESULTADO: IA personalizada funcionando
```

### SEMANA 5 (Gamificação)
```
✅ PROMPT 5.1 - Sistema de fases
✅ PROMPT 5.2 - Conquistas
✅ PROMPT 5.3 - Perfil completo

RESULTADO: Engajamento com feedback visual
```

---

## 🎯 CHECKLIST DE VALIDAÇÃO

Após cada fase, validar:

### ✅ FASE 1 COMPLETA QUANDO:
- [ ] Consigo criar conta
- [ ] Consigo fazer login
- [ ] Vejo as 5 tabs do bottom nav
- [ ] Database está criada no Supabase

### ✅ FASE 2 COMPLETA QUANDO:
- [ ] Novo usuário completa avaliação
- [ ] Mapa Keter é gerado
- [ ] Dados salvam no banco
- [ ] Redirect para dashboard funciona

### ✅ FASE 3 COMPLETA QUANDO:
- [ ] Vejo prática do dia na home
- [ ] Consigo completar uma prática
- [ ] Consigo fazer reflexão noturna
- [ ] Sequência atualiza corretamente

### ✅ FASE 4 COMPLETA QUANDO:
- [ ] Chat com Guia responde
- [ ] Análise semanal é gerada
- [ ] Conversas salvam no histórico
- [ ] Custo de IA está dentro do esperado

### ✅ FASE 5 COMPLETA QUANDO:
- [ ] Fases avançam automaticamente
- [ ] Conquistas desbloqueiam
- [ ] Perfil mostra todos os dados
- [ ] Gráficos renderizam

---

## 💡 DICAS IMPORTANTES

### Ao usar o Lovable:
1. **Um prompt de cada vez** - Não tente fazer tudo junto
2. **Valide cada step** - Teste antes de avançar
3. **Export o código** - Faça backup regular
4. **Use o preview** - Lovable tem preview em tempo real

### Economia de tempo:
- Copie e cole os prompts EXATAMENTE como estão
- Se algo não funcionar, peça para "corrigir o erro X"
- Use "continue daqui" se a resposta for cortada

### Priorização:
- FASES 1-3 são CRÍTICAS (core do produto)
- FASE 4 pode ser simplificada (IA mais simples)
- FASE 5 pode ser adiada se necessário

---

## 📞 PRÓXIMOS PASSOS IMEDIATOS

1. Abra o Lovable (lovable.dev)
2. Crie novo projeto "KETER"
3. Copie e cole PROMPT 1.1
4. Aguarde gerar
5. Teste no preview
6. Continue com PROMPT 1.2

**IMPORTANTE:** Não pule etapas! Cada prompt depende do anterior.

---

## 🚀 VAMOS COMEÇAR?

Sua primeira ação agora é:
1. Abrir Lovable
2. Criar projeto
3. Usar PROMPT 1.1

Qualquer dúvida, me chame! Estou aqui para ajudar. 💪

Boa sorte com o KETER! 🌟
