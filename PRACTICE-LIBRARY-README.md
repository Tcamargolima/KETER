# 📚 Biblioteca de Práticas KETER - README

## 🎯 Visão Geral

Sistema completo de práticas de meditação e autoconhecimento com:
- ✅ Banco de dados no Supabase com 10 práticas de exemplo
- ✅ Componente de biblioteca com filtros por fase/categoria
- ✅ Sistema de recomendação baseado em IA
- ✅ Timer circular com instruções passo a passo
- ✅ Integração com sistema de reflexões e perfil de usuário

## 🚀 Quick Start

### 1. Setup do Banco de Dados

```bash
# 1. No Supabase Dashboard, vá para SQL Editor
# 2. Execute o arquivo: database/migration-praticas-table.sql
# 3. Execute o arquivo: database/seed-praticas.sql

# OU use o script Node.js:
npm run db:seed
```

### 2. Uso Básico

```jsx
import PracticeApp from './practice-integration-example';

// No seu componente principal:
<PracticeApp />
```

### 3. Estrutura Criada

```
✅ database/migration-praticas-table.sql  - Cria tabela praticas
✅ database/seed-praticas.sql             - 10 práticas de exemplo
✅ scripts/seed-db.js                     - Script para popular DB
✅ scripts/reset-db.js                    - Script para limpar DB
✅ src/hooks/usePraticas.js               - Hook para gerenciar práticas
✅ src/components/features/PracticeLibrary.jsx - Biblioteca com filtros
✅ src/components/features/PracticeTimer.jsx   - Timer circular
✅ src/pages/Home/index.jsx               - Home com recomendação IA
✅ src/lib/supabase.js                    - Atualizado com helpers
```

## 📋 Componentes Disponíveis

### 1. Home - Dashboard com Recomendação IA

Mostra a próxima prática recomendada baseada em:
- Fase atual do usuário
- Histórico de práticas (últimos 3 dias)
- Horário do dia (manhã/tarde)

```jsx
import Home from './src/pages/Home';

<Home 
  userId={userId}
  onStartPratica={(pratica) => iniciarPratica(pratica)}
  onOpenLibrary={() => abrirBiblioteca()}
/>
```

### 2. PracticeLibrary - Biblioteca Completa

Biblioteca filtrada de todas as práticas:
- Busca por texto
- Filtro por fase (1-4)
- Filtro por categoria
- Cards com preview de benefícios

```jsx
import PracticeLibrary from './src/components/features/PracticeLibrary';

<PracticeLibrary
  userId={userId}
  onSelectPratica={(pratica) => selecionarPratica(pratica)}
/>
```

### 3. PracticeTimer - Timer Circular Dinâmico

Timer com instruções passo a passo:
- Carrega prática do Supabase
- Timer circular animado
- Instruções dinâmicas durante execução
- Salva automaticamente no histórico

```jsx
import PracticeTimer from './src/components/features/PracticeTimer';

<PracticeTimer
  praticaId={praticaId}
  userId={userId}
  onComplete={(pratica) => completarPratica(pratica)}
  onBack={() => voltar()}
/>
```

## 🎨 Práticas Incluídas (10)

### Fase 1: Despertar (3 práticas)
1. **Respiração 4-7-8** - 3 min - Respiração
2. **Intenção do Dia** - 4 min - Propósito
3. **Gratidão Profunda** - 4 min - Coração

### Fase 2: Disciplina (3 práticas)
4. **Meditação Guiada** - 10 min - Meditação
5. **Body Scan** - 8 min - Consciência Corporal
6. **Visualização Positiva** - 5 min - Imaginação

### Fase 3: Consciência (4 práticas)
7. **Loving-Kindness (Metta)** - 10 min - Compaixão
8. **Caminhada Consciente** - 15 min - Movimento
9. **Diário de Insights** - 10 min - Reflexão
10. **Micro-ato de Bondade** - 5 min - Serviço

## 🔧 Hook: usePraticas

Hook personalizado para gerenciar práticas:

