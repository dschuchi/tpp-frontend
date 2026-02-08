import { test, expect } from './fixtures/pom';

test.describe('ABM Roles', () => {

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('ev@gmail.com', 'admin');
    await expect(page).toHaveURL('/');
  });

  test('debería crear un nuevo rol exitosamente', async ({ page, rolesPage, newRolePage }) => {
    const roleToCreate = {
      name: `TestRole_${Date.now()}`,
      description: 'Role created by Playwright automated test'
    };

    await rolesPage.goto();
    await rolesPage.gotoNewRole();
    await newRolePage.createRole(roleToCreate.name, roleToCreate.description);

    await expect(page).toHaveURL('/roles');
    await rolesPage.verifyRoleVisible(roleToCreate.name);
  });

  test('debería editar un rol existente', async ({ page, rolesPage, newRolePage, editRolePage }) => {
    const roleToEdit = {
      name: `RoleToEdit_${Date.now()}`,
      description: 'Role created by Playwright for edit test'
    };

    await rolesPage.goto();

    await rolesPage.gotoNewRole();
    await newRolePage.createRole(roleToEdit.name, roleToEdit.description);
    await expect(page).toHaveURL('/roles');
    await rolesPage.verifyRoleVisible(roleToEdit.name);

    const newDesc = roleToEdit.description + ' Edited ' + Date.now();

    await rolesPage.gotoEditRole(roleToEdit.name);
    await editRolePage.updateRole('', newDesc);

    await expect(page).toHaveURL('/roles');
    await rolesPage.verifyRoleVisible(newDesc);
  });

  test('debería cambiar el estado del rol', async ({ page, rolesPage, newRolePage }) => {
    const roleToDelete = {
      name: `RoleToDelete_${Date.now()}`,
      description: 'Role created by Playwright for delete test'
    };

    await rolesPage.goto();

    await rolesPage.gotoNewRole();
    await newRolePage.createRole(roleToDelete.name, roleToDelete.description);
    await expect(page).toHaveURL('/roles');
    await rolesPage.verifyRoleVisible(roleToDelete.name);

    await rolesPage.deleteRole(roleToDelete.name);

    await rolesPage.restoreRole(roleToDelete.name);

    const roleRow = page.getByRole('row', { name: roleToDelete.name });
    await expect(roleRow.getByRole('button').filter({ has: page.locator('i.mdi-delete') })).toBeVisible();
  });

});
