# 📊 GUIA VISUAL: Gráficos de Evolução - Fase 7

## 🎨 Layout Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                        🎯 PERFIL - ABA EVOLUÇÃO                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  📊 Gráficos de Evolução                                             │
│  Visualize seu progresso através de dados e análises                │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│  ESTATÍSTICAS RÁPIDAS (Cards no topo)                                │
├─────────────────┬─────────────────┬─────────────────┬──────────────┤
│ 📅 Dias Ativos  │ 📈 Sequência    │ 💗 Humor Médio  │ 🧠 Total Atos│
│       28        │    7 dias       │     7.4/10      │      32      │
│                 │                 │                 │              │
└─────────────────┴─────────────────┴─────────────────┴──────────────┘

┌──────────────────────────────────┬──────────────────────────────────┐
│ 📅 CALENDÁRIO DE ATIVIDADES      │ 💗 EVOLUÇÃO DO HUMOR             │
│ Últimos 30 dias                   │ Média diária de humor            │
│                                   │                                  │
│  ████ BAR CHART ████              │  ─────── LINE CHART ───────      │
│  Roxo/Rosa/Âmbar por intensidade  │  Rosa com área preenchida        │
│  0=Cinza 1=Roxo 2=Rosa 3+=Âmbar  │  Escala 0-10                     │
│                                   │  Média: 7.4                      │
│  [Gráfico de barras mostrando     │  [Linha do tempo mostrando       │
│   atividades diárias]             │   evolução do humor]             │
│                                   │                                  │
└──────────────────────────────────┴──────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────────────┐
│ 🎯 PROGRESSO POR CATEGORIA       │ 🧠 PADRÕES DETECTADOS PELA IA    │
│ Distribuição de práticas          │ Análise de agência vs vitimização│
│                                   │                                  │
│     ◐ DOUGHNUT CHART ◑            │       ● PIE CHART ●              │
│  Meditação - 27% (roxo)           │  Agência - 65% (âmbar)           │
│  Gratidão - 22% (rosa)            │  Neutro - 30% (rosa)             │
│  Bondade - 36% (âmbar)            │  Vitimização - 5% (roxo)         │
│  Reflexão - 15% (cinza)           │                                  │
│  Total: 55 práticas               │  [Gráfico pizza mostrando        │
│                                   │   padrões comportamentais]       │
└──────────────────────────────────┴──────────────────────────────────┘
```

---

## 🎨 Paleta de Cores (Hexadecimais)

### Cores Principais KETER
```
┌──────────────────────────────────────────────────────────────┐
│ ROXO (Purple) - Principal                                    │
│ ██████████ #9333ea (main)                                    │
│ ██████████ #a855f7 (light)                                   │
│ ██████████ #7e22ce (dark)                                    │
│ rgba(147, 51, 234, 0.8) - gradient com transparência         │
│                                                              │
│ Uso: Streak Calendar (1 atividade), Borders, Highlights     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ROSA (Pink) - Emocional                                      │
│ ██████████ #ec4899 (main)                                    │
│ ██████████ #f472b6 (light)                                   │
│ ██████████ #db2777 (dark)                                    │
│ rgba(236, 72, 153, 0.8) - gradient com transparência         │
│                                                              │
│ Uso: Mood Chart, Streak (2 atividades), Categorias          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ÂMBAR (Amber) - Energia                                      │
│ ██████████ #f59e0b (main)                                    │
│ ██████████ #fbbf24 (light)                                   │
│ ██████████ #d97706 (dark)                                    │
│ rgba(245, 158, 11, 0.8) - gradient com transparência         │
│                                                              │
│ Uso: Streak (3+ atividades), Agência IA, Stats Cards        │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ CINZA (Slate) - Base/Neutro                                  │
│ ██████████ #64748b (main)                                    │
│ ██████████ #94a3b8 (light)                                   │
│ ██████████ #475569 (dark)                                    │
│ rgba(100, 116, 139, 0.3) - dias sem atividade                │
│                                                              │
│ Uso: Background, Text, Dias inativos, Categoria "Outros"    │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Detalhamento dos Gráficos

