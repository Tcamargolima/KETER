# Fase 11: Comunidade Leve (Círculos) - Documentação Completa

## 📋 Visão Geral

A Fase 11 implementa o sistema de **Círculos** - comunidades de chat em grupo com mensagens em tempo real, permitindo que os Keteros se conectem, compartilhem experiências e pratiquem juntos.

## 🎯 Funcionalidades Principais

### 1. Círculos de Chat
- **Públicos**: Qualquer usuário pode ver e entrar
- **Privados**: Apenas por convite (preparado para futuro)
- **Relacionados a Fases**: Círculos específicos para cada fase da jornada
- **Limite de Membros**: Máximo configurável (padrão: 50 membros)

### 2. Mensagens em Tempo Real
- **Real-time**: Mensagens aparecem instantaneamente usando Supabase Realtime
- **Modo Anônimo**: Opção de enviar mensagens anonimamente
- **Edição**: Usuários podem editar suas próprias mensagens
- **Moderação**: Criadores podem deletar qualquer mensagem

### 3. Gestão de Membros
- **Roles**: Owner (criador), Moderator (futuro), Member
- **Entrar/Sair**: Usuários podem entrar em círculos públicos e sair quando quiserem
- **Lista de Membros**: Visualização de todos os membros do círculo

## 🗄️ Estrutura do Banco de Dados

### Tabela: `circulos`
```sql
- id: UUID (PK)
- nome: VARCHAR(255)
- fase_relacionada: INTEGER (1-11, opcional)
- is_public: BOOLEAN (default: true)
- created_by: UUID (FK -> keteros)
- created_at: TIMESTAMP
- descricao: TEXT
- max_membros: INTEGER (default: 50)
- cor_tema: VARCHAR(20) (default: 'purple')
```

### Tabela: `circulo_membros`
```sql
- id: UUID (PK)
- circulo_id: UUID (FK -> circulos)
- user_id: UUID (FK -> keteros)
- joined_at: TIMESTAMP
- role: VARCHAR(20) ('owner', 'moderator', 'member')
- UNIQUE(circulo_id, user_id)
```

### Tabela: `circulo_mensagens`
```sql
- id: UUID (PK)
- circulo_id: UUID (FK -> circulos)
- user_id: UUID (FK -> keteros)
- mensagem: TEXT
- anonimo: BOOLEAN (default: false)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- deleted_at: TIMESTAMP (soft delete)
- user_nome: VARCHAR(255) (cache)
- editada: BOOLEAN (default: false)
```

## 🔐 Row Level Security (RLS)

### Círculos
- **SELECT**: Público ou criado pelo usuário
- **INSERT**: Qualquer usuário autenticado
- **UPDATE/DELETE**: Apenas o criador

### Membros
- **SELECT**: Membros do círculo ou círculos públicos
- **INSERT**: Usuário pode entrar em círculos públicos
- **DELETE**: Usuário pode sair ou owner pode remover

### Mensagens
- **SELECT**: Apenas membros do círculo
- **INSERT**: Apenas membros do círculo
- **UPDATE**: Próprio autor ou owner (para delete)

## 🎨 Componentes React

### 1. CirculosList.jsx
Lista todos os círculos disponíveis.

**Recursos:**
- Grid de cards de círculos
- Filtro de "Meus Círculos" vs "Disponíveis"
- Botão para criar novo círculo
- Botão para entrar/acessar círculo

### 2. ChatRoom.jsx
Interface de chat para um círculo específico.

**Recursos:**
- Lista de mensagens com scroll automático
- Input de mensagem com modo anônimo
- Sidebar de membros
- Opções de editar/deletar mensagens
- Real-time updates

### 3. MessageBubble.jsx
Componente individual de mensagem.

**Recursos:**
- Bubble colorida por usuário
- Avatar com iniciais
- Timestamp relativo
- Indicador de edição
- Botões de ação (editar/deletar)

### 4. CreateCirculoModal.jsx
Modal para criar novo círculo.

**Recursos:**
- Formulário de criação
- Seleção de fase relacionada
- Escolha de visibilidade (público/privado)
- Seleção de cor do tema
- Limite de 3 círculos por usuário

## 🪝 Custom Hooks

### useCirculos.js
Gerencia a lista de círculos e operações CRUD.

**Métodos:**
- `carregarCirculos()`: Busca todos os círculos
- `criarCirculo(dados)`: Cria novo círculo
- `entrarCirculo(circuloId)`: Usuário entra em círculo
- `sairCirculo(circuloId)`: Usuário sai do círculo
- `deletarCirculo(circuloId)`: Owner deleta círculo
- `obterCirculo(circuloId)`: Busca detalhes de um círculo

**Estado:**
- `circulos`: Array de todos os círculos
- `meusCirculos`: Array de círculos que o usuário participa
- `loading`: Estado de carregamento
- `error`: Mensagem de erro

### useCirculoChat.js
Gerencia o chat em tempo real de um círculo.

**Métodos:**
- `enviarMensagem(texto, anonimo)`: Envia mensagem
- `deletarMensagem(mensagemId)`: Deleta mensagem (soft delete)
- `editarMensagem(mensagemId, novoTexto)`: Edita mensagem
- `podeDeletarMensagem(mensagem)`: Verifica permissão
- `podeEditarMensagem(mensagem)`: Verifica permissão
- `getCorUsuario(userId)`: Retorna cor do bubble

**Estado:**
- `mensagens`: Array de mensagens do círculo
- `membros`: Array de membros do círculo
- `loading`: Estado de carregamento
- `sending`: Estado de envio
- `error`: Mensagem de erro

## 🚀 Configuração e Instalação

