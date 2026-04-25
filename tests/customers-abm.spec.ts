import { test, expect } from './fixtures/pom';
import { CUSTOMERS_ENDPOINTS } from '../src/api/endpoints';

test.describe('ABM Clientes', () => {

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('ev@gmail.com', 'admin');
    await expect(page).toHaveURL('/');
  });

  test('debería crear un nuevo cliente exitosamente', async ({ page, customersPage, newCustomerPage }) => {
    const customerToCreate = {
      name: `TestCustomer_${Date.now()}`,
      tax_id: '20-12345678-9',
      address: 'Test Address 123',
      phone: '1112345678',
      email: `test.customer.${Date.now()}@test.com`
    };

    await customersPage.goto();
    await customersPage.gotoNewCustomer();
    await newCustomerPage.createCustomer(customerToCreate);

    await expect(page).toHaveURL('/customers');
    await customersPage.verifyCustomerVisible(customerToCreate.name);
  });

  test('debería editar un cliente existente', async ({ apiOwner, customersPage, editCustomerPage }) => {
    const customerToEdit = {
      name: `CustomerToEdit_${Date.now()}`,
      tax_id: '20-87654321-0',
      address: 'Original Address 123',
      phone: '1187654321',
      email: `edit.customer.${Date.now()}@test.com`
    };

    await apiOwner.post(CUSTOMERS_ENDPOINTS.CUSTOMER, { data: customerToEdit })

    const newName = customerToEdit.name + ' Edited';

    await customersPage.goto();
    await customersPage.gotoEditCustomer(customerToEdit.name);
    await editCustomerPage.updateCustomer({ name: newName });
    await customersPage.verifyCustomerVisible(newName);
  });

  test('debería cambiar el estado del cliente', async ({ apiOwner, customersPage }) => {
    const customerToToggle = {
      name: `CustomerToToggle_${Date.now()}`,
      tax_id: '20-11223344-5',
      address: 'Toggle Address 123',
      phone: '1111223344',
      email: `toggle.customer.${Date.now()}@test.com`
    };

    await apiOwner.post(CUSTOMERS_ENDPOINTS.CUSTOMER, { data: customerToToggle })

    await customersPage.goto();
    await customersPage.deleteCustomer(customerToToggle.name);
    await customersPage.restoreCustomer(customerToToggle.name);
  });

});
