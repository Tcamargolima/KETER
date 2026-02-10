# 🚀 Setup & Testing Guide

## Prerequisites

Before testing the practice library implementation, you need to:

### 1. Install Dependencies

```bash
npm install
```

This will install:
- React 18.2.0
- @supabase/supabase-js 2.39.0
- lucide-react 0.300.0 (icons)
- react-router-dom 6.20.0
- And all dev dependencies

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key  # Optional, for seed scripts
VITE_OPENAI_API_KEY=your_openai_key    # If using AI features
```

Get these values from your Supabase Dashboard:
- Settings → API → Project URL
- Settings → API → Project API keys → anon/public key
- Settings → API → Project API keys → service_role key (for scripts only)

### 3. Setup Database

#### Option A: Using SQL Editor (Recommended)

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Create new query
4. Copy and paste `database/migration-praticas-table.sql`
5. Click "Run"
6. Create another new query
7. Copy and paste `database/seed-praticas.sql`
8. Click "Run"

#### Option B: Using Node.js Script

```bash
# After installing dependencies and setting up .env
npm run db:seed
```

### 4. Verify Database Setup

In Supabase Dashboard:
1. Go to Table Editor
2. Look for `praticas` table
3. Should see 10 practices loaded
4. Check that RLS policies are enabled

## Testing the Implementation

### Manual Testing Checklist

Once setup is complete:

#### 1. Test Home Component
```bash
npm run dev
# Navigate to home page
```

**Verify:**
- [ ] Shows "Próxima Prática Recomendada"
- [ ] Displays practice title, duration, category
- [ ] Shows benefits and tip
- [ ] "Iniciar Prática Agora" button works
- [ ] Statistics cards show correct data
- [ ] "Explorar Biblioteca" button works

#### 2. Test Practice Library
```bash
# Click "Ver Todas" from Home
```

**Verify:**
- [ ] Displays all 10 practices in grid
- [ ] Search box filters by text
- [ ] Phase filter buttons work (Fase 1-4)
- [ ] Category filter buttons work
- [ ] "Limpar filtros" resets all filters
- [ ] Clicking a card navigates to timer
- [ ] Shows correct count "Mostrando X práticas"

#### 3. Test Practice Timer
```bash
# Click any practice card
```

**Verify:**
- [ ] Loads practice from Supabase
- [ ] Shows circular timer
- [ ] Displays title and subtitle
- [ ] Shows tip before starting
- [ ] "Iniciar" button starts timer
- [ ] Timer counts down correctly
- [ ] Instructions update during practice
- [ ] "Pausar" button pauses timer
- [ ] "Retomar" button resumes
- [ ] "Reiniciar" button resets
- [ ] Completion shows congratulations
- [ ] "Finalizar" saves to database
- [ ] "Voltar" button returns to previous screen

#### 4. Test usePraticas Hook

Create a test component:

```jsx
import { usePraticas } from './src/hooks/usePraticas';

function TestHook() {
  const { praticas, carregando, erro } = usePraticas(userId);
  
  if (carregando) return <div>Loading...</div>;
  if (erro) return <div>Error: {erro}</div>;
  
  return (
    <div>
      <h1>Práticas: {praticas.length}</h1>
      <pre>{JSON.stringify(praticas, null, 2)}</pre>
    </div>
  );
}
```

**Verify:**
- [ ] Loads practices on mount
- [ ] Shows loading state
- [ ] Handles errors gracefully
- [ ] Returns correct data structure

#### 5. Test Recommendation Algorithm

In browser console:

```javascript
const { recomendarProximaPratica } = usePraticas(userId);
const { data: pratica } = await recomendarProximaPratica();
console.log('Recommended:', pratica);
```

**Verify:**
- [ ] Recommends from user's current phase
- [ ] Avoids practices done in last 3 days
- [ ] Shorter practices in morning (6am-12pm)
- [ ] Longer practices in afternoon/evening

### Integration Testing

#### Test with Existing keter-app.jsx

1. Add import:
```jsx
import PracticeApp from './practice-integration-example';
```

2. Add to view switch:
```jsx
case 'praticas':
  return <PracticeApp />;
