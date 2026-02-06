import { test, expect } from './fixtures/pom';

test.describe('ABM Usuarios', () => {

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('ev@gmail.com', 'admin');
    await expect(page).toHaveURL('/');
  });

  test('should create a new user successfully', async ({ usersPage }) => {
    const testUser = {
      username: 'TestCreate',
      lastname: 'User',
      email: `test.create.${Date.now()}@pharmatech.com`,
    };

    await usersPage.goto();
    await usersPage.createUser(testUser);
    await usersPage.verifyUserVisible(testUser.email);
  });

  test('should edit an existing user', async ({ usersPage }) => {
    const testUser = {
      username: `TestEdit_${Date.now()}`,
      lastname: 'User',
      email: `test.edit.${Date.now()}@pharmatech.com`,
    };

    await usersPage.goto();

    await usersPage.createUser(testUser);
    await usersPage.verifyUserVisible(testUser.email);

    const newName = testUser.username + 'Edited';
    await usersPage.editUser(testUser.email, newName);

    await usersPage.verifyUserVisible(newName);
  });

  test('should toggle user status', async ({ usersPage }) => {
    const testUser = {
      username: `TestToggle_${Date.now()}`,
      lastname: 'User',
      email: `test.toggle.${Date.now()}@pharmatech.com`,
    };

    await usersPage.goto();

    await usersPage.createUser(testUser);
    await usersPage.verifyUserVisible(testUser.email);

    await usersPage.toggleUserStatus(testUser.email);
  });

});