### 1. Executar Migration do Banco
```bash
# No Supabase SQL Editor, execute:
database/migrations/add-circles-phase-11.sql
```

Este arquivo cria:
- Tabelas necessárias
- RLS policies
- Índices para performance
- Funções auxiliares
- Triggers automáticos
- Seed data com círculos iniciais

### 2. Verificar Variáveis de Ambiente
```bash
# Certifique-se de que as variáveis do Supabase estão configuradas
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Instalar Dependências
```bash
npm install
```

### 4. Executar em Desenvolvimento
```bash
npm run dev
```

### 5. Build para Produção
```bash
npm run build
```

## 🧪 Como Testar

### Teste de Real-time (Múltiplas Tabs)

1. **Abra 2 navegadores ou tabs diferentes**
   - Tab 1: http://localhost:5173/circulos
   - Tab 2: http://localhost:5173/circulos

2. **Em ambas as tabs:**
   - Entre no mesmo círculo
   - Envie mensagens de cada tab
   - Observe as mensagens aparecerem em tempo real na outra tab

3. **Teste modo anônimo:**
   - Em uma tab, ative o modo anônimo
   - Envie uma mensagem
   - Verifique que aparece como "Anônimo" na outra tab

### Teste de Criação de Círculo

1. **Crie um novo círculo:**
   - Clique em "Criar Círculo"
   - Preencha nome e descrição
   - Escolha uma fase relacionada (opcional)
   - Selecione cor do tema
   - Clique em "Criar Círculo"

2. **Verifique limites:**
   - Tente criar 4 círculos
   - Sistema deve bloquear após 3

### Teste de Permissões

1. **Como membro regular:**
   - Entre em um círculo público
   - Envie mensagens
   - Edite suas próprias mensagens
   - Tente deletar mensagens de outros (não deve permitir)

2. **Como owner:**
   - Crie um círculo
   - Envie mensagens
   - Delete mensagens de outros membros
   - Saia do círculo (não deve permitir)

### Teste de RLS (Row Level Security)

1. **No Supabase SQL Editor:**
```sql
-- Verificar que usuário só vê círculos públicos ou seus próprios
SELECT * FROM circulos;

-- Verificar que usuário só vê mensagens de círculos que é membro
SELECT * FROM circulo_mensagens;

-- Verificar que usuário só pode entrar em círculos públicos
INSERT INTO circulo_membros (circulo_id, user_id, role)
VALUES ('circulo_id_here', auth.uid(), 'member');
```

## 🎨 Personalizações Disponíveis

### Cores de Tema
Os círculos suportam 8 cores de tema:
- Purple (roxo)
- Blue (azul)
- Green (verde)
- Amber (âmbar)
- Pink (rosa)
- Emerald (esmeralda)
- Violet (violeta)
- Cyan (ciano)

### Limites Configuráveis

No arquivo `/database/migrations/add-circles-phase-11.sql`:
```sql
-- Alterar limite de membros por círculo
max_membros INTEGER DEFAULT 50

-- No useCirculos.js, alterar limite de círculos por usuário:
if (count >= 3) { // Altere 3 para o número desejado
```

### Fases Relacionadas

Círculos podem ser relacionados a fases específicas (1-11) ou ser gerais (null).

## 🔔 Integração com Notificações (Fase 8)

A integração completa com o sistema de notificações está preparada mas pode ser implementada:

```javascript
// Em useCirculoChat.js, adicione:
import { createNotification } from '../lib/supabase';

// Após enviar mensagem:
await createNotification(otherUserId, {
  type: 'circulo_mensagem',
  title: `Nova mensagem em ${circulo.nome}`,
  body: mensagem.anonimo ? 'Alguém enviou uma mensagem' : `${userName} enviou: ${mensagem.mensagem}`,
  data: { circulo_id: circuloId }
});
```

## 📊 Métricas e Analytics (Futuro)

Dados que podem ser coletados:
- Total de mensagens por círculo
- Membros ativos por dia
- Círculos mais populares
- Taxa de mensagens anônimas
- Tempo médio de permanência em círculos

## 🐛 Troubleshooting

### Mensagens não aparecem em tempo real
1. Verifique se o Supabase Realtime está habilitado
2. Confirme que as RLS policies permitem leitura
3. Verifique o console do navegador para erros de subscription

### Erro ao criar círculo
1. Verifique se usuário está autenticado
2. Confirme que não atingiu limite de 3 círculos
3. Verifique as RLS policies da tabela `circulos`

### Não consigo entrar em círculo
1. Verifique se o círculo é público
2. Confirme que não está cheio (max_membros)
3. Verifique RLS policies da tabela `circulo_membros`

## 🚀 Próximos Passos (Roadmap)

1. **Convites para Círculos Privados**
   - Sistema de convites por link ou email
   - Aprovação de entrada pelo owner

2. **Moderadores**
   - Role de moderador com permissões intermediárias
   - Interface de moderação

3. **Reações nas Mensagens**
   - Emoji reactions (❤️, 👍, 🙏, etc.)
   - Contador de reações

4. **Menções**
   - @username para mencionar usuários
   - Notificações de menção

5. **Anexos**
   - Upload de imagens
   - Compartilhar práticas/reflexões

6. **Busca**
   - Buscar mensagens no círculo
   - Filtrar por usuário ou data

7. **Analytics**
   - Dashboard de estatísticas do círculo
   - Membros mais ativos

## 📝 Licença

Este código faz parte do projeto KETER e está sob a licença MIT.

## 👥 Contribuindo

Para contribuir com melhorias:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub ou entre em contato com a equipe KETER.

---

**Versão:** 1.0.0  
**Data:** Fevereiro 2026  
**Autor:** KETER Team
