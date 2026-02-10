# Correções de Erros SignIn/Home - KETER

## 🎯 Resumo das Correções

Este documento descreve as correções implementadas para resolver os erros acumulados no signin e home do projeto KETER, além de adicionar validação técnica completa.

## ✅ Problemas Resolvidos

### 1. Erro de Autenticação (SignIn)

**Problema Original:**
```
AuthApiError: Invalid login credentials (400)
```

**Correções Implementadas:**

- ✅ **Tratamento específico de erro 400**: Diferenciação entre credenciais inválidas e conta não confirmada
- ✅ **Mensagem amigável ao usuário**: "Email/senha incorretos ou conta não confirmada. Verifique sua caixa de entrada para confirmação."
- ✅ **Sistema de retry com backoff exponencial**: 
  - Máximo 3 tentativas
  - Delays: 1s, 2s, 3s entre tentativas
  - Apenas para erros temporários (não retenta erros 400)

**Arquivos Modificados:**
- `src/hooks/useAuth.jsx`
- `src/lib/supabase.js`
- `src/pages/Auth/index.jsx`

### 2. Erros de Consulta ao Banco (404/406)

**Problemas Originais:**
```
406 Not Acceptable em keteros (PGRST116 por .single() em vazio)
404 Not Found em: praticas_diarias, keteros_conquistas, transicoes_fase, 
reflexoes, conteudo_educacional, micro_atos
```

**Correções Implementadas:**

- ✅ **Substituição de `.single()` por `.maybeSingle()`**: Evita erro 406 quando não há resultados
- ✅ **Tratamento de data === null com defaults**:
  ```javascript
  const faseAtualValue = keteroData?.fase_atual ?? 1; // Default: fase 1
  const totalConquistas = conquistasData?.length || 0; // Default: 0
  ```
- ✅ **Detecção e log de tabelas inexistentes**:
  ```javascript
  if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
    console.error('❌ Tabela não encontrada: nome_tabela');
    console.error('💡 Crie a tabela usando arquivo: caminho/arquivo.sql');
  }
  ```
- ✅ **Degradação graciosa**: Continua execução com arrays vazios ao invés de travar

**Hooks Corrigidos:**
- `src/hooks/usePhaseProgress.js`
- `src/hooks/usePraticas.js`
- `src/hooks/useEvolutionData.js`
- `src/hooks/useReflexoes.js`
- `src/hooks/useMicroAtos.js`
- `src/hooks/useRecomendacaoConteudo.js`

### 3. Erro "Nenhuma prática cadastrada"

**Problema Original:**
```
"Nenhuma prática cadastrada para esta fase. Adicione práticas na biblioteca!"
```

**Correções Implementadas:**

- ✅ **Fallback amigável**: Mensagem clara quando praticas.length === 0
- ✅ **Sugestão contextual**: "Cadastrar práticas" ou redirect para admin/biblioteca
- ✅ **Verificação de tabela existente** antes de mostrar erro

## 🔧 Debug Panel - Validação Técnica

### Novo Componente: DebugPanel.jsx

**Localização:** `src/components/debug/DebugPanel.jsx`

**Visibilidade:** Apenas em modo desenvolvimento (`import.meta.env.DEV`)

**Funcionalidades:**

1. **10 Testes Automatizados:**
   - ✅ Sessão de Autenticação
   - ✅ Perfil do Ketero
   - ✅ Biblioteca de Práticas
   - ✅ Práticas Diárias (Histórico)
   - ✅ Reflexões Noturnas
   - ✅ Micro-Atos de Bondade
   - ✅ Conquistas
   - ✅ Transições de Fase
   - ✅ Conteúdo Educacional
   - ✅ Círculos de Apoio

2. **Interface do Debug Panel:**
   - Botão flutuante (🔧) no canto inferior direito
   - Execução individual ou em lote de todos os testes
   - Status visual: ⚪ (pendente), ✅ (sucesso), ❌ (erro)
   - Detalhes expansíveis com dados JSON retornados
   - Timestamp de cada teste

3. **Como Usar:**
   ```bash
   # Modo desenvolvimento
   npm run dev
   
   # Abra o app no navegador
   # Clique no botão 🔧 no canto inferior direito
   # Clique em "▶ Executar Todos os Testes"
   ```

