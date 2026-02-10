# 🎯 Quick Start Guide - Testing Your Fixes

## 🚀 For Developers

### Step 1: Start Development Server
```bash
cd /home/runner/work/KETER/KETER
npm run dev
```

### Step 2: Access DebugPanel
1. Open browser: `http://localhost:5173`
2. Look for 🔧 button in bottom-right corner
3. Click it to open DebugPanel
4. Click "▶ Executar Todos os Testes"

### Step 3: Check Results
- ✅ Green = Table exists and working
- ❌ Red = Table missing or error
- ⚪ Gray = Test not run yet

## 📋 Visual Checklist

### Authentication Tests

```
□ Try login with WRONG credentials
  Expected: "Email/senha incorretos ou conta não confirmada..."
  
□ Try login with CORRECT credentials
  Expected: Redirect to home page
  
□ Check console (F12)
  Expected: See emoji logs (❌⚠️✅💡)
```

### DebugPanel Tests

```
□ Open DebugPanel (🔧 button)
  Expected: Modal opens with 10 tests listed
  
□ Run "Biblioteca de Práticas" test
  If table exists: ✅ Success (count: X)
  If table missing: ❌ Error with SQL file reference
  
□ Run "Perfil do Ketero" test
  Expected: ✅ Success with your profile data
  
□ Click "Ver dados retornados" on any ✅ test
  Expected: JSON data displayed
```

### Home Page Tests

```
□ Navigate to home (/)
  Expected: No crashes, graceful empty state if tables missing
  
□ Check console
  Expected: Clear error messages (not generic "Object")
  
□ Look for "Nenhuma prática cadastrada"
  Expected: Helpful message, not crash
```

## 🎨 What You'll See

### DebugPanel Interface
```
┌─────────────────────────────────────────┐
│ 🔧 Debug Panel                          │
│ Validação Técnica - Dev Mode           │
├─────────────────────────────────────────┤
│ [▶ Executar Todos] [🗑 Limpar]         │
├─────────────────────────────────────────┤
│                                          │
│ ⚪ Sessão de Autenticação    [▶ Testar]│
│                                          │
│ ✅ Perfil do Ketero          [▶ Testar]│
│   ✅ Sucesso                             │
│   Registros encontrados: 1              │
│   [Ver dados retornados ▼]              │
│                                          │
│ ❌ Biblioteca de Práticas    [▶ Testar]│
│   ❌ Erro                                │
│   relation "praticas" does not exist    │
│   Código: PGRST116                      │
│   💡 Crie usando: migration-praticas... │
│                                          │
└─────────────────────────────────────────┘
```

### Console Logs
```javascript
// Good logs (what you'll see now):
❌ Tabela não encontrada: praticas_diarias
💡 Crie a tabela usando: supabase-schema.sql
⚠️ Tentativa 1/3 de login falhou. Tentando novamente em 1s...
✅ Perfil criado com sucesso na tentativa 2

// Bad logs (what you had before):
Error: Object
PGRST116
undefined
```

## 🔍 Troubleshooting

### DebugPanel Not Visible?
```bash
# Make sure you're in DEV mode:
npm run dev

# NOT production build:
npm run build && npm run preview  # DebugPanel won't show here!
```

### All Tests Show ❌?
```
This is EXPECTED if tables don't exist yet!

Next steps:
1. Read: CORREÇÕES-SIGNIN-HOME.md
2. Create tables using SQL scripts
3. Run tests again
```

### Tests Still Failing After Creating Tables?
```sql
-- In Supabase SQL Editor:
NOTIFY pgrst, 'reload schema';

-- OR restart Supabase project in dashboard
```

## 📱 Testing on Mobile (PWA)

### Install App
1. Desktop: Look for install prompt at top
2. Mobile: Browser menu → "Add to Home Screen"

### Test Offline Mode
1. Enable airplane mode
2. Open app
3. Should see offline indicator
4. Re-enable network
5. Should auto-sync

## ✅ Success Criteria

**You'll know it's working when:**

✅ Login with wrong credentials shows friendly Portuguese message
✅ DebugPanel shows ✅ for tables that exist
✅ DebugPanel shows ❌ with helpful SQL file reference for missing tables
✅ Console logs use emojis (❌⚠️✅💡) for clarity
✅ Home page doesn't crash even with missing data
✅ No generic "Object" errors in console

## 🎓 Learning Resources

**Want to understand the code?**

1. Start with: `src/hooks/useAuth.jsx`
   - See retry logic in `signIn()` function
   
2. Then check: `src/hooks/usePhaseProgress.js`
   - See `.maybeSingle()` usage
   - See error handling pattern
   
3. Finally: `src/components/debug/DebugPanel.jsx`
   - See how tests are structured
   - See how results are displayed

## 🆘 Need Help?

**Console shows error you don't understand?**
1. Copy full error message
2. Check if it includes 💡 emoji with suggestion
3. Follow the suggestion (usually a SQL file to run)

**DebugPanel test fails but you created the table?**
1. Refresh schema: `NOTIFY pgrst, 'reload schema';`
2. Check RLS policies (might be blocking query)
3. Verify column names match query

**App crashes on specific page?**
1. Open DebugPanel
2. Run test for that page's data
3. Check error message
4. Create missing table/fix query

## 🎯 Quick Win Test

**5-Minute Validation:**
```bash
# 1. Start dev server
npm run dev

# 2. Open browser
# http://localhost:5173

# 3. Click 🔧 button

# 4. Click "▶ Executar Todos os Testes"

# 5. Count results:
#    - ✅ = Things working
#    - ❌ = Things to fix (expected if tables missing)

# 6. Try login with wrong password
#    Should see: "Email/senha incorretos..."

# Done! 🎉
```

---

**Congratulations!** You now have:
- ✅ Better error handling
- ✅ Clear debugging tools
- ✅ User-friendly messages
- ✅ Comprehensive documentation

**Next:** Create missing tables and watch those ❌ turn into ✅!
