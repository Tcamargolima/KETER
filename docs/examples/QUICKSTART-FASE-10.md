# 🚀 Quick Start: Fase 10 - Conteúdo Educacional

## Setup Rápido (5 minutos)

### 1️⃣ Executar Migration
```sql
-- No SQL Editor do Supabase, execute:
-- Copie e cole todo o conteúdo de:
database/migrations/add-conteudo-educacional.sql
```

### 2️⃣ Adicionar Conteúdo Inicial
```sql
-- No SQL Editor do Supabase, execute:
-- Copie e cole todo o conteúdo de:
database/seed-conteudo-educacional.sql
```

### 3️⃣ Verificar Instalação
```sql
-- Conferir se criou 15 conteúdos:
SELECT COUNT(*) FROM conteudo_educacional;
-- Resultado esperado: 15

-- Ver distribuição por tipo:
SELECT tipo, COUNT(*) 
FROM conteudo_educacional 
GROUP BY tipo;
```

### 4️⃣ Acessar no App
```bash
# Navegue para:
http://localhost:5173/sabedoria

# Ou clique no widget de recomendações na Home
```

## 🎯 Features Disponíveis

### Na Home (`/`)
- Widget com 2 conteúdos recomendados pela IA
- Baseado na fase atual e reflexões recentes

### Na Biblioteca (`/sabedoria`)
- Grid completo de conteúdos
- Filtros por Fase, Tipo, Categoria
- Busca por texto
- Cards interativos com preview

### No Modal de Detalhes
- Visualização completa (artigos Markdown, vídeos, áudios)
- Favoritar/desfavoritar
- Marcar para offline
- Compartilhar
- Progresso (para cursos)

## 📝 Exemplos de Uso

### Buscar Conteúdos da Fase DESPERTAR
```javascript
import { useConteudoEducacional } from './hooks/useConteudoEducacional';

const { conteudos } = useConteudoEducacional('user-id', {
  fase: 'DESPERTAR'
});
```

### Favoritar um Conteúdo
```javascript
const { toggleFavorito } = useConteudoEducacional('user-id');

await toggleFavorito('conteudo-id');
```

### Gerar Recomendações
```javascript
import { useRecomendacaoConteudo } from './hooks/useRecomendacaoConteudo';

const { recomendacoes, gerarRecomendacoes } = useRecomendacaoConteudo('user-id');

useEffect(() => {
  gerarRecomendacoes();
}, []);
```

## 🎨 Adicionar Novo Conteúdo

### Artigo
```sql
INSERT INTO conteudo_educacional (
  titulo, subtitulo, fase, tipo, conteudo_texto, duracao_min, categoria, tags, ordem
) VALUES (
  'Título do Artigo',
  'Subtítulo descritivo',
  'DESPERTAR',
  'artigo',
  '# Título Principal\n\nTexto em **Markdown**...',
  5,
  'Mindfulness',
  '["tag1", "tag2"]',
  100
);
```

### Vídeo YouTube
```sql
INSERT INTO conteudo_educacional (
  titulo, fase, tipo, url, duracao_min, categoria, tags
) VALUES (
  'Título do Vídeo',
  'DISCIPLINA',
  'video',
  'https://www.youtube.com/embed/VIDEO_ID',
  10,
  'Meditação',
  '["meditacao"]'
);
```

### Áudio (Supabase Storage)
```sql
-- 1. Fazer upload do MP3 para Supabase Storage (bucket: audio-content)
-- 2. Copiar URL pública do arquivo
-- 3. Inserir:

INSERT INTO conteudo_educacional (
  titulo, tipo, url, duracao_min, categoria, tags
) VALUES (
  'Título do Áudio',
  'audio',
  'https://[PROJECT_ID].supabase.co/storage/v1/object/public/audio-content/arquivo.mp3',
  15,
  'Relaxamento',
  '["audio", "relaxamento"]'
);
```

## 🔍 Troubleshooting

### Conteúdos não aparecem?
- Verificar `publicado = true`
- Conferir RLS policies
- Ver console do navegador

### Recomendações vazias?
- Verificar `VITE_OPENAI_API_KEY` no .env
- Verificar se há conteúdos no banco
- IA usa fallback se falhar

### Vídeos não carregam?
- URL deve ser embed (não watch)
- Exemplo correto: `youtube.com/embed/VIDEO_ID`
- Exemplo errado: `youtube.com/watch?v=VIDEO_ID`

## 📊 Monitorar Uso

```sql
-- Conteúdos mais visualizados:
SELECT titulo, visualizacoes 
FROM conteudo_educacional 
ORDER BY visualizacoes DESC 
LIMIT 10;

-- Conteúdos mais favoritados:
SELECT titulo, favoritos 
FROM conteudo_educacional 
ORDER BY favoritos DESC 
LIMIT 10;

-- Tempo médio por conteúdo:
SELECT 
  c.titulo,
  AVG(v.tempo_assistido_min) as tempo_medio
FROM conteudo_visualizacoes v
JOIN conteudo_educacional c ON v.conteudo_id = c.id
GROUP BY c.id, c.titulo
ORDER BY tempo_medio DESC;
```

## 🎓 Próximos Passos

1. ✅ Biblioteca funcionando
2. ✅ Recomendações por IA
3. ✅ Sistema de favoritos
4. ✅ Offline support

### Melhorias Futuras:
- [ ] Upload de áudios reais
- [ ] Sistema de comentários
- [ ] Notas pessoais
- [ ] Playlists curadas
- [ ] Certificados para cursos

## 💬 Suporte

- Ver README completo: `FASE-10-CONTEUDO-EDUCACIONAL.md`
- Documentação técnica detalhada com exemplos
- Troubleshooting completo
- APIs de todos os hooks

---

**Desenvolvido com ❤️ para KETER**
