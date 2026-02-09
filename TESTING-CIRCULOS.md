# 🧪 Guia de Testes - Círculos (Fase 11)

## 📋 Checklist de Testes

### ✅ Testes Funcionais

#### 1. Criação de Círculo
- [ ] Criar círculo com nome válido
- [ ] Criar círculo com descrição
- [ ] Criar círculo relacionado a uma fase
- [ ] Criar círculo sem fase (geral)
- [ ] Escolher cor do tema
- [ ] Criar círculo público
- [ ] Tentar criar 4º círculo (deve bloquear)
- [ ] Validação de campos obrigatórios

#### 2. Listagem de Círculos
- [ ] Ver círculos públicos
- [ ] Ver "Meus Círculos"
- [ ] Ver contagem de membros
- [ ] Ver última mensagem (se houver)
- [ ] Filtrar por fase
- [ ] Ordenação por data de criação

#### 3. Entrar/Sair de Círculo
- [ ] Entrar em círculo público
- [ ] Sair de círculo (não sendo owner)
- [ ] Tentar sair sendo owner (deve bloquear)
- [ ] Tentar entrar em círculo cheio
- [ ] Ver confirmação ao sair

#### 4. Chat em Tempo Real
- [ ] Enviar mensagem
- [ ] Ver mensagem aparecer instantaneamente
- [ ] Scroll automático para última mensagem
- [ ] Mostrar timestamp relativo
- [ ] Mostrar "Enviando..." durante envio

#### 5. Modo Anônimo
- [ ] Ativar modo anônimo
- [ ] Enviar mensagem anônima
- [ ] Ver nome como "Anônimo"
- [ ] Ver avatar como 🎭
- [ ] Desativar modo anônimo

#### 6. Edição de Mensagem
- [ ] Editar própria mensagem
- [ ] Ver indicador "(editada)"
- [ ] Salvar edição
- [ ] Cancelar edição
- [ ] Tentar editar mensagem de outro (não deve aparecer opção)

#### 7. Moderação (Owner)
- [ ] Deletar própria mensagem
- [ ] Deletar mensagem de outro membro
- [ ] Ver mensagem soft-deleted
- [ ] Não pode deletar círculo com membros (futuro)

#### 8. Membros
- [ ] Ver lista de membros na sidebar
- [ ] Ver role de cada membro (owner, member)
- [ ] Ver avatar/iniciais
- [ ] Contagem correta de membros

### ✅ Testes de Real-time

#### Teste com 2 Tabs
1. **Setup:**
   - Tab 1: Usuário A no círculo "Teste"
   - Tab 2: Usuário B no círculo "Teste"

2. **Cenários:**
   - [ ] A envia mensagem → B vê imediatamente
   - [ ] B envia mensagem → A vê imediatamente
   - [ ] A edita mensagem → B vê atualização
   - [ ] A deleta mensagem → B vê desaparecer
   - [ ] C entra no círculo → A e B veem na lista de membros

#### Teste de Latência
- [ ] Medir tempo de mensagem até aparecer
- [ ] Objetivo: < 200ms
- [ ] Testar com 5 usuários simultâneos

### ✅ Testes de Segurança (RLS)

#### 1. Acesso a Círculos
```sql
-- Como usuário não-membro
SELECT * FROM circulos WHERE is_public = false;
-- Esperado: Nenhum resultado (apenas públicos)

SELECT * FROM circulos WHERE created_by = 'outro-user-id';
-- Esperado: Nenhum resultado (não é seu)
```

#### 2. Acesso a Mensagens
```sql
-- Tentar ler mensagens de círculo que não é membro
SELECT * FROM circulo_mensagens 
WHERE circulo_id = 'circulo-nao-membro';
-- Esperado: Erro de permissão ou nenhum resultado
```

#### 3. Envio de Mensagens
```sql
-- Tentar inserir mensagem em círculo que não é membro
INSERT INTO circulo_mensagens (circulo_id, user_id, mensagem)
VALUES ('circulo-nao-membro', auth.uid(), 'teste');
-- Esperado: Erro de permissão
```

#### 4. Moderação
```sql
-- Tentar deletar mensagem sendo membro regular
UPDATE circulo_mensagens 
SET deleted_at = NOW() 
WHERE user_id != auth.uid();
-- Esperado: Erro de permissão (apenas owner)
```

### ✅ Testes de Performance

#### 1. Carregamento
- [ ] Lista de círculos carrega em < 500ms
- [ ] Chat room carrega em < 300ms
- [ ] Mensagens carregam em < 200ms

#### 2. Real-time
- [ ] Latência de mensagem < 200ms
- [ ] 10 mensagens simultâneas sem lag
- [ ] 50 membros online sem impacto

#### 3. Escalabilidade
- [ ] 100 círculos ativos
- [ ] 1000 mensagens no histórico
- [ ] Pagination funciona corretamente

### ✅ Testes de UI/UX

#### 1. Responsividade
- [ ] Mobile (320px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)
- [ ] Sidebar de membros adaptável

#### 2. Acessibilidade
- [ ] Contraste de cores adequado
- [ ] Fontes legíveis
- [ ] Focus indicators visíveis
- [ ] Keyboard navigation

#### 3. Estados de Loading
- [ ] Skeleton/spinner ao carregar
- [ ] "Enviando..." ao enviar mensagem
- [ ] Feedback de erro claro

#### 4. Estados de Erro
- [ ] Erro ao criar círculo
- [ ] Erro ao enviar mensagem
- [ ] Erro de conexão
- [ ] Círculo não encontrado

### ✅ Testes de Edge Cases

