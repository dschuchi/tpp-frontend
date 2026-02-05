import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { RolesPage } from './pages/RolesPage';

test.describe('ABM Roles', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('ev@gmail.com', 'admin');
    await expect(page).toHaveURL('/');
  });

  test('should create a new role successfully', async ({ page }) => {
    const roleToCreate = {
      name: `TestRole_${Date.now()}`,
      description: 'Role created by Playwright automated test'
    };

    const rolesPage = new RolesPage(page);
    await rolesPage.goto();
    await rolesPage.createRole(roleToCreate.name, roleToCreate.description);

    await expect(page).toHaveURL('/roles');
    await rolesPage.verifyRoleVisible(roleToCreate.name);
  });

  test('should edit an existing role', async ({ page }) => {
    const roleToEdit = {
      name: `RoleToEdit_${Date.now()}`,
      description: 'Role created by Playwright for edit test'
    };

    const rolesPage = new RolesPage(page);
    await rolesPage.goto();

    await rolesPage.createRole(roleToEdit.name, roleToEdit.description);
    await expect(page).toHaveURL('/roles');
    await rolesPage.verifyRoleVisible(roleToEdit.name);

    const newDesc = roleToEdit.description + ' Edited ' + Date.now();
    await rolesPage.editRoleDescription(roleToEdit.name, newDesc);

    await expect(page).toHaveURL('/roles');
    await rolesPage.verifyRoleVisible(newDesc);
  });

  test('should toggle role status', async ({ page }) => {
    const roleToDelete = {
      name: `RoleToDelete_${Date.now()}`,
      description: 'Role created by Playwright for delete test'
    };

    const rolesPage = new RolesPage(page);
    await rolesPage.goto();

    await rolesPage.createRole(roleToDelete.name, roleToDelete.description);
    await expect(page).toHaveURL('/roles');
    await rolesPage.verifyRoleVisible(roleToDelete.name);

    await rolesPage.deleteRole(roleToDelete.name);

    await rolesPage.restoreRole(roleToDelete.name);

    const roleRow = page.getByRole('row', { name: roleToDelete.name });
    await expect(roleRow.getByRole('button').filter({ has: page.locator('i.mdi-delete') })).toBeVisible();
  });

});
