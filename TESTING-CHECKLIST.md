# ✅ Night Reflections - Testing Verification Checklist

## 🎯 Manual Testing Checklist

### Pre-requisites
- [ ] Supabase project configured
- [ ] Schema updated (ran `supabase-schema-update-reflexoes.sql`)
- [ ] `.env` file with all keys configured
- [ ] Dependencies installed (`npm install`)
- [ ] App running locally (`npm run dev`)

---

## 📱 Frontend Integration Tests

### 1. Component Loading
- [ ] App loads without console errors
- [ ] No missing imports or modules
- [ ] React hooks initialize properly

### 2. Home Screen Display
- [ ] "Reflexão Noturna" card shows when reflection not done
- [ ] "Reflexão Completa ✨" card shows when already done
- [ ] Card has correct styling and animations
- [ ] "Fazer Agora" button is clickable

### 3. Notification System
**Test at 20h (8pm):**
- [ ] Notification appears automatically in top-right
- [ ] Notification has correct text and styling
- [ ] Notification animates smoothly (slide-in)
- [ ] "Fazer Agora" button opens modal
- [ ] Close button (X) dismisses notification
- [ ] Notification doesn't show if reflection already done

**Test before 20h:**
- [ ] Notification does NOT appear
- [ ] Card on home screen still available

**Test after 23h59:**
- [ ] Notification disappears
- [ ] Card remains accessible

### 4. Modal Functionality

#### Opening Modal
- [ ] Modal opens from notification
- [ ] Modal opens from home card
- [ ] Modal has correct phase title
- [ ] Modal shows correct date
- [ ] Close button (X) works

#### Phase 1 Questions (3 questions)
- [ ] Question 1: "Como você se sentiu durante o dia?" (textarea)
  - [ ] Character counter works
  - [ ] Max length enforced (500)
  - [ ] Required field validated
- [ ] Question 2: "Paciência ou bondade hoje?" (radio)
  - [ ] All 4 options show with emojis
  - [ ] Selection highlights correctly
  - [ ] Checkmark appears on selected
  - [ ] Required field validated
- [ ] Question 3: "Mudaria algo?" (textarea, optional)
  - [ ] Character counter works
  - [ ] Not required - can skip

#### Phase 2 Questions (4 questions)
- [ ] All phase 1 questions present
- [ ] Additional question: "Micro-ato executado?" (radio)
- [ ] Additional question: "Desafio de disciplina?" (textarea, optional)
- [ ] Additional question: "Gratidão" (textarea, required)

#### Phase 3 Questions (4 questions)
- [ ] Question: "Mudança observada?" (textarea, required)
- [ ] Question: "Momento de consciência?" (radio)
- [ ] Question: "Padrão observado?" (textarea, optional)
- [ ] Question: "Impacto em outros?" (textarea, required)

#### Save Button
- [ ] Disabled when required fields empty
- [ ] Enabled when all required filled
- [ ] Shows "Salvar Reflexão" text
- [ ] Has save icon

### 5. AI Analysis Flow

#### Processing
- [ ] Clicking save shows loading spinner
- [ ] Loading text: "Analisando sua reflexão..."
- [ ] Spinner animates properly
- [ ] UI is blocked during processing (10-15 seconds)

#### Analysis Results
- [ ] Analysis modal appears after processing
- [ ] Shows ✨ icon in header
- [ ] Analysis text is formatted properly
- [ ] Analysis is in Portuguese
- [ ] Analysis is empathetic and constructive
- [ ] "Continuar" button closes modal

#### Error Handling
- [ ] If OpenAI fails, reflection still saves
- [ ] User is not blocked
- [ ] Console shows error but app continues

### 6. Data Persistence

#### Immediate Feedback
- [ ] After save, modal closes
- [ ] Home card changes to "Reflexão Completa ✨"
- [ ] Notification disappears
- [ ] Can't do another reflection same day

#### State Persistence
- [ ] Refresh page - reflection status persists
- [ ] Close app and reopen - status persists
- [ ] Login from different browser - status syncs

