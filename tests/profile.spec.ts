import { test, expect } from './fixtures/pom';

test.describe('Perfil de Usuario', () => {

  test.beforeEach(async () => {
    // TODO

    // Utilizando la API asegurarse que la contraseña es la correcta,
    // de esta manera se realiza más rapido y se ahorra el cleanup

    // Se debe crear un usuario especifico para el test de cambio de password
    // sino rompe los otros tests
  });

  test('debería validar los datos del usuario logueado', async ({ loginPage, profilePage, appBar }) => {
    await loginPage.goto();
    await loginPage.login('ev@gmail.com', 'admin');
    await expect(appBar.userName).toBeVisible()

    await profilePage.goto();
    await profilePage.validateUserData('Ezequiel', 'Vilardo', 'ev@gmail.com', 'Owner');
  });

  test.fixme('debería cambiar la contraseña y volver a iniciar sesión', async ({ loginPage, profilePage, updatedPasswordDialog }) => {
    const newPassword = 'newpassword123';
    const defaultPassword = 'admin';

    await loginPage.goto();
    await loginPage.login('ev@gmail.com', defaultPassword);

    await profilePage.goto();
    await profilePage.updatePassword(newPassword);

    await updatedPasswordDialog.accept();
    await expect(loginPage.page).toHaveURL(/.*login/);

    await loginPage.login('ev@gmail.com', newPassword);

    await expect(loginPage.page).not.toHaveURL(/.*login/);
  });
});
