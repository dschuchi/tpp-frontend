import { test, expect } from './fixtures/pom';

test.describe('ABM Proveedores', () => {

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('ev@gmail.com', 'admin');
    await expect(page).toHaveURL('/');
  });

  test('debería crear un nuevo proveedor exitosamente', async ({ page, suppliersPage, newSupplierPage }) => {
    const supplierToCreate = {
      name: `TestSupplier_${Date.now()}`,
      tax_id: '20-12345678-9',
      address: 'Test Address 123',
      phone: '1112345678',
      email: `test.supplier.${Date.now()}@test.com`
    };

    await suppliersPage.goto();
    await suppliersPage.gotoNewSupplier();
    await newSupplierPage.createSupplier(supplierToCreate);

    await expect(page).toHaveURL('/suppliers');
    await suppliersPage.verifySupplierVisible(supplierToCreate.name);
  });

  test('debería editar un proveedor existente', async ({ page, suppliersPage, newSupplierPage, editSupplierPage }) => {
    const supplierToEdit = {
      name: `SupplierToEdit_${Date.now()}`,
      tax_id: '20-87654321-0',
      address: 'Original Address 123',
      phone: '1187654321',
      email: `edit.supplier.${Date.now()}@test.com`
    };

    await suppliersPage.goto();
    await suppliersPage.gotoNewSupplier();
    await newSupplierPage.createSupplier(supplierToEdit);
    await expect(page).toHaveURL('/suppliers');
    await suppliersPage.verifySupplierVisible(supplierToEdit.name);

    const newName = supplierToEdit.name + ' Edited';

    await suppliersPage.gotoEditSupplier(supplierToEdit.name);
    await editSupplierPage.updateSupplier({ name: newName });

    await expect(page).toHaveURL('/suppliers');
    await suppliersPage.verifySupplierVisible(newName);
  });

  test('debería cambiar el estado del proveedor', async ({ page, suppliersPage, newSupplierPage }) => {
    const supplierToToggle = {
      name: `SupplierToToggle_${Date.now()}`,
      tax_id: '20-11223344-5',
      address: 'Toggle Address 123',
      phone: '1111223344',
      email: `toggle.supplier.${Date.now()}@test.com`
    };

    await suppliersPage.goto();
    await suppliersPage.gotoNewSupplier();
    await newSupplierPage.createSupplier(supplierToToggle);
    await expect(page).toHaveURL('/suppliers');
    await suppliersPage.verifySupplierVisible(supplierToToggle.name);

    await suppliersPage.deleteSupplier(supplierToToggle.name);

    await suppliersPage.restoreSupplier(supplierToToggle.name);
  });

});
