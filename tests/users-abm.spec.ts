import { test, expect } from './fixtures/pom';

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

  test('debería editar un usuario existente', async ({ usersPage, newUserPage, editUserPage }) => {
    const testUser = {
      username: `TestEdit_${Date.now()}`,
      lastname: 'User',
      email: `test.edit.${Date.now()}@pharmatech.com`,
    };

    await usersPage.goto();

    await usersPage.gotoNewUser();
    await newUserPage.createUser(testUser);
    await usersPage.verifyUserVisible(testUser.email);

    const newName = testUser.username + 'Edited';
    await usersPage.gotoEditUser(testUser.email);
    await editUserPage.updateUser(newName);

    await usersPage.verifyUserVisible(newName);
  });

  test('debería cambiar el estado del usuario', async ({ usersPage, newUserPage }) => {
    const testUser = {
      username: `TestToggle_${Date.now()}`,
      lastname: 'User',
      email: `test.toggle.${Date.now()}@pharmatech.com`,
    };

    await usersPage.goto();

    await usersPage.gotoNewUser();
    await newUserPage.createUser(testUser);
    await usersPage.verifyUserVisible(testUser.email);

    await usersPage.toggleUserStatus(testUser.email);
  });

});
