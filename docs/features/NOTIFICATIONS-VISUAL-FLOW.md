# 📊 Fluxo Visual: Sistema de Notificações KETER

## 🎯 Visão Geral do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                     KETER Notification System                    │
│                         (Phase 8)                                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
         ┌──────────────────┐      ┌──────────────────┐
         │  Smart Reminders │      │  Manual Triggers │
         │   (Automated)    │      │    (Events)      │
         └──────────────────┘      └──────────────────┘
                    │                         │
                    └────────────┬────────────┘
                                 ▼
                    ┌─────────────────────┐
                    │  Supabase Database  │
                    │  (notifications)     │
                    └─────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
         ┌──────────────────┐      ┌──────────────────┐
         │  Realtime Update │      │  Initial Fetch   │
         │  (WebSocket)     │      │  (REST API)      │
         └──────────────────┘      └──────────────────┘
                    │                         │
                    └────────────┬────────────┘
                                 ▼
                    ┌─────────────────────┐
                    │ useNotifications    │
                    │     Hook            │
                    └─────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
         ┌──────────────────┐      ┌──────────────────┐
         │ NotificationBell │      │ NotificationPage │
         │   + Popover      │      │   (Full List)    │
         └──────────────────┘      └──────────────────┘
                    │
                    ▼
              ┌──────────┐
              │   User   │
              │  Action  │
              └──────────┘
```

## 🔄 Fluxo de Lembretes Inteligentes

### 1️⃣ Lembrete Matinal (07:00-09:00)

```
┌─────────────────────────────────────────────────────────────┐
│                    Morning Reminder Flow                     │
└─────────────────────────────────────────────────────────────┘

07:00 → useSmartReminders verifica:
         │
         ├─→ Horário está no range? (07:00-09:00)
         │   └─→ ❌ Não → Aguarda próxima verificação
         │   └─→ ✅ Sim → Continua
         │
         ├─→ Já enviou lembrete hoje?
         │   └─→ ✅ Sim → Para
         │   └─→ ❌ Não → Continua
         │
         └─→ Usuário já praticou hoje?
             └─→ ✅ Sim → Para
             └─→ ❌ Não → Cria Notificação!
                           │
                           ▼
                    ┌──────────────┐
                    │  Supabase    │
                    │  INSERT      │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Realtime    │
                    │  Broadcast   │
                    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Badge Update │
                    │ Bell Rings   │
                    └──────────────┘
```

### 2️⃣ Lembrete Noturno (20:00-22:00)

```
20:00 → useSmartReminders verifica:
         │
         ├─→ Horário está no range? (20:00-22:00)
         ├─→ Já enviou lembrete hoje?
         └─→ Usuário já refletiu hoje?
             └─→ ❌ Não → Cria Notificação de Reflexão!
```

### 3️⃣ Streak Perdido

```
A cada 15min → useSmartReminders verifica:
                │
                ├─→ Tinha streak > 7 dias?
                ├─→ Streak atual = 0?
                └─→ Não praticou hoje?
                    └─→ ✅ Todas → Notifica sobre streak perdido!
```

### 4️⃣ IA Feedback

```
Após reflexão → useSmartReminders analisa:
                 │
                 ├─→ Reflexão foi nas últimas 24h?
                 ├─→ Sentimento detectado = baixo?
                 └─→ Ainda não enviou feedback?
                     └─→ ✅ Todas → Envia feedback personalizado!
```

## 📱 Fluxo de Interação do Usuário

### Cenário 1: Nova Notificação Chega

```
┌──────────────────────────────────────────────────────────────┐
│              User Receives New Notification                  │
└──────────────────────────────────────────────────────────────┘

Notificação criada (Backend/Sistema)
         │
         ▼
Supabase Realtime dispara evento
         │
         ▼
useNotifications recebe via WebSocket
         │
         ▼
Estado atualizado: notifications.push(nova)
         │
         ▼
Badge atualizado: unreadCount++
         │
         ▼
Sino balança (animação)
         │
         ▼
Usuário vê: 🔔 (1)
```

### Cenário 2: Usuário Clica no Sino

```
User clica no sino (NotificationBell)
         │
         ▼
Popover abre (NotificationPopover)
         │
         ▼
Lista de notificações carregada
┌────────────────────────────┐
│ 🏆 Nova Conquista!        │ ← não lida (badge roxo)
│ 🧘 Hora da prática        │ ← não lida
│ 📝 Reflexão pendente      │ ← lida (sem badge)
└────────────────────────────┘
```

### Cenário 3: Usuário Clica em Notificação

```
User clica em notificação específica
         │
         ├─→ markAsRead(notificationId)
         │   └─→ Supabase UPDATE read=true
         │       └─→ Badge diminui: unreadCount--
         │
         └─→ onNotificationClick(notification)
             └─→ Redireciona baseado no tipo:
                 │
                 ├─→ lembrete_pratica → /pratica
                 ├─→ lembrete_reflexao → /reflexao
                 ├─→ conquista → /perfil
                 └─→ ia_feedback → /chat-ia
