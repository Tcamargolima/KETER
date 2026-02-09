# Fase 7: Gráficos de Evolução - Documentação

## 📊 Visão Geral

A Fase 7 implementa um sistema completo de visualização de dados com 4 gráficos principais para acompanhar a evolução do usuário no KETER.

## 🎯 Componentes Implementados

### 1. `useEvolutionData.js` - Hook de Dados
**Localização:** `/src/hooks/useEvolutionData.js`

**Funcionalidades:**
- Busca dados de reflexões, práticas e micro-atos do Supabase
- Processa dados dos últimos 90 dias (configurável)
- Calcula estatísticas agregadas
- Usa `useMemo` para performance

**Dados Processados:**
```javascript
{
  streakCalendarData: {
    labels: ['01/02', '02/02', ...],
    data: [2, 3, 1, 0, ...],      // Atividades por dia
    rawData: { '2024-02-01': 2, ... }
  },
  moodEvolutionData: {
    labels: ['01/02', '05/02', ...],
    data: [7.5, 8.2, 6.8, ...],   // Humor médio por dia
    media: 7.4
  },
  progressByCategoryData: {
    labels: ['Meditação', 'Gratidão', ...],
    data: [15, 12, 20, ...],       // Práticas por categoria
    total: 47
  },
  aiPatternsData: {
    labels: ['Agência', 'Vitimização', 'Neutro'],
    data: [65, 5, 30],             // Percentuais
    agencia: 65,
    vitimizacao: 5,
    neutro: 30
  },
  statistics: {
    totalReflexoes: 25,
    totalPraticas: 47,
    totalMicroAtos: 32,
    diasAtivos: 28,
    mediaHumor: 7.4,
    sequenciaAtual: 7
  }
}
```

**Uso:**
```javascript
import { useEvolutionData } from '../hooks/useEvolutionData';

const { 
  carregando, 
  erro, 
  streakCalendarData,
  moodEvolutionData,
  statistics 
} = useEvolutionData(userId, 90); // 90 dias
```

### 2. `EvolutionCharts.jsx` - Componente de Gráficos
**Localização:** `/src/components/features/EvolutionCharts.jsx`

**Gráficos Implementados:**

#### 📅 Streak Calendar (Bar Chart)
- Mostra atividades diárias (últimos 30 dias)
- Cores gradientes baseadas na quantidade:
  - **0 atividades**: Cinza claro
  - **1 atividade**: Roxo (purple)
  - **2 atividades**: Rosa (pink)
  - **3+ atividades**: Âmbar (amber)
- Tooltips customizados

#### 💗 Evolução do Humor (Line Chart)
- Linha do tempo do humor médio diário
- Escala 0-10
- Área preenchida com gradiente rosa
- Suavização de curva (tension: 0.4)

#### 🎯 Progresso por Categoria (Doughnut Chart)
- Pizza mostrando distribuição de práticas
- Cores KETER alternadas
- Percentuais calculados automaticamente
- Legenda na parte inferior

#### 🧠 Padrões Detectados pela IA (Pie Chart)
- Análise de sentimentos nas reflexões
- Categorias:
  - **Agência**: Proatividade, responsabilidade
  - **Vitimização**: Passividade, culpa externa
  - **Neutro/Balanceado**: Sem padrão detectado
- Cores: Âmbar (agência), Roxo (vitimização), Rosa (neutro)

**Paleta de Cores KETER:**
```javascript
const KETER_COLORS = {
  purple: { main: '#9333ea', light: '#a855f7', dark: '#7e22ce' },
  pink:   { main: '#ec4899', light: '#f472b6', dark: '#db2777' },
  amber:  { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
  slate:  { main: '#64748b', light: '#94a3b8', dark: '#475569' }
};
```

### 3. Integração no Perfil
**Localização:** `/src/pages/Perfil/index.jsx`

**Mudanças:**
1. Importação do componente `EvolutionCharts`
2. Importação do ícone `BarChart3` do lucide-react
3. Nova aba "Evolução" adicionada
4. Componente `EvolucaoTab` criado

**Estrutura de Abas Atualizada:**
```
- Visão Geral
- Evolução         ← NOVA ABA
- Micro-atos
- Reflexões
- Conquistas
- Configurações
```

## 📦 Dependências Instaladas

```json
{
  "chart.js": "^4.4.1",
  "react-chartjs-2": "^5.2.0"
}
```

**Componentes Chart.js Registrados:**
- CategoryScale
- LinearScale
- PointElement
- LineElement
- BarElement
- ArcElement
- Title
- Tooltip
- Legend
- Filler

## 🎨 Design e UX

### Responsividade
- Grid adaptativo: 1 coluna (mobile) → 2 colunas (desktop)
- Gráficos com `maintainAspectRatio: false`
- Altura fixa de 300px por gráfico

### Tooltips Customizados
```javascript
tooltip: {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  titleColor: '#fff',
  bodyColor: '#cbd5e1',
  borderColor: KETER_COLORS.purple.main,
  borderWidth: 1,
  padding: 12
}
```

