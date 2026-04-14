import { test, expect } from './fixtures/pom';
import { RAW_MATERIALS_ENDPOINTS } from '../src/api/endpoints';

test.describe('ABM Materias Primas', () => {

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('ev@gmail.com', 'admin');
    await expect(page).toHaveURL('/');
  });

  test('debería crear una nueva materia prima exitosamente', async ({ page, rawMaterialsPage, newRawMaterialPage }) => {
    const rawMaterialToCreate = {
      name: `TestRawMaterial_${Date.now()}`
    };

    await rawMaterialsPage.goto();
    await rawMaterialsPage.gotoNewRawMaterial();
    await newRawMaterialPage.createRawMaterial(rawMaterialToCreate);

    await expect(page).toHaveURL('/raw-materials');
    await rawMaterialsPage.verifyRawMaterialVisible(rawMaterialToCreate.name);
  });

  test('debería editar una materia prima existente', async ({ apiOwner, rawMaterialsPage, editRawMaterialPage }) => {
    const rawMaterialToEdit = {
      name: `RawMaterialToEdit_${Date.now()}`
    };

    await apiOwner.post(RAW_MATERIALS_ENDPOINTS.RAW_MATERIAL, { data: rawMaterialToEdit });

    const newName = rawMaterialToEdit.name + ' Edited';

    await rawMaterialsPage.goto();
    await rawMaterialsPage.gotoEditRawMaterial(rawMaterialToEdit.name);
    await editRawMaterialPage.updateRawMaterial({ name: newName });
    await rawMaterialsPage.verifyRawMaterialVisible(newName);
  });

  test('debería cambiar el estado de una materia prima', async ({ apiOwner, rawMaterialsPage }) => {
    const rawMaterialToToggle = {
      name: `RawMaterialToToggle_${Date.now()}`
    };

    await apiOwner.post(RAW_MATERIALS_ENDPOINTS.RAW_MATERIAL, { data: rawMaterialToToggle });

    await rawMaterialsPage.goto();
    await rawMaterialsPage.deleteRawMaterial(rawMaterialToToggle.name);
    await rawMaterialsPage.restoreRawMaterial(rawMaterialToToggle.name);
  });

});
