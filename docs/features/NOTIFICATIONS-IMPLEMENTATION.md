# 🔔 FASE 8: Sistema de Notificações In-App + Lembretes Inteligentes

## 📋 Visão Geral

Sistema completo de notificações em tempo real com lembretes inteligentes baseados em IA, integrado ao app KETER. As notificações são personalizadas de acordo com o comportamento do usuário e horários ideais para engajamento.

## ✅ Funcionalidades Implementadas

### 1. **Database Schema**
- ✅ Tabela `notifications` no Supabase
- ✅ Campos: id, user_id, type, title, body, read, created_at, data (JSONB)
- ✅ Row Level Security (RLS) configurado
- ✅ Índices otimizados para performance
- ✅ Trigger automático para notificar conquistas

### 2. **Tipos de Notificação**
- ✅ `lembrete_pratica` - Lembretes para prática matinal
- ✅ `lembrete_reflexao` - Lembretes para reflexão noturna
- ✅ `streak_perdido` - Alerta quando streak é quebrado
- ✅ `conquista` - Notificação de nova conquista desbloqueada
- ✅ `ia_feedback` - Feedback personalizado da IA baseado em reflexões

### 3. **Hooks Customizados**

#### `useNotifications`
Hook principal para gerenciar notificações:
- Fetch de notificações do usuário
- Subscription realtime para novas notificações
- Marcar notificações como lidas (individual ou todas)
- Deletar notificações
- Contador de notificações não lidas
- Filtros por tipo

#### `useSmartReminders`
Hook para lembretes inteligentes:
- **Lembrete Matinal** (07:00-09:00): Sugere prática se não praticou ainda
- **Lembrete Noturno** (20:00-22:00): Sugere reflexão se não refletiu ainda
- **Streak Perdido**: Notifica quando usuário perde o streak
- **IA Feedback**: Analisa humor/reflexões e envia feedback personalizado
- Verificação a cada 15 minutos
- Não envia notificações duplicadas no mesmo dia

### 4. **Componentes UI**

#### `NotificationBell`
- Ícone de sino com badge animado
- Mostra contador de notificações não lidas
- Animação de balanço quando há notificações
- Integração com popover

#### `NotificationPopover`
- Dropdown elegante com lista de notificações
- Exibição cronológica (mais recentes primeiro)
- Formatação de tempo relativo (ex: "há 5 minutos")
- Ações inline: marcar como lida, deletar
- Botão "Marcar todas como lidas"
- Click outside para fechar
- Animações suaves com Framer Motion

#### `NotificationSystem`
- Componente wrapper que integra bell + popover
- Gerencia estado de abertura/fechamento
- Integra hooks de notificações e lembretes
- Redireciona para páginas apropriadas ao clicar

#### `NotificationsPage`
- Página dedicada para histórico completo
- Filtros por tipo de notificação
- Filtros por status (lidas/não lidas)
- Cards expandidos com mais detalhes
- Design responsivo

### 5. **Integração Supabase**
Funções adicionadas ao `supabase.js`:
- `createNotification` - Criar notificação
- `getNotifications` - Buscar notificações
- `markNotificationAsRead` - Marcar como lida
- `markAllNotificationsAsRead` - Marcar todas como lidas
- `subscribeToNotifications` - Subscribe realtime

## 🚀 Como Usar

### 1. Setup do Database

Execute no SQL Editor do Supabase:

```sql
-- 1. Criar tabela e RLS
\i supabase-notifications-schema.sql

-- 2. (Opcional) Seed de exemplo
\i supabase-notifications-seed.sql
```

### 2. Integrar no Layout/Header

```jsx
import { NotificationSystem } from './components/features/NotificationSystem';

function AppHeader({ userId, userProfile }) {
  const handleNotificationClick = (notification) => {
    // Redirecionar baseado no tipo
    switch (notification.type) {
      case 'lembrete_pratica':
        navigate('/pratica');
        break;
      case 'lembrete_reflexao':
        navigate('/reflexao');
        break;
      // ... outros casos
    }
  };

  return (
    <header className="flex items-center justify-between p-4">
      <h1>KETER</h1>
      
      <NotificationSystem
        userId={userId}
        userProfile={userProfile}
        onNotificationClick={handleNotificationClick}
      />
    </header>
  );
}
```

### 3. Usar Hook de Notificações Diretamente

```jsx
import { useNotifications } from './hooks/useNotifications';

function MyComponent({ userId }) {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    createNotification,
    deleteNotification
  } = useNotifications(userId);

  // Criar notificação manual
  const sendCustomNotification = async () => {
    await createNotification({
      type: 'ia_feedback',
      title: 'Título',
      body: 'Mensagem',
      data: { custom: 'data' }
    });
  };

  return (
    <div>
      <p>Notificações não lidas: {unreadCount}</p>
      {notifications.map(n => (
        <div key={n.id}>{n.title}</div>
      ))}
    </div>
  );
}
```

### 4. Adicionar Página de Histórico de Notificações

```jsx
import { NotificationsPage } from './pages/Notifications';

// No seu router
<Route path="/notifications" element={
  <NotificationsPage 
    userId={userId}
    onNotificationClick={handleNotificationClick}
  />
} />
```

## 🎨 Design & Estilo

### Cores por Tipo
- **Prática**: Roxo (`#9333EA`)
- **Reflexão**: Âmbar (`#F59E0B`)
- **Streak Perdido**: Vermelho (`#DC2626`)
- **Conquista**: Verde (`#10B981`)
- **IA Feedback**: Azul (`#3B82F6`)

