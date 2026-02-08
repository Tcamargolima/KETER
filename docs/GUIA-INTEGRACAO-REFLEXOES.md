# 🚀 Guia de Integração - Sistema de Reflexões Noturnas

## 📋 Checklist de Integração

### 1. ✅ Executar Schema SQL no Supabase

1. Acesse [Supabase Dashboard](https://supabase.com)
2. Vá em **SQL Editor**
3. Abra `database/schema-reflexoes-enhanced.sql`
4. Cole todo o conteúdo
5. Clique em **Run** (Ctrl+Enter)
6. Verifique: "Success. No rows returned"

### 2. ✅ Configurar Variáveis de Ambiente

Crie/atualize `.env` na raiz do projeto:

```bash
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui

# OpenAI
VITE_OPENAI_API_KEY=sk-sua_openai_key_aqui
```

**Obter credenciais:**
- **Supabase**: Dashboard > Settings > API
- **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### 3. ✅ Integrar no App Principal

Atualize seu arquivo principal (ex: `App.jsx` ou `keter-app.jsx`):

```javascript
// Importações
import { useReflexoes } from './src/hooks/useReflexoes';
import { NotificacaoReflexao } from './src/components/features/NotificacaoReflexao';
import { ReflexaoIntegration } from './src/components/features/ReflexaoIntegration';

function App() {
  const [user, setUser] = useState(null);
  
  // Hook de reflexões
  const { 
    mostrarNotificacao, 
    setMostrarNotificacao,
    mostrarModal,
    setMostrarModal,
    jaFezReflexaoHoje
  } = useReflexoes(user?.id);

  return (
    <div>
      {/* Seu app existente */}
      
      {/* 1. Notificação às 20h */}
      <NotificacaoReflexao
        mostrar={mostrarNotificacao}
        onAbrir={() => setMostrarModal(true)}
        onFechar={() => setMostrarNotificacao(false)}
      />

      {/* 2. Modal de reflexão */}
      {mostrarModal && (
        <ReflexaoIntegration
          userId={user?.id}
          onComplete={() => {
            setMostrarModal(false);
            // Opcional: mostrar toast de sucesso
          }}
        />
      )}
    </div>
  );
}
```

### 4. ✅ Adicionar Rota do Perfil

Se usar React Router:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Perfil from './src/pages/Perfil';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Suas rotas existentes */}
        
        {/* Nova rota do Perfil */}
        <Route 
          path="/perfil" 
          element={<Perfil user={user} userStats={userStats} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
```

### 5. ✅ (Opcional) Adicionar Card na Home

Para lembrar o usuário de fazer a reflexão:

```javascript
{!jaFezReflexaoHoje && (
  <div 
    onClick={() => setMostrarModal(true)}
    className="bg-gradient-to-br from-purple-900 to-amber-900 rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform"
  >
    <h3 className="text-white font-bold mb-2">🌙 Reflexão Noturna</h3>
    <p className="text-purple-200 text-sm">Ainda não fez sua reflexão de hoje</p>
  </div>
)}

{jaFezReflexaoHoje && (
  <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6">
    <h3 className="text-white font-bold mb-2">✨ Reflexão Completa</h3>
    <p className="text-green-200 text-sm">Você já refletiu hoje!</p>
  </div>
)}
```

## 🧪 Testes

### Teste 1: Verificar Notificação

**Método 1 - Aguardar 20h:**
- Aguarde até 20:00
- Notificação deve aparecer automaticamente

**Método 2 - Simular horário (Dev):**
```javascript
// No console do navegador (F12)
const originalGetHours = Date.prototype.getHours;
Date.prototype.getHours = function() { return 20; };
location.reload();
```

### Teste 2: Completar Reflexão

1. Clique em "Iniciar Reflexão"
2. Responda todas as perguntas obrigatórias
3. Clique em "Iniciar Reflexão" (último botão)
4. Aguarde análise IA (~5-10 segundos)
5. Leia o feedback
6. Clique em "Continuar"

### Teste 3: Verificar Dados no Supabase

No Supabase Dashboard:
1. Vá em **Table Editor**
2. Selecione tabela `reflexoes`
3. Veja sua reflexão salva
4. Verifique campo `analise_ia`

Tabela `keteros`:
- `total_reflexoes` deve ter incrementado
- `ultimo_acesso` deve estar atualizado

### Teste 4: Verificar Conquista

Faça reflexões em 3 dias consecutivos, então:

```sql
-- No SQL Editor
SELECT * FROM keteros_conquistas 
WHERE ketero_id = 'SEU_USER_ID'
AND conquista_id = 'reflexivo-iniciante';
```

Deve retornar 1 linha.

### Teste 5: Perfil - Aba Reflexões

1. Navegue para `/perfil`
2. Clique na aba "Reflexões"
3. Veja a timeline com suas reflexões
4. Expanda uma reflexão para ver detalhes

## 🐛 Troubleshooting Comum

### Erro: "Cannot find module './src/hooks/useReflexoes'"

**Solução:**
```bash
# Verifique se a estrutura src/ foi criada
ls -la src/hooks/

# Se não existir, copie os arquivos manualmente
mkdir -p src/hooks src/components/features src/pages/Perfil src/lib
```

### Erro: "supabase is not defined"

**Solução:**
```javascript
// Verifique o import no useReflexoes.js:
const { default: supabase } = await import('../lib/supabase');

// Deve ser:
import { supabase } from '../lib/supabase';
```

### Erro: "OpenAI API key not found"

**Solução:**
```bash
# Verifique .env
cat .env | grep OPENAI

# Deve conter:
VITE_OPENAI_API_KEY=sk-...

# Reinicie o servidor
npm run dev
```

### Modal não abre ao clicar

**Diagnóstico:**
```javascript
// No console do navegador
console.log(useReflexoes(userId));
// Deve mostrar: { mostrarModal, setMostrarModal, ... }
```

**Solução:** Verifique se `userId` está definido.

### Análise IA não funciona

**Possíveis causas:**
1. API key inválida
2. Sem créditos OpenAI
3. Rate limit atingido

**Verificação:**
```javascript
// Console do navegador
console.log(import.meta.env.VITE_OPENAI_API_KEY);
```

**Fallback:** Sistema salva reflexão mesmo se IA falhar.

### Dados não salvam

**Verificação SQL:**
```sql
-- Verificar RLS
SELECT * FROM reflexoes WHERE ketero_id = 'SEU_USER_ID';

-- Se retornar vazio, verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'reflexoes';
```

## 📝 Notas Importantes

### Segurança - OpenAI API Key

⚠️ **Desenvolvimento:**
- API key está exposta no browser (`dangerouslyAllowBrowser: true`)
- Aceitável APENAS para prototipação

🔒 **Produção:**
- Mover análise IA para Supabase Edge Function
- Não expor API key no frontend
- Implementar rate limiting por usuário

Ver `database/edge-function-exemplo.ts` para migração.

### Performance

**Cache de IA:**
- Considere cachear análises similares
- Reduza custos e latência

**Lazy Loading:**
- Modal carrega sob demanda
- Timeline virtualizada para muitas reflexões

## ✅ Checklist Final

Antes de considerar completo:

- [ ] Schema SQL executado no Supabase
- [ ] Arquivo `.env` configurado
- [ ] Imports adicionados no App principal
- [ ] Notificação aparece às 20h
- [ ] Modal abre e fecha corretamente
- [ ] Perguntas são validadas
- [ ] Análise IA funciona (ou fallback)
- [ ] Dados salvam no Supabase
- [ ] Contador de reflexões incrementa
- [ ] Rota do Perfil funciona
- [ ] Timeline exibe reflexões
- [ ] Conquista desbloqueia após 3 dias

## 🎉 Pronto!

Seu sistema de Reflexões Noturnas está funcional!

### Próximos Passos:

1. Teste com usuários reais
2. Colete feedback
3. Ajuste perguntas se necessário
4. Adicione gráficos de evolução
5. Implemente insights semanais
6. Migre IA para backend (produção)

## 📞 Suporte

- Issues no GitHub
- Documentação: `/docs/REFLEXAO-NOTURNA-IMPLEMENTACAO.md`
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- OpenAI Forum: [community.openai.com](https://community.openai.com)

---

**Boa sorte com seu app KETER! 🌟**
