# 💝 Sistema de Micro-atos de Bondade - README

## 🎯 O que é?

Um sistema completo que incentiva usuários do KETER a realizar pequenos atos de bondade diários, acompanhando seu progresso e desbloqueando conquistas.

---

## ⚡ Quick Start (3 passos)

### 1. Execute a Migration SQL
```bash
# Copie o conteúdo de database/migration-micro-atos-functions.sql
# Cole no Supabase SQL Editor
# Execute
```

### 2. Adicione na Home
```jsx
import MicroAtosCard from './components/features/MicroAtosCard';

<MicroAtosCard userId={userId} onComplete={() => console.log('Feito!')} />
```

### 3. Adicione no Perfil
```jsx
import MicroAtosStatistics from './components/features/MicroAtosStatistics';

<MicroAtosStatistics userId={userId} />
```

**Pronto!** 🎉

---

## 📁 Estrutura de Arquivos

```
KETER/
├── src/
│   ├── components/features/
│   │   ├── MicroAtosCard.jsx           # Card principal (Home)
│   │   └── MicroAtosStatistics.jsx     # Estatísticas (Perfil)
│   ├── hooks/
│   │   └── useMicroAtos.js             # Lógica de gerenciamento
│   └── data/
│       └── microAtosLibrary.js         # 60+ micro-atos
│
├── database/
│   └── migration-micro-atos-functions.sql  # Migration SQL
│
├── exemplos-integracao-micro-atos.jsx      # 7 exemplos práticos
│
└── docs/
    ├── MICRO-ATOS-DOCS.md                  # Documentação técnica
    ├── QUICKSTART-MICRO-ATOS.md            # Guia rápido
    ├── MICRO-ATOS-VISUAL-FLOW.md           # Diagramas
    └── IMPLEMENTATION-SUMMARY-MICRO-ATOS.md # Resumo
```

---

## 🎨 Categorias de Micro-atos

| Emoji | Categoria | Cor | Exemplos |
|-------|-----------|-----|----------|
| 💝 | Bondade | Rosa | "Fazer um elogio sincero" |
| 🕊️ | Perdão | Roxo | "Liberar um ressentimento" |
| 🎁 | Generosidade | Âmbar | "Compartilhar conhecimento" |
| 🧘 | Presença | Violeta | "Ouvir sem interromper" |
| 🤝 | Serviço | Verde | "Ajudar alguém com tecnologia" |
| 🙏 | Gratidão | Laranja | "Agradecer três pessoas hoje" |

**Total:** 60+ micro-atos únicos e inspiradores

---

## 🏆 Sistema de Conquistas

```
Nível 1: 💝 Primeiro Passo        (1 ato realizado)
Nível 2: 🌸 Bondade Iniciante     (7 atos realizados)
Nível 3: 🔥 Bondade Consistente   (7 dias seguidos)
Nível 4: 💖 Coração Generoso      (30 atos realizados)
Nível 5: ✨ Agente de Luz         (100 atos realizados)
```

Conquistas são desbloqueadas **automaticamente** via trigger SQL!

---

## 🔄 Fluxo de Uso

```
1. Usuário abre Home
   ↓
2. Sistema mostra micro-ato recomendado do dia
   (baseado na fase atual: 1-4)
   ↓
3. Usuário pode:
   - Aceitar e realizar
   - Trocar por outra categoria
   - Criar micro-ato personalizado
   ↓
4. Após realizar, pode adicionar reflexão
   ↓
5. Sistema:
   - Marca como executado
   - Incrementa contador
   - Verifica conquistas
   - Atualiza estatísticas
   ↓
6. Usuário vê estatísticas no Perfil
```

---

## 📊 Estatísticas Disponíveis

### No Card (Home)
- Micro-ato do dia
- Status (realizado ou não)
- Categoria e emoji

### No Perfil
- **Total** de micro-atos realizados
- **Streak** (dias consecutivos)
- **Últimos 7 dias** (calendário visual)
- **Por categoria** (gráfico de barras)
- **Histórico completo** com reflexões

---

## 🤖 Integração com IA

### Recomendação Inteligente
O sistema recomenda micro-atos baseados em:
- **Fase atual do usuário** (1-4)
- **Histórico recente** (evita repetição)
- **Hora do dia** (manhã vs tarde/noite)

### Futuro (Opcional)
- Análise de padrões nas reflexões
- Sugestões personalizadas por contexto emocional
- Identificação de áreas de crescimento

---

## 💾 Banco de Dados

