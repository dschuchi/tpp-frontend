import { test, expect } from './fixtures/pom';

test.describe('Perfil de Usuario', () => {

    test('debería validar los datos del usuario logueado', async ({ loginPage, profilePage }) => {
        await loginPage.goto();
        await loginPage.login('ev@gmail.com', 'admin');

        await profilePage.goto();
        await profilePage.validateUserData('Ezequiel', 'Vilardo', 'ev@gmail.com', 'admin');
    });

    test('debería cambiar la contraseña y volver a iniciar sesión', async ({ loginPage, profilePage, updatedPasswordDialog }) => {
        const newPassword = 'newpassword123';
        const defaultPassword = 'admin';

        await loginPage.goto();
        await loginPage.login('ev@gmail.com', defaultPassword);

        // Cambiar contraseña
        await profilePage.goto();
        await profilePage.updatePassword(newPassword);

        // Aceptar dialogo de confirmacion y verificar redireccion al login (o que hay que loguearse de nuevo)
        await updatedPasswordDialog.accept();
        await expect(loginPage.page).toHaveURL(/.*login/); // Asumiendo que redirige al login

        // Loguearse con la nueva contraseña
        await loginPage.login('ev@gmail.com', newPassword);

        // Verificar login exitoso (por ejemplo checking que estamos en home o profile)
        await expect(loginPage.page).not.toHaveURL(/.*login/);

        // --- CLEANUP ---
        // Volver a poner la contraseña original para no romper otros tests
        await profilePage.goto();
        await profilePage.updatePassword(defaultPassword);
        await updatedPasswordDialog.accept();
    });
});