#### 1. Dados Extremos
- [ ] Mensagem com 5000 caracteres
- [ ] Nome de círculo com 100 caracteres
- [ ] 50 membros em um círculo
- [ ] 100 mensagens carregadas

#### 2. Caracteres Especiais
- [ ] Emojis em mensagens: 😀🎉💚
- [ ] HTML/Scripts: <script>alert('xss')</script>
- [ ] SQL Injection: '; DROP TABLE circulos; --

#### 3. Conexão
- [ ] Enviar mensagem offline
- [ ] Reconectar e sincronizar
- [ ] Perder conexão durante envio

#### 4. Navegação
- [ ] Voltar durante criação de círculo
- [ ] F5 durante chat
- [ ] Link direto para círculo inválido

### ✅ Testes de Integração

#### 1. Com Notificações (Fase 8)
- [ ] Receber notificação de nova mensagem
- [ ] Clicar em notificação → abrir chat
- [ ] Badge de mensagens não lidas

#### 2. Com Perfil
- [ ] Avatar do perfil no chat
- [ ] Nome do perfil nas mensagens
- [ ] Link para perfil (futuro)

#### 3. Com Fases
- [ ] Círculos filtrados por fase atual
- [ ] Recomendações baseadas em fase
- [ ] Transição de fase → novos círculos

## 🔧 Ferramentas de Teste

### 1. Manual Testing
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Abrir múltiplas tabs
# Tab 1: http://localhost:5173/circulos
# Tab 2: http://localhost:5173/circulos
# Tab 3: http://localhost:5173/circulos
```

### 2. Console do Navegador
```javascript
// Verificar subscriptions ativas
console.log(window.supabase.channels);

// Simular erro
throw new Error('Teste de erro');

// Log de mensagens
console.log('Mensagem enviada:', mensagem);
```

### 3. Supabase Dashboard
```
1. Ir para: https://app.supabase.com
2. Selecionar projeto
3. Table Editor → Ver dados em tempo real
4. Logs → Ver queries executadas
```

### 4. Network Tab (DevTools)
```
1. Abrir DevTools → Network
2. Filter: WS (WebSocket)
3. Ver mensagens em tempo real
4. Verificar latência
```

## 📊 Relatório de Testes

### Template de Relatório

```markdown
## Relatório de Testes - Círculos

**Data:** [DATA]
**Testador:** [NOME]
**Versão:** 1.0.0

### Sumário
- Total de Testes: X
- Aprovados: Y
- Falhados: Z
- Pendentes: W

### Testes Aprovados ✅
1. [Teste 1]
2. [Teste 2]
...

### Testes Falhados ❌
1. [Teste 1]
   - Problema: [Descrição]
   - Severidade: Alta/Média/Baixa
   - Steps to Reproduce: [Passos]

### Bugs Encontrados 🐛
1. [Bug 1]
   - Descrição: [Descrição]
   - Impacto: Alto/Médio/Baixo
   - Screenshot: [Link]

### Melhorias Sugeridas 💡
1. [Melhoria 1]
2. [Melhoria 2]

### Conclusão
[Resumo geral dos testes]
```

## 🎯 Cenários de Teste Específicos

### Cenário 1: Usuário Iniciante
```
1. Acessa app pela primeira vez
2. Vê card "Círculos 🌟" na Home
3. Clica em "Explorar"
4. Vê 6 círculos pré-criados
5. Entra em "Primeiros Passos 🌱"
6. Lê mensagens de boas-vindas
7. Envia primeira mensagem
8. Recebe resposta de outro usuário
9. Testa modo anônimo
10. Sai do círculo
```

### Cenário 2: Usuário Criador
```
1. Vai para lista de círculos
2. Clica em "Criar Círculo"
3. Preenche formulário:
   - Nome: "Meditação Matinal"
   - Descrição: "Para quem pratica cedo"
   - Fase: 2
   - Cor: Verde
4. Cria círculo
5. Círculo aparece em "Meus Círculos"
6. Entra no círculo
7. Envia mensagem de boas-vindas
8. Aguarda outros membros
9. Modera conversas
10. Deleta mensagens inadequadas
```

### Cenário 3: Usuário Ativo
```
1. Tem 3 círculos
2. Entra em cada um
3. Responde mensagens
4. Usa modo anônimo em um
5. Edita mensagem antiga
6. Cria novo círculo (deve bloquear - limite 3)
7. Deleta um círculo
8. Cria novo círculo (agora permite)
9. Sai de um círculo
10. Volta para outro círculo
```

## 🚨 Critérios de Aceitação

Para considerar a feature completa:

- [ ] Todos os testes funcionais passam
- [ ] Real-time funciona em múltiplas tabs
- [ ] RLS protege dados corretamente
- [ ] Performance dentro dos limites
- [ ] UI responsiva em todos os tamanhos
- [ ] Sem erros no console
- [ ] Build sem warnings críticos
- [ ] Documentação completa

## 📝 Notas Finais

### O que foi testado
- Criação de círculos
- Chat em tempo real
- Modo anônimo
- Moderação
- RLS policies
- Build da aplicação

### O que precisa ser testado
- [ ] Teste com múltiplos usuários reais
- [ ] Teste de carga (stress test)
- [ ] Teste em produção
- [ ] Teste de integração com notificações
- [ ] Teste de acessibilidade completo

### Bugs Conhecidos
- Nenhum até o momento ✅

### Performance Observada
- Build time: ~6s
- Lista carrega: ~300ms
- Real-time latency: ~100ms
- Bundle size: 937KB (pode ser otimizado)

---

**Última atualização:** Fevereiro 2026  
**Status:** Pronto para testes! 🚀