---

## 🗄️ Backend Integration Tests

### 1. Supabase Connection
```sql
-- Run in Supabase SQL Editor

-- Check table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reflexoes_noturnas'
ORDER BY ordinal_position;

-- Should show all new columns:
-- micro_ato_executado, desafio_disciplina, gratidao_dia,
-- observacao_mudanca, momento_consciencia, padrao_observado, impacto_outros
```
- [ ] All new columns exist
- [ ] Data types are correct

### 2. Data Saving
```sql
-- After doing a reflection, run:
SELECT * FROM reflexoes_noturnas 
WHERE ketero_id = 'YOUR_USER_ID'
ORDER BY data DESC 
LIMIT 1;
```
- [ ] Row exists for today
- [ ] `sentimentos_dia` has content
- [ ] `paciencia_bondade` has value
- [ ] `analise_ia` has AI response (if OpenAI worked)
- [ ] `palavras_chave` is JSON array
- [ ] `sentimento_detectado` has value (positivo/neutro/negativo)
- [ ] Phase-specific fields populated correctly

### 3. Counter Increment
```sql
-- Check user stats updated
SELECT total_reflexoes, ultimo_acesso 
FROM keteros 
WHERE id = 'YOUR_USER_ID';
```
- [ ] `total_reflexoes` incremented by 1
- [ ] `ultimo_acesso` updated to current timestamp

### 4. Row Level Security (RLS)
```sql
-- Test as different user - should return empty
SELECT * FROM reflexoes_noturnas 
WHERE ketero_id = 'DIFFERENT_USER_ID';
```
- [ ] Returns empty set
- [ ] No access to other users' data

### 5. Function Execution
```sql
-- Test increment function
SELECT increment_reflexoes('YOUR_USER_ID');

-- Check result
SELECT total_reflexoes FROM keteros WHERE id = 'YOUR_USER_ID';
```
- [ ] Function exists
- [ ] Function executes without errors
- [ ] Counter increments

---

## 🤖 AI Integration Tests

### 1. OpenAI API Connection
**Check Console Logs:**
- [ ] No 401 Unauthorized errors
- [ ] No rate limit errors (429)
- [ ] Request completes in < 20 seconds

### 2. Analysis Quality
**For Phase 1 reflection:**
- [ ] Analysis is contextually relevant
- [ ] Mentions user's feelings from reflection
- [ ] Provides actionable suggestion
- [ ] Tone is empathetic, not preachy
- [ ] Length is appropriate (2-3 paragraphs)

**For negative reflection:**
- [ ] AI detects negative sentiment
- [ ] Offers support appropriately
- [ ] Doesn't trivialize feelings
- [ ] Suggests professional help if needed

**For positive reflection:**
- [ ] AI celebrates progress
- [ ] Encourages continued effort
- [ ] Identifies specific positive aspects

### 3. Fallback Behavior
**Test with invalid API key:**
- [ ] Reflection still saves
- [ ] No analysis shown
- [ ] User gets simple confirmation
- [ ] Console shows error but app doesn't crash

### 4. Rate Limiting
**Do multiple reflections rapidly:**
- [ ] Can only save one reflection per day
- [ ] Subsequent attempts blocked or ignored
- [ ] Error message is clear

---

## 🔐 Security Tests

### 1. CodeQL Scan
```bash
# Already passed with 0 alerts ✅
```
- [x] No security vulnerabilities detected

### 2. Environment Variables
- [ ] `.env` file is in `.gitignore`
- [ ] No API keys in source code
- [ ] Keys load from environment correctly
- [ ] Missing keys show helpful error messages

### 3. API Key Exposure
- [ ] Development warning displayed in console
- [ ] Comments indicate production migration needed
- [ ] Edge Function template provided

### 4. SQL Injection Protection
- [ ] All queries use parameterized statements
- [ ] No string concatenation in queries
- [ ] Supabase client handles escaping

