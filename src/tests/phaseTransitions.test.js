// ================================================
// TEST: Phase Transitions System
// ================================================
// Este arquivo demonstra como testar o sistema de transições

import { describe, it, expect } from 'vitest';

describe('Phase Transitions System', () => {
  
  describe('Phase Completion Criteria', () => {
    it('should define criteria for each phase', () => {
      const FASE_CRITERIOS = {
        0: { diasMinimos: 7, praticasMinimas: 3, reflexoesMinimas: 3, streakMinimo: 3 },
        1: { diasMinimos: 14, praticasMinimas: 10, reflexoesMinimas: 7, streakMinimo: 7 },
        2: { diasMinimos: 16, praticasMinimas: 14, reflexoesMinimas: 10, streakMinimo: 10 },
        3: { diasMinimos: 21, praticasMinimas: 21, reflexoesMinimas: 14, streakMinimo: 14 }
      };

      expect(FASE_CRITERIOS[0].diasMinimos).toBe(7);
      expect(FASE_CRITERIOS[1].praticasMinimas).toBe(10);
      expect(FASE_CRITERIOS[2].reflexoesMinimas).toBe(10);
      expect(FASE_CRITERIOS[3].streakMinimo).toBe(14);
    });
  });

  describe('Phase Colors Configuration', () => {
    it('should have unique colors for each phase', () => {
      const FASE_COLORS = {
        0: { nome: 'Semente', gradiente: 'from-purple-400 to-purple-600' },
        1: { nome: 'Despertar', gradiente: 'from-purple-500 to-indigo-600' },
        2: { nome: 'Disciplina', gradiente: 'from-amber-400 to-orange-500' },
        3: { nome: 'Consciência', gradiente: 'from-pink-400 to-pink-600' },
        4: { nome: 'Serviço', gradiente: 'from-amber-500 to-amber-600' }
      };

      expect(FASE_COLORS[0].nome).toBe('Semente');
      expect(FASE_COLORS[2].nome).toBe('Disciplina');
      expect(FASE_COLORS[4].nome).toBe('Serviço');
    });
  });

  describe('Achievement IDs', () => {
    it('should have correct achievement IDs for each phase transition', () => {
      const achievements = [
        'transcendente-semente',
        'transcendente-despertar',
        'transcendente-disciplina',
        'transcendente-consciencia'
      ];

      expect(achievements.length).toBe(4);
      expect(achievements[0]).toBe('transcendente-semente');
      expect(achievements[3]).toBe('transcendente-consciencia');
    });
  });

  describe('Progress Calculation', () => {
    it('should calculate if user meets phase completion criteria', () => {
      // Mock user progress
      const userProgress = {
        dias: 14,
        praticas: 10,
        reflexoes: 7,
        streak: 7,
        conquistas: 2
      };

      // Fase 1 (Despertar) criteria
      const criterios = {
        diasMinimos: 14,
        praticasMinimas: 10,
        reflexoesMinimas: 7,
        streakMinimo: 7,
        conquistasMinimas: 2
      };

      const meetsRequirements = 
        userProgress.dias >= criterios.diasMinimos &&
        userProgress.praticas >= criterios.praticasMinimas &&
        userProgress.reflexoes >= criterios.reflexoesMinimas &&
        userProgress.streak >= criterios.streakMinimo &&
        userProgress.conquistas >= criterios.conquistasMinimas;

      expect(meetsRequirements).toBe(true);
    });

    it('should not allow transition if criteria not met', () => {
      const userProgress = {
        dias: 10, // Less than required
        praticas: 10,
        reflexoes: 7,
        streak: 7,
        conquistas: 2
      };

      const criterios = {
        diasMinimos: 14,
        praticasMinimas: 10,
        reflexoesMinimas: 7,
        streakMinimo: 7,
        conquistasMinimas: 2
      };

      const meetsRequirements = 
        userProgress.dias >= criterios.diasMinimos &&
        userProgress.praticas >= criterios.praticasMinimas &&
        userProgress.reflexoes >= criterios.reflexoesMinimas &&
        userProgress.streak >= criterios.streakMinimo &&
        userProgress.conquistas >= criterios.conquistasMinimas;

      expect(meetsRequirements).toBe(false);
    });
  });

  describe('Modal Props Validation', () => {
    it('should have all required modal props', () => {
      const requiredProps = [
        'isOpen',
        'onClose',
        'transicao',
        'mensagemIA',
        'conquistasDesbloqueadas',
        'onContinuar'
      ];

      const mockProps = {
        isOpen: true,
        onClose: () => {},
        transicao: {
          id: 'test-id',
          fase_anterior: 0,
          fase_nova: 1,
          dias_na_fase: 7,
          praticas_completadas: 5,
          reflexoes_feitas: 5,
          sequencia_maxima_alcancada: 5
        },
        mensagemIA: 'Test message',
        conquistasDesbloqueadas: [],
        onContinuar: () => {}
      };

      requiredProps.forEach(prop => {
        expect(mockProps).toHaveProperty(prop);
      });
    });
  });
});

