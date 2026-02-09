# 📚 Fase 10: Conteúdo Educacional + Biblioteca Expandida

## Visão Geral

A Fase 10 implementa uma biblioteca completa de conteúdo educacional inspirada em apps como Headspace, Calm e Insight Timer. O sistema oferece artigos, vídeos, áudios e cursos curtos organizados por fase e categoria, com recomendações personalizadas por IA.

## ✨ Funcionalidades Principais

### 1. **Biblioteca de Conteúdo**
- **Tipos de conteúdo**: Artigos, Vídeos (YouTube/Vimeo), Áudios, Cursos Curtos
- **Organização**: Por fase (DESPERTAR, DISCIPLINA, CONSCIÊNCIA, SERVIÇO) e categoria
- **Filtros avançados**: Fase, tipo, categoria, busca por texto
- **Tags**: Sistema de tags para fácil descoberta

### 2. **Recomendações por IA**
- Análise do perfil do usuário (fase atual, sequência, práticas)
- Análise de reflexões recentes
- Recomendação contextual de 2-3 conteúdos
- Widget de recomendações na Home

### 3. **Sistema de Favoritos**
- Adicionar/remover favoritos
- Rastreamento de progresso (para cursos)
- Histórico de visualizações
- Download para acesso offline

### 4. **Offline Support (PWA)**
- Cache de conteúdo texto via Service Worker
- Cache de vídeos embeds (YouTube/Vimeo)
- Cache de áudios
- Marcação de conteúdo para acesso offline

## 🗄️ Estrutura do Banco de Dados

### Tabela: `conteudo_educacional`
```sql
- id: UUID (PK)
- titulo: VARCHAR(255)
- subtitulo: TEXT
- fase: VARCHAR(50) -- 'DESPERTAR', 'DISCIPLINA', 'CONSCIÊNCIA', 'SERVIÇO', NULL (universal)
- tipo: VARCHAR(50) -- 'artigo', 'video', 'audio', 'curso_curto'
- conteudo_texto: TEXT (Markdown para artigos)
- url: TEXT (YouTube/Vimeo embed ou Supabase Storage)
- duracao_min: INTEGER
- categoria: VARCHAR(100)
- tags: JSONB -- Array de tags
- ordem: INTEGER
- publicado: BOOLEAN
- destaque: BOOLEAN
- visualizacoes: INTEGER
- favoritos: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Tabela: `conteudo_favoritos`
```sql
- id: UUID (PK)
- ketero_id: UUID (FK)
- conteudo_id: UUID (FK)
- progresso: INTEGER (0-100%)
- completado: BOOLEAN
- baixado_offline: BOOLEAN
- adicionado_em: TIMESTAMP
- ultima_visualizacao: TIMESTAMP
```

### Tabela: `conteudo_visualizacoes`
```sql
- id: UUID (PK)
- ketero_id: UUID (FK)
- conteudo_id: UUID (FK)
- tempo_assistido_min: INTEGER
- completou: BOOLEAN
- visualizado_em: TIMESTAMP
```

## 🎨 Componentes React

### 1. **ContentLibrary.jsx**
Componente principal da biblioteca com:
- Grid de conteúdos
- Barra de busca
- Filtros (fase, tipo, categoria)
- Seção de recomendações IA
- Integração com modal de detalhes

**Props:**
- `userId`: ID do usuário

### 2. **ContentCard.jsx**
Card individual de conteúdo com:
- Preview do conteúdo
- Metadados (duração, categoria, tipo)
- Botão de favorito
- Badge de fase
- Barra de progresso (para cursos)
- Animações hover

**Props:**
- `conteudo`: Objeto do conteúdo
- `isFavorito`: Boolean
- `progresso`: Número (0-100)
- `onClick`: Callback
- `onToggleFavorito`: Callback

### 3. **ContentDetailModal.jsx**
Modal full-screen para visualização de conteúdo:
- Renderização de texto Markdown
- Embed de vídeos (YouTube/Vimeo)
- Player de áudio
- Botões de ação (favorito, offline, compartilhar)
- Rastreamento de tempo de visualização
- Barra de progresso

**Props:**
- `isOpen`: Boolean
- `onClose`: Callback
- `conteudo`: Objeto
- `isFavorito`: Boolean
- `progresso`: Número
- `onToggleFavorito`: Callback
- `onRegistrarVisualizacao`: Callback
- `onMarcarOffline`: Callback
- `onAtualizarProgresso`: Callback

### 4. **RecommendedContentWidget.jsx**
Widget de recomendações para Home:
- Exibe 2 conteúdos recomendados pela IA
- Link para biblioteca completa
- Loading state
- Animações de entrada

**Props:**
- `userId`: ID do usuário

## 🪝 Custom Hooks

### 1. **useConteudoEducacional**
Hook principal para gerenciar conteúdo educacional.

**API:**
```javascript
const {
  // Estado
  conteudos,        // Array de conteúdos
  favoritos,        // Array de favoritos do usuário
  carregando,       // Boolean
  erro,             // String | null

  // Ações
  buscarConteudos,           // (filtros) => Promise
  buscarFavoritos,           // () => Promise
  toggleFavorito,            // (conteudoId) => Promise
  registrarVisualizacao,     // (conteudoId, tempo, completou) => Promise
  atualizarProgresso,        // (conteudoId, progresso) => Promise
  marcarOffline,             // (conteudoId, baixado) => Promise

  // Helpers
  isFavorito,                // (conteudoId) => Boolean
  getProgresso,              // (conteudoId) => Number
  buscarPorTexto             // (texto) => Array
} = useConteudoEducacional(userId, filtros);
```

**Exemplo:**
```javascript
const { 
  conteudos, 
  toggleFavorito, 
  isFavorito 
} = useConteudoEducacional('user-123', { 
  fase: 'DESPERTAR', 
  tipo: 'artigo' 
});
```

### 2. **useRecomendacaoConteudo**
Hook para recomendações de conteúdo por IA.

**API:**
```javascript
const {
  recomendacoes,      // Array de conteúdos recomendados
  carregando,         // Boolean
  erro,               // String | null
  gerarRecomendacoes  // (contexto?) => Promise
} = useRecomendacaoConteudo(userId);
```

**Algoritmo:**
1. Busca contexto do usuário (fase, práticas, reflexões)
2. Envia prompt estruturado para OpenAI
3. Parseia resposta e retorna conteúdos
4. Fallback para recomendações baseadas em regras se IA falhar

## 🚀 Instalação e Setup

### 1. Executar Migration
No SQL Editor do Supabase:
```sql
-- Execute o arquivo:
database/migrations/add-conteudo-educacional.sql
```

### 2. Executar Seed
No SQL Editor do Supabase:
```sql
-- Execute o arquivo:
database/seed-conteudo-educacional.sql
```

Isso criará 15 conteúdos de exemplo:
- 6 Artigos (gratidão, hábitos, padrões mentais, bondade, respiração, ciência)
- 4 Vídeos (meditação guiada, mindfulness, compaixão, respiração)
- 2 Áudios (sons natureza, frequência 432Hz)
- 3 Cursos curtos (meditação, gratidão, consciência emocional)

### 3. Instalar Dependência
```bash
npm install react-markdown
```

### 4. Configurar Variáveis de Ambiente
Já configurado! O sistema usa:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`