### 1. 📅 STREAK CALENDAR (Bar Chart)
```
Tipo: Gráfico de Barras Vertical
Dados: Últimos 30 dias
Fonte: reflexoes + praticas_diarias + micro_atos

LÓGICA DE CORES:
┌──────────┬──────────────────────────────────────────┐
│ Valor    │ Cor + Significado                        │
├──────────┼──────────────────────────────────────────┤
│ 0        │ █ Cinza - Nenhuma atividade              │
│ 1        │ █ Roxo - 1 atividade (prática OU reflexão)│
│ 2        │ █ Rosa - 2 atividades                     │
│ 3+       │ █ Âmbar - 3 ou mais atividades           │
└──────────┴──────────────────────────────────────────┘

EXEMPLO VISUAL:
Dias: 01  02  03  04  05  06  07  08 ...
      █   ██  ███ █   ░   ██  ███ █
      1   2   3   1   0   2   3   1

TOOLTIP:
"5 de Fevereiro"
"3 atividades"
```

### 2. 💗 MOOD EVOLUTION (Line Chart)
```
Tipo: Gráfico de Linha com Área Preenchida
Dados: Reflexões com campo humor_dia
Escala: 0-10
Cor: Rosa (#ec4899) com transparência

EXEMPLO VISUAL:
10 ┤
 9 ┤
 8 ┤     ╱╲    ╱
 7 ┤    ╱  ╲  ╱
 6 ┤   ╱    ╲╱
 5 ┤  ╱
 4 ┤ ╱
 3 ┤╱
   └────────────────────────>
   01  05  10  15  20  25

Área sob a linha: Rosa translúcido
Pontos: Rosa sólido com borda branca
Média: Linha tracejada horizontal

TOOLTIP:
"10 de Fevereiro"
"Humor: 7.5/10"
```

### 3. 🎯 PROGRESS BY CATEGORY (Doughnut Chart)
```
Tipo: Gráfico de Rosquinha (donut)
Dados: praticas_diarias JOIN praticas (categoria)
Total: Soma de todas práticas completadas

DISTRIBUIÇÃO EXEMPLO:
      ╭─────────────╮
     ╱  27% Roxo     ╲
    │   Meditação     │
    │ ╭───────────╮   │
    ││             ││
    ││   Total:    ││
    ││   55        ││
    ││   práticas  ││
    │ ╰───────────╯   │
    │ 36% Âmbar       │
     ╲  Bondade      ╱
      ╰─────────────╯
       22% Rosa
       Gratidão

LEGENDA (bottom):
● Meditação (15) - 27%
● Gratidão (12) - 22%
● Bondade (20) - 36%
● Reflexão (8) - 15%

TOOLTIP:
"Meditação: 15 (27.3%)"
```

### 4. 🧠 AI PATTERNS (Pie Chart)
```
Tipo: Gráfico de Pizza
Dados: Análise de analise_ia em reflexoes
Categorias: Agência / Vitimização / Neutro

PALAVRAS-CHAVE:
Agência: agência, proativ, responsabilidade, iniciativa,
         ação, controle, decisão, escolha, poder

Vitimização: vítima, culpa, impotente, impossível,
             não consigo, destino, sorte, injust

EXEMPLO VISUAL:
      ╭─────────────╮
     ╱   65%         ╲
    │   Agência       │
   ╱│   (Âmbar)      │╲
  │ ╰───────────────╯  │
  │        5%           │
  │    Vitimização      │
   ╲     (Roxo)        ╱
    ╲                 ╱
     ╰───────────────╯
         30%
        Neutro
        (Rosa)

TOOLTIP:
"Agência: 65%"
"Demonstra proatividade e responsabilidade"
```