```jsx
import { usePraticas } from './src/hooks/usePraticas';

const {
  praticas,                    // Array de todas práticas
  praticasFiltradas,          // Práticas após filtros
  carregando,                 // Boolean de loading
  erro,                       // String de erro
  faseAtual,                  // Fase atual do usuário (1-4)
  
  // Métodos
  carregarPraticas,           // () => Promise<void>
  filtrarPraticas,            // (filtros) => Array
  obterPraticaPorId,          // (id) => Promise<pratica>
  obterPraticasDaFase,        // (fase) => Array
  obterHistoricoPraticas,     // (limite) => Promise<Array>
  recomendarProximaPratica,   // () => Promise<pratica>
  obterCategorias,            // () => Array<string>
  obterEstatisticas           // () => Promise<Object>
} = usePraticas(userId);
```

## 📊 Funções Helper do Supabase

```js
import { 
  getPraticas,              // (filtros) => Promise<Array>
  getPraticaById,           // (id) => Promise<pratica>
  getPraticasByFase,        // (fase) => Promise<Array>
  getHistoricoPraticas      // (userId, limite) => Promise<Array>
} from './src/lib/supabase';
```

## 🛠️ Scripts NPM

```bash
# Popular banco com práticas
npm run db:seed

# Limpar práticas do banco
npm run db:reset

# Desenvolvimento
npm run dev

# Build
npm run build
```

## 📖 Documentação Completa

Para documentação detalhada, veja:
- `PRACTICE-LIBRARY-DOCS.md` - Documentação completa
- `practice-integration-example.jsx` - Exemplos de integração

## 🔄 Integração com Sistema Existente

### No keter-app.jsx

```jsx
import Home from './src/pages/Home';
import PracticeLibrary from './src/components/features/PracticeLibrary';
import PracticeTimer from './src/components/features/PracticeTimer';

// Adicionar ao switch de views:
case 'home':
  return <Home userId={user?.id} ... />;

case 'practice-library':
  return <PracticeLibrary userId={user?.id} ... />;

case 'practice-timer':
  return <PracticeTimer praticaId={...} userId={user?.id} ... />;
```

## 🎯 Lógica de Recomendação IA

O sistema recomenda práticas baseado em:

1. **Fase Atual**: Só recomenda práticas da fase atual do usuário
2. **Histórico Recente**: Evita práticas feitas nos últimos 3 dias
3. **Horário do Dia**: 
   - Manhã (6h-12h): Práticas mais curtas
   - Tarde/Noite: Práticas mais longas
4. **Sequência**: Se todas práticas foram feitas, reinicia ciclo

## 📱 Design Responsivo

Todos os componentes são totalmente responsivos:
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3 colunas

## 🎨 Customização

### Adicionar Nova Prática

1. Via SQL:
```sql
INSERT INTO praticas (titulo, fase, categoria, duracao_min, instrucoes_texto, ordem, ...)
VALUES ('Nova Prática', 1, 'Categoria', 5, '[...]', 10, ...);
```

2. Via Script: Edite `scripts/seed-db.js`

### Mudar Cores/Temas

Cores estão definidas nos componentes. Principais:
- Fase 1: `#F59E0B` (Laranja)
- Fase 2: `#EC4899` (Rosa)
- Fase 3: `#6B46C1` (Roxo)
- Fase 4: `#10B981` (Verde)

## 🐛 Troubleshooting

### Práticas não aparecem
1. Verificar se migration foi executada
2. Verificar se seed foi executado
3. Verificar credenciais no `.env`

### Recomendação não funciona
1. Verificar se usuário tem `fase_atual` definida
2. Verificar se há práticas na fase atual
3. Ver console do navegador para erros

### Timer não carrega prática
1. Verificar se `praticaId` é válido (UUID)
2. Verificar se prática existe no banco
3. Verificar formato de `instrucoes_texto` (deve ser JSON array)

## 🤝 Contribuindo

Para adicionar novas funcionalidades:

1. **Novas Práticas**: Edite `database/seed-praticas.sql`
2. **Novos Filtros**: Edite `PracticeLibrary.jsx`
3. **Nova Lógica IA**: Edite `recomendarProximaPratica()` em `usePraticas.js`

## 📞 Suporte

Para problemas:
1. Verifique console do navegador
2. Verifique logs do Supabase
3. Leia `PRACTICE-LIBRARY-DOCS.md`

## 📄 Licença

MIT License

---

**Desenvolvido para KETER - Plataforma de Evolução Pessoal** 🌟
