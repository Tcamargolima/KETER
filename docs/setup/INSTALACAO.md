# 🌟 GUIA COMPLETO DE INSTALAÇÃO - KETER.CENTER

## 📦 PACOTE CONTEÚDO ENTREGUE

Você recebeu:
- ✅ App React completo e funcional (keter-app.jsx)
- ✅ Biblioteca de 30 práticas guiadas (praticas-biblioteca.js)
- ✅ Sistema de reflexão noturna + micro-atos (reflexao-microatos.jsx)
- ✅ Configuração completa Supabase (supabase-config.js)
- ✅ Integração OpenAI com análises IA (openai-integration.js)

---

## 🚀 OPÇÃO 1: DEPLOY RÁPIDO (Recomendado para começar)

### Usando Vercel + Supabase (15 minutos)

#### Passo 1: Criar Projeto React
```bash
# Criar novo projeto Vite + React
npm create vite@latest keter-app -- --template react

cd keter-app

# Instalar dependências
npm install

# Instalar dependências do KETER
npm install @supabase/supabase-js openai lucide-react
```

#### Passo 2: Adicionar Arquivos do KETER
```bash
# Copie os arquivos que você recebeu:
# - keter-app.jsx → src/App.jsx
# - praticas-biblioteca.js → src/data/praticas.js
# - reflexao-microatos.jsx → src/components/ReflexaoMicroatos.jsx
# - supabase-config.js → src/lib/supabase.js
# - openai-integration.js → src/lib/openai.js
```

#### Passo 3: Configurar Supabase

1. **Criar conta**: https://supabase.com
2. **Novo projeto**: 
   - Nome: KETER
   - Database Password: (guarde bem!)
   - Region: South America (São Paulo)
3. **Executar SQL**:
   - Vá em SQL Editor
   - Copie e execute o conteúdo de `DATABASE_SCHEMA` do arquivo supabase-config.js
4. **Pegar credenciais**:
   - Settings > API
   - Copie: `URL` e `anon/public key`

#### Passo 4: Configurar Variáveis de Ambiente

Crie arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
VITE_OPENAI_API_KEY=sk-sua-chave-openai-aqui
```

#### Passo 5: Testar Localmente
```bash
npm run dev
```

Abra http://localhost:5173

#### Passo 6: Deploy no Vercel

1. **Criar conta**: https://vercel.com
2. **Import Project**:
   - Conecte GitHub
   - Importe seu repositório
3. **Configurar Environment Variables**:
   - Adicione as 3 variáveis do .env
4. **Deploy!**

✨ Pronto! Seu KETER está no ar!

---

## 🔧 OPÇÃO 2: CONFIGURAÇÃO DETALHADA (Para desenvolvedores)

### Estrutura de Pastas Recomendada

```
keter-app/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes base
│   │   ├── ReflexaoMicroatos.jsx
│   │   └── ...
│   ├── data/
│   │   └── praticas.js
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── openai.js
│   │   └── utils.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env
├── package.json
└── vite.config.js
```

### Dependências Completas

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "openai": "^4.24.0",
    "lucide-react": "^0.263.1",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Configurar Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**tailwind.config.js:**
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B46C1',
        secondary: '#EC4899',
        accent: '#F59E0B',
      }
    },
  },
  plugins: [],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-950 text-slate-100;
  }
}
```

### Context de Autenticação (Opcional - para app mais robusto)

**src/contexts/AuthContext.jsx:**
```jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseHelpers } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signUp: supabaseHelpers.signUp,
    signIn: supabaseHelpers.signIn,
    signOut: supabaseHelpers.signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

## 📊 CONFIGURAÇÃO DO SUPABASE (Detalhado)

### 1. Habilitar Autenticação por Email

Settings > Authentication > Providers:
- ✅ Email (enabled)
- Confirm email: Disabled (para desenvolvimento)
- Secure email change: Enabled

### 2. Configurar Storage (para fotos de perfil - futuro)

Storage > New Bucket:
- Name: `avatars`
- Public: Yes
- Policies: Users can upload own avatar

### 3. Configurar Edge Functions (opcional - para análises IA serverless)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link projeto
supabase link --project-ref seu-projeto-ref

# Criar function
supabase functions new analise-semanal

# Deploy
supabase functions deploy analise-semanal
```

### 4. Row Level Security (RLS)

O schema já inclui policies, mas verifique:

```sql
-- Verificar policies
SELECT * FROM pg_policies WHERE tablename = 'keteros';

-- Testar policy (como usuário autenticado)
SELECT * FROM keteros WHERE id = auth.uid();
```