### Animações
- Badge aparece com `scale` animation
- Sino balança quando há notificações novas
- Popover abre/fecha com `fade` + `scale`
- Cards na lista com `slide-in` animation
- Smooth transitions em hover states

## 🔐 Segurança (RLS)

```sql
-- Usuários só veem suas próprias notificações
CREATE POLICY "Usuários veem apenas suas notificações"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Usuários só podem criar suas próprias notificações
CREATE POLICY "Usuários podem criar suas notificações"
  ON notifications FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Usuários só podem atualizar suas próprias notificações
CREATE POLICY "Usuários podem atualizar suas notificações"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());
```

## 📊 Estrutura de Dados

### Notification Object
```typescript
{
  id: UUID,
  user_id: UUID,
  type: 'lembrete_pratica' | 'lembrete_reflexao' | 'streak_perdido' | 'conquista' | 'ia_feedback',
  title: string,
  body: string,
  read: boolean,
  created_at: timestamp,
  data: {
    // Dados customizados por tipo
    conquista_id?: string,
    reflexao_id?: string,
    streak_perdido?: number,
    sugestao?: string,
    // etc...
  }
}
```

## 🧪 Testando

### 1. Criar Notificação Manual (via SQL)
```sql
INSERT INTO notifications (user_id, type, title, body, data)
VALUES (
  'seu-user-id',
  'ia_feedback',
  '💫 Teste de Notificação',
  'Esta é uma notificação de teste!',
  '{"teste": true}'::jsonb
);
```

### 2. Testar Realtime
- Abra o app em duas abas
- Crie uma notificação em uma aba
- Deve aparecer instantaneamente na outra

### 3. Testar Lembretes
- Ajuste o horário do sistema para 07:30 ou 21:00
- Aguarde até 15 minutos
- Lembrete deve aparecer automaticamente

## 🔧 Configuração Avançada

### Personalizar Horários de Lembrete

Edite `useSmartReminders.js`:

```javascript
// Lembrete matinal - altere o range
if (hour >= 7 && hour < 9) {  // 07:00-09:00
  // ...
}

// Lembrete noturno - altere o range
if (hour >= 20 && hour < 22) {  // 20:00-22:00
  // ...
}
```

### Personalizar Intervalo de Verificação

```javascript
// Padrão: 15 minutos
const interval = setInterval(() => {
  // checks...
}, 15 * 60 * 1000);

// Mudar para 5 minutos:
const interval = setInterval(() => {
  // checks...
}, 5 * 60 * 1000);
```

### Adicionar Novo Tipo de Notificação

1. **Atualizar Schema SQL**:
```sql
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN (
  'lembrete_pratica',
  'lembrete_reflexao',
  'streak_perdido',
  'conquista',
  'ia_feedback',
  'novo_tipo'  -- ADICIONAR AQUI
));
```

2. **Adicionar ao Componente**:
```javascript
const NOTIFICATION_ICONS = {
  // ...
  novo_tipo: '🎉'
};

const NOTIFICATION_COLORS = {
  // ...
  novo_tipo: 'bg-indigo-100 border-indigo-300'
};
```

## 📱 Suporte a PWA

O sistema está preparado para notificações push quando o app for convertido para PWA:

```javascript
// Exemplo futuro com service worker
if ('Notification' in window && 'serviceWorker' in navigator) {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      // Registrar para push notifications
    }
  });
}
```

## 🎯 Próximos Passos Sugeridos

1. **Notificações Push**: Implementar web push notifications
2. **Email Notifications**: Enviar email para notificações importantes
3. **Configurações**: Permitir usuário customizar horários e tipos
4. **Analytics**: Rastrear engajamento com notificações
5. **A/B Testing**: Testar diferentes mensagens e horários

## 📝 Arquivos Criados

```
KETER/
├── src/
│   ├── components/features/
│   │   ├── NotificationBell.jsx         # Ícone de sino com badge
│   │   ├── NotificationPopover.jsx      # Dropdown de notificações
│   │   └── NotificationSystem.jsx       # Sistema integrado
│   ├── hooks/
│   │   ├── useNotifications.js          # Hook principal
│   │   └── useSmartReminders.js         # Lembretes inteligentes
│   ├── lib/
│   │   └── supabase.js                  # + funções de notificação
│   └── pages/
│       └── Notifications/
│           └── index.jsx                # Página de histórico
├── supabase-notifications-schema.sql    # Schema do database
├── supabase-notifications-seed.sql      # Dados de exemplo
├── exemplos-integracao-notifications.jsx # Exemplo de integração
└── NOTIFICATIONS-IMPLEMENTATION.md      # Este arquivo
```

## 🐛 Troubleshooting

### Notificações não aparecem em realtime
- Verificar se o usuário está autenticado
- Conferir RLS policies no Supabase
- Verificar console para erros de WebSocket
- Confirmar que `user_id` está correto

### Lembretes não estão sendo enviados
- Verificar horário do sistema
- Confirmar que `userProfile` tem dados corretos
- Checar console para erros no `useSmartReminders`
- Verificar se já não enviou lembrete no dia

### Badge não atualiza
- Verificar se `unreadCount` está sendo calculado
- Confirmar subscription realtime está ativa
- Testar marcar como lida manualmente no database

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar console do navegador
2. Conferir SQL Editor no Supabase para RLS
3. Testar queries manualmente no Supabase
4. Revisar este documento

---

**Desenvolvido para KETER - Plataforma de Evolução Pessoal com IA** ✨
