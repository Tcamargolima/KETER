# Biblioteca de Práticas KETER - Documentação

## Visão Geral

Este documento descreve a implementação completa da biblioteca de práticas do KETER, incluindo banco de dados, componentes React e hooks personalizados.

## 📦 Estrutura de Arquivos

```
KETER/
├── database/
│   ├── migration-praticas-table.sql    # Migration para criar tabela praticas
│   └── seed-praticas.sql               # Seed com 10 práticas de exemplo
├── scripts/
│   ├── seed-db.js                      # Script Node.js para popular DB
│   └── reset-db.js                     # Script para limpar DB
├── src/
│   ├── components/features/
│   │   ├── PracticeLibrary.jsx        # Biblioteca com filtros
│   │   └── PracticeTimer.jsx          # Timer circular dinâmico
│   ├── hooks/
│   │   └── usePraticas.js             # Hook para gerenciar práticas
│   ├── lib/
│   │   └── supabase.js                # Cliente + helpers (atualizado)
│   └── pages/
│       └── Home/
│           └── index.jsx              # Home com recomendação IA
```

## 🗄️ Banco de Dados

### 1. Criar Tabela `praticas`

Execute o arquivo `database/migration-praticas-table.sql` no SQL Editor do Supabase:

```bash
# No Supabase Dashboard:
# SQL Editor > New Query > Cole o conteúdo do arquivo > Run
```

**Estrutura da Tabela:**
- `id` (UUID): Identificador único
- `titulo` (VARCHAR): Nome da prática
- `subtitulo` (VARCHAR): Descrição curta
- `fase` (INTEGER): Fase da jornada (1-4)
- `categoria` (VARCHAR): Categoria (Respiração, Meditação, etc)
- `duracao_min` (INTEGER): Duração em minutos
- `instrucoes_texto` (TEXT): JSON com etapas e instruções
- `audio_url` (VARCHAR, opcional): URL do áudio guiado
- `ordem` (INTEGER): Ordem de apresentação na fase
- Metadados: dificuldade, icone, cor_categoria, objetivo, beneficios, dica

### 2. Popular com Dados Iniciais

**Opção A - Via SQL:**
```bash
# Execute database/seed-praticas.sql no SQL Editor
```

**Opção B - Via Script Node.js:**
```bash
# Configure .env com credenciais do Supabase
npm run db:seed
```

**Práticas Incluídas (10 práticas):**

**Fase 1 - Despertar:**
1. Respiração 4-7-8 (3 min)
2. Intenção do Dia (4 min)
3. Gratidão Profunda (4 min)

**Fase 2 - Disciplina:**
4. Meditação Guiada (10 min)
5. Body Scan (8 min)
6. Visualização Positiva (5 min)

**Fase 3 - Consciência:**
7. Loving-Kindness (Metta) (10 min)
8. Caminhada Consciente (15 min)
9. Diário de Insights (10 min)
10. Micro-ato de Bondade (5 min)

## 🔧 Configuração

### 1. Variáveis de Ambiente

Certifique-se de ter no `.env`:

```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_KEY=sua_service_key  # Opcional, apenas para scripts
```

### 2. Instalar Dependências

Todas as dependências já estão no `package.json`:
- @supabase/supabase-js
- react
- lucide-react (ícones)

## 🎯 Uso dos Componentes

### 1. Home Component

Mostra a próxima prática recomendada pela IA:

```jsx
import Home from './src/pages/Home';

<Home 
  userId={userId}
  onStartPratica={(pratica) => {
    // Navegar para o timer
    setPraticaId(pratica.id);
    setView('timer');
  }}
  onOpenLibrary={() => setView('library')}
/>
```

**Recursos:**
- Recomendação inteligente baseada em:
  - Fase atual do usuário
  - Práticas recentes (últimos 3 dias)
  - Horário do dia (manhã/tarde)
- Estatísticas do usuário
- Botão para biblioteca completa

### 2. PracticeLibrary Component

Biblioteca completa com filtros:

```jsx
import PracticeLibrary from './src/components/features/PracticeLibrary';

<PracticeLibrary
  userId={userId}
  onSelectPratica={(pratica) => {
    // Iniciar prática selecionada
    setPraticaId(pratica.id);
    setView('timer');
  }}
/>
```

**Recursos:**
- Busca por texto
- Filtro por fase (1-4)
- Filtro por categoria
- Cards com preview de benefícios
- Design responsivo

### 3. PracticeTimer Component

Timer circular com instruções dinâmicas:

```jsx
import PracticeTimer from './src/components/features/PracticeTimer';

<PracticeTimer
  praticaId={praticaId}
  userId={userId}
  onComplete={(pratica) => {
    // Prática concluída
    // Atualizar estatísticas
    // Mostrar conquistas
    setView('home');
  }}
  onBack={() => setView('home')}
/>
```

