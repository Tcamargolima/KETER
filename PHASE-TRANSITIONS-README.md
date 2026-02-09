# Phase 6: Transitions Between Phases - Implementation Guide

## Overview

This implementation adds a complete phase transition ceremony system to the KETER app, including:
- Animated modal celebrations with confetti
- Personalized AI-generated messages
- Achievement unlocking
- Progress tracking and validation
- Integration with Home and Profile pages

## Files Created/Modified

### New Files

1. **`src/components/features/PhaseTransitionModal.jsx`**
   - Beautiful animated modal with phase-specific gradients
   - Confetti celebration effect
   - Displays AI message, achievements, and statistics
   - Uses framer-motion for smooth animations

2. **`src/hooks/usePhaseProgress.js`**
   - Manages phase progress calculation
   - Validates completion criteria
   - Triggers transitions
   - Handles AI message generation

3. **`database/migrations/add-phase-transition-achievements.sql`**
   - Creates "Transcendente" achievements for each phase
   - Updates `verificar_transicao_fase` function
   - Adds `desbloquear_conquista_transicao` function

### Modified Files

1. **`src/lib/openai.js`**
   - Added `generatePhaseTransitionMessage()` function
   - Creates personalized, poetic celebration messages

2. **`src/pages/Home/index.jsx`**
   - Integrated PhaseTransitionModal
   - Checks for pending transitions on load
   - Displays modal automatically

3. **`src/pages/Perfil/index.jsx`**
   - Integrated PhaseTransitionModal
   - Same transition check as Home page

## Dependencies Added

```json
{
  "framer-motion": "latest",
  "react-confetti": "latest"
}
```

Install with:
```bash
npm install framer-motion react-confetti
```

## Phase Configuration

The system supports 5 phases with specific colors and criteria:

| Phase | Name | Color Gradient | Icon | Duration | Criteria |
|-------|------|---------------|------|----------|----------|
| 0 | Semente | Purple soft | 🌱 | 7 days | 3 practices, 3 reflections, streak 3 |
| 1 | Despertar | Purple intense | 🌿 | 14 days | 10 practices, 7 reflections, streak 7 |
| 2 | Disciplina | Amber intense | 🌳 | 16 days | 14 practices, 10 reflections, streak 10 |
| 3 | Consciência | Pink deep | 🌲 | 21 days | 21 practices, 14 reflections, streak 14 |
| 4 | Serviço | Golden/Amber | 🌸 | Unlimited | N/A (final phase) |

## Completion Criteria

Each phase requires the user to complete:
- **Minimum days**: Consecutive days in the phase
- **Practices**: Total practices completed
- **Reflections**: Night reflections submitted
- **Streak**: Consecutive days of activity
- **Achievements**: Unlocked achievements

Example for Phase 3 (Consciência):
```javascript
{
  diasMinimos: 21,
  praticasMinimas: 21,
  reflexoesMinimas: 14,
  streakMinimo: 14,
  conquistasMinimas: 5
}
```

## How It Works

### 1. Progress Tracking

The `usePhaseProgress` hook:
- Loads current user progress from Supabase
- Calculates if completion criteria are met
- Checks for unseen transitions
- Generates AI messages when needed

```javascript
const {
  transicaoPendente,
  mensagemIA,
  conquistasDesbloqueadas,
  marcarTransicaoVista,
  verificarETransitar
} = usePhaseProgress();
```

### 2. Transition Detection

When a user completes a practice or reflection:
1. The database trigger updates `progresso_fase`
2. The `verificar_transicao_fase()` RPC function checks if progress >= 100%
3. If yes, creates a new row in `transicoes_fase` table
4. Unlocks the "Transcendente [Phase]" achievement
5. Advances the user to the next phase

### 3. Modal Display

On page load (Home or Profile):
1. `usePhaseProgress` checks for unseen transitions
2. If found, displays the PhaseTransitionModal
3. Modal shows:
   - Confetti animation (5 seconds)
   - Phase icons (old → new)
   - AI-generated message
   - Unlocked achievements
   - Statistics from previous phase
   - "Continue Journey" button

### 4. AI Message Generation

The OpenAI integration creates personalized messages:

```javascript
const mensagem = await generatePhaseTransitionMessage(
  nomeUsuario,
  faseNova,
  transicao
);
```

The AI considers:
- User's name
- Phase completed
- Days spent in phase
- Practices and reflections completed
- Maximum streak achieved

## Database Schema

### `transicoes_fase` table

