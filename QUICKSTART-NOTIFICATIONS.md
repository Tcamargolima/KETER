# 🚀 GUIA RÁPIDO: Setup de Notificações - KETER Fase 8

## ⚡ Setup Rápido (5 minutos)

### 1️⃣ Configurar Database (Supabase)

**Passo 1: Acessar Supabase**
1. Entre em https://app.supabase.com
2. Selecione seu projeto KETER
3. Vá em **SQL Editor** (menu lateral)

**Passo 2: Criar Tabela**
1. Crie uma nova query
2. Cole o conteúdo de `supabase-notifications-schema.sql`
3. Clique em **Run** (ou F5)
4. Aguarde confirmação de sucesso ✅

**Passo 3: (Opcional) Adicionar Dados de Teste**
1. Crie outra query
2. Cole o conteúdo de `supabase-notifications-seed.sql`
3. **IMPORTANTE**: Substitua `'seu-user-id-aqui'` pelo seu user ID real
4. Clique em **Run**

**Como encontrar seu user ID:**
```sql
-- Execute esta query no SQL Editor
SELECT id, email, nome FROM keteros LIMIT 5;
-- Copie o 'id' do usuário que você quer testar
```

### 2️⃣ Integrar no App

**Opção A: Adicionar ao Header/Layout Existente**

Se você tem um componente de layout ou header:

```jsx
// Seu arquivo de Layout.jsx ou Header.jsx
import { NotificationSystem } from './components/features/NotificationSystem';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function AppLayout({ children }) {
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Obter usuário atual
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Buscar perfil
        const { data: profile } = await supabase
          .from('keteros')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUserProfile(profile);
      }
    };
    
    getUser();
  }, []);

  const handleNotificationClick = (notification) => {
    // Redirecionar baseado no tipo
    console.log('Notificação clicada:', notification);
    // Adicione sua lógica de redirecionamento aqui
  };

  return (
    <div>
      <header className="flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-2xl font-bold">KETER</h1>
        
        {/* ADICIONAR AQUI */}
        {userId && (
          <NotificationSystem
            userId={userId}
            userProfile={userProfile}
            onNotificationClick={handleNotificationClick}
          />
        )}
      </header>
      
      <main>{children}</main>
    </div>
  );
}

export default AppLayout;
```

**Opção B: Adicionar Direto na Home**

Veja o arquivo `exemplos-integracao-notifications.jsx` para exemplo completo.

```jsx
import { NotificationSystem } from './components/features/NotificationSystem';

function Home({ userId, userProfile }) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header com Notificações */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Bem-vindo! ✨</h1>
        
        <NotificationSystem
          userId={userId}
          userProfile={userProfile}
          onNotificationClick={(notification) => {
            console.log('Clicou em:', notification);
          }}
        />
      </div>
      
      {/* Resto do conteúdo */}
    </div>
  );
}
```

### 3️⃣ (Opcional) Adicionar Página de Notificações

Se quiser uma página dedicada para histórico:

```jsx
// No seu router (React Router exemplo)
import { NotificationsPage } from './pages/Notifications';

<Routes>
  <Route path="/notifications" element={
    <NotificationsPage 
      userId={userId}
      onNotificationClick={handleNotificationClick}
    />
  } />
</Routes>
```

## 🧪 Testar

### Teste 1: Criar Notificação Manual

No SQL Editor do Supabase:

```sql
-- Substitua 'seu-user-id' pelo ID real
INSERT INTO notifications (user_id, type, title, body, data)
VALUES (
  'seu-user-id',
  'conquista',
  '🏆 Teste de Notificação!',
  'Se você está vendo isso, funcionou! 🎉',
  '{"teste": true}'::jsonb
);
```

Deve aparecer:
- Badge no sino com "1"
- Notificação no popover quando clicar

### Teste 2: Marcar como Lida

1. Clique no sino
2. Veja a notificação no popover
3. Clique na notificação
4. Badge deve sumir
5. Notificação deve ficar sem o ponto roxo

### Teste 3: Realtime

