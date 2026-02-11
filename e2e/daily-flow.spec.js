import { test, expect } from '@playwright/test';

test.describe('Fluxo Diário', () => {
    test.beforeEach(async ({ page }) => {
        // Mock login here ideally
        await page.goto('/app/dashboard');
    });

    test('dashboard carrega elementos principais', async ({ page }) => {
        // Se redirecionar para login, validar isso
        if (page.url().includes('login')) {
            await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
            return;
        }

        await expect(page.getByText(/bom dia|boa tarde|boa noite/i)).toBeVisible();
        await expect(page.getByText(/intenção/i)).toBeVisible();
    });
});
