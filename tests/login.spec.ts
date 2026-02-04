import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';

test.describe('Flujo de Login', () => {
  test('debería iniciar sesión correctamente con credenciales válidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('ev@gmail.com', 'admin');

    const homePage = new HomePage(page);
    await expect(homePage.userName).toHaveText('Ezequiel Vilardo', { timeout: 5000 });
  });

  test('debería mostrar mensaje de error con credenciales inválidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('invalid@test.com', 'wrongpass');

    await expect(loginPage.notification).toBeVisible();
    await expect(loginPage.notification).toHaveText('Correo o contraseña incorrectos');
  });
});