---

## 📊 Performance Tests

### 1. Initial Load
- [ ] Page loads in < 3 seconds
- [ ] No blocking on reflection check
- [ ] Async loading doesn't freeze UI

### 2. Modal Opening
- [ ] Modal opens in < 500ms
- [ ] Animation is smooth (60fps)
- [ ] No layout shifts

### 3. AI Analysis
- [ ] Completes in 10-20 seconds (acceptable)
- [ ] UI shows clear feedback during wait
- [ ] User can't submit multiple times

### 4. Database Queries
- [ ] Reflection check is fast (< 200ms)
- [ ] Save operation completes quickly
- [ ] No unnecessary re-renders

---

## ♿ Accessibility Tests

### 1. Keyboard Navigation
- [ ] Can tab through all form fields
- [ ] Can close modal with Escape key
- [ ] Enter key submits when appropriate
- [ ] Focus indicators visible

### 2. Screen Readers
- [ ] Form labels are readable
- [ ] Error messages announced
- [ ] Loading states announced
- [ ] Success confirmation announced

### 3. Color Contrast
- [ ] Text readable on backgrounds
- [ ] Buttons have sufficient contrast
- [ ] Disabled states are clear

---

## 📱 Responsive Design Tests

### Mobile (375px width)
- [ ] Modal fits screen without horizontal scroll
- [ ] Notification doesn't overflow
- [ ] Textarea is usable
- [ ] Buttons are tap-friendly (min 44px)

### Tablet (768px width)
- [ ] Layout adapts appropriately
- [ ] Modal is centered and sized well
- [ ] Home cards stack properly

### Desktop (1920px width)
- [ ] Modal doesn't become too wide
- [ ] Notification positioned correctly
- [ ] Content is readable (not stretched)

---

## 🌐 Browser Compatibility

### Chrome
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

### Firefox
- [ ] All features work
- [ ] Styles render correctly
- [ ] No console errors

### Safari
- [ ] All features work
- [ ] Date handling correct
- [ ] Animations work

### Edge
- [ ] All features work
- [ ] Compatible with Chromium features

---

## 🔄 Edge Cases

### 1. Missing User
- [ ] Hooks don't crash without userId
- [ ] Appropriate error message
- [ ] Redirects to login

### 2. Network Failure
- [ ] Save fails gracefully
- [ ] Error message shown
- [ ] Can retry

### 3. Duplicate Submission
- [ ] Prevented by unique constraint
- [ ] Error handled gracefully
- [ ] Updates existing record instead

### 4. Very Long Text
- [ ] Max length enforced
- [ ] Character counter accurate
- [ ] Doesn't break layout

### 5. Special Characters
- [ ] Emojis save correctly
- [ ] Accents preserved
- [ ] Quotes don't break SQL

---

## 📋 Final Verification

### Documentation
- [x] README updated
- [x] Setup guide complete
- [x] Technical docs written
- [x] Edge Function template provided

### Code Quality
- [x] No console errors in production build
- [x] No eslint warnings
- [x] Code review passed
- [x] CodeQL passed with 0 alerts

### Git
- [x] All changes committed
- [x] Branch pushed to remote
- [x] PR description complete
- [x] Changelog updated

---

## 🎉 Sign-Off

Once ALL items above are checked:

- [ ] Feature is ready for production
- [ ] Documentation is complete
- [ ] Security is verified
- [ ] Performance is acceptable
- [ ] UX is polished

**Tested by:** _________________  
**Date:** _________________  
**Environment:** Development / Staging / Production  
**Notes:** _________________

---

## 🐛 Issues Found During Testing

| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
|       | High/Med/Low | Open/Fixed |       |

---

## 📞 Report Issues

If you find any issues during testing:
1. Document the exact steps to reproduce
2. Include browser/device information
3. Screenshot or screen recording if applicable
4. Console errors (if any)
5. Open a GitHub issue or notify the team

---

**Last Updated:** February 2025  
**Version:** 1.0.0
