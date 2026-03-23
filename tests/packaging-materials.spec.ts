import { test, expect } from './fixtures/pom';

test.describe('ABM Materiales de Empaque', () => {

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('ev@gmail.com', 'admin');
    await expect(page).toHaveURL('/');
  });

  test('debería crear un nuevo material de empaque exitosamente', async ({ page, packagingMaterialsPage, newPackagingMaterialPage }) => {
    const packagingMaterialToCreate = {
      code: `PM-${Date.now()}`,
      description: `Description ${Date.now()}`
    };

    await packagingMaterialsPage.goto();
    await packagingMaterialsPage.gotoNewPackagingMaterial();
    await newPackagingMaterialPage.createPackagingMaterial(packagingMaterialToCreate);

    await expect(page).toHaveURL('/packaging-materials');
    await packagingMaterialsPage.verifyPackagingMaterialVisible(packagingMaterialToCreate.code);
  });

  test('debería editar un material de empaque existente', async ({ page, packagingMaterialsPage, newPackagingMaterialPage, editPackagingMaterialPage }) => {
    const packagingMaterialToEdit = {
      code: `PME-${Date.now()}`,
      description: `To Edit ${Date.now()}`
    };

    await packagingMaterialsPage.goto();
    await packagingMaterialsPage.gotoNewPackagingMaterial();
    await newPackagingMaterialPage.createPackagingMaterial(packagingMaterialToEdit);
    await expect(page).toHaveURL('/packaging-materials');
    await packagingMaterialsPage.verifyPackagingMaterialVisible(packagingMaterialToEdit.code);

    const newDescription = packagingMaterialToEdit.description + ' Edited';

    await packagingMaterialsPage.gotoEditPackagingMaterial(packagingMaterialToEdit.code);
    await editPackagingMaterialPage.updatePackagingMaterial({ description: newDescription });

    await expect(page).toHaveURL('/packaging-materials');
    await packagingMaterialsPage.verifyPackagingMaterialVisible(packagingMaterialToEdit.code);
  });

  test('debería cambiar el estado de un material de empaque', async ({ page, packagingMaterialsPage, newPackagingMaterialPage }) => {
    const packagingMaterialToToggle = {
      code: `PMT-${Date.now()}`,
      description: `To Toggle ${Date.now()}`
    };

    await packagingMaterialsPage.goto();
    await packagingMaterialsPage.gotoNewPackagingMaterial();
    await newPackagingMaterialPage.createPackagingMaterial(packagingMaterialToToggle);
    await expect(page).toHaveURL('/packaging-materials');
    await packagingMaterialsPage.verifyPackagingMaterialVisible(packagingMaterialToToggle.code);

    await packagingMaterialsPage.deletePackagingMaterial(packagingMaterialToToggle.code);

    await packagingMaterialsPage.restorePackagingMaterial(packagingMaterialToToggle.code);
  });

});