## 📱 Rotas

### Nova Rota: `/sabedoria`
Acesso à biblioteca completa de conteúdo educacional.

**Navegação:**
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/sabedoria');
```

## 🎯 Como Usar

### Exemplo 1: Buscar Conteúdos da Fase DESPERTAR
```javascript
import { useConteudoEducacional } from './hooks/useConteudoEducacional';

function MeuComponente() {
  const { conteudos, carregando } = useConteudoEducacional('user-123', {
    fase: 'DESPERTAR',
    tipo: 'artigo'
  });

  if (carregando) return <div>Carregando...</div>;

  return (
    <div>
      {conteudos.map(conteudo => (
        <div key={conteudo.id}>{conteudo.titulo}</div>
      ))}
    </div>
  );
}
```

### Exemplo 2: Gerar Recomendações
```javascript
import { useRecomendacaoConteudo } from './hooks/useRecomendacaoConteudo';

function Recomendacoes() {
  const { recomendacoes, gerarRecomendacoes } = useRecomendacaoConteudo('user-123');

  useEffect(() => {
    gerarRecomendacoes({ humorMedio: 7 });
  }, []);

  return (
    <div>
      {recomendacoes.map(rec => (
        <div key={rec.id}>{rec.titulo}</div>
      ))}
    </div>
  );
}
```

### Exemplo 3: Adicionar Favorito
```javascript
const { toggleFavorito, isFavorito } = useConteudoEducacional('user-123');