### Estados de Loading e Erro
- Loading: Mensagem centralizada
- Erro: Card vermelho com detalhes
- Empty State: Mensagem motivacional quando não há dados

### Cards de Estatísticas
4 cards no topo com resumo rápido:
- 📅 Dias Ativos
- 📈 Sequência Atual
- 💗 Humor Médio
- 🧠 Total de Atos

## 🔧 Como Usar

### Integração Básica
```jsx
import { EvolutionCharts } from './components/features/EvolutionCharts';

function MeuComponente() {
  return (
    <div>
      <h1>Minha Evolução</h1>
      <EvolutionCharts userId={usuario.id} />
    </div>
  );
}
```

### Com Dados Customizados
```jsx
import { useEvolutionData } from './hooks/useEvolutionData';

function CustomChart() {
  const { moodEvolutionData, carregando } = useEvolutionData(userId, 30); // 30 dias
  
  if (carregando) return <div>Carregando...</div>;
  
  return (
    <div>
      <p>Humor médio: {moodEvolutionData.media}</p>
      {/* Seu gráfico customizado */}
    </div>
  );
}
```

## 🧪 Testes

### Teste HTML Standalone
Arquivo criado: `/test-evolution-charts.html`

Abra no navegador para ver:
- Demonstração visual de todos os 4 gráficos
- Dados mockados
- Sem necessidade de build

### Dados de Teste
O hook automaticamente retorna estados vazios quando não há dados:
- Empty states com mensagens motivacionais
- Gráficos não quebram com arrays vazios
- Validação de dados em todos os useMemo

## 📊 Estrutura de Dados do Supabase

### Tabelas Utilizadas
```sql
-- reflexoes: humor_dia, analise_ia, data
SELECT ketero_id, data, humor_dia, analise_ia
FROM reflexoes
WHERE ketero_id = ? AND data >= ?
ORDER BY data ASC;

-- praticas_diarias: práticas completadas
SELECT pd.*, p.categoria, p.nome
FROM praticas_diarias pd
JOIN praticas p ON pd.pratica_id = p.id
WHERE pd.ketero_id = ? AND pd.completada = true
AND pd.completed_at >= ?
ORDER BY pd.completed_at ASC;

-- micro_atos: atos de bondade
SELECT *
FROM micro_atos
WHERE ketero_id = ? AND executado = true
AND data >= ?
ORDER BY data ASC;
```

## 🎯 Próximos Passos

### Melhorias Possíveis
1. **Filtros de Período**: Adicionar seletor de período (7, 30, 90, 365 dias)
2. **Export de Dados**: Botão para baixar CSV/PDF dos gráficos
3. **Comparação Temporal**: Comparar período atual vs anterior
4. **Insights Automáticos**: IA gerando insights sobre os padrões
5. **Gráficos Adicionais**:
   - Heat map de horas do dia mais produtivas
   - Radar chart de categorias de práticas
   - Timeline de conquistas

### Otimizações
- [ ] Cache de dados processados no localStorage
- [ ] Lazy loading dos gráficos
- [ ] Virtualização para muitos dados
- [ ] Web Workers para processamento pesado

## 🐛 Troubleshooting

### Gráficos não aparecem
- Verificar se Chart.js está registrado
- Confirmar que userId é válido
- Checar console para erros do Supabase

### Performance lenta
- Reduzir `daysRange` em `useEvolutionData`
- Adicionar debounce em filtros
- Usar `React.memo` nos subcomponentes

### Cores não aparecem
- Verificar se Tailwind está configurado
- Confirmar paleta KETER_COLORS
- Checar suporte a gradientes no navegador

## 📝 Exemplo Completo

```jsx
import React from 'react';
import { EvolutionCharts } from './components/features/EvolutionCharts';
import { useAuth } from './hooks/useAuth';

export function PerfilPage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Minha Evolução
        </h1>
        
        <EvolutionCharts userId={user.id} />
      </div>
    </div>
  );
}
```

## ✅ Checklist de Implementação

- [x] Instalar dependências (chart.js, react-chartjs-2)
- [x] Criar hook useEvolutionData
- [x] Implementar processamento de dados
- [x] Criar componente EvolutionCharts
- [x] Implementar 4 gráficos principais
- [x] Registrar componentes Chart.js
- [x] Adicionar paleta de cores KETER
- [x] Criar tooltips customizados
- [x] Implementar estados de loading/erro
- [x] Integrar no Perfil como nova aba
- [x] Adicionar ícone BarChart3
- [x] Criar arquivo de teste HTML
- [x] Documentar uso e estrutura

## 🎉 Resultado

A Fase 7 está completa! Os usuários agora podem:
- 📊 Visualizar seu progresso ao longo do tempo
- 💗 Acompanhar evolução emocional
- 🎯 Entender distribuição de práticas
- 🧠 Ver padrões comportamentais detectados pela IA
- 📈 Celebrar conquistas e streaks

A interface é limpa, moderna e totalmente responsiva, mantendo a identidade visual KETER com suas cores características (roxo, rosa, âmbar).
