# 🚀 Guia de Instalação Rápida - Micro-atos de Bondade

## ⚡ Quick Start (5 minutos)

### Passo 1: Executar Migration SQL

1. Acesse o Supabase Dashboard
2. Vá para SQL Editor
3. Cole e execute o conteúdo de: `database/migration-micro-atos-functions.sql`

```sql
-- Isso criará:
-- ✅ Funções SQL necessárias
-- ✅ Trigger automático
-- ✅ 5 novas conquistas
-- ✅ Índices para performance
-- ✅ Coluna total_micro_atos
```

### Passo 2: Integrar na Home

```javascript
// src/pages/Home/index.jsx
import MicroAtosCard from '../../components/features/MicroAtosCard';

export const Home = ({ userId }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Outras seções... */}
      
      {/* NOVO: Micro-ato do Dia */}
      <div className="mb-6">
        <MicroAtosCard 
          userId={userId}
          onComplete={() => {
            // Opcional: mostrar notificação, atualizar stats, etc.
            console.log('Micro-ato completado! 🎉');
          }}
        />
      </div>
    </div>
  );
};
```

### Passo 3: Adicionar Aba no Perfil

```javascript
// src/pages/Perfil/index.jsx
import MicroAtosStatistics from '../../components/features/MicroAtosStatistics';

export const Perfil = ({ userId }) => {
  const [abaAtiva, setAbaAtiva] = useState('praticas');

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setAbaAtiva('praticas')}>Práticas</button>
        <button onClick={() => setAbaAtiva('micro-atos')}>💝 Micro-atos</button>
        <button onClick={() => setAbaAtiva('reflexoes')}>Reflexões</button>
      </div>

      {/* Conteúdo */}
      {abaAtiva === 'micro-atos' && (
        <MicroAtosStatistics userId={userId} />
      )}
    </div>
  );
};
```

### Passo 4: Testar

```bash
npm run dev
```

Acesse:
- Home: Ver card do micro-ato do dia
- Perfil → Micro-atos: Ver estatísticas

---

## 📊 O que você verá

### Na Home
Um card colorido com:
- Micro-ato recomendado do dia
- Botão "Já Realizei"
- Botão "Trocar" (para escolher outro)
- Opção de criar micro-ato customizado

### No Perfil
Estatísticas completas:
- Total de micro-atos realizados
- Dias seguidos (streak)
- Últimos 7 dias (visual)
- Distribuição por categoria
- Histórico com reflexões

---

## 🎯 Funcionalidades

### Para o Usuário
- ✅ Recebe recomendação diária baseada na fase
- ✅ Pode trocar por qualquer categoria
- ✅ Pode criar micro-ato customizado
- ✅ Registra reflexão opcional após executar
- ✅ Acompanha progresso e estatísticas
- ✅ Desbloqueia conquistas

### Sistema
- ✅ 60+ micro-atos em 6 categorias
- ✅ Evita repetição (últimos 3 dias)
- ✅ Contador automático via trigger
- ✅ Verificação de conquistas
- ✅ Cálculo de streaks
- ✅ Persistência Supabase

---

## 🎨 Categorias

| Emoji | Nome | Cor | Quantidade |
|-------|------|-----|------------|
| 💝 | Bondade | Rosa | 10 atos |
| 🕊️ | Perdão | Roxo | 10 atos |
| 🎁 | Generosidade | Âmbar | 10 atos |
| 🧘 | Presença | Violeta | 10 atos |
| 🤝 | Serviço | Verde | 10 atos |
| 🙏 | Gratidão | Laranja | 10 atos |

---

## 🏆 Conquistas

1. **💝 Primeiro Passo** - Realizar 1 micro-ato
2. **🌸 Bondade Iniciante** - Realizar 7 micro-atos
3. **🔥 Bondade Consistente** - 7 dias seguidos
4. **💖 Coração Generoso** - Realizar 30 micro-atos
5. **✨ Agente de Luz** - Realizar 100 micro-atos

---

## 🔧 Troubleshooting

### ❌ Erro: "Função increment_micro_atos não existe"
**Solução:** Execute a migration SQL no Supabase

### ❌ Erro: "Coluna total_micro_atos não existe"
**Solução:** A migration cria essa coluna automaticamente

### ❌ Card não aparece
**Solução:** Verifique:
1. userId está sendo passado corretamente
2. Supabase está conectado (.env configurado)
3. Tabela micro_atos existe

### ❌ Contador não atualiza
**Solução:** Verifique se o trigger foi criado:
```sql
SELECT * FROM pg_trigger 
WHERE tgname = 'trigger_contador_micro_atos';
```

---

## 📚 Mais Informações

- **Documentação Completa:** `MICRO-ATOS-DOCS.md`
- **Exemplos de Integração:** `exemplos-integracao-micro-atos.jsx`
- **Migration SQL:** `database/migration-micro-atos-functions.sql`

---

## 🎉 Pronto!

Seu sistema de Micro-atos de Bondade está funcionando! 

**Próximos passos sugeridos:**
1. ✅ Testar fluxo completo
2. 🤖 Integrar análise por IA
3. 🔔 Adicionar notificações push
4. 👥 Compartilhar na comunidade (futuro)
5. 📊 Exportar relatório de impacto

---

**Dúvidas?** Consulte a documentação completa em `MICRO-ATOS-DOCS.md`
