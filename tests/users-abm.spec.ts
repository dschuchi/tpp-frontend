import { test, expect } from './fixtures/pom';
import { USERS_ENDPOINTS } from '../src/api/endpoints';

test.describe('ABM Usuarios', () => {

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('ev@gmail.com', 'admin');
    await expect(page).toHaveURL('/');
  });

  test('debería crear un nuevo usuario exitosamente', async ({ usersPage, newUserPage }) => {
    const testUser = {
      username: 'TestCreate',
      lastname: 'User',
      email: `test.create.${Date.now()}@pharmatech.com`,
    };

    await usersPage.goto();
    await usersPage.gotoNewUser();
    await newUserPage.createUser(testUser);
    await usersPage.verifyUserVisible(testUser.email);
  });

  test('debería editar un usuario existente', async ({ apiOwner, usersPage, editUserPage }) => {
    const testUser = {
      username: `TestEdit_${Date.now()}`,
      lastname: 'User',
      email: `test.edit.${Date.now()}@pharmatech.com`,
    };

    await apiOwner.post(USERS_ENDPOINTS.USER, { data: testUser });

    const newName = testUser.username + 'Edited';

    await usersPage.goto();
    await usersPage.gotoEditUser(testUser.email);
    await editUserPage.updateUser(newName);

    await usersPage.verifyUserVisible(newName);
  });

  test('debería cambiar el estado del usuario', async ({ apiOwner, usersPage }) => {
    const testUser = {
      username: `TestToggle_${Date.now()}`,
      lastname: 'User',
      email: `test.toggle.${Date.now()}@pharmatech.com`,
    };

    await apiOwner.post(USERS_ENDPOINTS.USER, { data: testUser });

    await usersPage.goto();
    await usersPage.toggleUserStatus(testUser.email);
  });

  test('debería mostrar un error al ingresar un mail existente', async ({ appBar, usersPage, newUserPage }) => {
    const existingEmail = 'ev@gmail.com';
    const testUser = {
      username: 'Duplicate',
      lastname: 'User',
      email: existingEmail,
    };

    await usersPage.goto();
    await usersPage.gotoNewUser();
    await newUserPage.fillForm(testUser);
    await newUserPage.save();

    await expect(appBar.snackbar).toBeVisible();
    await expect(appBar.snackbar).toHaveText(`Ya existe un usuario con el mail ${existingEmail}`);
  });

});
