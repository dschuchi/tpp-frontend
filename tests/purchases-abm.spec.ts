import { test, expect } from './fixtures/pom';
import { PURCHASES_ENDPOINTS } from '../src/api/endpoints';

test.describe('ABM Compras', () => {

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('ev@gmail.com', 'admin');
    await expect(page).toHaveURL('/');
  });

  test('debería crear una nueva compra exitosamente', async ({ page, purchasesPage, newPurchasePage }) => {
    const purchaseToCreate = {
      scheduled_date: '2027-10-10',
      received_date: '2027-10-11',
      observation: `Purchase obs ${Date.now()}`,
      items: [
        { type: 'raw' as const, quantity: 10, price: '500' }
      ]
    };

    await purchasesPage.goto();
    await purchasesPage.gotoNewPurchase();
    await newPurchasePage.createPurchase(purchaseToCreate);

    await expect(page).toHaveURL('/purchases');
  });

  test('debería editar una compra existente', async ({ page, apiOwner, purchasesPage, editPurchasePage }) => {
    const purchaseToEdit = {
      supplier_id: 1,
      scheduled_date: '2027-12-10',
      received_date: '2027-12-11',
      observation: `Obs to edit ${Date.now()}`,
      status_id: 1,
      purchase_items: []
    };

    const res = await apiOwner.post(PURCHASES_ENDPOINTS.PURCHASES, { data: purchaseToEdit });
    const createdPurchase = await res.json();

    const newObservation = 'Updated observation';

    await purchasesPage.goto();
    await purchasesPage.gotoEditPurchase(createdPurchase.id.toString());
    await editPurchasePage.updatePurchase({ observation: newObservation });

    await expect(page).toHaveURL('/purchases');
  });

});
