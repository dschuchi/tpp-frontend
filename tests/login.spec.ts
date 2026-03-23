import { test, expect } from './fixtures/pom';

test.describe('Flujo de Login', () => {
  test('debería iniciar sesión correctamente con credenciales válidas', async ({ loginPage, appBar }) => {
    await loginPage.goto();
    await loginPage.login('ev@gmail.com', 'admin');

    await expect(appBar.userName).toHaveText('Ezequiel Vilardo');
  });

  test.fixme('debería mostrar mensaje de error con credenciales inválidas', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('invalid@test.com', 'wrongpass');

    await expect(loginPage.notification).toBeVisible();
    await expect(loginPage.notification).toHaveText('Correo o contraseña incorrectos');
  });
});
