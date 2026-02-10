# KETER.CENTER - Comandos Lovable por Fase

## 📋 ÍNDICE
- [Fase 0: Setup Inicial](#fase-0-setup-inicial)
- [Fase 1: Fundação & Auth](#fase-1-fundação--auth)
- [Fase 2: Onboarding & Avaliação](#fase-2-onboarding--avaliação)
- [Fase 3: Práticas Diárias](#fase-3-práticas-diárias)
- [Fase 4: IA & Feedback](#fase-4-ia--feedback)
- [Fase 5: Gamificação](#fase-5-gamificação)
- [Fase 6: Círculos](#fase-6-círculos)

---

# FASE 0: SETUP INICIAL
**Duração:** 1 dia  
**Objetivo:** Criar projeto e configurar base

## Comando 1: Criar Projeto
```
Crie um novo projeto React com TypeScript chamado "KETER".

Stack desejada:
- React 18 + TypeScript
- Tailwind CSS para estilização
- React Router para navegação
- Lucide React para ícones
- shadcn/ui para componentes

Estrutura de pastas:
/src
  /components
    /ui (componentes shadcn)
    /features (componentes específicos)
  /pages
  /lib (utilitários)
  /hooks
  /types
  /services

Configure o tema com as seguintes cores:
- Primary: #6B46C1 (roxo/violeta - representa espiritualidade)
- Secondary: #EC4899 (rosa - representa compaixão)
- Accent: #F59E0B (dourado - representa iluminação)
- Background: #0F172A (azul escuro - representa profundidade)
- Text: #F1F5F9 (branco suave)

Crie um layout base com:
- Header simples com logo "KETER"
- Área de conteúdo principal
- Bottom navigation (será usado depois)
```

## Comando 2: Configurar Supabase
```
Instale e configure Supabase client:

1. Adicione @supabase/supabase-js ao projeto

2. Crie arquivo /src/lib/supabase.ts com:
   - Cliente Supabase configurado
   - Variáveis de ambiente para SUPABASE_URL e SUPABASE_ANON_KEY
   - Helper functions para auth

3. Crie tipos TypeScript para as tabelas:
   - Ketero (usuário)
   - AvaliacaoInicial
   - MapaKeter
   - PraticaDiaria
   - ReflexaoNoturna

Não se conecte ainda ao Supabase real - vamos usar mock data por enquanto.
```

## Comando 3: Sistema de Rotas
```
Configure React Router com as seguintes rotas:

Rotas públicas:
- / (Landing/Welcome)
- /login
- /signup

Rotas protegidas (requerem auth):
- /onboarding (avaliação inicial)
- /home (dashboard principal)
- /pratica (tela de prática)
- /guia (chat com IA)
- /circulos (comunidade - bloqueado inicialmente)
- /perfil

Crie um componente ProtectedRoute que:
- Verifica se usuário está autenticado
- Redireciona para /login se não estiver
- Mostra loading enquanto verifica
```

---

# FASE 1: FUNDAÇÃO & AUTH
**Duração:** 2-3 dias  
**Objetivo:** Sistema de autenticação funcionando

## Comando 4: Página de Welcome
```
Crie a página inicial (/) com:

Hero section:
- Logo KETER (use um círculo com símbolo da Árvore da Vida simplificado)
- Título: "Sua evolução pessoal, acompanhada por IA"
- Subtítulo: "5 minutos por dia. Sempre gratuito."
- 3 checkmarks com ícones:
  ✓ 5 minutos por dia
  ✓ IA que te conhece de verdade
  ✓ Sempre gratuito
- Botão CTA: "Começar minha jornada"

Seção "Como funciona" com 4 cards:
1. Descubra quem você é (ícone: Search)
2. Pratique 5 min/dia (ícone: Timer)
3. IA acompanha evolução (ícone: Brain)
4. Evolua em comunidade (ícone: Users)

Footer simples com:
- Links: Sobre, Privacidade, Contato
- Copyright

Use animações sutis de fade-in ao scroll.
Design clean, minimalista, espaçamento generoso.
```

## Comando 5: Auth - Login/Signup
```
Crie páginas de autenticação:

/signup:
- Campo: Email (validação de email)
- Campo: Senha (min 8 caracteres, validação de força)
- Campo: Confirmar senha
- Checkbox: "Aceito os termos de uso e política de privacidade"
- Botão: "Criar conta gratuita"
- Link: "Já tem conta? Faça login"

/login:
- Campo: Email
- Campo: Senha
- Link: "Esqueceu a senha?"
- Botão: "Entrar"
- Link: "Não tem conta? Cadastre-se"

Validações:
- Email válido
- Senha forte (mostrar indicador de força)
- Mensagens de erro claras
- Loading state nos botões

Por enquanto, use mock auth (localStorage):
- Salve user = { id, email, createdAt }
- Redirecione para /onboarding após signup
- Redirecione para /home após login
```

## Comando 6: Contexto de Autenticação
```
Crie um AuthContext com Provider que gerencie:

Estado:
- user (null | User)
- loading (boolean)
- isAuthenticated (boolean)

Métodos:
- signup(email, password)
- login(email, password)
- logout()
- resetPassword(email)

Use Context + useReducer para gerenciar estado.
Persista sessão no localStorage.
Exponha hook useAuth() para componentes.
```

---

# FASE 2: ONBOARDING & AVALIAÇÃO
**Duração:** 3-4 dias  
**Objetivo:** Questionário inicial e geração de mapa

## Comando 7: Estrutura do Onboarding
```
Crie fluxo de onboarding em /onboarding com multi-step form:

Componente OnboardingWizard com:
- Progress bar no topo (mostra etapa atual)
- Navegação: Próximo, Voltar
- 5 etapas (steps)
- Animação suave entre etapas (slide)
- Auto-save no localStorage a cada resposta

Estrutura:
{
  currentStep: number,
  totalSteps: 5,
  answers: {
    sentimentoGeral: number,
    incomodoPrincipal: string,
    habitosDesejados: string[],
    tempoDisponivel: string,
    buscaPrincipal: string[]
  }
}
```

## Comando 8: Etapa 1 - Sentimento Geral
```
Crie Step 1 do onboarding:

Título: "Como você se sente na maior parte do tempo?"

Componente principal:
- Slider de 1 a 10
- Emojis correspondentes ao valor:
  1-2: 😢 (muito mal)
  3-4: 😟 (mal)
  5-6: 😐 (neutro)
  7-8: 🙂 (bem)
  9-10: 😊 (muito bem)
- Label mostrando o número selecionado
- Valor padrão: 5

Campo de texto (opcional):
- Label: "O que mais te incomoda hoje?"
- Placeholder: "Ex: Ansiedade, falta de propósito, relacionamentos..."
- Textarea com max 500 caracteres
- Contador de caracteres

Botão: "Continuar" (habilitado sempre)
```

## Comando 9: Etapa 2 - Hábitos Desejados
```
Crie Step 2 do onboarding:

Título: "Quais hábitos você gostaria de ter?"
Subtítulo: "Selecione quantos quiser"

Grid de cards selecionáveis (multi-select):
- Meditação diária (ícone: Brain)
- Mais paciência (ícone: Heart)
- Exercício físico (ícone: Activity)
- Reflexão regular (ícone: BookOpen)
- Perdoar mais facilmente (ícone: Smile)
- Servir aos outros (ícone: Users)

Estados:
- Não selecionado: border cinza, bg transparente
- Selecionado: border primary, bg primary/10, checkmark

Mínimo: 1 seleção
Botão "Continuar" só habilitado se >= 1 selecionado
```

## Comando 10: Etapa 3 - Tempo Disponível
```
Crie Step 3 do onboarding:

Título: "Quanto tempo você tem por dia?"
Subtítulo: "Seja realista. Começaremos pequeno."

3 Cards grandes (single-select):

Card 1:
- Título: "3-5 minutos"
- Descrição: "Perfeito para começar"
- Ícone: Clock (pequeno)

Card 2:
- Título: "10-15 minutos"
- Descrição: "Tempo ideal"
- Ícone: Clock (médio)

Card 3:
- Título: "20+ minutos"
- Descrição: "Mergulho profundo"
- Ícone: Clock (grande)

Visual:
- Cards grandes, clicáveis
- Hover effect
- Selecionado: border destacada, ícone em primary
```

## Comando 11: Etapa 4 - Busca Principal
```
Crie Step 4 do onboarding:

Título: "O que você mais busca agora?"
Subtítulo: "Escolha até 3 opções"

Grid de chips selecionáveis (max 3):
- Paz interior
- Disciplina
- Propósito
- Conexão
- Perdão
- Autoconhecimento
- Gratidão
- Compaixão

Comportamento:
- Permite selecionar até 3
- Ao selecionar 4º, desabilita os não-selecionados
- Mostra contador: "X de 3 selecionados"

Validação:
- Mínimo 1, máximo 3
- Botão "Continuar" habilitado entre 1-3
```

## Comando 12: Etapa 5 - Mapa Completo (Opcional)
```
Crie Step 5 do onboarding:

Título: "Quer um mapa mais completo?"
Subtítulo: "Podemos criar seu mapa numerológico e astrológico"

Explicação em card:
- Ícone: Sparkles
- Texto: "Com seu nome completo e data de nascimento, geramos 
  insights personalizados baseados em numerologia e astrologia básica."
- Disclaimer: "Totalmente opcional. Você pode pular."

Formulário (campos opcionais):
- Nome completo
- Data de nascimento (date picker)
- Hora de nascimento (time picker)
- Cidade de nascimento (input text)

Botões:
- "Gerar meu mapa completo"
- "Pular por enquanto" (link discreto)

Ambos levam para próxima tela (processamento).
```

## Comando 13: Processamento e Mapa Inicial
```
Crie tela de processamento:

Animação de loading:
- Círculo pulsante com gradiente
- Textos que alternam a cada 2 segundos:
  "Analisando suas respostas..."
  "Identificando seu ponto de partida..."
  "Criando seu mapa pessoal..."

Após 5 segundos, mostra Mapa Keter:

Card grande centralizado:
Título: "Seu Mapa Keter Inicial"

Seção: Nível Atual
- Badge: "DESPERTAR - Dia 1"
- Ícone: Sunrise

Seção: Seus Pontos Fortes
- Lista com checks verdes:
  ✓ Desejo genuíno de crescer
  ✓ Abertura para mudança
  (baseado nas respostas)

Seção: Áreas de Desenvolvimento
- Lista com arrows:
  → Criar rotina consistente
  → Desenvolver [hábito escolhido]
  (baseado nas respostas)

Seção: Seu Foco Inicial
- Texto personalizado baseado no tempo disponível e busca

Botão CTA: "Começar agora"
→ Leva para /home
```

---

# FASE 3: PRÁTICAS DIÁRIAS
**Duração:** 4-5 dias  
**Objetivo:** Sistema de práticas funcionando

## Comando 14: Dashboard Home
```
Crie a página /home (dashboard principal):

Header:
- Saudação: "Olá, [Nome]" 👋
- Ícone de notificações (badge se houver)

Card de Status:
- Badge fase atual: "DESPERTAR"
- Texto: "Dia X de 14"
- Progress bar visual

Card de Sequência:
- Ícone de fogo 🔥
- Texto: "Sequência: X dias"
- Mensagem motivacional se sequência > 3

Card de Prática do Dia (destaque):
- Título: "Prática de Hoje"
- Nome da prática: ex "Respiração + Intenção"
- Duração: "5 minutos"
- Botão grande: "▶ Começar" (primary)
- Status: "Não realizada" ou "Completa ✓" (verde)

Card de Reflexão:
- Título: "Reflexão de Hoje"
- Status: "Ainda não feita" ou hora que fez
- Link: "Fazer reflexão" ou "Ver reflexão"

Card de Micro-Ato (se Fase 2+):
- Título: "Micro-ato de Hoje"
- Botão: "Escolher ação"

Seção: Seu Progresso
- Link: "Ver detalhes >"
- Miniatura com estatísticas

Bottom Navigation (fixo):
- Casa (ativo)
- Prática
- Guia
- Círculos
- Perfil
```

## Comando 15: Biblioteca de Práticas
```
Crie arquivo /src/data/praticas.ts com array de 30 práticas:

Interface Pratica:
{
  id: string;
  dia: number;
  titulo: string;
  duracao: number; // minutos
  categoria: string; // "respiracao", "reflexao", "meditacao"
  etapas: Etapa[];
  dica?: string;
}

Interface Etapa:
{
  tipo: "respiracao" | "reflexao" | "meditacao";
  duracao: number; // segundos
  instrucoes: string[];
  audio?: string; // URL futura
}

Crie as primeiras 7 práticas:

Dia 1: Respiração Consciente (3 min)
- 3 min de respiração guiada
- Instrução: padrão 4-4-4-4

Dia 2: Intenção + Respiração (3 min)
- 30s definir intenção
- 2m30s respiração

Dia 3: Gratidão Simples (3 min)
- 1 min respiração
- 2 min listar 3 gratidões mentalmente

Dia 4: Presença no Corpo (4 min)
- Body scan rápido

Dia 5: Perdão Pequeno (4 min)
- Identificar algo pequeno para perdoar
- Respiração com soltar

Dia 6: Compaixão por Si (4 min)
- Auto-compaixão guiada

Dia 7: Revisão Semanal (5 min)
- Reflexão sobre os 6 dias

Exporte array `praticas` default.
```

## Comando 16: Player de Prática
```
Crie página /pratica com player interativo:

Estrutura:
- Header: título da prática, botão voltar
- Seção info (antes de começar):
  - Duração total
  - O que vamos fazer (lista de etapas)
  - Dica do dia (se houver)
  - Botão grande: "▶ Iniciar Prática"

Player (quando iniciado):
- Timer grande circular
  - Mostra tempo restante
  - Animação de progresso circular
  - Texto central: MM:SS
  
- Etapa atual
  - Título da etapa
  - Instrução principal (grande)
  - Se respiração: animação de círculo expandindo/contraindo
  
- Controles
  - Pausar/Resumir
  - Parar (com confirmação)
  - Próxima etapa (se aplicável)

- Progress dots no topo
  - Mostra etapa atual de N

Estados:
- idle: Aguardando começar
- running: Prática em andamento
- paused: Pausado
- completed: Finalizada

Ao completar:
- Confete/celebração
- "Parabéns! Prática completa 🌟"
- Campo: "Como você se sente?" (4 emojis)
- Campo opcional: "Observações" (textarea)
- Botão: "Finalizar"
- → Salva dados e volta para /home
```

## Comando 17: Sistema de Timer
```
Crie hook customizado useTimer:

Hook useTimer(duracao: number, onComplete: () => void)

Retorna:
{
  tempoRestante: number, // segundos
  isRunning: boolean,
  isPaused: boolean,
  progresso: number, // 0-100
  start: () => void,
  pause: () => void,
  resume: () => void,
  stop: () => void,
  reset: () => void
}

Implementação:
- Use useRef para interval
- Use useState para estado
- Cleanup no unmount
- Play/pause sonoro opcional
```

## Comando 18: Reflexão Noturna
```
Crie componente ReflexaoNoturna (modal ou página):

Abre às 20h via notificação ou pelo dashboard.

Formulário:
Pergunta 1:
- Label: "O que você sentiu durante o dia?"
- Textarea (280 chars max)
- Placeholder: "Seja honesto consigo mesmo..."

Pergunta 2:
- Label: "Você tratou alguém com paciência ou bondade hoje?"
- Radio buttons:
  ○ Sim, me orgulho disso
  ○ Tentei, mas foi difícil
  ○ Não, e me arrependo
  ○ Não tive oportunidade

Pergunta 3:
- Label: "Se pudesse reviver hoje, mudaria algo?"
- Textarea (280 chars max)
- Opcional

Botão: "Salvar reflexão"

Feedback ao salvar:
- Toast: "Reflexão salva ✓"
- Ou tela: "Boa noite! Até amanhã 💫"
- Atualiza status no dashboard
```

---

# FASE 4: IA & FEEDBACK
**Duração:** 5-6 dias  
**Objetivo:** IA básica para análise e chat

## Comando 19: Setup OpenAI
```
Configure integração com OpenAI:

1. Instale openai package

2. Crie /src/lib/openai.ts:
   - Cliente OpenAI configurado
   - Var de ambiente OPENAI_API_KEY
   - Helper: chat(messages, systemPrompt)
   
3. Crie /src/prompts/guia-keter.ts:
   - Sistema prompt do Guia Keter
   - Contexto sobre o usuário
   - Diretrizes de tom e comportamento

4. Por enquanto, use mock responses (não gaste API):
   - Crie respostas pré-definidas
   - Simule delay de 1-2s
```

## Comando 20: Página do Guia (Chat IA)
```
Crie página /guia com interface de chat:

Header:
- Título: "Seu Guia Keter"
- Ícone: Sparkles
- Subtítulo: "IA personalizada"

Área de mensagens:
- Scroll infinito
- Mensagens do guia (esquerda, roxo claro)
- Mensagens do usuário (direita, roxo escuro)
- Avatar nos mensagens
- Timestamp discreto

Primeira mensagem automática:
"Olá! Como posso ajudar você hoje?

Posso:
• Analisar sua evolução
• Responder dúvidas sobre práticas
• Sugerir próximos passos
• Ajudar com desafios específicos"

Quick replies (botões rápidos):
- "Como estou evoluindo?"
- "Estou com dificuldade"
- "Preciso de motivação"
- "Quero ajustar minha rotina"

Input de mensagem:
- Textarea auto-expandível (max 3 linhas)
- Placeholder: "Digite sua mensagem..."
- Botão enviar (ícone: Send)
- Disable quando vazio

Estados:
- Guia digitando (3 pontos animados)
- Erro de envio (retry)
```

## Comando 21: Análise Semanal Automática
```
Crie sistema de análise semanal:

Componente AnaliseIA (exibido no /home):

Card expandível:
Cabeçalho:
- Ícone: TrendingUp
- Título: "Análise Semanal da IA"
- Data: "Semana de DD/MM - DD/MM"
- Badge: "Nova" (se não lida)

Conteúdo (quando expandido):
- Métricas observadas
  • X práticas realizadas
  • Y reflexões completas
  • Sequência de Z dias
  
- Análise textual (2-3 parágrafos):
  "Suas reflexões estão mais profundas..."
  "Percebi que você usa mais..."
  
- Próximo passo sugerido:
  Card com ação recomendada
  
- Botão: "Conversar sobre isso"
  → Abre /guia com contexto pré-carregado

Mock de análise:
- Detecte mudanças de padrão (palavras usadas)
- Calcule consistência
- Gere feedback realista

Trigger:
- A cada 7 dias (Dia 7, 14, 21...)
- Salva no histórico
```

## Comando 22: Sistema de Detecção de Padrões
```
Crie utilitário /src/lib/analise-linguagem.ts:

Funções:

1. analisarReflexoes(reflexoes: string[]):
   - Conta palavras de vitimização
     ["não consigo", "impossível", "nunca", "culpa"]
   - Conta palavras de agência
     ["posso", "escolho", "vou tentar", "aprendi"]
   - Calcula ratio

2. detectarMudanca(reflexoesAntes: string[], reflexoesDepois: string[]):
   - Compara padrões entre períodos
   - Retorna % de mudança
   - Identifica direção (positiva/negativa)

3. extrairTemas(reflexoes: string[]):
   - Identifica temas recorrentes
   - Usa contagem de palavras-chave
   - Retorna top 3 temas

4. calcularProfundidade(reflexao: string):
   - Tamanho do texto
   - Uso de palavras emocionais
   - Especificidade
   - Score 1-10

Use no backend (Supabase Edge Functions futuramente).
Por ora, rode no frontend com mock data.
```

---

# FASE 5: GAMIFICAÇÃO
**Duração:** 3-4 dias  
**Objetivo:** Conquistas, níveis, progressão

## Comando 23: Sistema de Fases
```
Crie /src/lib/fases.ts com lógica das 4 fases:

Const FASES = [
  {
    id: 1,
    nome: "DESPERTAR",
    duracao: 14,
    objetivo: "Conhecer a si mesmo",
    criterios: {
      praticasMinimas: 10,
      reflexoesMinimas: 7
    },
    cor: "#F59E0B", // dourado
    icone: "Sunrise"
  },
  {
    id: 2,
    nome: "DISCIPLINA",
    duracao: 16,
    objetivo: "Criar hábito sustentável",
    criterios: {
      praticasMinimas: 21,
      qualidadeReflexoes: true,
      microAtosMinimos: 3
    },
    cor: "#EC4899", // rosa
    icone: "Target"
  },
  {
    id: 3,
    nome: "CONSCIÊNCIA",
    duracao: 30,
    objetivo: "Perceber transformação",
    criterios: {
      diasNoSistema: 45,
      mudancaPadrao: true,
      participacaoCirculo: true
    },
    cor: "#6B46C1", // roxo
    icone: "Brain"
  },
  {
    id: 4,
    nome: "SERVIÇO",
    duracao: null, // infinito
    objetivo: "Impacto no mundo",
    criterios: {
      diasNoSistema: 60,
      missoesCompletas: 1
    },
    cor: "#10B981", // verde
    icone: "Heart"
  }
]

Funções:
- getFaseAtual(ketero): Fase
- verificarDesbloqueio(ketero, proximaFase): boolean
- calcularProgresso(ketero): number (%)
- getProximaFase(faseAtual): Fase | null
```

## Comando 24: Conquistas
```
Crie /src/data/conquistas.ts:

Interface Conquista:
{
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  criterio: (ketero) => boolean;
  raridade: "comum" | "rara" | "epica";
  recompensa?: string; // texto motivacional
}

Conquistas iniciais:

1. "Primeiro Passo"
   - Completar primeira prática
   - Comum

2. "Constância"
   - 7 dias seguidos
   - Rara

3. "Disciplinado"
   - 21 dias seguidos
   - Épica

4. "Bondoso"
   - 10 micro-atos completos
   - Rara

5. "Reflexivo"
   - 30 reflexões salvas
   - Comum

6. "Evolução Detectada"
   - IA detectar mudança de padrão
   - Épica

7. "Comunitário"
   - Entrar em um Círculo
   - Rara

8. "Servo"
   - Completar primeira missão
   - Épica

Sistema de desbloqueio:
- Verificar após cada ação
- Mostrar modal de celebração
- Salvar no perfil
```

## Comando 25: Modal de Conquista
```
Crie componente ConquistaDesbloqueada:

Modal animado que aparece quando conquista é desbloqueada:

Animação de entrada:
- Fade + scale
- Confete caindo de cima
- Brilho dourado

Conteúdo:
- Ícone grande da conquista (dourado se épica)
- Texto: "Conquista Desbloqueada!"
- Nome da conquista (grande)
- Descrição
- Badge de raridade
- Botão: "Continuar"

Som opcional de "achievement unlocked"

Comportamento:
- Fecha automaticamente após 5s ou ao clicar
- Empilha se múltiplas ao mesmo tempo
- Salva "visualizada" para não repetir
```

## Comando 26: Página de Perfil/Progresso
```
Crie página /perfil completa:

Header:
- Foto/avatar (default: iniciais)
- Nome do Ketero
- Membro desde: data
- Botão editar perfil (ícone)

Card: Nível Atual
- Badge grande da fase
- Nome da fase + descrição
- Dia X de Y (se fase finita)
- Progress bar
- Botão: "Ver detalhes da fase"

Card: Estatísticas
Grid 2x3:
- 🔥 Sequência atual: X dias
- 📝 Total práticas: X
- 💚 Micro-atos: X
- 📖 Reflexões: X
- ⏱ Tempo total: Xh Ymin
- 🎯 Taxa conclusão: X%

Card: Conquistas
- Grid de ícones das conquistas
- Desbloqueadas: coloridas
- Bloqueadas: cinza com cadeado
- Clicável: mostra detalhes
- Progresso: "X de Y desbloqueadas"

Card: Evolução no Tempo
- Gráfico simples:
  • Linha: práticas por semana
  • Barras: reflexões por semana
- Últimas 4 semanas

Seção: Configurações
- Notificações
- Horários de prática/reflexão
- Privacidade
- Sobre & FAQ
- Sair

Botão: "Apoiar o KETER" (leva para doações)
```

---

# FASE 6: CÍRCULOS
**Duração:** 4-5 dias  
**Objetivo:** Comunidade e discussões

## Comando 27: Página Círculos (Bloqueado)
```
Crie página /circulos com 2 estados:

ESTADO 1: Bloqueado (se Fase < 3)

Tela:
- Ícone: Lock grande
- Título: "Círculos desbloqueiam na Fase 3"
- Subtítulo: "Você está em: FASE X - Y"
- Progress bar para Fase 3

Card explicativo:
Título: "O que são Círculos?"
Conteúdo:
- Pequenos grupos de 5-12 Keteros
- Discussões semanais sobre temas
- Apoio mútuo na jornada
- Moderação ativa

Card: Como desbloquear
Checklist:
- ✓/⏳ Completar 30 dias
- ✓/⏳ IA detectar evolução
- ⏳ Chegar à Fase 3: Consciência

Mensagem: "Faltam ~X dias"

ESTADO 2: Desbloqueado (será implementado depois)
```

## Comando 28: Lista de Círculos
```
Quando desbloqueado, mostrar:

Header:
- Título: "Círculos"
- Filtros: Todos | Meus Círculos | Recomendados
- Botão: "+ Criar novo círculo"

Lista de Círculos disponíveis:

Card por círculo:
- Ícone/emoji do círculo
- Nome (ex: "Círculo do Amanhecer")
- Tema (ex: "Disciplina Matinal")
- Membros: X/12
- Próximo encontro: "Amanhã 19h"
- Botão: "Participar" ou "Ver" (se já membro)

Seção: Meus Círculos (fixo no topo se > 0)
- Card destaque do círculo principal
- Notificação: "X mensagens novas"

Sidebar (desktop):
- Filtrar por tema
- Filtrar por horário
- Só com vagas
```

## Comando 29: Página do Círculo
```
Crie página /circulos/[id]:

Header:
- Ícone do círculo
- Nome
- Tema
- Botão: Sair do círculo (se membro)
- Botão: Participar (se não membro)

Tabs:
1. Discussão
2. Membros
3. Sobre

TAB: Discussão
- Feed de mensagens (chat-like)
- Mensagens agrupadas por dia
- Avatar + nome + hora
- Input de nova mensagem (bottom)
- Regras de moderação (sidebar)

TAB: Membros
- Lista de membros
- Avatar + nome + fase atual
- Membro desde (no círculo)
- Admin badge (se aplicável)

TAB: Sobre
- Descrição do círculo
- Tema detalhado
- Regras
- Horário de encontros
- Criado por + data
```

## Comando 30: Chat do Círculo
```
Crie componente CirculoChat:

Área de mensagens:
- Scroll reverso (últimas no bottom)
- Auto-scroll ao enviar
- Agrupamento por usuário e tempo
- Avatar à esquerda
- Timestamp discreto

Mensagem do próprio usuário:
- Alinhada à direita
- Cor diferente
- Sem avatar

Indicadores:
- "Fulano está digitando..."
- Mensagem enviando (loading)
- Erro ao enviar (retry)

Input:
- Textarea multiline (max 3 linhas)
- Placeholder: "Compartilhe suas reflexões..."
- Max 1000 caracteres
- Contador (quando > 800)
- Botão enviar

Funcionalidades:
- Mencionar @usuario
- Reagir com emoji (futuramente)
- Denunciar mensagem

Mock data:
- Gere 20-30 mensagens de exemplo
- Simule delay de envio
```

---

# COMANDOS EXTRAS E POLIMENTO

## Comando 31: Notificações
```
Implemente sistema de notificações:

1. Componente Toast/Notification:
   - Tipos: success, error, info, warning
   - Auto-dismiss em 5s
   - Empilhável (max 3)
   - Posição: top-right

2. Context NotificationContext:
   - addNotification(mensagem, tipo)
   - removeNotification(id)

3. Notificações do app:
   - Prática disponível (9h)
   - Reflexão disponível (20h)
   - Análise semanal pronta
   - Nova mensagem em círculo
   - Conquista desbloqueada

Mock por enquanto (usar setTimeout).
```

## Comando 32: Loading States
```
Melhore UX com estados de loading:

1. Skeleton screens para:
   - Lista de círculos
   - Feed de mensagens
   - Dashboard home
   - Perfil

2. Spinners para:
   - Botões de ação
   - Salvamento
   - Carregamento de dados

3. Progress indicators:
   - Upload/download
   - Processamento de análise

Use Lucide icons: Loader2 com spin.
```

## Comando 33: Responsividade
```
Garanta que TODAS as telas sejam responsivas:

Breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

Ajustes principais:
- Mobile: bottom nav fixo
- Desktop: sidebar fixa
- Grids: 1 col mobile, 2-3 desktop
- Modais: fullscreen mobile, centered desktop
- Player prática: adapta timer size

Teste em:
- iPhone SE (375px)
- iPhone 12 (390px)
- iPad (768px)
- Desktop (1920px)
```

## Comando 34: Dark Mode (se necessário)
```
Se quiser implementar dark mode:

1. Use classe 'dark' no root
2. Ajuste todas as cores com dark:
   - bg-slate-900 dark:bg-slate-100
   - text-slate-100 dark:text-slate-900
   
3. Toggle no /perfil

Por enquanto, DARK é padrão (conforme design).
Não implementar light mode ainda.
```

---

# SEQUÊNCIA RECOMENDADA DE EXECUÇÃO

## Semana 1: Foundation
1. ✅ Comando 1: Criar Projeto
2. ✅ Comando 2: Configurar Supabase (mock)
3. ✅ Comando 3: Sistema de Rotas
4. ✅ Comando 4: Página Welcome
5. ✅ Comando 5: Auth Login/Signup
6. ✅ Comando 6: Auth Context

## Semana 2: Onboarding
7. ✅ Comando 7: Estrutura Onboarding
8. ✅ Comando 8-12: Etapas 1-5
9. ✅ Comando 13: Mapa Inicial

## Semana 3: Práticas
10. ✅ Comando 14: Dashboard Home
11. ✅ Comando 15: Biblioteca Práticas
12. ✅ Comando 16: Player Prática
13. ✅ Comando 17: Timer Hook
14. ✅ Comando 18: Reflexão Noturna

## Semana 4: IA
15. ✅ Comando 19: Setup OpenAI (mock)
16. ✅ Comando 20: Página Guia
17. ✅ Comando 21: Análise Semanal
18. ✅ Comando 22: Detecção Padrões

## Semana 5: Gamificação
19. ✅ Comando 23: Sistema Fases
20. ✅ Comando 24: Conquistas
21. ✅ Comando 25: Modal Conquista
22. ✅ Comando 26: Perfil

## Semana 6: Comunidade
23. ✅ Comando 27: Círculos Bloqueado
24. ✅ Comando 28: Lista Círculos
25. ✅ Comando 29: Página Círculo
26. ✅ Comando 30: Chat

## Polimento Final
27. ✅ Comando 31: Notificações
28. ✅ Comando 32: Loading States
29. ✅ Comando 33: Responsividade

---

# DICAS DE USO NO LOVABLE

1. **Execute 1 comando por vez**
   - Aguarde build completo
   - Teste visualmente
   - Corrija bugs antes de avançar

2. **Use o Preview constantemente**
   - Lovable tem preview em tempo real
   - Teste fluxos completos
   - Verifique responsividade

3. **Itere baseado em feedback**
   - Se algo não ficou bom, refine
   - Peça melhorias específicas
   - Ajuste cores, espaçamentos, textos

4. **Mock data é seu amigo**
   - Não conecte Supabase real ainda
   - Use localStorage para persistência
   - Facilita testar fluxos

5. **Mantenha componentes pequenos**
   - Reaproveite componentes
   - Crie variantes
   - Facilita manutenção

6. **Prototipe rápido, refine depois**
   - Primeira versão pode ser simples
   - Importante é funcionar
   - Polimento vem depois

---

# COMANDOS PRONTOS PARA COPIAR (PRIMEIROS 5)

## 1️⃣ SETUP INICIAL
```
Crie um novo projeto React chamado "KETER" para uma plataforma de autoconhecimento e evolução pessoal.

Stack: React 18, TypeScript, Tailwind CSS, React Router, Lucide React, shadcn/ui.

Estrutura de pastas:
- /src/components (ui e features)
- /src/pages
- /src/lib
- /src/hooks
- /src/types
- /src/services

Tema:
- Primary: #6B46C1 (roxo)
- Secondary: #EC4899 (rosa)
- Accent: #F59E0B (dourado)
- Background: #0F172A (dark blue)
- Text: #F1F5F9

Layout base:
- Header com logo KETER
- Área de conteúdo
- Bottom navigation (para depois)

Use design minimalista, moderno, com muito espaçamento.
```

## 2️⃣ WELCOME PAGE
```
Crie a página inicial (/) do KETER:

Hero section centralizada:
- Logo circular com símbolo da Árvore da Vida simplificado (use ícone Network da Lucide)
- Título (h1, grande): "Sua evolução pessoal, acompanhada por IA"
- Subtítulo: "5 minutos por dia. Sempre gratuito."
- 3 checkmarks com ícones:
  ✓ 5 minutos por dia (ícone Clock)
  ✓ IA que te conhece de verdade (ícone Brain)
  ✓ Sempre gratuito (ícone Heart)
- Botão CTA primary grande: "Começar minha jornada"

Seção "Como funciona" (4 cards em grid):
1. Descubra quem você é (ícone Search)
   - "Avaliação personalizada em 3 minutos"
2. Pratique 5 min/dia (ícone Timer)
   - "Meditação, reflexão, ação"
3. IA acompanha evolução (ícone TrendingUp)
   - "Feedback real baseado em você"
4. Evolua em comunidade (ícone Users)
   - "Círculos de apoio mútuo"

Footer:
- Links: Sobre | Privacidade | Contato
- © 2025 KETER

Design: gradientes sutis, animações fade-in ao scroll, muito espaço em branco.
```

## 3️⃣ AUTH PAGES
```
Crie páginas de autenticação:

/signup:
- Card centralizado, max-width 400px
- Título: "Criar conta gratuita"
- Campo email (com validação)
- Campo senha (min 8 chars, mostrar força)
- Campo confirmar senha
- Checkbox: "Aceito termos de uso"
- Botão primary: "Criar conta"
- Link: "Já tem conta? Faça login"

/login:
- Card centralizado, max-width 400px
- Título: "Bem-vindo de volta"
- Campo email
- Campo senha
- Link: "Esqueceu a senha?"
- Botão primary: "Entrar"
- Link: "Não tem conta? Cadastre-se"

Validações:
- Email formato válido
- Senha com indicador de força visual
- Mensagens de erro claras em vermelho
- Disable botão se inválido
- Loading state no botão ao submeter

Por enquanto, use mock auth (salvar no localStorage):
- user = { id: uuid(), email, createdAt: Date.now() }
- Redirecionar para /onboarding após signup
- Redirecionar para /home após login

Crie também AuthContext para gerenciar estado global de autenticação.
```

## 4️⃣ ONBOARDING - ESTRUTURA
```
Crie fluxo de onboarding multi-step em /onboarding:

Componente OnboardingWizard:
- Progress bar no topo mostrando etapa X de 5
- Botões Voltar/Próximo
- Animação suave (slide) entre etapas
- Auto-save no localStorage

Estado:
{
  currentStep: 1-5,
  answers: {
    sentimentoGeral: number,
    incomodoPrincipal: string,
    habitosDesejados: string[],
    tempoDisponivel: string,
    buscaPrincipal: string[]
  }
}

Primeira etapa (Step 1):
Título: "Como você se sente na maior parte do tempo?"

- Slider de 1 a 10
- Emojis correspondentes:
  1-2: 😢, 3-4: 😟, 5-6: 😐, 7-8: 🙂, 9-10: 😊
- Label mostrando número
- Valor padrão: 5

Campo opcional:
- "O que mais te incomoda hoje?"
- Textarea 500 chars max
- Contador de caracteres

Botão: "Continuar"

Design: limpo, um elemento focal por vez, muito espaço.
```

## 5️⃣ ONBOARDING - ETAPA 2
```
Crie Step 2 do onboarding:

Título: "Quais hábitos você gostaria de ter?"
Subtítulo: "Selecione quantos quiser"

Grid 2x3 de cards selecionáveis (multi-select):

1. Meditação diária (ícone Brain)
2. Mais paciência (ícone Heart)
3. Exercício físico (ícone Activity)
4. Reflexão regular (ícone BookOpen)
5. Perdoar mais (ícone Smile)
6. Servir aos outros (ícone Users)

Estados do card:
- Não selecionado: border cinza, fundo transparente
- Selecionado: border roxo (#6B46C1), fundo roxo/10, checkmark

Comportamento:
- Múltipla seleção permitida
- Mínimo 1 para continuar
- Contador: "X selecionados"

Botão "Continuar" desabilitado se nenhum selecionado.

Design: cards grandes, clicáveis, hover effect sutil.
```

---

# PRÓXIMOS PASSOS

1. **Comece pelo Comando 1** (Setup)
2. **Teste o preview** após cada comando
3. **Ajuste conforme necessário** antes de avançar
4. **Use este documento como referência** durante toda construção
5. **Marque comandos completados** para não se perder

Quando tiver dúvidas ou quiser ajustes, me chame! 🚀