## 📊 Logs Aprimorados

### Console Logs Adicionados

**Antes:**
```javascript
console.error('Erro ao buscar conquistas:', error);
```

**Depois:**
```javascript
if (error.code === 'PGRST116') {
  console.error('❌ Tabela não encontrada: keteros_conquistas. Erro:', error.code);
  console.error('💡 Crie a tabela usando: supabase-schema.sql');
}
```

**Formato de Log Padronizado:**
- ❌ = Erro crítico
- ⚠️ = Aviso (tentando novamente)
- ✅ = Sucesso após retry
- 💡 = Sugestão de correção

## 🗂️ Recomendações ao Usuário

### 1. Criar Tabelas Faltantes no Supabase

Execute os seguintes scripts SQL no Supabase SQL Editor:

```sql
-- 1. Tabela keteros (perfil do usuário)
-- Arquivo: supabase-schema.sql

-- 2. Tabela praticas (biblioteca de práticas)
-- Arquivo: database/migration-praticas-table.sql

-- 3. Tabela praticas_diarias (histórico)
-- Arquivo: supabase-schema.sql

-- 4. Tabela reflexoes (reflexões noturnas)
-- Arquivo: database/schema-reflexoes-enhanced.sql

-- 5. Tabela micro_atos (atos de bondade)
-- Arquivo: supabase-schema.sql

-- 6. Tabela keteros_conquistas (conquistas desbloqueadas)
-- Arquivo: supabase-schema.sql

-- 7. Tabela transicoes_fase (histórico de transições)
-- Arquivo: supabase-schema.sql

-- 8. Tabela conteudo_educacional (artigos/vídeos)
-- Arquivo: database/migrations/add-conteudo-educacional.sql

-- 9. Tabela circulos (círculos de apoio)
-- Arquivo: supabase-schema.sql
```

### 2. Configurar Políticas RLS (Row Level Security)

**Para tabelas do usuário:**
```sql
-- SELECT/INSERT com autenticação
CREATE POLICY "Users can access own data"
ON praticas_diarias
FOR ALL
USING (auth.uid() = ketero_id);

-- Repetir para: reflexoes, micro_atos, keteros_conquistas, transicoes_fase
```

**Para tabelas públicas:**
```sql
-- SELECT público (sem auth)
CREATE POLICY "Public read access"
ON praticas
FOR SELECT
TO public
USING (true);

-- Repetir para: conteudo_educacional
```

### 3. Atualizar Schema Cache

**Problema:** Cache stale causa 404/406 persistentes

**Solução:**
```sql
-- No Supabase SQL Editor, execute:
NOTIFY pgrst, 'reload schema';

-- OU: Reinicie o projeto Supabase no Dashboard
-- Settings > General > Restart Project
```

### 4. Confirmar Conta de Email

**Problema:** Conta não confirmada gera erro 400

**Solução:**
1. Após signup, verifique caixa de entrada (e spam)
2. Clique no link de confirmação do Supabase
3. Tente login novamente

### 5. Popular Dados de Teste

**Práticas de Exemplo:**
```sql
INSERT INTO praticas (titulo, fase, categoria, duracao_min, dificuldade) VALUES
  ('Meditação Matinal', 1, 'Mindfulness', 10, 'Fácil'),
  ('Gratidão Diária', 1, 'Reflexão', 5, 'Fácil'),
  ('Exercício Físico', 2, 'Corpo', 30, 'Médio');
```

**Conteúdo Educacional:**
```sql
INSERT INTO conteudo_educacional (titulo, fase, tipo, categoria, publicado) VALUES
  ('Introdução à Meditação', 'DESPERTAR', 'artigo', 'Mindfulness', true),
  ('Práticas de Gratidão', 'DESPERTAR', 'video', 'Bem-estar', true);
```

## 🧪 Testando as Correções

### Teste Manual - SignIn

1. **Credenciais Inválidas:**
   ```
   Email: invalido@teste.com
   Senha: senha_errada
   
   Esperado: "Email/senha incorretos ou conta não confirmada..."
   ```