1. Abra o app em duas abas/janelas
2. Na primeira aba, insira notificação via SQL
3. Na segunda aba, deve aparecer automaticamente! ⚡

### Teste 4: Lembretes Inteligentes

**Lembrete Matinal:**
1. Ajuste horário do sistema para 07:30
2. Certifique-se que não praticou hoje
3. Aguarde até 15 minutos
4. Deve receber lembrete de prática

**Lembrete Noturno:**
1. Ajuste horário do sistema para 21:00
2. Certifique-se que não refletiu hoje
3. Aguarde até 15 minutos
4. Deve receber lembrete de reflexão

## ✅ Checklist de Verificação

- [ ] Tabela `notifications` criada no Supabase
- [ ] RLS policies ativas (verificar no Supabase Dashboard)
- [ ] NotificationSystem importado e renderizado
- [ ] userId sendo passado corretamente
- [ ] Notificação de teste aparece no popover
- [ ] Badge mostra contador correto
- [ ] Marcar como lida funciona
- [ ] Realtime atualiza em tempo real

## 🐛 Problemas Comuns

### ❌ "Notificação não aparece"

**Causa:** RLS bloqueando acesso

**Solução:**
1. Vá em Supabase → Authentication → Policies
2. Verifique se tabela `notifications` tem as policies
3. Se não, execute novamente o schema SQL

### ❌ "Badge não atualiza"

**Causa:** userId incorreto ou não passado

**Solução:**
```javascript
// Verifique se userId está correto
console.log('User ID:', userId);

// Deve ser um UUID válido, ex:
// "550e8400-e29b-41d4-a716-446655440000"
```

### ❌ "Realtime não funciona"

**Causa:** Subscription não foi estabelecida

**Solução:**
1. Abra DevTools (F12)
2. Vá na aba Network
3. Filtre por "websocket" ou "realtime"
4. Deve ver conexão ativa
5. Se não, verifique credenciais do Supabase

### ❌ "Lembretes não aparecem"

**Causa:** Horário fora do range ou já enviou hoje

**Solução:**
```javascript
// No useSmartReminders.js, adicione logs:
console.log('Hora atual:', new Date().getHours());
console.log('Último lembrete:', lastReminderCheck.current);

// Verificar se práticas/reflexões existem:
// No Supabase, query:
SELECT * FROM praticas_diarias 
WHERE ketero_id = 'seu-user-id' 
AND data = CURRENT_DATE;
```

## 📚 Próximos Passos

Depois de configurar:

1. **Personalize Mensagens**: Edite os textos em `useSmartReminders.js`
2. **Ajuste Horários**: Mude ranges de 07:00-09:00 e 20:00-22:00
3. **Adicione Notificações**: Crie notificações em outros eventos do app
4. **Estilize**: Customize cores em `NotificationPopover.jsx`
5. **Analytics**: Rastreie quais notificações têm mais engajamento

## 🎨 Customização Rápida

### Mudar Cores

```jsx
// Em NotificationPopover.jsx
const NOTIFICATION_COLORS = {
  lembrete_pratica: 'bg-purple-100 border-purple-300', // MUDE AQUI
  lembrete_reflexao: 'bg-amber-100 border-amber-300',
  // ...
};
```

### Mudar Ícones

```jsx
// Em NotificationPopover.jsx
const NOTIFICATION_ICONS = {
  lembrete_pratica: '🧘', // MUDE AQUI
  lembrete_reflexao: '📝',
  // ...
};
```

### Mudar Textos de Lembrete

```javascript
// Em useSmartReminders.js - Lembrete Matinal
await createNotification(userId, {
  type: 'lembrete_pratica',
  title: 'SEU TÍTULO AQUI',
  body: 'SUA MENSAGEM AQUI',
  // ...
});
```

## 📞 Precisa de Ajuda?

1. Veja `NOTIFICATIONS-IMPLEMENTATION.md` para documentação completa
2. Confira `exemplos-integracao-notifications.jsx` para exemplos
3. Teste queries no SQL Editor do Supabase
4. Verifique console do navegador para erros

---

**Configuração concluída! Seu sistema de notificações está pronto! 🎉**
