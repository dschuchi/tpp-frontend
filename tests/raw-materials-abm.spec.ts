import { test, expect } from './fixtures/pom';

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

  test('debería editar una materia prima existente', async ({ page, rawMaterialsPage, newRawMaterialPage, editRawMaterialPage }) => {
    const rawMaterialToEdit = {
      name: `RawMaterialToEdit_${Date.now()}`
    };

    await rawMaterialsPage.goto();
    await rawMaterialsPage.gotoNewRawMaterial();
    await newRawMaterialPage.createRawMaterial(rawMaterialToEdit);
    await expect(page).toHaveURL('/raw-materials');
    await rawMaterialsPage.verifyRawMaterialVisible(rawMaterialToEdit.name);

    const newName = rawMaterialToEdit.name + ' Edited';

    await rawMaterialsPage.gotoEditRawMaterial(rawMaterialToEdit.name);
    await editRawMaterialPage.updateRawMaterial({ name: newName });

    await expect(page).toHaveURL('/raw-materials');
    await rawMaterialsPage.verifyRawMaterialVisible(newName);
  });

  test('debería cambiar el estado de una materia prima', async ({ page, rawMaterialsPage, newRawMaterialPage }) => {
    const rawMaterialToToggle = {
      name: `RawMaterialToToggle_${Date.now()}`
    };

    await rawMaterialsPage.goto();
    await rawMaterialsPage.gotoNewRawMaterial();
    await newRawMaterialPage.createRawMaterial(rawMaterialToToggle);
    await expect(page).toHaveURL('/raw-materials');
    await rawMaterialsPage.verifyRawMaterialVisible(rawMaterialToToggle.name);

    await rawMaterialsPage.deleteRawMaterial(rawMaterialToToggle.name);

    await rawMaterialsPage.restoreRawMaterial(rawMaterialToToggle.name);
  });

});