2. **Conta Não Confirmada:**
   ```
   1. Crie nova conta (signup)
   2. NÃO clique no email de confirmação
   3. Tente login
   
   Esperado: Mesma mensagem amigável
   ```

3. **Erro Temporário (simulado):**
   ```
   - Desconecte internet brevemente
   - Tente login
   - Reconecte
   
   Esperado: Retry automático (logs no console)
   ```

### Teste Manual - Home/Hooks

1. **Sem Tabelas:**
   ```
   1. Abra DebugPanel (botão 🔧)
   2. Execute "Biblioteca de Práticas"
   
   Se tabela não existe:
   - Status: ❌
   - Erro: "relation 'praticas' does not exist"
   - Sugestão: "Crie usando database/migration-praticas-table.sql"
   ```

2. **Com Tabelas Vazias:**
   ```
   1. Crie tabela praticas (sem dados)
   2. Execute teste no DebugPanel
   
   Esperado:
   - Status: ✅
   - Count: 0
   - Mensagem: "Nenhuma prática cadastrada"
   ```

3. **Verificar Logs:**
   ```
   F12 > Console
   
   Procure por:
   - ❌ para erros
   - 💡 para sugestões
   - ⚠️ para retries
   ```

## 📦 Dependências Adicionadas

```json
{
  "dependencies": {
    "react-toastify": "^10.0.5"
  }
}
```

**Instalação:**
```bash
npm install
```

## 🚀 Próximos Passos

1. **Deploy no Vercel:**
   ```bash
   # Push já foi feito
   # Vercel redeploy automático
   # Limpe cache: Settings > Clear Cache and Redeploy
   ```

2. **Teste em Produção:**
   - Login com credenciais inválidas
   - Navegue para home
   - Verifique console (F12) para erros

3. **Melhorias Futuras:**
   - [ ] Adicionar toast notifications com react-toastify
   - [ ] Testes unitários com vitest
   - [ ] E2E tests com Playwright
   - [ ] Métricas de erro (Sentry)

## 📝 Notas Técnicas

### Por que `.maybeSingle()` ao invés de `.single()`?

```javascript
// .single() - Erro 406 se vazio
const { data, error } = await supabase
  .from('keteros')
  .select('*')
  .eq('id', userId)
  .single(); // ❌ Erro se não encontrar

// .maybeSingle() - Retorna null se vazio
const { data, error } = await supabase
  .from('keteros')
  .select('*')
  .eq('id', userId)
  .maybeSingle(); // ✅ data = null se não encontrar
```

### Retry vs Erro Imediato

```javascript
// Retry: Erros temporários (rede, timeout)
if (attempt < maxRetries) {
  await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
  continue; // Tenta novamente
}

// Erro Imediato: Erros permanentes (400 bad request)
if (error.status === 400) {
  return { error: 'Credenciais inválidas' }; // Não retenta
}
```

## 🆘 Troubleshooting

### Debug Panel Não Aparece

**Problema:** Botão 🔧 não visível

**Solução:**
```bash
# Verifique se está em dev mode
npm run dev  # NÃO npm run build + preview

# Verifique no console:
console.log(import.meta.env.DEV); // Deve ser true
```

### Erros Persistem Após Correções

**Problema:** Ainda vejo 404/406

**Solução:**
1. Verifique se tabelas foram criadas no Supabase
2. Execute `NOTIFY pgrst, 'reload schema';`
3. Reinicie projeto Supabase
4. Limpe cache do navegador (Ctrl+Shift+Del)
5. Hard reload (Ctrl+Shift+R)

### Retry Não Funciona

**Problema:** Não vejo logs de retry

**Solução:**
```javascript
// Simule erro temporário:
// 1. Network throttling (Chrome DevTools)
// 2. Ou adicione delay artificial:
const { error } = await supabase.auth.signInWithPassword({
  email,
  password: 'errado' // Força erro
});
```

## 📞 Suporte

Para questões adicionais:
1. Verifique logs no console (F12)
2. Use DebugPanel para diagnosticar
3. Consulte documentação Supabase: https://supabase.com/docs

---

**Autor:** GitHub Copilot Agent
**Data:** 2026-02-10
**Branch:** copilot/fix-signin-home-errors
**Commit:** a9f78ea