### Tabela Principal: `micro_atos`
```sql
- id (UUID)
- ketero_id (FK → keteros.id)
- data (DATE)
- tipo (VARCHAR - categoria)
- descricao (TEXT)
- executado (BOOLEAN)
- reflexao_pos (TEXT)
- executado_at (TIMESTAMP)
```

### Trigger Automático
Quando `executado = true`:
- Incrementa `keteros.total_micro_atos`
- Verifica e desbloqueia conquistas

### Functions SQL
1. `increment_micro_atos(user_id)` - Incrementa contador
2. `verificar_conquistas_micro_atos(user_id)` - Desbloqueia conquistas

---

## 🎨 Personalização

### Cores por Categoria
Cada categoria tem cor única que aparece em:
- Gradiente do card
- Badge da categoria
- Gráficos de estatísticas
- Timeline dos últimos 7 dias

### Customização
Usuários podem:
- Escolher categoria preferida
- Criar micro-atos personalizados
- Adicionar reflexões únicas

---

## 🔧 API do Hook

```javascript
const {
  // Estado
  microAtoAtual,       // Objeto do micro-ato atual
  jaRealizouHoje,      // Boolean - se já fez hoje
  historico,           // Array de atos anteriores
  carregando,          // Boolean - loading state
  erro,                // String - mensagem de erro
  faseAtual,           // Number - fase do usuário (1-4)
  categorias,          // Array - lista de categorias
  
  // Métodos
  carregarDados,       // () => void - Recarrega dados
  trocarMicroAto,      // (categoria?) => Promise - Troca o ato
  marcarComoExecutado, // (reflexao?) => Promise - Marca como feito
  criarMicroAtoCustomizado, // (desc, cat) => Promise - Cria custom
  obterEstatisticas,   // () => Object - Retorna estatísticas
  obterHistorico       // (limite?) => Promise - Retorna histórico
} = useMicroAtos(userId);
```

---

## 📖 Documentação Completa

Para mais detalhes, consulte:

1. **Início rápido:** `QUICKSTART-MICRO-ATOS.md`
2. **Fluxos visuais:** `MICRO-ATOS-VISUAL-FLOW.md`
3. **Detalhes técnicos:** `MICRO-ATOS-DOCS.md`
4. **Exemplos de código:** `exemplos-integracao-micro-atos.jsx`
5. **Resumo executivo:** `IMPLEMENTATION-SUMMARY-MICRO-ATOS.md`

---

## 🐛 Troubleshooting

### ❌ "Função increment_micro_atos não existe"
**Solução:** Execute a migration SQL no Supabase

### ❌ "Coluna total_micro_atos não existe"
**Solução:** A migration cria essa coluna automaticamente

### ❌ Card não aparece
**Solução:** 
1. Verifique se userId está correto
2. Confirme que Supabase está conectado (.env)
3. Verifique se tabela micro_atos existe

### ❌ Contador não atualiza
**Solução:** Verifique se o trigger foi criado:
```sql
SELECT * FROM pg_trigger 
WHERE tgname = 'trigger_contador_micro_atos';
```

---

## ✅ Checklist de Implementação

- [ ] **Executar migration SQL**
  - Acesse Supabase SQL Editor
  - Cole `database/migration-micro-atos-functions.sql`
  - Execute

- [ ] **Integrar na Home**
  - Import MicroAtosCard
  - Adicionar no layout
  - Passar userId

- [ ] **Integrar no Perfil**
  - Import MicroAtosStatistics
  - Criar aba "Micro-atos"
  - Passar userId

- [ ] **Testar fluxo completo**
  - Ver micro-ato do dia
  - Trocar categoria
  - Criar customizado
  - Marcar como executado
  - Ver estatísticas
  - Verificar conquistas

- [ ] **Opcional: Adicionar notificações**
  - Lembrete às 14h
  - Quando desbloquear conquista

---

## 📊 Métricas de Sucesso

Acompanhe:
- **Taxa de realização diária** (% usuários que fazem)
- **Streak médio** (dias consecutivos)
- **Categoria mais popular**
- **Taxa de customização** (% que criam próprios)
- **Reflexões registradas** (% com reflexão)

---

## 🎉 Resultado Final

Um sistema completo, gamificado e visualmente atraente que:

✅ Incentiva bondade diária  
✅ Rastreia progresso  
✅ Desbloqueia conquistas  
✅ Fornece dados para IA  
✅ Aumenta engajamento  
✅ Cria hábitos positivos  

**Status:** ✅ 100% Pronto para Produção

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação completa
2. Verifique os exemplos de integração
3. Abra uma issue no repositório

---

**Implementado com ❤️ para o projeto KETER**  
**Data:** Fevereiro 2026  
**Versão:** 1.0.0