---

## 🎯 Cards de Estatísticas (Topo)

### Layout dos Cards
```
┌─────────────────────┬─────────────────────┬─────────────────────┬────────────────────┐
│ 📅 Dias Ativos      │ 📈 Sequência Atual  │ 💗 Humor Médio      │ 🧠 Total de Atos   │
│ ┌─────────────────┐ │ ┌─────────────────┐ │ ┌─────────────────┐ │ ┌────────────────┐ │
│ │ Ícone: Calendar │ │ │ Ícone: TrendUp  │ │ │ Ícone: Heart    │ │ │ Ícone: Brain   │ │
│ │ Cor: Roxo       │ │ │ Cor: Âmbar      │ │ │ Cor: Rosa       │ │ │ Cor: Roxo      │ │
│ │                 │ │ │                 │ │ │                 │ │ │                │ │
│ │ Valor: 28       │ │ │ Valor: 7 dias   │ │ │ Valor: 7.4/10   │ │ │ Valor: 32      │ │
│ │ Label: Dias     │ │ │ Label: Sequência│ │ │ Label: Humor    │ │ │ Label: Atos    │ │
│ │        Ativos   │ │ │                 │ │ │        Médio    │ │ │                │ │
│ └─────────────────┘ │ └─────────────────┘ │ └─────────────────┘ │ └────────────────┘ │
│                     │                     │                     │                    │
│ Gradient:           │ Gradient:           │ Gradient:           │ Gradient:          │
│ purple-900 → 800    │ amber-900 → 800     │ pink-900 → 800      │ purple-900 → 800   │
│ Border: purple-700  │ Border: amber-700   │ Border: pink-700    │ Border: purple-700 │
└─────────────────────┴─────────────────────┴─────────────────────┴────────────────────┘
```

---

## 📱 Responsividade

### Desktop (lg:)
```
┌─────────────────────────────────────────────────────────────┐
│ Stats Cards: 4 colunas (grid-cols-4)                        │
├──────────────────────────────┬──────────────────────────────┤
│ Streak Calendar              │ Mood Evolution               │
│ (50% width)                  │ (50% width)                  │
├──────────────────────────────┼──────────────────────────────┤
│ Progress by Category         │ AI Patterns                  │
│ (50% width)                  │ (50% width)                  │
└──────────────────────────────┴──────────────────────────────┘
Grid: lg:grid-cols-2 gap-6
```

### Tablet/Mobile (md/sm)
```
┌───────────────────────────┐
│ Stats: 2 colunas          │
├───────────┬───────────────┤
│ Dias      │ Sequência     │
├───────────┼───────────────┤
│ Humor     │ Atos          │
└───────────┴───────────────┘

┌───────────────────────────┐
│ Streak Calendar (100%)    │
├───────────────────────────┤
│ Mood Evolution (100%)     │
├───────────────────────────┤
│ Category Progress (100%)  │
├───────────────────────────┤
│ AI Patterns (100%)        │
└───────────────────────────┘
Grid: grid-cols-1
```

---

## 🎨 Estados Visuais

### Loading State
```
┌────────────────────────────────────┐
│                                    │
│   ⟳ Carregando dados de evolução...│
│                                    │
└────────────────────────────────────┘
Cor: Branco (text-white)
Centralizado
```

### Error State
```
┌────────────────────────────────────┐
│ ⚠️ Erro ao carregar dados          │
│                                    │
│ [Mensagem de erro específica]     │
└────────────────────────────────────┘
Fundo: red-900/20
Border: red-700
Texto: red-200
```

### Empty State (por gráfico)
```
┌────────────────────────────────────┐
│                                    │
│   [Mensagem específica]            │
│   Continue sua jornada para ver    │
│   seus gráficos de evolução        │
│                                    │
└────────────────────────────────────┘
Cor: slate-500 (cinza)
Centralizado
Altura: 256px (h-64)
```

---