---

## 🤖 CONFIGURAÇÃO OPENAI

### Obter API Key

1. Vá em https://platform.openai.com
2. API Keys > Create new secret key
3. Copie e guarde (não será mostrada novamente!)
4. Adicione ao `.env`

### Custos Estimados

Com 1.000 usuários ativos:
- Chat Guia: ~$200/mês (GPT-4 Turbo)
- Análises semanais: ~$100/mês
- Detecção padrões: ~$50/mês

**Total: ~$350/mês**

Para reduzir custos:
- Use GPT-3.5-turbo para chat ($50/mês)
- Limite análises semanais (1x por semana)
- Cache respostas comuns

### Modo de Desenvolvimento (sem gastar)

Use respostas mock em `openai-integration.js`:

```js
// No topo do arquivo
const DEV_MODE = true;

export const aiService = {
  async chatGuia(mensagem, contexto) {
    if (DEV_MODE) {
      return {
        mensagem: respostasRapidas[mensagem.toLowerCase()] 
          || "Entendo. Continue praticando!",
        tokens: 0
      };
    }
    // ... código real
  }
}
```

---

## 🔐 SEGURANÇA

### Nunca Exponha:

❌ API Keys no código frontend
❌ Senhas no código
❌ Tokens de acesso

### Sempre Use:

✅ Variáveis de ambiente (.env)
✅ .gitignore para .env
✅ Supabase RLS policies
✅ Rate limiting

### .gitignore Recomendado:

```
# Env
.env
.env.local
.env.production

# Dependencies
node_modules/

# Build
dist/
build/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

---

## 🧪 TESTES

### Testar Autenticação:

1. Criar conta nova
2. Fazer login
3. Verificar se dados aparecem em Supabase > Authentication > Users

### Testar Práticas:

1. Completar uma prática
2. Verificar em Supabase > Table Editor > praticas_diarias
3. Confirmar sequência incrementou em keteros

### Testar IA (se configurada):

1. Mandar mensagem no chat
2. Verificar resposta personalizada
3. Checar tokens_usados em conversas_guia

---

## 📈 MONITORAMENTO

### Supabase Dashboard:

- Database > Reports: Uso de DB
- Authentication > Users: Crescimento de usuários
- API > Logs: Erros e requisições

### OpenAI Dashboard:

- Usage: Tokens consumidos
- Rate limits: Verificar se não está batendo no limite

### Vercel Analytics:

- Web Vitals: Performance
- Requests: Tráfego
- Functions: Uso serverless

---

## 🐛 TROUBLESHOOTING

### Erro: "Supabase client error"
- Verifique URL e anon key
- Confirme que executou o schema SQL
- Teste conexão no Supabase Dashboard

### Erro: "OpenAI API error"
- Confirme API key válida
- Verifique créditos na conta OpenAI
- Teste com modelo mais barato (gpt-3.5-turbo)

### Erro: "Cannot read properties of undefined"
- Verifique se todos os imports estão corretos
- Confirme estrutura de dados no Supabase
- Use console.log para debugar

### Performance lenta:
- Habilite cache no Supabase
- Use CDN para assets
- Otimize queries com indexes
- Lazy load componentes pesados

---

## 🚀 PRÓXIMOS PASSOS

Após configuração básica:

1. **Semana 1**: Testar com 10 beta users
2. **Semana 2**: Ajustar baseado em feedback
3. **Semana 3**: Adicionar notificações push
4. **Semana 4**: Implementar círculos funcionais
5. **Mês 2**: Analytics e otimizações

---

## 📞 SUPORTE

### Recursos Oficiais:

- Supabase Docs: https://supabase.com/docs
- OpenAI Docs: https://platform.openai.com/docs
- React Docs: https://react.dev

### Comunidades:

- Supabase Discord
- OpenAI Forum
- React Community

---

## ✅ CHECKLIST DE DEPLOY

- [ ] Projeto Vite criado
- [ ] Dependências instaladas
- [ ] Arquivos KETER adicionados
- [ ] Supabase configurado
- [ ] Schema SQL executado
- [ ] Variáveis de ambiente configuradas
- [ ] OpenAI key adicionada
- [ ] Testado localmente
- [ ] GitHub repo criado
- [ ] Deploy no Vercel
- [ ] SSL configurado (automático Vercel)
- [ ] Domínio customizado (opcional)
- [ ] Testado em produção

---

🎉 **Parabéns! Seu KETER está pronto para evoluir vidas!**

Agora é só testar, iterar e crescer. Boa jornada! 🌟