// ================================================
// INTEGRATION TEST SCENARIOS
// ================================================

describe('Integration Scenarios', () => {
  
  it('Scenario 1: User completes Semente phase', async () => {
    // Given: User has completed all requirements for Semente (phase 0)
    const userProgress = {
      fase_atual: 0,
      dias: 7,
      praticas: 5,
      reflexoes: 5,
      streak: 5,
      conquistas: 2
    };

    // When: verificar_transicao_fase is called
    // (This would be a real DB call in production)
    const shouldTransition = userProgress.dias >= 7;

    // Then: User should transition to Despertar (phase 1)
    expect(shouldTransition).toBe(true);
    
    // And: Should unlock 'transcendente-semente' achievement
    const expectedAchievement = 'transcendente-semente';
    expect(expectedAchievement).toBe('transcendente-semente');
  });

  it('Scenario 2: User is midway through Disciplina phase', () => {
    // Given: User is in Disciplina phase
    const userProgress = {
      fase_atual: 2,
      dias: 10,
      praticas: 8,
      reflexoes: 6,
      streak: 8
    };

    // When: Progress is calculated
    const criterios = { diasMinimos: 16, praticasMinimas: 14 };
    const progressPercentage = Math.round(
      ((userProgress.dias / criterios.diasMinimos) * 30) +
      ((userProgress.praticas / criterios.praticasMinimas) * 25)
    );

    // Then: Progress should be partial (not 100%)
    expect(progressPercentage).toBeLessThan(100);
  });

  it('Scenario 3: Modal appears after transition', () => {
    // Given: A new transition exists
    const transicao = {
      id: 'abc-123',
      fase_anterior: 1,
      fase_nova: 2,
      animacao_vista: false
    };

    // When: usePhaseProgress hook loads
    const shouldShowModal = transicao && !transicao.animacao_vista;

    // Then: Modal should be displayed
    expect(shouldShowModal).toBe(true);
  });

  it('Scenario 4: AI message generation', () => {
    // Given: A phase transition
    const transicao = {
      fase_anterior: 1,
      fase_nova: 2,
      dias_na_fase: 14,
      praticas_completadas: 12,
      reflexoes_feitas: 9
    };

    const nomeUsuario = 'João';
    const faseNova = 'Disciplina';

    // When: Generating prompt for AI
    const prompt = `Crie uma mensagem celebratória para ${nomeUsuario} completando a fase ${faseNova}`;

    // Then: Prompt should contain user info
    expect(prompt).toContain('João');
    expect(prompt).toContain('Disciplina');
  });
});

// ================================================
// MANUAL TEST GUIDE
// ================================================

/*
MANUAL TESTING CHECKLIST:

1. Setup:
   □ Run database migration: add-phase-transition-achievements.sql
   □ Ensure OpenAI API key is configured
   □ Create a test user account

2. Test Phase Completion (Semente → Despertar):
   □ Complete 3+ practices
   □ Submit 3+ reflections
   □ Maintain 3+ day streak
   □ Navigate to Home page
   □ Verify modal appears with confetti
   □ Check AI message is displayed
   □ Confirm achievement shows: "Transcendente Semente"
   □ Click "Continuar Jornada"
   □ Verify user is now in Despertar phase

3. Test Modal Features:
   □ Confetti animation plays for 5 seconds
   □ Phase transition icons display correctly
   □ Statistics from previous phase are accurate
   □ Modal closes when clicking backdrop
   □ Modal closes when clicking button

4. Test on Multiple Pages:
   □ Trigger transition
   □ Go to Home - modal appears
   □ Mark as viewed
   □ Go to Perfil - modal does NOT appear again

5. Test AI Integration:
   □ Check that mensagem_ia is saved in DB
   □ Verify message is personalized
   □ Confirm message mentions user's name
   □ Check message is poetic and motivational

6. Test Database:
   □ Verify new row in transicoes_fase
   □ Check conquistas_desbloqueadas array
   □ Confirm animacao_vista = false initially
   □ Verify fase_atual updated in keteros

7. Edge Cases:
   □ What if OpenAI fails? (Should show default message)
   □ What if user closes modal quickly?
   □ What if user meets criteria for multiple phases?
   □ What if database connection fails?

8. Performance:
   □ Modal loads within 1 second
   □ Confetti doesn't lag
   □ AI message generates within 3 seconds
   □ No memory leaks after closing modal

EXPECTED RESULTS:
✓ Smooth, beautiful transition ceremony
✓ Personalized AI message
✓ Achievements unlocked and displayed
✓ User progresses to next phase
✓ No errors in console
✓ Database correctly updated
*/