## 🖱️ Interatividade

### Tooltips
```
╔════════════════════════════╗
║ 10 de Fevereiro            ║ ← Título (branco)
║ ────────────────────────── ║
║ 3 atividades               ║ ← Corpo (slate-300)
╚════════════════════════════╝
    ▼ (ponteiro)

Background: rgba(15, 23, 42, 0.95) - quase opaco
Border: 1px roxo (#9333ea)
Padding: 12px
Border-radius: rounded
```

### Hover Effects
- Cards de stats: Sem hover (estáticos)
- Gráficos: Tooltip aparece ao passar mouse
- Pontos da linha: Aumentam de tamanho (radius: 4px → 6px)
- Fatias de pizza/donut: Offset de 10px

### Animações
- Entrada: Fade in suave
- Carregamento: Spinner rotativo
- Gráficos: Animação de draw ao montar
- Transições: 300ms ease

---

## 📏 Dimensões

### Cards de Estatísticas
- Height: auto (ajusta ao conteúdo)
- Padding: p-4 (16px)
- Border-radius: rounded-xl (12px)
- Border-width: 1px
- Gap: gap-4 (16px)

### Cards de Gráficos
- Height: auto + fixed chart height (300px)
- Padding: p-6 (24px)
- Border-radius: rounded-xl (12px)
- Border-width: 1px
- Gap: gap-6 (24px)

### Gráficos Internos
- Height: 300px (fixed)
- Width: 100% (responsive)
- maintainAspectRatio: false

---

## 🔤 Tipografia

### Títulos
```
"Gráficos de Evolução"
- Size: text-2xl (1.5rem / 24px)
- Weight: font-bold (700)
- Color: text-white
- Margin-bottom: mb-2 (8px)
```

### Subtítulos
```
"Visualize seu progresso através de dados e análises"
- Size: text-base (1rem / 16px)
- Weight: normal (400)
- Color: text-slate-400
```

### Labels de Cards
```
"Dias Ativos"
- Size: text-xs (0.75rem / 12px)
- Weight: normal (400)
- Color: text-slate-300
```

### Valores de Cards
```
"28" ou "7.4/10"
- Size: text-2xl (1.5rem / 24px)
- Weight: font-bold (700)
- Color: text-white
- Margin-bottom: mb-1 (4px)
```

---

## 🎭 Ícones (Lucide React)

### Usados
- Calendar (📅) - Dias ativos, Streak
- TrendingUp (📈) - Sequência, Evolução
- Heart (💗) - Humor, Micro-atos
- Brain (🧠) - IA, Padrões
- BarChart3 (📊) - Ícone da aba Evolução

### Tamanho
- Cards de stats: w-6 h-6 (24px)
- Cards de gráficos: w-5 h-5 (20px)
- Aba: w-5 h-5 (20px)

---

## ✨ Diferenciais

### UX
✅ Loading states claros
✅ Empty states motivacionais
✅ Error handling gracioso
✅ Tooltips informativos
✅ Cores significativas (não apenas decorativas)
✅ Responsivo mobile-first

### Performance
✅ useMemo para cálculos pesados
✅ Queries otimizadas do Supabase
✅ Lazy loading recomendado
✅ Componentes leves

### Acessibilidade
✅ Cores com contraste adequado
✅ Labels descritivos
✅ Tooltips com informação clara
✅ Ícones com significado semântico

---

## 🎯 Resultado Final

Os gráficos de evolução proporcionam:
1. **Motivação**: Ver progresso visual incentiva continuidade
2. **Insights**: Padrões comportamentais ficam claros
3. **Gamificação**: Streaks e estatísticas engajam
4. **Autoconhecimento**: Humor e padrões IA revelam evolução emocional

**Status: ✅ IMPLEMENTAÇÃO COMPLETA E FUNCIONAL**

---

_Guia Visual criado para KETER - Fase 7: Gráficos de Evolução_
