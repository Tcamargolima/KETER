# 🌟 KETER - Plataforma de Evolução Pessoal com IA

<div align="center">

![KETER Logo](https://via.placeholder.com/200x200/6B46C1/FFFFFF?text=KETER)

**Sua evolução pessoal, acompanhada por IA**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange.svg)](https://openai.com/)

[Demo](#) · [Documentação](#documentação) · [Roadmap](#roadmap)

</div>

---

## 📖 Sobre o Projeto

KETER é uma plataforma gratuita de autoconhecimento e evolução pessoal que combina:

- 🧘 **Práticas Diárias** de 3-5 minutos
- 🤖 **IA Personalizada** que analisa sua evolução
- 📊 **Métricas Reais** de progresso
- 👥 **Comunidade** de apoio mútuo
- ❤️ **Sempre Gratuito** - sem paywalls

### ✨ Diferencial

Única plataforma que:
- ✅ Mede evolução real (não só tempo de tela)
- ✅ IA contextual baseada em seus dados
- ✅ Método estruturado em 4 fases
- ✅ Gamificação significativa
- ✅ 100% gratuito, sempre

---

## 🎯 As 4 Fases de Evolução

### 1️⃣ DESPERTAR (Dias 1-14)
**Objetivo:** Autoconhecimento inicial  
Práticas de respiração, gratidão e intenção diária

### 2️⃣ DISCIPLINA (Dias 15-30)
**Objetivo:** Formar hábito sustentável  
Micro-atos de bondade + consistência

### 3️⃣ CONSCIÊNCIA (Dias 31-60)
**Objetivo:** Perceber transformação  
Feedback da IA + círculos de apoio

### 4️⃣ SERVIÇO (Dia 60+)
**Objetivo:** Impacto no mundo  
Missões de legado + mentoria

---

## 🚀 Tecnologias

### Frontend
- **React 18** - Framework principal
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Vite** - Build tool

### Backend
- **Supabase** - Database & Auth
  - PostgreSQL (13 tabelas)
  - Row Level Security
  - Realtime subscriptions
  
### IA
- **OpenAI GPT-4** - Análise profunda
- **GPT-3.5 Turbo** - Chat rápido
- Detecção de padrões linguísticos
- Análise semanal automática

---

## 📁 Estrutura do Projeto

```
keter/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes base
│   │   ├── IA/             # Componentes de IA
│   │   └── features/       # Features específicas
│   ├── hooks/              # Custom hooks
│   │   ├── useAuth.js      # Autenticação
│   │   ├── useIA.js        # Hooks de IA
│   │   └── ...
│   ├── lib/                # Utilitários
│   │   ├── supabase.js     # Cliente Supabase
│   │   └── openai.js       # Cliente OpenAI
│   ├── pages/              # Páginas/Views
│   ├── data/               # Dados estáticos
│   │   └── praticas.js     # Biblioteca de práticas
│   └── App.jsx             # App principal
├── database/
│   └── schema.sql          # Schema Supabase
├── docs/                   # Documentação
│   ├── SETUP-SUPABASE.md
│   ├── SETUP-OPENAI.md
│   └── ARCHITECTURE.md
├── .env.example            # Variáveis de ambiente
├── package.json
└── README.md
```

---

## ⚙️ Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase
- Conta OpenAI

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/keter.git
cd keter
```

### 2. Instale dependências

```bash
npm install
```

### 3. Configure variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` e adicione suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon
VITE_OPENAI_API_KEY=sk-sua_chave_openai
```

### 4. Configure o banco de dados

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o schema SQL:
   - Vá em "SQL Editor"
   - Cole o conteúdo de `database/schema.sql`
   - Execute (Run)

### 5. Inicie o projeto

```bash
npm run dev
```

Acesse http://localhost:5173

---

## 🚀 Deploy para Produção

### Opção Recomendada: Vercel

O KETER está otimizado para deploy no **Vercel** (frontend) + **Supabase** (backend/database).

> 📚 **Documentação Completa de Deploy:**
> - [Guia Completo de Deploy](./DEPLOY-GUIDE.md) - Passo a passo detalhado
> - [Referência Rápida](./DEPLOY-QUICK-REFERENCE.md) - Quick start em 10 minutos
> - [Resumo da Correção 07](./CORRECAO-07-SUMMARY.md) - O que foi implementado

#### Pré-requisitos de Deploy

- Conta no [Vercel](https://vercel.com) (gratuita)
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Sentry](https://sentry.io) (opcional, para monitoramento)
- Repositório GitHub com o código

#### Passo 1: Preparar Supabase

1. **Criar projeto em produção** no Supabase
2. **Executar schema de produção**: 
   - Vá em SQL Editor
   - Execute `database/schema.sql` (schema consolidado de produção)
   - Execute `database/rls-policies-production.sql` (políticas de segurança)
3. **Configurar Row Level Security (RLS)**:
   - Verifique que todas as tabelas têm RLS ENABLED
   - Confirme policies de segurança
   - Dashboard → Database → Tables (todas devem mostrar RLS: enabled)
4. **Seed inicial** (opcional):
   ```bash
   # Execute no SQL Editor do Supabase:
   # database/seed-praticas.sql (se necessário)
   ```

#### Passo 2: Deploy no Vercel

1. **Importar repositório**:
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Conecte sua conta GitHub
   - Selecione o repositório `KETER`
   - Clique em "Import"

2. **Configurar projeto**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (raiz)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Variáveis de Ambiente**:
   
   No Vercel Dashboard → Settings → Environment Variables, adicione:

   | Nome | Valor | Onde Obter |
   |------|-------|------------|
   | `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Settings → API |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbG...` | Supabase → Settings → API → anon public |
   | `VITE_OPENAI_API_KEY` | `sk-...` | OpenAI → API Keys |
   | `VITE_SENTRY_DSN` | `https://...@sentry.io/...` | Sentry → Project Settings (opcional) |
   | `VITE_APP_VERSION` | `1.0.0` | Versão atual |

   ⚠️ **Importante**: Configure para todos os ambientes (Production, Preview, Development)

4. **Deploy**:
   - Clique em "Deploy"
   - Aguarde build (2-3 minutos)
   - Vercel fornecerá uma URL: `https://keter.vercel.app`

#### Passo 3: Configurar Domínio Customizado (Opcional)

1. No Vercel Dashboard → Settings → Domains
2. Adicione seu domínio: `keter.center`
3. Configure DNS seguindo instruções do Vercel
4. Aguarde propagação (até 24h)

#### Passo 4: Ativar Monitoramento

##### Vercel Analytics (built-in)

1. Vercel Dashboard → Analytics → Enable
2. Automaticamente tracka:
   - Page views
   - Performance (Core Web Vitals)
   - Traffic origins

##### Sentry (recomendado)

1. Crie conta em [sentry.io](https://sentry.io)
2. Crie novo projeto React
3. Copie o DSN
4. Adicione `VITE_SENTRY_DSN` nas env vars do Vercel
5. Redeploy

Sentry capturará:
- Erros JavaScript
- Performance issues
- Session replays (com máscaras de privacidade)

##### Supabase Logs

1. Supabase Dashboard → Logs
2. Monitore:
   - Database queries
   - API errors
   - Auth events
3. Configure webhooks para alertas críticos (opcional)

#### Passo 5: Post-Deploy Checklist

- [ ] ✅ App carrega na URL de produção
- [ ] ✅ Login/Autenticação funciona
- [ ] ✅ Práticas são carregadas do banco
- [ ] ✅ IA responde corretamente
- [ ] ✅ PWA instala corretamente (mobile)
- [ ] ✅ Service Worker registra (offline mode)
- [ ] ✅ Realtime notifications funcionam
- [ ] ✅ Analytics tracking ativo
- [ ] ✅ Sentry captura erros (force um erro de teste)
- [ ] ✅ RLS ativo em todas tabelas
- [ ] ✅ Performance > 90 no Lighthouse
- [ ] ✅ Responsivo em mobile/tablet/desktop

#### Configuração Avançada

##### Auto-Deploy on Push

O Vercel auto-deploya quando você faz push para `main`:

```bash
git add .
git commit -m "feat: nova feature"
git push origin main
# Vercel automatically deploys ✅
```

##### Preview Deployments

Toda PR gera um deploy de preview:

- URL única por PR
- Teste antes de mergear
- Compartilhe com equipe/stakeholders

##### Revert Deploy

Se algo der errado:

1. Vercel Dashboard → Deployments
2. Encontre deploy anterior estável
3. "..." → Promote to Production

#### Comandos Úteis

```bash
# Build local (testar antes de deploy)
npm run build
npm run preview

# Seed produção (apenas primeira vez)
npm run db:seed-prod

# Verificar bundle size
npm run build -- --report
```

#### Troubleshooting

**Erro: "Failed to load Supabase"**
- Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
- Certifique-se que começam com `VITE_`
- Redeploy após alterar env vars

**Erro: "OpenAI API Error"**
- Verifique VITE_OPENAI_API_KEY
- Confirme créditos na conta OpenAI
- Verifique rate limits

**PWA não instala**
- Verifique HTTPS (Vercel fornece automaticamente)
- Manifesto em `/manifest.webmanifest`
- Service Worker registrado

**Performance baixa**
- Ative Vercel Edge Network
- Otimize imagens
- Code splitting automático pelo Vite

#### Alternativas ao Vercel

Se preferir outras plataformas:

- **Netlify**: Similar ao Vercel, bom para static + functions
- **Railway**: Se precisar de backend mais complexo
- **Cloudflare Pages**: Boa opção para escala global
- **AWS Amplify**: Se já usa AWS

Todas suportam Vite e funcionarão com ajustes mínimos.

#### Monitoramento de Custos

**Vercel Free Tier** (suficiente para início):
- 100 GB bandwidth/mês
- 100 builds/mês
- Domains ilimitados

**Supabase Free Tier**:
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth

**OpenAI** (pague conforme uso):
- GPT-4: ~$0.03 por análise
- GPT-3.5: ~$0.001 por chat
- Estimativa: $20-50/mês para 100 usuários ativos

**Sentry Free Tier**:
- 5K errors/mês
- 1 usuário
- Suficiente para validação

#### Próximos Passos

1. ✅ Deploy realizado
2. 📊 Configure analytics
3. 🐛 Configure Sentry
4. 🔒 Revise RLS policies
5. 📱 Teste PWA em mobile
6. 👥 Convide beta testers
7. 📈 Monitore métricas

---

## 📚 Documentação

### Guias de Setup
- [Configurar Supabase](docs/SETUP-SUPABASE.md)
- [Configurar OpenAI](docs/SETUP-OPENAI.md)
- [Arquitetura do Sistema](docs/ARCHITECTURE.md)

### Para Desenvolvedores
- [Contribuindo](CONTRIBUTING.md)
- [Código de Conduta](CODE_OF_CONDUCT.md)
- [Guia de Estilo](docs/STYLE_GUIDE.md)

---

## 🎮 Funcionalidades Implementadas

### ✅ Core (v1.0)
- [x] Autenticação (email/senha)
- [x] Onboarding personalizado
- [x] Dashboard principal
- [x] Sistema de práticas diárias
- [x] Timer com SVG animado
- [x] Reflexões noturnas
- [x] Sistema de fases (4 fases)
- [x] Conquistas automáticas
- [x] Perfil e estatísticas

### ✅ IA (v1.1)
- [x] Chat contextual com IA
- [x] Análise semanal automática
- [x] Detecção de padrões linguísticos
- [x] Recomendação de práticas
- [x] Detecção de crises

### 🚧 Em Desenvolvimento
- [ ] Biblioteca completa (30+ práticas)
- [ ] Micro-atos de bondade
- [ ] Sistema de Círculos (comunidade)
- [ ] Missões de legado
- [ ] PWA (modo offline)
- [ ] Notificações push

---

## 🗺️ Roadmap

### Q1 2025
- ✅ MVP funcional
- ✅ Backend Supabase
- ✅ IA integrada
- ⏳ Beta fechado (100 usuários)

### Q2 2025
- [ ] Lançamento público
- [ ] Apps mobile (iOS/Android)
- [ ] Sistema de Círculos
- [ ] Analytics avançado

### Q3 2025
- [ ] API pública
- [ ] Versão B2B (empresas)
- [ ] Conteúdo educacional
- [ ] Programa de embaixadores

### Q4 2025
- [ ] Internacionalização (EN/ES)
- [ ] Integrações (Notion, Google Calendar)
- [ ] Plataforma de criadores

---

## 💰 Modelo de Negócio

### Gratuito (sempre)
- ✅ Todas as funcionalidades core
- ✅ IA ilimitada
- ✅ Círculos
- ✅ Sem ads

### Premium (opcional - futuro)
- Análises evolutivas avançadas
- Mentoria humana 1:1
- Certificado de evolução
- Círculos privados

### Corporativo (B2B)
- Dashboard de RH
- Programas customizados
- Suporte dedicado

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! 

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para mais detalhes.

---

## 📊 Status do Projeto

### Métricas Técnicas
- **Cobertura de testes:** 0% (TODO)
- **Performance:** 95+ (Lighthouse)
- **Acessibilidade:** 90+ (WCAG AA)
- **Bundle size:** < 500kb

### Métricas de Produto (Beta)
- **Usuários ativos:** Em desenvolvimento
- **Retenção D7:** TBD
- **NPS:** TBD

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais informações.

---

## 👥 Time

### Fundadores
- **[Seu Nome]** - Idealizador e Desenvolvedor Principal
  - [GitHub](https://github.com/seu-usuario)
  - [LinkedIn](https://linkedin.com/in/seu-perfil)

### Colaboradores
Veja a lista completa em [CONTRIBUTORS.md](CONTRIBUTORS.md)

---

## 🙏 Agradecimentos

- Comunidade espírita brasileira
- Kabbalah Centre
- Comunidade open-source
- Todos os beta testers

---

## 📮 Contato

- **Email:** contato@keter.center
- **Discord:** [Entrar na comunidade](#)
- **Twitter:** [@ketercenter](#)

---

<div align="center">

**Desenvolvido com ❤️ para transformar vidas**

[⬆ Voltar ao topo](#-keter---plataforma-de-evolução-pessoal-com-ia)

</div>