```sql
CREATE TABLE transicoes_fase (
  id UUID PRIMARY KEY,
  ketero_id UUID REFERENCES keteros(id),
  fase_anterior INTEGER,
  fase_nova INTEGER,
  data_transicao TIMESTAMP,
  dias_na_fase INTEGER,
  praticas_completadas INTEGER,
  reflexoes_feitas INTEGER,
  sequencia_maxima_alcancada INTEGER,
  conquistas_desbloqueadas JSONB,
  mensagem_ia TEXT,
  animacao_vista BOOLEAN DEFAULT false,
  feedback_usuario TEXT
);
```

### New Achievements

- `transcendente-semente`: Complete Semente phase
- `transcendente-despertar`: Complete Despertar phase
- `transcendente-disciplina`: Complete Disciplina phase
- `transcendente-consciencia`: Complete Consciência phase

## Usage Examples

### In a Page Component

```javascript
import { usePhaseProgress } from '../../hooks/usePhaseProgress';
import { PhaseTransitionModal } from '../../components/features/PhaseTransitionModal';

const MyPage = () => {
  const {
    transicaoPendente,
    mensagemIA,
    conquistasDesbloqueadas,
    marcarTransicaoVista
  } = usePhaseProgress();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (transicaoPendente) {
      setShowModal(true);
    }
  }, [transicaoPendente]);

  const handleClose = async () => {
    await marcarTransicaoVista(transicaoPendente.id);
    setShowModal(false);
  };

  return (
    <>
      <PhaseTransitionModal
        isOpen={showModal}
        onClose={handleClose}
        transicao={transicaoPendente}
        mensagemIA={mensagemIA}
        conquistasDesbloqueadas={conquistasDesbloqueadas}
        onContinuar={handleClose}
      />
      {/* Your page content */}
    </>
  );
};
```

### Manually Trigger Transition Check

```javascript
const { verificarETransitar } = usePhaseProgress();

// After completing a practice or reflection
await completarPratica(userId, praticaId);
const { transitou } = await verificarETransitar();

if (transitou) {
  console.log('User transitioned to next phase!');
}
```

## Deployment Steps

1. **Install dependencies**:
   ```bash
   npm install framer-motion react-confetti
   ```

2. **Run database migrations**:
   - Execute `database/migrations/add-phase-transition-achievements.sql` in Supabase SQL Editor
   - This creates the new achievements and updates functions

3. **Deploy code**:
   - All new files are in `src/` directory
   - Modified files maintain backward compatibility

4. **Test the flow**:
   - Create a test user
   - Complete practices and reflections to meet criteria
   - Verify modal appears on Home/Profile page
   - Check AI message generation
   - Confirm achievement unlocking

## Customization

### Change Phase Colors

Edit `FASE_COLORS` in `PhaseTransitionModal.jsx`:

```javascript
const FASE_COLORS = {
  0: {
    gradiente: 'from-purple-400 via-purple-500 to-purple-600',
    confettiColors: ['#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9']
  },
  // ... more phases
};
```

### Adjust Completion Criteria

Edit `FASE_CRITERIOS` in `usePhaseProgress.js`:

```javascript
const FASE_CRITERIOS = {
  1: {
    diasMinimos: 14,
    praticasMinimas: 10,
    reflexoesMinimas: 7,
    streakMinimo: 7,
    conquistasMinimas: 2
  },
  // ... more phases
};
```

### Modify AI Prompt

Edit the prompt in `generatePhaseTransitionMessage()` in `openai.js`:

```javascript
const prompt = `Your custom prompt here...`;
```

## Troubleshooting

### Modal Not Appearing

1. Check if `transicoes_fase` table has unseen transitions:
   ```sql
   SELECT * FROM transicoes_fase 
   WHERE ketero_id = '[user_id]' 
   AND animacao_vista = false;
   ```

2. Verify user meets criteria:
   ```sql
   SELECT * FROM v_progresso_fase WHERE id = '[user_id]';
   ```

3. Check browser console for errors

### AI Message Not Generating

1. Verify OpenAI API key is set in environment variables
2. Check `mensagem_ia` column in `transicoes_fase` table
3. Review OpenAI client logs for API errors

### Achievements Not Unlocking

1. Verify achievements exist in `conquistas` table
2. Check `keteros_conquistas` for new entries
3. Review `desbloquear_conquista_transicao()` function execution

## Performance Considerations

- Modal uses lazy loading for confetti library
- AI messages are generated asynchronously and cached
- Database triggers are optimized for minimal overhead
- Real-time subscriptions only active when needed

## Future Enhancements

Possible improvements:
- [ ] Add theme switching based on phase colors
- [ ] Create phase-specific practice recommendations
- [ ] Add social sharing of phase completions
- [ ] Implement phase completion certificates
- [ ] Add statistics visualization on modal

## Support

For issues or questions:
- Check the KETER documentation
- Review the implementation files
- Open an issue on GitHub
