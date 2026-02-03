import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('your.email@pharmatech.com').fill('ev@gmail.com');
    await page.getByPlaceholder('Enter your password').fill('admin');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL('/');
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('your.email@pharmatech.com').fill('invalid@test.com');
    await page.getByPlaceholder('Enter your password').fill('wrongpass');

    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText('Correo o contraseña incorrectos')).toBeVisible();
  });
});