**Recursos:**
- Carrega prática do Supabase dinamicamente
- Timer circular animado
- Instruções passo a passo durante a prática
- Salva automaticamente no histórico
- Feedback de conclusão

## 🪝 Hook: usePraticas

Hook personalizado para gerenciar práticas:

```jsx
import { usePraticas } from './src/hooks/usePraticas';

const {
  praticas,                    // Todas as práticas
  praticasFiltradas,          // Práticas após filtros
  carregando,                 // Estado de loading
  erro,                       // Erro se houver
  faseAtual,                  // Fase atual do usuário
  
  // Métodos
  carregarPraticas,
  filtrarPraticas,
  obterPraticaPorId,
  obterPraticasDaFase,
  obterHistoricoPraticas,
  recomendarProximaPratica,
  obterCategorias,
  obterEstatisticas
} = usePraticas(userId);

// Exemplos de uso:

// Filtrar práticas
filtrarPraticas({ fase: 2, categoria: 'Meditação' });

// Obter prática específica
const { data: pratica } = await obterPraticaPorId(praticaId);

// Recomendação IA
const { data: proxima } = await recomendarProximaPratica();

// Estatísticas
const stats = await obterEstatisticas();
// Retorna: { total, tempoTotal, porCategoria, sequenciaAtual }
```

## 📚 Funções Helper (supabase.js)

Novas funções adicionadas:

```js
import { 
  getPraticas,              // Obter todas com filtros
  getPraticaById,           // Obter uma específica
  getPraticasByFase,        // Obter por fase
  getHistoricoPraticas      // Histórico do usuário
} from './src/lib/supabase';

// Exemplo:
const { data: praticas, error } = await getPraticas({ 
  fase: 1, 
  categoria: 'Respiração' 
});
```

## 🎨 Personalização

### Adicionar Novas Práticas

1. **Via SQL:**
```sql
INSERT INTO praticas (titulo, fase, categoria, duracao_min, instrucoes_texto, ordem, ...)
VALUES ('Nova Prática', 1, 'Categoria', 5, '[...]', 10, ...);
```

2. **Via Script:**
Edite `scripts/seed-db.js` e adicione ao array `PRATICAS_SEED`.

### Formato de Instruções

As instruções devem ser um array JSON:

```json
[
  {
    "duracao": 60,
    "titulo": "Preparação",
    "instrucoes": "Texto da instrução..."
  },
  {
    "duracao": 120,
    "titulo": "Prática Principal",
    "instrucoes": "Texto da instrução..."
  }
]
```

## 🧪 Testes

Para testar localmente:

```bash
# 1. Popular banco de dados
npm run db:seed

# 2. Iniciar dev server
npm run dev

# 3. Testar fluxo completo:
# - Home > Ver prática recomendada
# - Home > Biblioteca de práticas
# - Biblioteca > Filtrar por fase/categoria
# - Biblioteca > Selecionar prática
# - Timer > Iniciar prática
# - Timer > Completar prática
```

## 🔄 Integração com Sistema Existente

O sistema foi projetado para integrar com:

1. **Sistema de Reflexões:** `useReflexoes.js`
   - Usa reflexões para melhorar recomendações

2. **Sistema de Conquistas:** `keteros_conquistas`
   - Pode desbloquear conquistas ao completar práticas

3. **Sistema de Fases:** `keteros.fase_atual`
   - Recomenda práticas da fase atual

4. **IA/OpenAI:** `src/lib/openai.js`
   - Pode ser integrado para recomendações mais sofisticadas

## 📊 Analytics e Métricas

O sistema já rastreia:
- Total de práticas completadas
- Tempo total de prática
- Práticas por categoria
- Sequência de dias consecutivos

Para adicionar mais métricas, edite:
- `obterEstatisticas()` em `usePraticas.js`
- `completarPratica()` em `supabase.js`

## 🚀 Próximos Passos

Melhorias sugeridas:

1. **IA Avançada:**
   - Integrar OpenAI para análise de reflexões
   - Recomendações baseadas em sentimento
   - Sugestões personalizadas de duração

2. **Áudio Guiado:**
   - Implementar suporte para `audio_url`
   - Player de áudio integrado ao timer

3. **Gamificação:**
   - Conquistas específicas por prática
   - Níveis de maestria
   - Desafios semanais

4. **Social:**
   - Práticas em grupo
   - Compartilhar progresso
   - Comunidade de praticantes

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique se as migrations foram executadas
2. Confirme variáveis de ambiente no `.env`
3. Veja logs no console do navegador
4. Verifique logs do Supabase

## 📝 Licença

MIT License - Ver arquivo LICENSE no repositório.
