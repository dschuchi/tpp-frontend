import { test, expect } from './fixtures/pom';
import { PACKAGING_MATERIALS_ENDPOINTS } from '../src/api/endpoints';

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

  test('debería editar un material de empaque existente', async ({ apiOwner, packagingMaterialsPage, editPackagingMaterialPage }) => {
    const packagingMaterialToEdit = {
      code: `PME-${Date.now()}`,
      description: `To Edit ${Date.now()}`
    };

    await apiOwner.post(PACKAGING_MATERIALS_ENDPOINTS.PACKAGING_MATERIAL, { data: packagingMaterialToEdit });

    const newDescription = packagingMaterialToEdit.description + ' Edited';

    await packagingMaterialsPage.goto();
    await packagingMaterialsPage.gotoEditPackagingMaterial(packagingMaterialToEdit.code);
    await editPackagingMaterialPage.updatePackagingMaterial({ description: newDescription });
    await packagingMaterialsPage.verifyPackagingMaterialVisible(packagingMaterialToEdit.code);
  });

  test('debería cambiar el estado de un material de empaque', async ({ apiOwner, packagingMaterialsPage }) => {
    const packagingMaterialToToggle = {
      code: `PMT-${Date.now()}`,
      description: `To Toggle ${Date.now()}`
    };

    await apiOwner.post(PACKAGING_MATERIALS_ENDPOINTS.PACKAGING_MATERIAL, { data: packagingMaterialToToggle });

    await packagingMaterialsPage.goto();
    await packagingMaterialsPage.deletePackagingMaterial(packagingMaterialToToggle.code);
    await packagingMaterialsPage.restorePackagingMaterial(packagingMaterialToToggle.code);
  });
});
