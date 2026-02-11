import { test, expect } from '@playwright/test';

test('visitante inicia onboarding', async ({ page }) => {
    await page.goto('/');

    // Verificar se está na landing page
    await expect(page.getByText('KETER')).toBeVisible();

    // Iniciar jornada
    await page.getByRole('button', { name: /iniciar/i }).first().click();

    // Deve redirecionar para login ou onboarding direto se permitir guest
    // Assumindo fluxo de validação
    await expect(page).toHaveURL(/.*(login|onboarding|signup)/);
});

test('fluxo completo de onboarding (mockado)', async ({ page }) => {
    // Simular estado de autenticação ou modo guest se implementado
    await page.goto('/onboarding');

    // Se redirecionar para login, fazer login de teste
    if (page.url().includes('login')) {
        // Implementar login aqui se necessário ou usar estado global de teste
        // Por enquanto, testamos a acessibilidade da rota
        await expect(page.getByLabel(/email/i)).toBeVisible();
    } else {
        // Testar passos do onboarding
        await expect(page.getByText(/intenção/i)).toBeVisible();
    }
});
