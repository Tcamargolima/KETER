# 🌙 Sistema de Reflexão Noturna - Documentação Completa

## 📋 Visão Geral

O Sistema de Reflexão Noturna é uma funcionalidade completa do KETER que permite aos usuários refletirem sobre seu dia através de perguntas guiadas, com análise em tempo real da IA.

## ✨ Funcionalidades Implementadas

### 1. **Componentes Criados**

#### `reflexao-integration.jsx`
Arquivo principal que contém:
- **Hook `useReflexaoNoturna`**: Gerencia todo o estado da reflexão
- **Componente `NotificacaoReflexao`**: Notificação visual que aparece às 20h
- **Componente `ReflexaoWrapper`**: Wrapper que adiciona análise IA ao modal
- **Componente `AnaliseIAModal`**: Exibe os insights gerados pela IA
- **Função `analisarReflexaoComIA`**: Integração com OpenAI para análise

### 2. **Sistema de Notificação Automática**

```javascript
// Verifica o horário a cada minuto
// Exibe notificação entre 20h e 23h59
// Apenas se o usuário ainda não fez a reflexão
```

**Comportamento:**
- ✅ Notificação aparece às 20h (8pm)
- ✅ Persiste até 23h59 se não for feita
- ✅ Desaparece automaticamente se a reflexão for completada
- ✅ Pode ser fechada temporariamente pelo usuário

### 3. **Perguntas Dinâmicas por Fase**

#### Fase 1 - DESPERTAR (3 perguntas)
1. Como você se sentiu durante o dia? (texto obrigatório)
2. Você tratou alguém com paciência ou bondade? (múltipla escolha obrigatória)
3. Se pudesse reviver hoje, mudaria algo? (texto opcional)

#### Fase 2 - DISCIPLINA (4 perguntas)
1. Como você se sentiu durante o dia? (texto obrigatório)
2. Você executou seu micro-ato de bondade hoje? (múltipla escolha obrigatória)
3. Qual foi seu maior desafio de disciplina hoje? (texto opcional)
4. Pelo que você é grato hoje? (texto obrigatório)

#### Fase 3 - CONSCIÊNCIA (4 perguntas)
1. Que mudança você observou em si mesmo hoje? (texto obrigatório)
2. Houve um momento hoje em que você estava plenamente presente? (múltipla escolha obrigatória)
3. Você notou algum padrão se repetindo? (texto opcional)
4. Como suas ações impactaram outras pessoas hoje? (texto obrigatório)

### 4. **Análise IA em Tempo Real**

**Processo:**
1. ✅ Usuário completa as perguntas
2. ✅ Sistema salva no Supabase
3. ✅ OpenAI analisa o texto (GPT-3.5-turbo)
4. ✅ IA retorna:
   - Feedback empático e construtivo (2-3 parágrafos)
   - Insight sobre estado emocional
   - Sugestão prática para o próximo dia
5. ✅ Análise é exibida em modal bonito
6. ✅ Salva também no banco para histórico

**Fallback:**
- Se a IA falhar, reflexão é salva normalmente
- Análise local básica (detecção de sentimento simples)
- Não bloqueia o salvamento

### 5. **Integração com Supabase**

#### Schema Atualizado (`supabase-schema-update-reflexoes.sql`)
```sql
-- Novas colunas adicionadas:
- micro_ato_executado (VARCHAR)
- desafio_disciplina (TEXT)
- gratidao_dia (TEXT)
- observacao_mudanca (TEXT)
- momento_consciencia (VARCHAR)
- padrao_observado (TEXT)
- impacto_outros (TEXT)
```

#### Função de Incremento
```sql
-- Atualiza contador de reflexões automaticamente
CREATE OR REPLACE FUNCTION increment_reflexoes(user_id UUID)
```

### 6. **Integração no App Principal**

#### `keter-app.jsx` - Mudanças
```javascript
// 1. Import do sistema
import { useReflexaoNoturna, NotificacaoReflexao, ReflexaoWrapper } from './reflexao-integration';

// 2. Hook no componente principal
const reflexaoHook = useReflexaoNoturna(user?.id, userStats.faseAtual);

// 3. Notificação no render
<NotificacaoReflexao
  mostrar={reflexaoHook.mostrarNotificacao}
  onAbrir={() => reflexaoHook.setMostrarModal(true)}
  onFechar={() => reflexaoHook.setMostrarNotificacao(false)}
/>

// 4. Modal de reflexão
{reflexaoHook.mostrarModal && (
  <ReflexaoWrapper
    fase={userStats.faseAtual}
    userId={user.id}
    onFechar={() => reflexaoHook.setMostrarModal(false)}
    onSalvar={reflexaoHook.salvarReflexao}
  />
)}

// 5. Indicador visual no Home
- Card "Reflexão Noturna" se ainda não fez
- Card "Reflexão Completa ✨" se já fez
```

## 🎨 UX/UI

### Design
- **Notificação:** Slide-in do canto superior direito
- **Modal:** Gradiente roxo-pink, bordas arredondadas
- **Loading:** Spinner animado durante análise IA
- **Análise:** Modal separado com destaque para insights

