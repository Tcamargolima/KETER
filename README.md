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