```

### Cenário 4: Marcar Todas Como Lidas

```
User clica "Marcar todas como lidas"
         │
         ▼
markAllAsRead() executado
         │
         ▼
Supabase: UPDATE notifications SET read=true
         │
         ▼
Badge zera: unreadCount = 0
         │
         ▼
Sino fica normal (sem balançar)
```

## 🗄️ Estrutura de Dados

### Notification Object

```javascript
{
  // IDs
  id: "550e8400-e29b-41d4-a716-446655440000",
  user_id: "123e4567-e89b-12d3-a456-426614174000",
  
  // Conteúdo
  type: "lembrete_pratica",
  title: "🌅 Hora da prática matinal!",
  body: "Comece seu dia com clareza...",
  
  // Status
  read: false,
  
  // Timestamps
  created_at: "2024-02-09T07:30:00Z",
  
  // Metadata (opcional)
  data: {
    hora: "07:30",
    tipo_lembrete: "matinal",
    sugestao: "respiracao_consciente"
  }
}
```

## 🎨 Tipos de Notificação e Cores

```
┌─────────────────────────────────────────────────────────────┐
│                  Notification Types                          │
└─────────────────────────────────────────────────────────────┘

🧘 lembrete_pratica     → 🟣 Roxo    (bg-purple-100)
📝 lembrete_reflexao    → 🟡 Âmbar   (bg-amber-100)
💔 streak_perdido       → 🔴 Vermelho (bg-red-100)
🏆 conquista            → 🟢 Verde   (bg-green-100)
🤖 ia_feedback          → 🔵 Azul    (bg-blue-100)
```

## ⚡ Fluxo de Realtime

```
┌──────────────────────────────────────────────────────────────┐
│                    Realtime Subscription                      │
└──────────────────────────────────────────────────────────────┘

App inicia
    │
    ▼
useNotifications hook ativa
    │
    ▼
Cria channel: notifications:{userId}
    │
    ▼
Subscribe eventos: INSERT, UPDATE
    │
    ├─→ INSERT → Adiciona ao estado
    │             └─→ unreadCount++
    │
    └─→ UPDATE → Atualiza no estado
                  └─→ Recalcula unreadCount
```

## 🔐 Security Flow (RLS)

```
┌──────────────────────────────────────────────────────────────┐
│                    Row Level Security                         │
└──────────────────────────────────────────────────────────────┘

User faz query → Supabase
                    │
                    ▼
              RLS verifica:
              auth.uid() == notification.user_id?
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
    ✅ Sim                   ❌ Não
  Retorna dados          Acesso negado
```

## 📊 Performance Considerations

### Otimizações Implementadas

```
1. Indexes no Database:
   ├─ user_id (para queries rápidas)
   ├─ user_id + read (para unread count)
   ├─ user_id + created_at (para ordem cronológica)
   └─ user_id + type (para filtros)

2. Realtime Subscription:
   ├─ Apenas para user_id específico
   ├─ Unsubscribe ao desmontar componente
   └─ Reuso de channel único

3. Frontend:
   ├─ useState para cache local
   ├─ useMemo para filtros pesados
   ├─ Lazy loading em lista longa
   └─ Debounce em verificações periódicas
```

## 🔄 Ciclo de Vida Completo

```
┌──────────────────────────────────────────────────────────────┐
│              Complete Notification Lifecycle                  │
└──────────────────────────────────────────────────────────────┘

1. CRIAÇÃO
   Smart Reminder detecta condição
        ↓
   createNotification(userId, {...})
        ↓
   INSERT into Supabase
        ↓
   Trigger realtime event

2. ENTREGA
   Realtime → useNotifications
        ↓
   Estado atualizado
        ↓
   UI renderiza badge/popover

3. VISUALIZAÇÃO
   User abre popover
        ↓
   Lista exibida
        ↓
   Formatação de tempo relativo

4. INTERAÇÃO
   User clica notificação
        ↓
   markAsRead(id)
        ↓
   UPDATE read=true
        ↓
   onNotificationClick → Redireciona

5. LIMPEZA (Opcional)
   User deleta notificação
        ↓
   deleteNotification(id)
        ↓
   DELETE from Supabase
        ↓
   Remove do estado local
```

---

**Este diagrama representa o fluxo completo do sistema de notificações KETER Fase 8** ✨