### Animações
- Fade-in suave da notificação
- Scale-in do modal
- Bounce no ícone de sino
- Spinner durante processamento

### Responsividade
- ✅ Mobile-friendly
- ✅ Scroll automático em perguntas longas
- ✅ Textarea adaptativo

## 🔧 Como Usar

### Para Desenvolvedores

#### 1. Executar Migration do Schema
```bash
# No Supabase SQL Editor:
# Cole o conteúdo de supabase-schema-update-reflexoes.sql
# Execute
```

#### 2. Configurar Variáveis de Ambiente
```bash
# .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_OPENAI_API_KEY=your_openai_key
```

#### 3. Instalar Dependências
```bash
npm install
```

#### 4. Rodar App
```bash
npm run dev
```

### Para Usuários

1. **Acesse o app após 20h (8pm)**
2. **Notificação aparecerá no canto superior direito**
3. **Clique em "Fazer Agora" ou ignore por enquanto**
4. **Responda as perguntas de forma honesta**
5. **Aguarde a análise da IA (10-15 segundos)**
6. **Leia os insights e continue**

## 📊 Métricas

### Dados Coletados
- Respostas de todas as perguntas
- Horário da reflexão
- Palavras-chave identificadas
- Sentimento detectado (positivo/neutro/negativo)
- Análise completa da IA

### Estatísticas Atualizadas
- `total_reflexoes` incrementado automaticamente
- `ultimo_acesso` atualizado
- Histórico completo salvo

## 🔒 Segurança

### Row Level Security (RLS)
- ✅ Usuários só veem suas próprias reflexões
- ✅ Política aplicada automaticamente
- ✅ Nenhum acesso cross-user

### API Keys
- ⚠️ OpenAI key exposta no browser (desenvolvimento)
- 🔜 TODO: Mover para backend serverless (produção)
- ✅ Supabase anon key segura

## 💰 Custos Estimados

### OpenAI (GPT-3.5-turbo)
- **Por reflexão:** ~500 tokens = $0.0007
- **1000 usuários/dia:** $0.70/dia = ~$21/mês
- **Otimização:** Cache de análises similares

### Supabase
- **Free tier:** Até 500MB DB
- **Crescimento:** ~1KB por reflexão
- **Capacidade:** ~500K reflexões no free tier

## 🐛 Troubleshooting

### Modal não abre
```javascript
// Verificar se o hook está inicializado
console.log(reflexaoHook);
// Deve ter: mostrarModal, setMostrarModal, etc.
```

### Notificação não aparece
```javascript
// Verificar horário
const agora = new Date();
console.log(agora.getHours()); // Deve ser >= 20
```

### Análise IA falha
```javascript
// Verificar API key
console.log(import.meta.env.VITE_OPENAI_API_KEY);
// Verificar console para erros de rate limit
```

### Dados não salvam
```sql
-- Verificar RLS no Supabase
SELECT * FROM reflexoes_noturnas WHERE ketero_id = 'user_id';
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'reflexoes_noturnas';
```

## 🚀 Próximos Passos

### Melhorias Planejadas
- [ ] Mover análise IA para backend (Edge Functions)
- [ ] Sistema de notificações push (PWA)
- [ ] Exportar reflexões em PDF
- [ ] Gráficos de evolução emocional
- [ ] Comparação com semana anterior
- [ ] Insights semanais automáticos
- [ ] Compartilhar reflexões anônimas na comunidade

### Otimizações
- [ ] Cache de análises similares
- [ ] Lazy loading do modal
- [ ] Compression de textos longos
- [ ] Batch processing de análises

## 📝 Exemplos de Uso

### Hook Standalone
```javascript
const {
  mostrarModal,
  setMostrarModal,
  mostrarNotificacao,
  reflexaoHoje,
  salvarReflexao,
  jaFezReflexaoHoje
} = useReflexaoNoturna(userId, faseAtual);

// Verificar se já fez hoje
if (jaFezReflexaoHoje) {
  console.log('Já refletiu!', reflexaoHoje);
}

// Abrir modal programaticamente
setMostrarModal(true);

// Salvar reflexão
const resultado = await salvarReflexao(respostas);
```

### Componente Customizado
```javascript
<NotificacaoReflexao
  mostrar={true}
  onAbrir={() => alert('Abrir modal')}
  onFechar={() => alert('Fechar notificação')}
/>
```

## 🎯 KPIs de Sucesso

### Engajamento
- **Meta:** 70% dos usuários fazem reflexão diária
- **Atual:** Implementado, aguardando dados

### Retenção
- **Meta:** Aumentar retenção D7 em 20%
- **Hipótese:** Reflexão cria hábito diário

### Qualidade
- **Meta:** Análise IA útil em 80% dos casos
- **Medição:** Feedback dos usuários

## 🙏 Agradecimentos

Sistema desenvolvido com:
- React 18
- Supabase (PostgreSQL + Auth)
- OpenAI GPT-3.5-turbo
- Lucide Icons
- Tailwind CSS

---

**Versão:** 1.0.0  
**Data:** Fevereiro 2025  
**Autor:** KETER Team  
**Status:** ✅ Implementado e Funcional