```

3. Add navigation:
```jsx
<button onClick={() => setCurrentView('praticas')}>
  Práticas
</button>
```

**Verify:**
- [ ] Integrates without breaking existing views
- [ ] Navigation works correctly
- [ ] userId passes correctly
- [ ] State persists across views

### Error Testing

#### Test Edge Cases:

1. **No practices in database:**
   - Should show "Nenhuma prática encontrada"
   - Should offer "Tentar Novamente" button

2. **Invalid practice ID:**
   - Should show error message
   - Should offer "Voltar" button

3. **No user logged in:**
   - Should handle gracefully
   - Timer should still work (just won't save)

4. **Network error:**
   - Should show loading state
   - Should show error message
   - Should offer retry option

### Performance Testing

Check in browser DevTools:

1. **Network tab:**
   - [ ] Practices loaded only once on mount
   - [ ] No unnecessary re-fetches
   - [ ] Proper caching

2. **React DevTools:**
   - [ ] No unnecessary re-renders
   - [ ] State updates are batched
   - [ ] Components unmount cleanly

3. **Lighthouse:**
   - [ ] Accessibility score > 90
   - [ ] Performance score > 80
   - [ ] Best practices score > 90

## Common Issues & Solutions

### Issue: "Práticas não aparecem"

**Solution:**
1. Check browser console for errors
2. Verify `.env` has correct Supabase credentials
3. Verify migration was executed
4. Verify seed was executed
5. Check Supabase Dashboard → Table Editor → praticas

### Issue: "Erro ao carregar prática"

**Solution:**
1. Check practice ID is valid UUID
2. Verify practice exists in database
3. Check `instrucoes_texto` is valid JSON array
4. Verify RLS policies allow SELECT

### Issue: "Recomendação não funciona"

**Solution:**
1. Verify user has `fase_atual` field set in `keteros` table
2. Verify there are practices in that phase
3. Check browser console for errors
4. Try with different user/phase

### Issue: "Timer não carrega"

**Solution:**
1. Verify `praticaId` prop is valid UUID
2. Check practice exists in database
3. Verify `instrucoes_texto` is properly formatted JSON
4. Check browser console for parse errors

### Issue: "Filtros não funcionam"

**Solution:**
1. Check browser console for errors
2. Verify practices have `fase` and `categoria` fields
3. Try clearing all filters first
4. Reload page

## Debugging Tips

### Enable Verbose Logging

Add to components:

```jsx
useEffect(() => {
  console.log('Component mounted');
  console.log('Props:', { userId, praticaId, etc });
}, []);

useEffect(() => {
  console.log('State changed:', { praticas, carregando, erro });
}, [praticas, carregando, erro]);
```

### Check Supabase Logs

1. Go to Supabase Dashboard
2. Click "Logs" in sidebar
3. Filter by:
   - API logs (for fetch errors)
   - Postgres logs (for query errors)

### Check Network Requests

1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Look for requests to Supabase
4. Check response status and data

## Next Steps After Testing

Once all tests pass:

1. ✅ Merge PR to main branch
2. ✅ Deploy to production
3. ✅ Monitor error logs
4. ✅ Gather user feedback
5. ✅ Iterate on AI recommendation logic
6. ✅ Add more practices
7. ✅ Implement audio feature
8. ✅ Add gamification elements

## Support

If you encounter issues:

1. Check this guide first
2. Read `PRACTICE-LIBRARY-DOCS.md`
3. Read `PRACTICE-LIBRARY-README.md`
4. Check browser console
5. Check Supabase logs
6. Create detailed bug report with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Console errors
   - Network logs

## Success Criteria

The implementation is successful when:

- [x] All database migrations executed
- [x] 10 practices seeded correctly
- [x] All 3 components render without errors
- [x] Filters work correctly
- [x] Recommendation logic works
- [x] Timer completes full cycle
- [x] Practices save to database
- [x] No console errors
- [x] No network errors
- [x] No accessibility issues
- [x] Mobile responsive
- [x] Integration with existing app works
- [x] Documentation is clear

---

**Happy Testing! 🎉**