const handleFavorito = async (conteudoId) => {
  const { adicionado } = await toggleFavorito(conteudoId);
  console.log(adicionado ? 'Favoritado!' : 'Removido!');
};
```

## 🎨 Design System

### Cores por Fase
```javascript
DESPERTAR:    from-blue-500 to-cyan-500
DISCIPLINA:   from-purple-500 to-pink-500
CONSCIÊNCIA:  from-amber-500 to-orange-500
SERVIÇO:      from-green-500 to-emerald-500
```

### Ícones por Tipo
- Artigo: 📖 (BookOpen)
- Vídeo: 🎥 (Video)
- Áudio: 🎧 (Headphones)
- Curso: 🎓 (GraduationCap)

## 📊 Analytics & Métricas

O sistema rastreia:
- **Visualizações**: Quantas vezes cada conteúdo foi acessado
- **Tempo assistido**: Tempo total gasto em cada conteúdo
- **Taxa de conclusão**: % de usuários que completaram o conteúdo
- **Favoritos**: Quantos usuários favoritaram
- **Progresso**: % de conclusão de cursos

## 🔒 Segurança (RLS)

### Políticas Implementadas:
1. **conteudo_educacional**: Todos podem ler conteúdo publicado
2. **conteudo_favoritos**: Usuários gerenciam apenas seus favoritos
3. **conteudo_visualizacoes**: Usuários veem apenas suas visualizações

## 🌐 Offline Support

### Estratégias de Cache (Service Worker):
1. **Conteúdo Texto**: CacheFirst (30 dias)
2. **Vídeos Embed**: NetworkFirst (7 dias)
3. **Áudios**: CacheFirst (30 dias)
4. **API Supabase**: NetworkFirst (24 horas)

### Como Funciona:
1. Usuário marca conteúdo para offline
2. Service Worker baixa e cacheia recursos
3. Conteúdo disponível mesmo sem conexão
4. Sincronização automática quando online

## 🧪 Testing

### Testes Manuais:
1. ✅ Visualizar biblioteca completa
2. ✅ Filtrar por fase/tipo/categoria
3. ✅ Buscar por texto
4. ✅ Abrir modal de detalhes
5. ✅ Adicionar/remover favorito
6. ✅ Marcar progresso em curso
7. ✅ Ver recomendações na Home
8. ✅ Testar modo offline

### Checklist de Validação:
- [ ] Migration executada sem erros
- [ ] Seed criou 15 conteúdos
- [ ] Biblioteca carrega e exibe conteúdos
- [ ] Filtros funcionam corretamente
- [ ] Modal abre e fecha
- [ ] Favoritos sincronizam
- [ ] Recomendações aparecem na Home
- [ ] Cache offline funciona

## 📚 Conteúdo Inicial (Seed)

### Artigos (6):
1. O Poder Transformador da Gratidão (DESPERTAR)
2. A Ciência dos Hábitos Duradouros (DISCIPLINA)
3. Reconhecendo Seus Padrões Mentais (CONSCIÊNCIA)
4. Bondade Como Prática Espiritual (DISCIPLINA)
5. Respiração: Sua Âncora no Presente (DESPERTAR)
6. Meditação e Neurociência (Universal)

### Vídeos (4):
1. Meditação Guiada para Iniciantes - 10min (DESPERTAR)
2. Como Praticar Mindfulness no Dia a Dia (CONSCIÊNCIA)
3. Meditação da Compaixão (Loving-Kindness) (SERVIÇO)
4. Técnicas de Respiração para Ansiedade (Universal)

### Áudios (2):
1. Sons da Natureza para Meditação (Universal)
2. Frequência 432Hz - Cura e Equilíbrio (CONSCIÊNCIA)

### Cursos (3):
1. Introdução à Meditação - Parte 1/3 (DESPERTAR)
2. Gratidão Transformadora - Parte 1/3 (DESPERTAR)
3. Consciência Emocional - Parte 1/4 (CONSCIÊNCIA)

## 🔮 Próximos Passos (Melhorias Futuras)

1. **Sistema de Comentários**: Permitir discussões nos conteúdos
2. **Notas Pessoais**: Usuário pode anotar insights em cada conteúdo
3. **Playlist Personalizada**: IA cria sequência ideal de conteúdos
4. **Certificados**: Ao completar cursos
5. **Conteúdo Gerado por IA**: Artigos personalizados sob demanda
6. **Integração com Práticas**: Sugerir prática relacionada ao conteúdo
7. **Modo Escuro**: Para leitura noturna
8. **Text-to-Speech**: Converter artigos em áudio
9. **Legendas**: Para vídeos
10. **Tradução**: Multi-idioma

## 💡 Dicas de Uso

### Para Adicionar Novo Conteúdo:
```sql
INSERT INTO conteudo_educacional (
  titulo, subtitulo, fase, tipo, conteudo_texto, duracao_min, categoria, tags, ordem
) VALUES (
  'Novo Artigo Incrível',
  'Subtítulo descritivo',
  'DESPERTAR',
  'artigo',
  '# Título\n\nConteúdo em **Markdown**...',
  5,
  'Mindfulness',
  '["tag1", "tag2"]',
  100
);
```

### Para Adicionar Vídeo YouTube:
```sql
INSERT INTO conteudo_educacional (
  titulo, fase, tipo, url, duracao_min, categoria, tags
) VALUES (
  'Meditação Guiada',
  'DESPERTAR',
  'video',
  'https://www.youtube.com/embed/VIDEO_ID',
  15,
  'Meditação',
  '["meditacao", "guiada"]'
);
```

## 🆘 Troubleshooting

### Conteúdos não aparecem:
- Verificar se `publicado = true`
- Checar RLS policies
- Ver console do navegador para erros

### Recomendações não funcionam:
- Verificar `VITE_OPENAI_API_KEY`
- Conferir se há conteúdos no banco
- Ver fallback baseado em regras

### Cache offline não funciona:
- Verificar se Service Worker está registrado
- Limpar cache do navegador
- Ver console do Service Worker

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar console do navegador
2. Verificar logs do Supabase
3. Revisar este README
4. Consultar código-fonte comentado

---

**Desenvolvido com ❤️ para a evolução do KETER**
