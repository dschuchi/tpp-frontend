import { test, expect } from './fixtures/pom';
import { ROLES_ENDPOINTS } from '../src/api/endpoints';

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

  test('debería editar un rol existente', async ({ apiOwner, rolesPage, editRolePage }) => {
    const roleToEdit = {
      name: `RoleToEdit_${Date.now()}`,
      description: 'Role created by Playwright for edit test'
    };

    await apiOwner.post(ROLES_ENDPOINTS.ROLE, { data: roleToEdit });

    const newDesc = roleToEdit.description + ' Edited ' + Date.now();

    await rolesPage.goto();
    await rolesPage.gotoEditRole(roleToEdit.name);
    await editRolePage.updateRole({ description: newDesc });
    await rolesPage.verifyRoleVisible(newDesc);
  });

  test('debería cambiar el estado del rol', async ({ page, apiOwner, rolesPage }) => {
    const roleToDelete = {
      name: `RoleToDelete_${Date.now()}`,
      description: 'Role created by Playwright for delete test'
    };

    await apiOwner.post(ROLES_ENDPOINTS.ROLE, { data: roleToDelete });

    await rolesPage.goto();
    await rolesPage.deleteRole(roleToDelete.name);
    await rolesPage.restoreRole(roleToDelete.name);
  });

});
